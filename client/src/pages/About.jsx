import { Helmet } from "react-helmet-async";
import { Users, ShieldCheck, Heart, Target, ArrowRight } from "lucide-react";
import FaqAccordion from "../components/FaqAccordion";
import usePageSeo from "../hooks/usePageSeo"; // Impor hook kustom

export default function About() {
  // Ambil data SEO khusus untuk halaman 'about'
  const seo = usePageSeo('about');

  const faqItemsAbout = [
    { q: "Apa bedanya Penyalur Pembantu Indonesia dengan agen perorangan/calo?", a: "Kami adalah P3RT (Perusahaan Penempatan Pekerja Rumah Tangga) resmi yang berbadan hukum, bukan perorangan. Ini berarti kami beroperasi di bawah pengawasan pemerintah, memiliki standar prosedur yang jelas, dan memberikan jaminan keamanan serta kontrak kerja yang legal bagi pengguna jasa dan pekerja." },
    { q: "Bagaimana proses seleksi tenaga kerja di sini?", a: "Setiap calon pekerja wajib melalui beberapa tahap: verifikasi identitas asli (KTP, KK), wawancara mendalam untuk mengetahui karakter dan motivasi, pengecekan latar belakang, serta pelatihan dasar mengenai etika dan keterampilan kerja sebelum kami nyatakan siap untuk disalurkan." },
    { q: "Apakah perusahaan ini legal dan terdaftar?", a: "Tentu. Kami adalah P3RT (Perusahaan Penempatan Pekerja Rumah Tangga) yang terdaftar secara resmi di dinas terkait. Legalitas adalah prioritas utama kami untuk memberikan rasa aman dan kepercayaan penuh kepada seluruh klien kami." },
    { q: "Mengapa saya harus memilih penyalur resmi seperti Anda?", a: "Memilih penyalur resmi memberikan Anda kepastian hukum, kontrak yang jelas, dan perlindungan. Anda mendapatkan garansi penggantian jika pekerja tidak cocok dan dukungan mediasi jika terjadi masalah. Ini adalah investasi untuk ketenangan pikiran jangka panjang keluarga Anda." },
  ];

  return (
    <>
      <Helmet>
        <title>{seo ? seo.meta_title : "Tentang Kami | Penyalur Pembantu & ART Terpercaya"}</title>
        <meta name="description" content={seo ? seo.meta_description : "Pelajari lebih lanjut tentang visi, misi, dan komitmen kami sebagai P3RT resmi dalam menyediakan tenaga kerja rumah tangga yang profesional, amanah, dan terverifikasi."} />
        {seo?.meta_keywords && <meta name="keywords" content={seo.meta_keywords} />}
        <meta property="og:title" content={seo ? seo.meta_title : "Tentang Kami | Penyalur Pembantu & ART Terpercaya"} />
        <meta property="og:description" content={seo ? seo.meta_description : "Kenali lebih dalam Penyalur Pembantu Indonesia, P3RT resmi yang berkomitmen pada legalitas, keamanan, dan kualitas tenaga kerja."} />
        <meta property="og:image" content="/hero-tentang.jpeg" />
      </Helmet>

      {/* Header Section */}
      <div className="bg-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tentang Kami</h1>
          <p className="text-purple-100 text-lg max-w-2xl mx-auto">
            Membangun kepercayaan dan kenyamanan keluarga Indonesia melalui pelayanan tenaga kerja rumah tangga yang profesional dan amanah.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative"> 
             <div className="aspect-video bg-slate-200 rounded-2xl overflow-hidden shadow-lg">
                <img src="/hero-tentang.jpeg" alt="Tim Penyalur Pembantu" className="w-full h-full object-cover" />
             </div>
             <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border border-slate-100 hidden md:block">
                <p className="text-purple-700 font-bold text-2xl">10+</p>
                <p className="text-slate-500 text-sm">Tahun Pengalaman</p>
             </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Mitra Keluarga Terpercaya</h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Penyalur Pembantu Indonesia didirikan dengan satu tujuan sederhana: <strong>memberikan ketenangan pikiran bagi keluarga</strong>. Kami memahami betapa sulitnya mencari asisten rumah tangga, baby sitter, atau perawat lansia yang tidak hanya terampil, tetapi juga dapat dipercaya.
            </p>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Kami bukan sekadar agen penyalur. Kami adalah mitra yang melakukan seleksi ketat, verifikasi latar belakang, dan pelatihan dasar untuk memastikan setiap tenaga kerja yang kami tempatkan siap memberikan pelayanan terbaik dengan hati.
            </p>
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-slate-700">
                    <ShieldCheck className="text-green-500" size={24} />
                    <span>Verifikasi identitas & latar belakang ketat.</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                    <Heart className="text-red-500" size={24} />
                    <span>Pelayanan berbasis empati dan kekeluargaan.</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                    <Target className="text-blue-500" size={24} />
                    <span>Garansi penggantian jika tidak cocok.</span>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visi Misi */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-800">Visi & Misi</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-purple-100 text-center hover:-translate-y-1 transition">
                    <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-800">Visi Kami</h3>
                    <p className="text-slate-600 text-sm">
                        Menjadi perusahaan penempatan tenaga kerja rumah tangga terdepan di Indonesia yang dikenal karena integritas, kualitas, dan kemanusiaan.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-purple-100 text-center hover:-translate-y-1 transition md:col-span-2">
                    <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Target size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-800">Misi Kami</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-left text-slate-600 text-sm">
                        <ul className="space-y-2">
                            <li>• Menyediakan tenaga kerja yang terlatih, jujur, dan bertanggung jawab.</li>
                            <li>• Memberikan perlindungan dan kesejahteraan yang layak bagi tenaga kerja.</li>
                        </ul>
                        <ul className="space-y-2">
                            <li>• Membangun hubungan harmonis antara pengguna jasa dan tenaga kerja.</li>
                            <li>• Terus meningkatkan standar pelayanan melalui evaluasi berkala.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Konten SEO Tambahan */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Legalitas dan Komitmen Kami</h2>
          <div className="text-slate-600 space-y-4 leading-relaxed">
            <p>
              Sebagai <strong>P3RT (Perusahaan Penempatan Pekerja Rumah Tangga)</strong> yang beroperasi di bawah naungan hukum Indonesia, legalitas adalah fondasi utama kami. Kami bukan sekadar perantara, melainkan sebuah lembaga yang bertanggung jawab penuh atas setiap tenaga kerja yang kami salurkan. Dengan status sebagai <strong>P3RT resmi</strong>, kami memastikan semua prosedur, mulai dari rekrutmen hingga penempatan, sesuai dengan standar pemerintah. Ini memberikan jaminan keamanan bagi Anda sebagai pengguna jasa dan juga perlindungan hak bagi para pekerja.
            </p>
            <p>
              Komitmen kami tidak berhenti pada penyaluran tenaga kerja. Kami percaya bahwa hubungan kerja yang baik dibangun di atas rasa saling percaya dan komunikasi yang terbuka. Oleh karena itu, tim kami selalu siap menjadi mediator dan memberikan dukungan penuh selama masa kontrak. Memilih kami berarti memilih <strong>penyalur pembantu yang amanah</strong>, transparan, dan profesional, memastikan ketenangan dan kenyamanan jangka panjang untuk keluarga Anda.
            </p>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq-about" className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-10">Pertanyaan Seputar Perusahaan</h2>
            <FaqAccordion items={faqItemsAbout} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Siap Menemukan Partner Terbaik untuk Keluarga Anda?</h2>
            <p className="text-slate-600 mb-8">Jangan ragu untuk berkonsultasi dengan kami. Tim kami siap membantu mencarikan kandidat yang paling sesuai dengan kebutuhan spesifik rumah tangga Anda.</p>
            <button 
                onClick={() => window.open("https://wa.me/6285781823040", "_blank")} 
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-4 rounded-full font-bold hover:bg-purple-700 transition shadow-lg"
            >
                Hubungi Kami Sekarang <ArrowRight size={20} />
            </button>
        </div>
      </section>
    </>
  );
}