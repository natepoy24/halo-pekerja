const mysql = require('mysql2');
const dotenv = require('dotenv');

// Membaca file .env
dotenv.config();

// Membuat kolam koneksi (Connection Pool)
// Kita pakai 'pool' agar koneksi tidak putus-nyambung terus menerus
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

// Cek koneksi saat file ini dijalankan pertama kali
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Gagal terhubung ke Database cPanel:', err.message);
    } else {
        console.log('✅ Berhasil terhubung ke Database cPanel!');
        connection.release(); // Kembalikan koneksi ke pool
    }
});

// Kita export agar bisa dipakai di file lain
module.exports = db.promise();