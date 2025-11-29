// Merender konten dari route anak.
import { Outlet } from "react-router-dom";
// Hook inti React untuk state dan side-effects.
import { useState, useEffect } from "react";
// Klien HTTP untuk membuat permintaan API.
import axios from "axios";
// Komponen untuk mengelola perubahan pada <head> dokumen.
import { Helmet } from "react-helmet-async";
// Komponen Header dan Footer untuk seluruh situs.
import Header from "./Header";
import Footer from "./Footer";

export default function PublicLayout() {
  // State untuk menyimpan pengaturan website global (SEO, nama situs, dll.).
  const [settings, setSettings] = useState(null);
  const API_URL = 'https://api.halopekerja.com';

  // Mengambil pengaturan website global dari API saat layout pertama kali dimuat.
  useEffect(() => {
    axios.get(`${API_URL}/api/settings`)
      .then(res => setSettings(res.data))
      .catch(err => console.error("Gagal memuat pengaturan global:", err));
  }, []);

  return (
    // Kontainer layout utama menggunakan flexbox untuk memastikan footer tetap di bawah.
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* Menyisipkan tag meta global ke dalam <head> dokumen. */}
      <Helmet>
        {/* Ini berfungsi sebagai tag meta default. Tag ini dapat ditimpa oleh halaman spesifik yang menggunakan komponen Helmet sendiri. */}
        {settings?.site_name && <title>{settings.site_name}</title>}
        {settings?.meta_description && <meta name="description" content={settings.meta_description} />}
        {settings?.meta_keywords && <meta name="keywords" content={settings.meta_keywords} />}
        
        {/* Menyisipkan kode verifikasi Google Search Console jika ada di dalam pengaturan. */}
        {settings?.google_verification_code && (
            <meta name="google-site-verification" content={settings.google_verification_code} />
        )}
      </Helmet>

      <Header />
      
      {/* Area konten utama yang akan mengisi ruang kosong yang tersedia, mendorong footer ke bawah. */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}