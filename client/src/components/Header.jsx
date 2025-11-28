import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40 w-full bg-opacity-95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Bagian Kiri: Logo dan Judul Situs */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-purple-700 group">
              <div className="w-10 h-10 transition-transform group-hover:scale-105">
                  <img src="/new-favicon.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold leading-none tracking-tight">
                  Penyalur Pembantu <span className="hidden sm:inline">Indonesia</span>
                </h1>
                <p className="text-[10px] text-slate-500 font-medium tracking-wider hidden lg:block">
                  Perusahaan Penempatan PRT Terpercaya
                </p>
              </div>
            </Link>
          </div>
          
          {/* Bagian Kanan: Menu Navigasi Desktop */}
          <div className="hidden md:flex items-center gap-5">
            <Link to="/" className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-purple-700 font-bold' : 'text-slate-600 hover:text-purple-700'}`}>Beranda</Link>
            <Link to="/tentang-kami" className={`text-sm font-medium transition-colors ${location.pathname === '/tentang-kami' ? 'text-purple-700 font-bold' : 'text-slate-600 hover:text-purple-700'}`}>Tentang Kami</Link>
            <Link to="/layanan" className={`text-sm font-medium transition-colors ${location.pathname === '/layanan' ? 'text-purple-700 font-bold' : 'text-slate-600 hover:text-purple-700'}`}>Layanan</Link>
            <a href="/#katalog" className="text-sm font-medium text-slate-600 hover:text-purple-700 transition-colors">List Pekerja</a>
            <Link to="/galeri" className={`text-sm font-medium transition-colors ${location.pathname === '/galeri' ? 'text-purple-700 font-bold' : 'text-slate-600 hover:text-purple-700'}`}>Galeri</Link>
            <Link to="/blog" className={`text-sm font-medium transition-colors ${location.pathname.startsWith('/blog') ? 'text-purple-700 font-bold' : 'text-slate-600 hover:text-purple-700'}`}>Blog</Link>
            <Link to="/kontak" className={`text-sm font-medium transition-colors ${location.pathname === '/kontak' ? 'text-purple-700 font-bold' : 'text-slate-600 hover:text-purple-700'}`}>Kontak</Link>
            
            <Link to="/login" className="ml-2 px-5 py-2 text-sm font-semibold text-purple-700 border border-purple-200 rounded-full hover:bg-purple-600 hover:text-white transition-all shadow-sm">
              Masuk Admin
            </Link>
          </div>

          {/* Tombol Hamburger untuk Tampilan Mobile */}
          <div className="flex md:hidden">
            <button onClick={() => setIsMenuOpen(true)} className="p-2 text-slate-600 hover:text-purple-700 transition-colors" aria-label="Buka Menu">
              <Menu size={26} />
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile (Drawer) */}
      <div className={`fixed inset-0 z-50 md:hidden ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        
        {/* Latar belakang overlay gelap */}
        <div 
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`} 
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Panel menu yang muncul dari kanan */}
        <div 
          className={`absolute top-0 right-0 w-[80%] max-w-sm h-screen bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${ // 'h-screen' untuk tinggi penuh
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header pada menu mobile */}
          <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-white">
            <span className="font-bold text-lg text-purple-700">Menu Utama</span>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-500 hover:text-red-500 hover:bg-slate-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
          
          {/* Daftar link navigasi mobile */}
          <div className="flex-1 overflow-y-auto p-6 bg-white">
            <div className="flex flex-col gap-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-slate-700 hover:text-purple-700 py-2 border-b border-slate-50 flex justify-between items-center">
                Beranda
              </Link>
              <Link to="/tentang-kami" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-slate-700 hover:text-purple-700 py-2 border-b border-slate-50">
                Tentang Kami
              </Link>
              <Link to="/layanan" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-slate-700 hover:text-purple-700 py-2 border-b border-slate-50">
                Layanan
              </Link>
              <a href="/#katalog" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-slate-700 hover:text-purple-700 py-2 border-b border-slate-50">
                List Pekerja
              </a>
              <Link to="/blog" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-slate-700 hover:text-purple-700 py-2 border-b border-slate-50">
                Blog
              </Link>
              <Link to="/galeri" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-slate-700 hover:text-purple-700 py-2 border-b border-slate-50">
                Galeri
              </Link>
              <Link to="/kontak" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-slate-700 hover:text-purple-700 py-2 border-b border-slate-50">
                Kontak
              </Link>
            </div>

            <div className="mt-8">
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block w-full text-center py-3 text-white bg-purple-600 rounded-lg font-bold hover:bg-purple-700 transition shadow-md">
                Masuk Admin Area
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}