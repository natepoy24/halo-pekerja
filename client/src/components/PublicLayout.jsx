import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import Header from "./Header";
import Footer from "./Footer";
// Pastikan import X untuk tombol close pada bubble
import { MessageCircle, X } from "lucide-react";

export default function PublicLayout() {
  const [settings, setSettings] = useState({});
  const [showBubble, setShowBubble] = useState(true); // State untuk kontrol visibilitas CTA
  const API_URL = 'https://api.halopekerja.com';

  useEffect(() => {
    // Ambil pengaturan SEO global
    axios.get(`${API_URL}/api/settings`)
      .then(res => {
        if (res.data) {
          setSettings(res.data);
        }
      })
      .catch(err => console.error("Gagal memuat pengaturan global:", err));

    // Opsional: Munculkan bubble otomatis setelah 3 detik jika user menutupnya (bisa dihapus jika tidak perlu)
    // setTimeout(() => setShowBubble(true), 3000);
  }, []);

  const handleFloatingWA = () => {
    const phoneNumber = "628139511409";
    const message = "Halo Admin, saya ingin berkonsultasi mengenai kebutuhan tenaga kerja rumah tangga.";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">

      <Helmet>
        {settings.site_name && <title>{settings.site_name}</title>}
        {settings.meta_description && <meta name="description" content={settings.meta_description} />}
        {settings.meta_keywords && <meta name="keywords" content={settings.meta_keywords} />}
      </Helmet>

      <Header />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />

      {/* --- FLOATING WA WRAPPER --- */}
      {/* Container utama yang mengambang di pojok kanan bawah */}
      <div className="fixed bottom-6 right-6 z-[20] flex flex-col items-end gap-2">

        {/* 1. CTA BUBBLE (Muncul jika showBubble true) */}
        {showBubble && (
          <div className="relative bg-white p-4 rounded-xl shadow-xl border border-slate-100 max-w-[250px] animate-fade-in-up">
            {/* Tombol Close Kecil */}
            <button
              onClick={() => setShowBubble(false)}
              className="absolute -top-2 -left-2 bg-slate-200 text-slate-600 rounded-full p-1 hover:bg-red-100 hover:text-red-500 transition-colors"
            >
              <X size={12} />
            </button>

            {/* Isi Teks CTA */}
            <p className="text-sm font-bold text-slate-800 mb-1">Butuh ART atau Nanny?</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Konsultasi gratis sekarang! Kami siap membantu.
            </p>

            {/* Panah Segitiga Bawah (Aksen Speech Bubble) */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45 border-r border-b border-slate-100"></div>
          </div>
        )}

        {/* 2. TOMBOL WA */}
        <button
          onClick={handleFloatingWA}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
          aria-label="Chat WhatsApp"
          title="Chat dengan Admin"
        >
          <MessageCircle size={32} />
        </button>

      </div>

    </div>
  );
}