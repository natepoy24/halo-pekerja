import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { 
  MapPin, Briefcase, User, Star, Heart, AlertCircle, 
  CheckCircle, MessageCircle, ArrowLeft, DollarSign 
} from "lucide-react";

export default function WorkerDetail() {
  const { id } = useParams(); // Ambil ID dari URL
  const [worker, setWorker] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkerDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/workers/${id}`);
        setWorker(response.data);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data pekerja. Mungkin ID tidak ditemukan.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkerDetail();
  }, [id]);

  const handleContact = () => {
    if (!worker) return;
    const phoneNumber = "6285781823040"; // Nomor WA Admin
    const message = `Halo Admin, saya ingin merekrut pekerja ini:\n\nNama: ${worker.name}\nID: ${worker.id}\nKategori: ${worker.category}\n\nApakah masih tersedia?`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full"></div>
    </div>
  );

  if (error || !worker) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
      <AlertCircle size={48} className="text-red-500 mb-4" />
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Data Tidak Ditemukan</h2>
      <p className="text-slate-600 mb-6">{error || "Pekerja yang Anda cari tidak tersedia."}</p>
      <Link to="/" className="text-purple-700 font-bold hover:underline">Kembali ke Beranda</Link>
    </div>
  );

  // Membuat objek structured data untuk SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": worker.name,
    "jobTitle": worker.category,
    "description": worker.description || `Profil ${worker.category} bernama ${worker.name}, usia ${worker.age} tahun, asal dari ${worker.origin}.`,
    "image": worker.photo_url ? `http://localhost:5000/uploads/${worker.photo_url}` : null,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": worker.origin,
      "addressCountry": "ID"
    },
    "knowsAbout": worker.skills ? worker.skills.split(',').map(s => s.trim()) : [worker.category]
  };

  return (
    <>
      <Helmet>
        <title>{`${worker.name} - ${worker.category} | Penyalur Pembantu Indonesia`}</title>
        <meta name="description" content={`Profil lengkap ${worker.name}, seorang ${worker.category} berpengalaman dari ${worker.origin}. Lihat detail keahlian, pengalaman, dan gaji. Siap bekerja untuk area Jabodetabek.`} />
        <meta name="keywords" content={`${worker.category}, ${worker.name}, cari ${worker.category.toLowerCase()}, penyalur ${worker.category.toLowerCase()}, ${worker.origin}, pekerja rumah tangga`} />
        
        {/* Open Graph Tags untuk Media Sosial */}
        <meta property="og:title" content={`${worker.name} - ${worker.category}`} />
        <meta property="og:description" content={worker.description || `Profil lengkap ${worker.name}, seorang ${worker.category} berpengalaman.`} />
        {worker.photo_url && <meta property="og:image" content={`http://localhost:5000/uploads/${worker.photo_url}`} />}
        
        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-slate-50 font-sans py-12 px-4">
        <div className="max-w-5xl mx-auto">
          
          {/* Breadcrumb / Back Button */}
          <Link to="/#katalog" className="inline-flex items-center gap-2 text-slate-500 hover:text-purple-700 mb-6 font-medium transition">
            <ArrowLeft size={20} /> Kembali ke Daftar
          </Link>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* --- SIDEBAR KIRI (FOTO & CTA) --- */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sticky top-24">
                <div className="aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden mb-6 relative">
                  {worker.photo_url ? (
                    <img 
                      src={`http://localhost:5000/uploads/${worker.photo_url}`} 
                      alt={worker.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <User size={64} />
                    </div>
                  )}
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${worker.status === 'Tersedia' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {worker.status}
                  </div>
                </div>

                <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Gaji Harapan</h3>
                <div className="flex items-center gap-2 text-2xl font-bold text-slate-800 mb-6">
                  <span className="text-purple-600">Rp</span>
                  {Number(worker.salary).toLocaleString('id-ID')}
                  <span className="text-sm text-slate-400 font-normal">/bulan</span>
                </div>

                <button 
                  onClick={handleContact}
                  disabled={worker.status !== 'Tersedia'}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold shadow-lg shadow-purple-200 transition flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} />
                  {worker.status === 'Tersedia' ? 'Rekrut Sekarang (WA)' : 'Sudah Bekerja'}
                </button>
                <p className="text-xs text-center text-slate-400 mt-3">
                  *Biaya administrasi belum termasuk
                </p>
              </div>
            </div>

            {/* --- KONTEN KANAN (DETAIL DATA) --- */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Header Info */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                  <div>
                    <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold mb-2">
                      {worker.category}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{worker.name}</h1>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                    <MapPin size={18} className="text-purple-600" />
                    <span className="font-medium">{worker.origin}</span>
                  </div>
                </div>

                {/* Statistik Utama */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-b border-slate-100 py-6 mb-6">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Usia</p>
                    <p className="text-lg font-bold text-slate-800">{worker.age} Tahun</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Pengalaman</p>
                    <p className="text-lg font-bold text-slate-800">{worker.experience} Tahun</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Agama</p>
                    <p className="text-lg font-bold text-slate-800">{worker.religion}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Status</p>
                    <p className="text-lg font-bold text-slate-800">{worker.marital_status}</p>
                  </div>
                </div>

                {/* Deskripsi */}
                <div className="mb-6">
                  <h3 className="font-bold text-slate-800 mb-3 text-lg">Tentang Pekerja</h3>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                    {worker.description || "Tidak ada deskripsi tambahan."}
                  </p>
                </div>

                {/* Informasi Tambahan (Suku, Bahasa, dll) */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <User size={18} className="text-purple-600"/> Data Pribadi
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex justify-between border-b border-slate-50 pb-2">
                        <span>Suku:</span> <span className="font-semibold">{worker.tribe}</span>
                      </li>
                      <li className="flex justify-between border-b border-slate-50 pb-2">
                        <span>Keahlian Bahasa Asing:</span> <span className="font-semibold">{worker.languages || "Tidak ada"}</span>
                      </li>
                      {/* UPDATE BAGIAN INI: */}
                      <li className="flex justify-between border-b border-slate-50 pb-2">
                        <span>Pendidikan:</span> <span className="font-semibold">{worker.education || "SD"}</span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Keahlian (Skills) */}
                  <div>
                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <Briefcase size={18} className="text-purple-600"/> Keahlian Utama
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {worker.skills ? worker.skills.split(',').map((skill, idx) => (
                        <span key={idx} className="bg-green-50 text-green-700 px-3 py-1 rounded-md text-sm font-medium border border-green-100">
                          {skill.trim()}
                        </span>
                      )) : <span className="text-slate-400 italic">Tidak ada data skill</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Kekurangan (Transparansi) */}
              {worker.shortcomings && (
                <div className="bg-yellow-50 rounded-2xl border border-yellow-100 p-6">
                  <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                    <AlertCircle size={20} /> Catatan Kejujuran (Kekurangan)
                  </h3>
                  <p className="text-yellow-700 text-sm">
                    {worker.shortcomings}
                  </p>
                  <p className="text-xs text-yellow-600 mt-2 italic">
                    *Kami menjunjung tinggi transparansi agar Anda mendapatkan pekerja yang sesuai harapan.
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}