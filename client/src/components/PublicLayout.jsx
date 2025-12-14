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

  // Fungsi klik WA Floating
  const handleFloatingWA = () => {
    const phoneNumber = "6285781823040"; 
    const message = "Halo Admin, saya ingin berkonsultasi mengenai kebutuhan tenaga kerja rumah tangga.";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* INJECT META DATA GLOBAL */}
      <Helmet>
        {/* Default Title & Desc (akan ditimpa oleh halaman spesifik jika ada) */}
        {settings.site_name && <title>{settings.site_name}</title>}
        {settings.meta_description && <meta name="description" content={settings.meta_description} />}
        {settings.meta_keywords && <meta name="keywords" content={settings.meta_keywords} />}
        
      </Helmet>

      <Header />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />

      {/* --- FLOATING WHATSAPP BUTTON --- */}
      <button 
        onClick={handleFloatingWA}
        className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center animate-bounce-slow"
        aria-label="Chat WhatsApp"
        title="Chat dengan Admin"
      >
        <MessageCircle size={32} fill="white" className="text-green-500" />
      </button>

    </div>

  );
}