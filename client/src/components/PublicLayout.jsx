import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PublicLayout() {
  return (
    // 1. Menggunakan flexbox untuk mengatur layout secara vertikal.
    // 2. `min-h-screen` memastikan layout mengambil tinggi minimal seluruh layar.
    // 3. `bg-slate-50`, `font-sans`, `text-slate-800` menjadi gaya dasar untuk semua halaman publik.
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header />
      
      {/* 4. `flex-grow` membuat area konten utama ini mengisi semua ruang kosong yang tersedia,
             sehingga mendorong footer ke bagian paling bawah halaman. */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}