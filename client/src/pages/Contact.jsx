import { Helmet } from "react-helmet-async";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import usePageSeo from "../hooks/usePageSeo"; // Import Hook

export default function Contact() {
  // PANGGIL DATA SEO KHUSUS HALAMAN 'contact'
  const seo = usePageSeo('contact');

  const handleSendMessage = (e) => {
    e.preventDefault();
    const nama = e.target.nama.value;
    const pesan = e.target.pesan.value;

    const waLink = `https://wa.me/628139511409?text=Halo admin, saya ${nama}. ${pesan}`;
    window.open(waLink, "_blank");
  };

  return (
    <>
      <Helmet>
        <title>{seo?.meta_title || "Kontak Kami | Penyalur Pembantu Indonesia"}</title>
        <meta name="description" content={seo?.meta_description || "Hubungi kami untuk konsultasi kebutuhan tenaga kerja Anda."} />
        <meta name="keywords" content={seo?.meta_keywords || "kontak penyalur, alamat p3rt jakarta, no wa penyalur"} />
      </Helmet>

      {/* ... (SISA KODE TAMPILAN DI BAWAH TETAP SAMA) ... */}
      <div className="bg-purple-700 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-2">Hubungi Kami</h1>
        <p className="text-purple-100 max-w-xl mx-auto">
          Kami siap membantu Anda menemukan solusi tenaga kerja terbaik. Silakan hubungi kami melalui formulir di bawah atau kunjungi kantor kami.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Informasi Kantor</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Alamat Kantor</h3>
                    <p className="text-slate-600">Jl. Swadaya Gudang Baru Gg. Swadaya 1 no 27 S, Ciganjur, Kec. Jagakarsa, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12630</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-lg text-green-600">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">WhatsApp</h3>
                    <p className="text-slate-600">0857-8182-3040</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Email</h3>
                    <p className="text-slate-600">admin@halopekerja.com</p>
                    <p className="text-slate-600">support@halopekerja.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Jam Operasional</h3>
                    <p className="text-slate-600">Senin - Sabtu: 08.00 - 17.00 WIB</p>
                    <p className="text-slate-600">Minggu: Tutup</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg h-64 border border-slate-200">
              <iframe
                title="Peta Lokasi"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7930.797266400214!2d106.815783!3d-6.342389!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x36341c827e7837b%3A0x57c9ffc62718191c!2sPenyalur%20pembantu%20indonesia!5e0!3m2!1sid!2sid!4v1763853318507!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 h-fit">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Kirim Pesan</h2>
            <p className="text-slate-500 mb-6">Isi formulir di bawah ini, tim kami akan segera membalas via WhatsApp.</p>

            <form onSubmit={handleSendMessage} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <input type="text" name="nama" required className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Nama Anda" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">No. WhatsApp</label>
                  <input type="tel" name="hp" required className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="08..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Kategori</label>
                  <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white">
                    <option>Umum</option>
                    <option>Cari ART</option>
                    <option>Cari Baby Sitter</option>
                    <option>Cari Perawat Lansia</option>
                    <option>Komplain</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Pesan</label>
                <textarea name="pesan" required rows={4} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Tuliskan kebutuhan atau pertanyaan Anda..."></textarea>
              </div>

              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 shadow-md">
                <Send size={18} /> Kirim Pesan
              </button>
            </form>
          </div>

        </div>
      </div>

      <section className="bg-white py-16 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Konsultasi Kebutuhan Tenaga Kerja Anda</h2>
          <div className="text-slate-600 space-y-4 leading-relaxed text-base">
            <p>
              Mencari tenaga kerja rumah tangga yang tepat membutuhkan pertimbangan matang. Sebagai <strong>P3RT resmi di Jakarta</strong>, kami membuka pintu selebar-lebarnya bagi Anda untuk berkonsultasi. Jangan ragu menghubungi kami melalui <strong>nomor WhatsApp penyalur pembantu</strong> yang tertera di atas untuk mendapatkan informasi kandidat, standar gaji, atau prosedur pengambilan.
            </p>
            <p>
              Jika Anda ingin bertemu langsung, silakan kunjungi kantor kami sesuai <strong>alamat penyalur pembantu</strong> yang tercantum. Tim kami siap memberikan penjelasan detail mengenai layanan ART, Baby Sitter, dan Perawat Lansia untuk area <strong>Jabodetabek</strong>. Kami berkomitmen memberikan solusi yang aman, transparan, dan sesuai dengan kebutuhan unik keluarga Anda.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}