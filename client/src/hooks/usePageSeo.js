// Hook inti React untuk state dan side-effects.
import { useState, useEffect } from 'react';
// Klien HTTP untuk membuat permintaan API.
import axios from 'axios';

// URL dasar API Anda.
const API_URL = 'https://api.halopekerja.com';

/**
 * Custom hook untuk mengambil data SEO spesifik untuk sebuah halaman.
 * @param {string} pageName - Nama unik halaman (misal: 'home', 'tentang-kami').
 * @returns {object|null} - Objek data SEO atau null jika sedang memuat atau gagal.
 */
const usePageSeo = (pageName) => {
  // State untuk menyimpan data SEO yang diambil dari API.
  const [seo, setSeo] = useState(null);

  useEffect(() => {
    // Jangan jalankan jika nama halaman tidak ada.
    if (!pageName) return;

    axios.get(`${API_URL}/api/page-seo/${pageName}`)
      .then(response => setSeo(response.data))
      .catch(error => console.error(`Gagal mengambil data SEO untuk halaman '${pageName}':`, error));

  }, [pageName]); // Jalankan kembali efek ini jika pageName berubah.

  return seo;
};

export default usePageSeo;