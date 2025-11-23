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

// Agar folder 'uploads' bisa diakses dari browser (untuk menampilkan foto di frontend)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- KONFIGURASI UPLOAD FOTO (MULTER) ---
// Cek apakah folder uploads ada, jika tidak buat baru
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Atur tempat penyimpanan dan nama file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      // Format nama file: timestamp-angkaacak.ekstensi (agar unik)
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage });


// ================= RUTE API =================

// --- ROUTE 1: TEST SERVER ---
app.get('/', (req, res) => {
    res.send('API Penyalur Pembantu Aktif! Server berjalan normal.');
});

// --- ROUTE 2: TAMBAH PEKERJA BARU (CREATE) ---
app.post('/api/workers', upload.single('fotoUrl'), async (req, res) => {
    try {
        const data = req.body;
        const file = req.file;
        
        // Jika user upload foto, pakai nama filenya. Jika tidak, null.
        const photoFilename = file ? file.filename : null;

        const sql = `
            INSERT INTO workers 
            (name, age, category, origin, marital_status, religion, education, tribe, experience, skills, shortcomings, languages, status, salary, description, photo_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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

// --- ROUTE 3: AMBIL SEMUA DATA PEKERJA (READ ALL) ---
app.get('/api/workers', async (req, res) => {
    try {
        // Mengambil semua data diurutkan dari yang terbaru
        const [rows] = await db.query('SELECT * FROM workers ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error("Error ambil data:", error);
        res.status(500).json({ message: 'Gagal mengambil data' });
    }
});

// --- ROUTE 4: AMBIL DATA 1 PEKERJA SPESIFIK (READ ONE) ---
// Digunakan untuk mengisi Form Edit otomatis
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

// --- ROUTE 5: UPDATE DATA PEKERJA (UPDATE) ---
app.put('/api/workers/:id', upload.single('fotoUrl'), async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const file = req.file;

        // Logika Update:
        // Kita update semua data teks.
        // Untuk foto: Jika ada file baru, kita update kolom photo_url. Jika tidak, jangan diubah.
        
        let sql = `
            UPDATE workers SET 
            name=?, age=?, category=?, origin=?, marital_status=?, religion=?, education=?,
            tribe=?, experience=?, skills=?, shortcomings=?, languages=?, 
            status=?, salary=?, description=?
        `;
        
        const values = [
            data.nama, data.umur, data.kategori, data.lokasi, data.status_perkawinan,
            data.agama, data.pendidikan, // Tambahkan ini
            data.suku, data.pengalaman, data.keterampilan,
            data.kekurangan, data.bahasa_asing, data.status, data.gaji, data.deskripsi
        ];

        // Jika user mengupload foto baru, tambahkan ke query
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

// --- ROUTE 6: HAPUS PEKERJA (DELETE) ---
app.delete('/api/workers/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // 1. Cek dulu apakah pekerja ini punya foto?
        const [rows] = await db.query('SELECT photo_url FROM workers WHERE id = ?', [id]);
        
        // 2. Jika ada fotonya, hapus file fotonya dari folder 'uploads'
        if (rows.length > 0 && rows[0].photo_url) {
            const filePath = path.join(__dirname, 'uploads', rows[0].photo_url);
            // Cek apakah filenya beneran ada, kalau ada hapus
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); 
            }
        }

        // 3. Hapus data dari database
        await db.query('DELETE FROM workers WHERE id = ?', [id]);

        res.json({ message: 'Data pekerja berhasil dihapus' });

    } catch (error) {
        console.error("Error delete:", error);
        res.status(500).json({ message: 'Gagal menghapus data', error: error.message });
    }
});

// --- ROUTE 7: SETUP ADMIN (SUDAH DIMATIKAN AGAR AMAN) ---
/* app.post('/api/setup-admin', async (req, res) => {
    // ... kode lama ...
});
*/

// --- ROUTE 8: LOGIN ADMIN (DENGAN LOGGING/CCTV) ---
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Ambil semua data user
        const [users] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
        
        if (users.length === 0) return res.status(401).json({ message: 'Username tidak ditemukan!' });

        const admin = users[0];
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) return res.status(401).json({ message: 'Password salah!' });

        // Buat Token
        const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Kirim Token DAN ROLE ke frontend
        res.json({ 
            message: 'Login berhasil', 
            token, 
            username: admin.username,
            role: admin.role // <--- PENTING: Kirim role
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
});

// ================= MANAJEMEN USER (KHUSUS SUPERADMIN) =================

// 1. AMBIL SEMUA ADMIN
app.get('/api/admins', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, username, email, phone, role FROM admins');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Gagal ambil data admin' });
    }
});

// 2. TAMBAH ADMIN BARU
app.post('/api/admins', async (req, res) => {
    try {
        const { username, email, phone, password, role } = req.body;
        
        // Hash password
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

// 3. EDIT ADMIN
app.put('/api/admins/:id', async (req, res) => {
    try {
        const { username, email, phone, password, role } = req.body;
        const id = req.params.id;

        let sql = 'UPDATE admins SET username=?, email=?, phone=?, role=?';
        let values = [username, email, phone, role];

        // Jika password diisi, update password. Jika kosong, biarkan password lama.
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

// 4. HAPUS ADMIN (DENGAN PENGAMANAN)
app.delete('/api/admins/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // LANGKAH 1: Cek dulu siapa yang mau dihapus?
        const [targets] = await db.query('SELECT role FROM admins WHERE id = ?', [id]);
        
        if (targets.length === 0) {
            return res.status(404).json({ message: 'Admin tidak ditemukan' });
        }

        const targetRole = targets[0].role;

        // LANGKAH 2: Jika yang mau dihapus adalah SUPERADMIN, cek jumlah sisanya
        if (targetRole === 'superadmin') {
            const [result] = await db.query('SELECT COUNT(*) as total FROM admins WHERE role = "superadmin"');
            const totalSuperadmin = result[0].total;

            if (totalSuperadmin <= 1) {
                // TOLAK PENGHAPUSAN
                return res.status(403).json({ message: 'DILARANG: Ini adalah Superadmin terakhir. Tidak bisa dihapus.' });
            }
        }

        // LANGKAH 3: Jika aman, baru hapus
        await db.query('DELETE FROM admins WHERE id = ?', [id]);
        res.json({ message: 'Admin berhasil dihapus' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal hapus admin' });
    }
});

// --- JALANKAN SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di port ${PORT}`);
});