const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Inisialisasi connection pool untuk manajemen koneksi database yang efisien.
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verifikasi koneksi ke database saat aplikasi dimulai.
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Gagal terhubung ke Database cPanel:', err.message);
    } else {
        console.log('✅ Berhasil terhubung ke Database cPanel!');
        connection.release(); // Melepas koneksi kembali ke pool.
    }
});

// Ekspor pool dalam bentuk promise untuk mendukung async/await.
module.exports = db.promise();