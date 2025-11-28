const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// Middleware untuk menyajikan file statis dari direktori 'uploads'.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Konfigurasi Multer untuk File Upload ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Konfigurasi penyimpanan file, termasuk destinasi dan penamaan file unik.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage });


// ================= Endpoint API =================

// Endpoint untuk verifikasi status server.
app.get('/', (req, res) => {
    res.send('API Penyalur Pembantu Aktif! Server berjalan normal.');
});

// Endpoint untuk menambah data pekerja baru.
app.post('/api/workers', upload.single('fotoUrl'), async (req, res) => {
    try {
        const data = req.body;
        const file = req.file;
        
        const photoFilename = file ? file.filename : null;

        const sql = `
            INSERT INTO workers 
            (name, age, category, origin, marital_status, religion, education, tribe, experience, skills, shortcomings, languages, status, salary, description, photo_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.nama, 
            data.umur, 
            data.kategori, 
            data.lokasi, 
            data.status_perkawinan,
            data.agama, 
            data.pendidikan || '-',            
            data.suku || '-', 
            data.pengalaman, 
            data.keterampilan,
            data.kekurangan, 
            data.bahasa_asing, 
            data.status, 
            data.gaji, 
            data.deskripsi, 
            photoFilename
        ];

        const [result] = await db.query(sql, values);
        
        res.status(201).json({ 
            message: 'Pekerja berhasil ditambahkan!', 
            data: { id: result.insertId, ...data, photoFilename } 
        });

    } catch (error) {
        console.error("Error input:", error);
        res.status(500).json({ message: 'Gagal menyimpan data', error: error.message });
    }
});

// Endpoint untuk mengambil semua data pekerja.
app.get('/api/workers', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM workers ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error("Error ambil data:", error);
        res.status(500).json({ message: 'Gagal mengambil data' });
    }
});

// Endpoint untuk mengambil data satu pekerja berdasarkan ID.
app.get('/api/workers/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM workers WHERE id = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Pekerja tidak ditemukan' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error("Error ambil detail:", error);
        res.status(500).json({ message: 'Gagal mengambil detail pekerja' });
    }
});

// Endpoint untuk memperbarui data pekerja berdasarkan ID.
app.put('/api/workers/:id', upload.single('fotoUrl'), async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const file = req.file;
        
        let sql = `
            UPDATE workers SET 
            name=?, age=?, category=?, origin=?, marital_status=?, religion=?, education=?,
            tribe=?, experience=?, skills=?, shortcomings=?, languages=?, 
            status=?, salary=?, description=?
        `;
        
        const values = [
            data.nama, data.umur, data.kategori, data.lokasi, data.status_perkawinan,
            data.agama, data.pendidikan,
            data.suku, data.pengalaman, data.keterampilan,
            data.kekurangan, data.bahasa_asing, data.status, data.gaji, data.deskripsi
        ];

        // Jika ada file foto baru, perbarui juga photo_url.
        if (file) {
            sql += `, photo_url=?`;
            values.push(file.filename);
        }

        sql += ` WHERE id=?`;
        values.push(id);

        await db.query(sql, values);
        
        res.json({ message: 'Data pekerja berhasil diperbarui!' });

    } catch (error) {
        console.error("Error update:", error);
        res.status(500).json({ message: 'Gagal update data', error: error.message });
    }
});

// Endpoint untuk menghapus data pekerja berdasarkan ID.
app.delete('/api/workers/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Ambil URL foto untuk dihapus dari storage.
        const [rows] = await db.query('SELECT photo_url FROM workers WHERE id = ?', [id]);
        
        // Jika foto ada, hapus file dari direktori 'uploads'.
        if (rows.length > 0 && rows[0].photo_url) {
            const filePath = path.join(__dirname, 'uploads', rows[0].photo_url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); 
            }
        }

        // Hapus record dari database.
        await db.query('DELETE FROM workers WHERE id = ?', [id]);

        res.json({ message: 'Data pekerja berhasil dihapus' });

    } catch (error) {
        console.error("Error delete:", error);
        res.status(500).json({ message: 'Gagal menghapus data', error: error.message });
    }
});

// Endpoint untuk otentikasi admin.
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Ambil semua data user
        const [users] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
        
        if (users.length === 0) return res.status(401).json({ message: 'Username tidak ditemukan!' });

        const admin = users[0];
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) return res.status(401).json({ message: 'Password salah!' });

        // Buat JSON Web Token (JWT) untuk sesi.
        const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ 
            message: 'Login berhasil', 
            token, 
            username: admin.username,
            role: admin.role
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
});

// ================= Manajemen User (Khusus Superadmin) =================

// Endpoint untuk mengambil semua data admin.
app.get('/api/admins', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, username, email, phone, role FROM admins');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Gagal ambil data admin' });
    }
});

// Endpoint untuk menambah admin baru.
app.post('/api/admins', async (req, res) => {
    try {
        const { username, email, phone, password, role } = req.body;
        
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            'INSERT INTO admins (username, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
            [username, email, phone, hashedPassword, role || 'admin']
        );
        res.json({ message: 'Admin baru berhasil dibuat' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal tambah admin', error: error.message });
    }
});

// Endpoint untuk memperbarui data admin.
app.put('/api/admins/:id', async (req, res) => {
    try {
        const { username, email, phone, password, role } = req.body;
        const id = req.params.id;

        let sql = 'UPDATE admins SET username=?, email=?, phone=?, role=?';
        let values = [username, email, phone, role];

        // Jika password baru disediakan, hash dan perbarui.
        if (password && password.trim() !== "") {
            const hashedPassword = await bcrypt.hash(password, 10);
            sql += ', password=?';
            values.push(hashedPassword);
        }

        sql += ' WHERE id=?';
        values.push(id);

        await db.query(sql, values);
        res.json({ message: 'Data admin berhasil diupdate' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal update admin' });
    }
});

// Endpoint untuk menghapus admin.
app.delete('/api/admins/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Ambil role dari admin yang akan dihapus.
        const [targets] = await db.query('SELECT role FROM admins WHERE id = ?', [id]);
        
        if (targets.length === 0) {
            return res.status(404).json({ message: 'Admin tidak ditemukan' });
        }

        const targetRole = targets[0].role;

        // Proteksi agar superadmin terakhir tidak bisa dihapus.
        if (targetRole === 'superadmin') {
            const [result] = await db.query('SELECT COUNT(*) as total FROM admins WHERE role = "superadmin"');
            const totalSuperadmin = result[0].total;

            if (totalSuperadmin <= 1) {
                return res.status(403).json({ message: 'DILARANG: Ini adalah Superadmin terakhir. Tidak bisa dihapus.' });
            }
        }

        // Lanjutkan penghapusan jika validasi lolos.
        await db.query('DELETE FROM admins WHERE id = ?', [id]);
        res.json({ message: 'Admin berhasil dihapus' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal hapus admin' });
    }
});

// --- Fungsi Bantuan ---
const createSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')           // Ganti spasi dengan -
        .replace(/[^\w\-]+/g, '')       // Hapus karakter non-word
        .replace(/\-\-+/g, '-')         // Ganti multiple - dengan single -
        .replace(/^-+/, '')             // Trim - di awal
        .replace(/-+$/, '');            // Trim - di akhir
};

// ================= Manajemen Artikel (Blog) =================

// Endpoint untuk mengambil semua artikel.
app.get('/api/articles', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM articles ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Gagal ambil artikel' });
    }
});

// Endpoint untuk mengambil satu artikel berdasarkan slug.
app.get('/api/articles/:slug', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM articles WHERE slug = ?', [req.params.slug]);
        if (rows.length === 0) return res.status(404).json({ message: 'Artikel tidak ditemukan' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error server' });
    }
});

// Endpoint untuk menambah artikel baru.
app.post('/api/articles', upload.single('image'), async (req, res) => {
    try {
        const { title, content, meta_title, meta_description } = req.body;
        const file = req.file;
        const image_url = file ? file.filename : null;
        
        // Buat slug unik dari judul.
        const slug = createSlug(title) + '-' + Math.floor(Math.random() * 1000);

        const sql = `INSERT INTO articles (title, slug, content, image_url, meta_title, meta_description) VALUES (?, ?, ?, ?, ?, ?)`;
        await db.query(sql, [title, slug, content, image_url, meta_title, meta_description]);

        res.json({ message: 'Artikel berhasil diterbitkan!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal posting artikel' });
    }
});

// Endpoint untuk memperbarui artikel.
app.put('/api/articles/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, meta_title, meta_description } = req.body;
        const file = req.file;

        let sql = 'UPDATE articles SET title=?, content=?, meta_title=?, meta_description=?';
        const values = [title, content, meta_title, meta_description];

        // Jika ada file gambar baru, hapus yang lama dan perbarui.
        if (file) {
            const [rows] = await db.query('SELECT image_url FROM articles WHERE id = ?', [id]);
            if (rows.length > 0 && rows[0].image_url) {
                const oldImagePath = path.join(__dirname, 'uploads', rows[0].image_url);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            // Tambahkan nama file baru ke query.
            sql += ', image_url=?';
            values.push(file.filename);
        }

        sql += ' WHERE id=?';
        values.push(id);

        await db.query(sql, values);

        res.json({ message: 'Artikel berhasil diperbarui!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal update artikel' });
    }
});

// Endpoint untuk menghapus artikel.
app.delete('/api/articles/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Ambil URL gambar untuk dihapus dari storage.
        const [rows] = await db.query('SELECT image_url FROM articles WHERE id = ?', [id]);

        // Jika gambar ada, hapus dari direktori 'uploads'.
        if (rows.length > 0 && rows[0].image_url) {
            const imagePath = path.join(__dirname, 'uploads', rows[0].image_url);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Hapus record artikel dari database.
        await db.query('DELETE FROM articles WHERE id = ?', [id]);
        res.json({ message: 'Artikel berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus artikel' });
    }
});

// --- Menjalankan Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di port ${PORT}`);
});