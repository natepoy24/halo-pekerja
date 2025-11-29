import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import Header from "./Header";
import Footer from "./Footer";

export default function PublicLayout() {
  // Inisialisasi dengan object kosong agar tidak error saat akses properti
  const [settings, setSettings] = useState({});
  const API_URL = 'https://api.halopekerja.com';

  useEffect(() => {
    // Ambil pengaturan SEO global saat website pertama dibuka
    axios.get(`${API_URL}/api/settings`)
      .then(res => {
          if (res.data) {
              setSettings(res.data);
          }
      })
      .catch(err => console.error("Gagal memuat pengaturan global:", err));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* INJECT META DATA GLOBAL */}
      <Helmet>
        {/* Default Title & Desc (akan ditimpa oleh halaman spesifik jika ada) */}
        {settings.site_name && <title>{settings.site_name}</title>}
        {settings.meta_description && <meta name="description" content={settings.meta_description} />}
        {settings.meta_keywords && <meta name="keywords" content={settings.meta_keywords} />}
        
        {/* GOOGLE SEARCH CONSOLE VERIFICATION CODE */}
        {/* Pastikan hanya merender jika kodenya ada */}
        {settings.google_verification_code && (
            <meta name="google-site-verification" content={settings.google_verification_code} />
        )}
      </Helmet>

      <Header />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}