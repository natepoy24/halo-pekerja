import { Helmet } from "react-helmet-async";
import { CheckCircle, Clock, DollarSign, ShieldCheck, Star } from "lucide-react";
import FaqAccordion from "../components/FaqAccordion";

export default function Services() {
  // Data statis untuk layanan yang ditawarkan.
  const services = [
    {
      id: "art",
      title: "Asisten Rumah Tangga (ART)",
      image: "/1.png",
      description: "Solusi utama untuk menjaga kebersihan dan keteraturan rumah Anda. ART kami terlatih dalam manajemen rumah tangga dasar hingga mendalam.",
      tasks: [
        "Menyapu, mengepel, dan membersihkan debu seluruh ruangan.",
        "Mencuci dan menyetrika pakaian dengan rapi.",
        "Memasak masakan harian sederhana hingga variatif.",
        "Membersihkan kamar mandi dan dapur secara mendetail.",
        "Membantu belanja kebutuhan harian ke pasar/supermarket."
      ],
      salaryRange: "Rp 2.500.000 - Rp 3.500.000",
      note: "Gaji tergantung pengalaman dan lokasi (Jabodetabek/Luar)."
    },
    {
      id: "lansia",
      title: "Perawat Lansia (Caregiver)",
      image: "/2.png",
      description: "Pendamping profesional untuk orang tua tercinta. Fokus pada kenyamanan, kesehatan, dan keamanan lansia di rumah.",
      tasks: [
        "Membantu mobilitas (berjalan, pindah kursi roda).",
        "Menjaga kebersihan diri (memandikan, ganti popok).",
        "Memantau jadwal minum obat.",
        "Menyiapkan dan menyuapi makanan diet khusus lansia.",
        "Menjadi teman bicara untuk menjaga kesehatan mental lansia."
      ],
      salaryRange: "Rp 3.000.000 - Rp 5.000.000+",
      note: "Gaji bervariasi untuk perawat medis dan non-medis (pendamping), tegantung pengalaman dan lokasi (Jabodetabek/Luar)."
    },
    {
      id: "babysitter",
      title: "Baby Sitter & Nanny",
      image: "/3.png",
      description: "Pengasuh anak yang sabar dan telaten. Membantu tumbuh kembang anak dari bayi baru lahir (newborn) hingga balita.",
      tasks: [
        "Memandikan dan merawat kebersihan bayi/anak.",
        "Menyiapkan susu, MPASI, dan makanan bernutrisi.",
        "Mensterilkan botol dan peralatan makan anak.",
        "Mengajak bermain edukatif untuk stimulasi motorik.",
        "Menidurkan anak sesuai jadwal tidur yang teratur."
      ],
      salaryRange: "Rp 3.000.000 - Rp 5.000.000",
      note: "Gaji bervariasi untuk antar pengasuh bayi newborn dan balita, tegantung pengalaman dan lokasi (Jabodetabek/Luar)."
    }
  ];

  // Data statis untuk FAQ di halaman layanan.
  const serviceFaq = [
    { q: "Apakah gaji di atas sudah termasuk uang makan?", a: "Umumnya gaji tersebut adalah gaji bersih (net). Majikan menanggung makan 3x sehari dan perlengkapan mandi standar. Namun bisa berbeda tengantung kesepakatan diawal." },
    { q: "Bagaimana sistem kontrak kerjanya?", a: "Untuk JABODETABEK, kami menerapkan sistem garansi 3 bulan, 3x pergantian. Pekerja bisa berkerja sebetahnya. Untuk luar kota menggunakan sistem kontrak dengan jangka waktu sesuai kesepakatan (biasanya 1 tahun). Hal ini untuk menjamin keamanan kedua belah pihak" },
    { q: "Apakah bisa request pekerja dari suku tertentu?", a: "Bisa. Anda dapat menyampaikan preferensi suku (Jawa, Sunda, dll) atau agama saat konsultasi, namun ketersediaan tergantung stok tenaga kerja saat itu." },
    { q: "Apa bedanya Perawat Lansia Medis dan Non-Medis?", a: "Perawat Medis memiliki latar belakang pendidikan keperawatan (bisa pasang infus/sonde/kateter). Non-medis adalah pendamping yang fokus pada aktivitas harian dan kebersihan lansia tanpa tindakan medis invasif." }
  ];

  return (
    <div className="bg-slate-50 font-sans text-slate-800">
      
      <Helmet>
        <title>Layanan Kami | Penyalur ART, Baby Sitter, Perawat Lansia</title>
        <meta name="description" content="Detail layanan profesional kami: Asisten Rumah Tangga (ART), Baby Sitter, dan Perawat Lansia. Dapatkan tenaga kerja terverifikasi dan terlatih untuk keluarga Anda." />
        <meta name="keywords" content="layanan penyalur pembantu, jasa art, jasa baby sitter, jasa perawat lansia, tugas art, tugas baby sitter" />
        <meta property="og:title" content="Layanan & Standar Gaji 2025 | Penyalur Pembantu Indonesia" />
        <meta property="og:description" content="Lihat detail layanan ART, Baby Sitter, dan Perawat Lansia kami, lengkap dengan rincian tugas dan estimasi standar gaji terbaru." />
        <meta property="og:image" content="/1.png" />
      </Helmet>

      {/* HERO LAYANAN */}
      <div className="bg-purple-700 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Layanan & Standar Gaji 2025</h1>
        <p className="text-purple-100 text-lg max-w-2xl mx-auto">
          Transparansi tugas dan estimasi biaya untuk membantu Anda merencanakan kebutuhan rumah tangga dengan lebih baik.
        </p>
      </div>

      {/* DAFTAR LAYANAN */}
      <section className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        {services.map((service, index) => (
          <div key={service.id} className={`flex flex-col md:flex-row gap-10 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
            
            {/* FOTO LAYANAN */}
            <div className="w-full md:w-1/2">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-white relative group">
                <img 
                  src={service.image} 
                  alt={`Layanan ${service.title} Profesional`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Estimasi Gaji 2025</p>
                    <p className="text-purple-700 font-bold text-lg">{service.salaryRange}</p>
                </div>
              </div>
            </div>

            {/* INFO LAYANAN */}
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                {service.title}
              </h2>
              <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                {service.description}
              </p>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={20}/> Tugas & Tanggung Jawab:
                </h3>
                <ul className="space-y-3">
                    {service.tasks.map((task, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                            <span className="mt-1.5 w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0"></span>
                            {task}
                        </li>
                    ))}
                </ul>
              </div>

              <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg text-blue-800 text-sm">
                <DollarSign className="flex-shrink-0 mt-0.5" size={18}/>
                <p><strong>Catatan Gaji:</strong> {service.note}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* SEO CONTENT SECTION */}
      <section className="bg-white py-16 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 text-center">
            <span className="text-purple-600 font-bold tracking-wider text-sm uppercase">Mengapa Memilih Kami?</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-10">Standar Kualitas Penyalur Pembantu Indonesia</h2>
            
            <div className="grid md:grid-cols-3 gap-8 text-left">
                <div className="p-6 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-md transition">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                        <ShieldCheck size={24} />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Pemeriksaan Latar Belakang</h3>
                    <p className="text-slate-600 text-sm">Setiap pekerja melalui proses screening identitas (KTP/KK) dan pengecekan riwayat kriminal untuk keamanan keluarga Anda.</p>
                </div>
                <div className="p-6 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-md transition">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                        <Star size={24} />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Pelatihan Standar</h3>
                    <p className="text-slate-600 text-sm">Kami memberikan pembekalan dasar mengenai etika kerja, kebersihan, dan penggunaan peralatan rumah tangga modern.</p>
                </div>
                <div className="p-6 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-md transition">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                        <Clock size={24} />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Proses Cepat</h3>
                    <p className="text-slate-600 text-sm">Database kami selalu diperbarui (real-time). Anda bisa mendapatkan kandidat siap kerja dalam waktu kurang dari 24 jam.</p>
                </div>
            </div>
        </div>
      </section>

      {/* FAQ LAYANAN */}
      <section className="py-16 max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">Pertanyaan Seputar Layanan</h2>
        <FaqAccordion items={serviceFaq} />
      </section>

      {/* CTA */}
      <section className="py-12 bg-purple-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-4">Butuh Penawaran Khusus?</h2>
            <p className="mb-8 text-purple-100">Hubungi kami untuk konsultasi kebutuhan spesifik dan dapatkan profil kandidat yang paling cocok.</p>
            <button onClick={() => window.open("https://wa.me/6285781823040", "_blank")} className="bg-white text-purple-700 px-8 py-3 rounded-full font-bold hover:bg-purple-50 transition shadow-lg">
                Hubungi Admin Sekarang
            </button>
        </div>
      </section>

    </div>
  );
}