import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { Users, ArrowRight, CheckCircle, Star, MessageCircle, MapPin, Briefcase, ShieldCheck, GraduationCap, Replace, Fingerprint, Zap, LifeBuoy } from "lucide-react";

import FaqAccordion from "../components/FaqAccordion";
import AnimatedBadge from "../components/AnimatedBadge";
export default function Home() {
  const [workers, setWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- 1. AMBIL DATA DARI DATABASE ---
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/workers");
        // Filter hanya yang statusnya "Tersedia" agar user tidak kecewa
        const availableWorkers = response.data.filter(w => w.status === 'Tersedia');
        setWorkers(availableWorkers);
      } catch (error) {
        console.error("Gagal ambil data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkers();
  }, []);

  // --- 2. FUNGSI WHATSAPP ---
  const handleContact = (workerName, workerCategory) => {
    const phoneNumber = "6285781823040"; // GANTI DENGAN NOMOR WA BISNIS KAMU (Format: 628...)
    const message = `Halo Admin Penyalur Pembantu, saya tertarik dengan profil pekerja: ${workerName}, Kategori: ${workerCategory}. Apakah masih tersedia?`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const trustBadges = [
    { icon: <ShieldCheck size={24} className="text-purple-600"/>, title: "P3RT Resmi & Legal", desc: "Lembaga terdaftar & diawasi oleh dinas terkait." },
    { icon: <GraduationCap size={24} className="text-purple-600"/>, title: "Terdidik & Terlatih", desc: "Lolos seleksi keterampilan, etika, dan standar kerja." },
    { icon: <Replace size={24} className="text-purple-600"/>, title: "Garansi Penggantian", desc: "Jaminan ganti jika pekerja tidak cocok selama masa garansi." },
    { icon: <LifeBuoy size={24} className="text-purple-600"/>, title: "Dukungan Penuh", desc: "Tim kami siap memberikan dukungan dan mediasi selama masa kontrak kerja." },
    { icon: <Fingerprint size={24} className="text-purple-600"/>, title: "Verifikasi Identitas", desc: "Data KTP, KK, dan SKCK asli dan telah kami verifikasi." },
    { icon: <Zap size={24} className="text-purple-600"/>, title: "Proses Cepat & Mudah", desc: "Admin kami siap membantu Anda via WhatsApp." },
  ];

  const faqItems = [
    { q: "Apakah ada garansi jika pekerja tidak cocok?", a: "Ya, kami memberikan garansi penggantian pekerja sebanyak 3x dalam masa garansi 3 bulan tanpa biaya tambahan administrasi." },
    { q: "Berapa biaya pengambilan pekerja?", a: "Biaya administrasi bervariasi tergantung jenis pekerjaan dan pengalaman pekerja. Silakan hubungi admin kami via WhatsApp untuk detail biaya administrasi." },
    { q: "Apakah pekerja dapat dipercaya?", a: "Tentu, setiap calon pekerja kami melalui proses seleksi yang sangat ketat, meliputi verifikasi identitas (KTP, KK), wawancara mendalam, uji kompetensi(kecuali ART), serta pengecekan latar belakang untuk memastikan mereka dapat dipercaya." },
    { q: "Bagaimana cara pembayarannya?", a: "Pembayaran administrasi dilakukan via transfer ke rekening perusahaan setelah Anda melakukan interview dan cocok dengan pekerja." },
    { q: "Bagaimana proses pemesanan?", a: "Sangat mudah: 1. Konsultasi kebutuhan Anda dengan admin kami. 2. Kami akan berikan beberapa kandidat yang cocok. 3. Lakukan interview (bisa via video call). 4. Jika cocok, selesaikan administrasi. 5. Pekerja kami antar ke lokasi Anda." },
    { q: "Apakah aman?", a: "Sangat aman. Kami adalah P3RT (Perusahaan Penempatan Pekerja Rumah Tangga) resmi yang terdaftar dan diawasi. Semua pekerja telah melalui proses verifikasi identitas yang ketat." },
    { q: "Wilayah layanan mencakup area mana saja?", a: "Saat ini, fokus utama layanan kami adalah untuk wilayah Jabodetabek (Jakarta, Bogor, Depok, Tangerang, Bekasi) dan sekitarnya. Namun kami juga melayani untuk luar kota menggunakan sistem Kontrak" }
  ];

  return (
    <>
      <Helmet>
        <title>Penyalur Pembantu & ART Terpercaya di Jabodetabek | P3RT Resmi</title>
        <meta name="description" content="Cari ART, Baby Sitter, dan Perawat Lansia terlatih & terverifikasi. Kami adalah P3RT resmi di Jabodetabek yang menyediakan tenaga kerja profesional dengan garansi." />
        <meta name="keywords" content="penyalur pembantu, art, baby sitter, perawat lansia, jabodetabek, p3rt, lptks, yayasan pembantu, jasa art, penyalur prt" />
      </Helmet>
      {/* --- HERO SECTION --- */}
      <header className="bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
                <AnimatedBadge />
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                    Solusi Terbaik untuk <span className="text-purple-600">Kenyamanan</span> Keluarga Anda.
                </h1>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    Kami menyalurkan PRT, Baby Sitter, dan Perawat Lansia yang terlatih, jujur, dan siap kerja. Proses cepat, transparan, dan bergaransi.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <a href="#katalog" className="bg-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-200 flex justify-center items-center gap-2">
                        Lihat Daftar Pekerja <ArrowRight size={20} />
                    </a>
                    <button onClick={() => window.open("https://wa.me/6285781823040", "_blank")} className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition flex justify-center items-center gap-2">
                        <MessageCircle size={20} /> Konsultasi Gratis
                    </button>
                </div>
                
                <div className="mt-8 flex gap-6 text-sm text-slate-500 font-medium">
                    <div className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Identitas Jelas</div>
                    <div className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Garansi Ganti</div>
                    <div className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Admin Responsif</div>
                </div>
            </div>
            <div className="order-1 md:order-2 relative">
                {/* Pastikan file hero.jpg ada di folder client/public/hero.jpg */}
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative z-10">
                    <img src="/hero.jpg" alt="Keluarga Bahagia" className="w-full h-full object-cover" />
                </div>
                {/* Aksen Dekorasi */}
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-yellow-400 rounded-full z-0 opacity-50 blur-2xl"></div>
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-purple-600 rounded-full z-0 opacity-20 blur-3xl"></div>
            </div>
        </div>
      </header>

      {/* --- LAYANAN KAMI --- */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-800 mb-4">Layanan Kami</h2>
                <p className="text-slate-600 max-w-2xl mx-auto text-base">Fokus pada tiga bidang utama untuk membantu manajemen rumah tangga Anda berjalan lancar.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { title: "Asisten Rumah Tangga", desc: "Menjaga kebersihan rumah, memasak, mencuci, dan setrika dengan standar kerapihan tinggi.", icon: "🏠" },
                    { title: "Baby Sitter / Nanny", desc: "Mengasuh buah hati dengan kasih sayang, sabar, dan telaten. Berpengalaman menangani bayi hingga balita.", icon: "👶" },
                    { title: "Perawat Lansia", desc: "Mendampingi orang tua tercinta dengan penuh perhatian, membantu mobilitas, dan memantau kesehatan.", icon: "👵" }
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:-translate-y-1 transition duration-300">
                        <div className="text-4xl mb-4">{item.icon}</div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                        <p className="text-slate-600 leading-relaxed text-base">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- TRUST BADGE SECTION --- */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-800 mb-4">Mengapa Memilih Kami?</h2>
                <p className="text-slate-600 max-w-2xl mx-auto text-base">Kami berkomitmen memberikan layanan terbaik dengan standar keamanan dan profesionalisme tertinggi.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trustBadges.map((badge, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-5 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            {badge.icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">{badge.title}</h3>
                            <p className="text-base text-slate-600">{badge.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- KATALOG PEKERJA (AMBIL DARI DB) --- */}
      <section id="katalog" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Tenaga Kerja Tersedia</h2>
                    <p className="text-slate-600">Pilih kandidat terbaik yang siap bekerja hari ini.</p>
                </div>
                {/* Tombol filter sederhana bisa ditaruh disini nanti */}
            </div>

            {isLoading ? (
                <div className="text-center py-20">
                    <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-500">Memuat data pekerja...</p>
                </div>
            ) : workers.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <p className="text-slate-500">Maaf, belum ada tenaga kerja yang tersedia saat ini.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {workers.map((worker) => (
                        <Link to={`/pekerja/${worker.id}`} key={worker.id} className="block bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition duration-300 group">
                            <div>
                                <div className="relative w-full aspect-square bg-slate-200 overflow-hidden">
                                    {worker.photo_url ? (
                                        <img src={`http://localhost:5000/uploads/${worker.photo_url}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={worker.name} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400"><Users size={40} /></div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                        <p className="text-white font-bold text-lg">{worker.name}</p>
                                        <p className="text-purple-200 text-xs font-medium">{worker.origin} • {worker.age} Thn</p>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="mb-4">
                                        <span className="inline-block bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded mb-2">
                                            {worker.category}
                                        </span>
                                        <p className="text-xs text-slate-500 line-clamp-2">{worker.description || "Pekerja rajin dan berpengalaman."}</p>
                                    </div>
                                    
                                    <div className="flex gap-2 text-xs text-slate-600 mb-4 font-medium">
                                        <span className="bg-slate-100 px-2 py-1 rounded flex items-center gap-1"><Briefcase size={12}/> {worker.experience} Thn</span>
                                        <span className="bg-slate-100 px-2 py-1 rounded flex items-center gap-1"><Star size={12}/> {worker.religion}</span>
                                    </div>

                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault(); // Mencegah link ter-trigger saat tombol WA diklik
                                            handleContact(worker.name, worker.category);
                                        }}
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-bold text-sm transition flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle size={16} /> Pesan via WA
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
      </section>

      {/* --- KONTEN SEO --- */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Mencari Penyalur Pembantu Terpercaya di Jabodetabek?</h2>
            <div className="text-slate-600 text-base leading-relaxed space-y-4">
                <p>
                    Penyalur Pembantu Indonesia adalah solusi terbaik bagi Anda yang sedang mencari <strong>penyalur pembantu</strong> profesional dan amanah di area <strong>Jabodetabek</strong>. Sebagai <strong>P3RT (Perusahaan Penempatan Pekerja Rumah Tangga)</strong> yang resmi dan legal, kami berkomitmen untuk menyediakan tenaga kerja berkualitas, mulai dari <strong>Asisten Rumah Tangga (ART)</strong>, <strong>Baby Sitter</strong>, hingga <strong>Perawat Lansia</strong> yang sudah terdidik dan terlatih.
                </p>
                <p>
                    Kami memahami pentingnya keamanan dan kenyamanan keluarga Anda. Oleh karena itu, setiap calon pekerja telah melalui proses verifikasi identitas yang ketat. Dengan layanan kami, Anda tidak perlu lagi khawatir saat mencari <strong>jasa ART</strong>, <strong>baby sitter terpercaya</strong>, atau <strong>perawat lansia profesional</strong> untuk wilayah Jakarta, Bogor, Depok, Tangerang, dan Bekasi. Hubungi kami untuk mendapatkan tenaga kerja rumah tangga terbaik dengan proses yang cepat, transparan, dan bergaransi.
                </p>
                <p>
                    Sebagai P3RT resmi, kami berbeda dari calo atau perantara perorangan. Seluruh proses, mulai dari rekrutmen, pelatihan, hingga penempatan, dilakukan secara profesional di bawah pengawasan hukum. Ini memberikan Anda kepastian dan perlindungan sebagai pengguna jasa. Anda mendapatkan kontrak kerja yang jelas, jaminan penggantian, serta dukungan mediasi jika terjadi kendala. Memilih <strong>yayasan penyalur pembantu</strong> resmi seperti kami adalah investasi untuk ketenangan pikiran Anda.
                </p>
                <p>
                    Apakah Anda mencari <strong>penyalur PRT di Jakarta</strong>, <strong>yayasan baby sitter di Bekasi</strong>, atau <strong>jasa perawat lansia di Tangerang</strong>? Kami adalah mitra yang tepat. Jangkauan layanan kami yang luas di Jabodetabek memastikan Anda mendapatkan kandidat terbaik yang paling dekat dengan lokasi Anda, menghemat waktu dan biaya transportasi.
                </p>
            </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-10">Pertanyaan Umum (FAQ)</h2>
            <FaqAccordion items={faqItems} />
        </div>
      </section>
    </>
  );
}