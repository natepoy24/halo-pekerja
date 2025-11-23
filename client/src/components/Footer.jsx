import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Kolom 1: Tentang Kami */}
          <div className="md:col-span-2 pr-8">
            <div className="flex items-center gap-3 mb-4">
              <img src="/new-favicon.png" alt="Logo" className="w-10 h-10" />
              <span className="text-white text-xl font-bold">Penyalur Pembantu Indonesia</span>
            </div>
            <p className="text-sm leading-relaxed">
              P3RT resmi yang berdedikasi untuk menyediakan tenaga kerja rumah tangga (ART, Baby Sitter, Perawat Lansia) yang terverifikasi, terlatih, dan amanah untuk kenyamanan keluarga Anda di Jabodetabek.
            </p>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wider">Navigasi</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/tentang-kami" className="hover:text-white transition-colors">Tentang Kami</Link></li>
              <li><Link to="/layanan" className="hover:text-white transition-colors">Layanan</Link></li>
              <li><a href="/#katalog" className="hover:text-white transition-colors">List Pekerja</a></li>
              <li><Link to="/galeri" className="hover:text-white transition-colors">Galeri</Link></li>
              <li><Link to="/kontak" className="hover:text-white transition-colors">Kontak</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Kontak Kami */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wider">Kontak Kami</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="flex-shrink-0 mt-1 text-purple-400" />
                <span>Jl. Swadaya Gudang Baru Gg. Swadaya 1 no 27 S, Ciganjur, Jagakarsa, Jakarta Selatan</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="flex-shrink-0 mt-1 text-purple-400" />
                <span>0857-8182-3040</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="flex-shrink-0 mt-1 text-purple-400" />
                <span>admin@halopekerja.com</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bagian Copyright */}
      <div className="bg-slate-900 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Penyalur Pembantu Indonesia. Semua Hak Cipta Dilindungi.
        </div>
      </div>
    </footer>
  );
}

