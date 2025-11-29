import { Helmet } from "react-helmet-async";
import usePageSeo from "../hooks/usePageSeo"; // Import Hook

export default function Gallery() {
  // PANGGIL DATA SEO KHUSUS HALAMAN 'gallery'
  const seo = usePageSeo('gallery');

  const galleryImages = [
    // ... (biarkan data gambar tetap sama) ...
    { src: "/gallery/1.png", alt: "foto bersama semua calon pekerja" },
    { src: "/gallery/2.png", alt: "Pemberian materi secara tertulis" },
    { src: "/gallery/3.png", alt: "foto bersama semua calon pekerja" },
    { src: "/gallery/4.jpeg", alt: "makan bersama di asrama" },
    { src: "/gallery/5.png", alt: "Pemberian materi secara lisan" },
    { src: "/gallery/7.jpeg", alt: "pelatihan memandikan bayi..." },
    { src: "/gallery/8.jpeg", alt: "pelatihan praktek memakaikan baju..." },
    { src: "/gallery/9.jpeg", alt: "pelatihan praktek memberi susu..." },
  ];

  return (
    <>
      <Helmet>
        <title>{seo?.meta_title || "Galeri Kegiatan | Penyalur Pembantu Indonesia"}</title>
        <meta name="description" content={seo?.meta_description || "Dokumentasi kegiatan pelatihan dan penempatan tenaga kerja."} />
        <meta name="keywords" content={seo?.meta_keywords || "galeri foto, pelatihan art, kegiatan p3rt"} />
      </Helmet>

      {/* ... (SISA KODE TAMPILAN DI BAWAH TETAP SAMA) ... */}
      <div className="bg-purple-700 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-2">Galeri Kegiatan</h1>
        <p className="text-purple-100 max-w-2xl mx-auto">
          Transparansi adalah kunci kepercayaan. Lihat bagaimana kami menyeleksi, melatih, dan menyiapkan tenaga kerja terbaik untuk Anda.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleryImages.map((image, index) => (
            <div key={index} className="group aspect-square bg-slate-200 rounded-xl overflow-hidden shadow-lg border-4 border-white hover:shadow-2xl transition-shadow duration-300">
              <img 
                src={image.src} 
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      <section className="bg-slate-50 py-16 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Proses Profesional untuk Hasil Maksimal</h2>
          <div className="text-slate-600 space-y-4 leading-relaxed text-base">
            <p>
              Setiap foto dalam galeri ini adalah cerminan dari komitmen kami sebagai <strong>P3RT resmi</strong>. Kami tidak hanya menyalurkan, tetapi juga membentuk tenaga kerja yang siap pakai. Proses <strong>pelatihan ART</strong> mencakup standar kebersihan modern, sementara <strong>pelatihan baby sitter</strong> kami fokus pada keamanan dan stimulasi tumbuh kembang anak.
            </p>
            <p>
              Dokumentasi kegiatan ini menunjukkan dedikasi kami dalam menjalankan setiap prosedur, mulai dari <strong>verifikasi identitas</strong> yang ketat hingga pembekalan mental sebelum pekerja ditempatkan. Dengan melihat langsung proses kerja kami, kami berharap Anda semakin yakin untuk mempercayakan kebutuhan tenaga kerja rumah tangga Anda kepada Penyalur Pembantu Indonesia.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}