import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Save, Layout, Loader2 } from "lucide-react";

export default function PageSeoForm() {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [formData, setFormData] = useState({
    meta_title: "", 
    meta_description: "", 
    meta_keywords: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = 'https://api.halopekerja.com';

  useEffect(() => {
    axios.get(`${API_URL}/api/page-seo`)
      .then(res => {
        setPages(res.data);
        if (res.data.length > 0) {
            handleSelectPage(res.data[0]);
        }
      })
      .catch(err => {
        console.error(err);
        toast.error("Gagal memuat data SEO Halaman");
      });
  }, []);

  const handleSelectPage = (page) => {
    setSelectedPage(page);
    setFormData({
        meta_title: page.meta_title || "",
        meta_description: page.meta_description || "",
        meta_keywords: page.meta_keywords || ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPage) return;

    setIsLoading(true);
    
    // AMBIL TOKEN DARI LOCALSTORAGE
    const token = localStorage.getItem("token");

    try {
      // SERTAKAN HEADER AUTHORIZATION DI SINI
      await axios.put(`${API_URL}/api/page-seo/${selectedPage.page_name}`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });
      
      toast.success(`SEO untuk halaman ${selectedPage.page_name} tersimpan!`);
      
      const updatedPages = pages.map(p => 
        p.page_name === selectedPage.page_name ? { ...p, ...formData } : p
      );
      setPages(updatedPages);
      
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Gagal menyimpan perubahan.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Layout className="text-purple-600" /> Editor SEO Per Halaman
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
          
          {/* SIDEBAR KIRI */}
          <div className="w-full md:w-1/3 space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pilih Halaman</p>
            {pages.map(page => (
                <button 
                    key={page.id}
                    onClick={() => handleSelectPage(page)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition ${
                        selectedPage?.page_name === page.page_name 
                        ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    {page.page_name.charAt(0).toUpperCase() + page.page_name.slice(1)}
                </button>
            ))}
            {pages.length === 0 && <p className="text-sm text-slate-400 italic">Belum ada data halaman.</p>}
          </div>

          {/* KANAN: FORM EDITOR */}
          <div className="w-full md:w-2/3 bg-slate-50 p-5 rounded-xl border border-slate-200">
             {selectedPage ? (
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">
                        Edit Meta: <span className="text-purple-600 uppercase">{selectedPage.page_name}</span>
                    </h3>
                    
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Meta Title (Judul di Browser)</label>
                        <input 
                            type="text" 
                            value={formData.meta_title} 
                            onChange={e => setFormData({...formData, meta_title: e.target.value})}
                            className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="Judul Halaman di Google"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Meta Description (Deskripsi di Google)</label>
                        <textarea 
                            rows="3" 
                            value={formData.meta_description} 
                            onChange={e => setFormData({...formData, meta_description: e.target.value})}
                            className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="Deskripsi singkat halaman ini..."
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Meta Keywords</label>
                        <input 
                            type="text" 
                            value={formData.meta_keywords} 
                            onChange={e => setFormData({...formData, meta_keywords: e.target.value})}
                            className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="Kata kunci, dipisah koma"
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button 
                            type="submit" 
                            disabled={isLoading} 
                            className="bg-purple-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-purple-700 transition flex items-center gap-2 text-sm disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} 
                            Simpan Perubahan
                        </button>
                    </div>
                 </form>
             ) : (
                 <div className="text-center py-10 text-slate-400 flex flex-col items-center">
                    <Layout size={40} className="mb-2 opacity-20" />
                    <p>Pilih halaman di sebelah kiri untuk mulai mengedit.</p>
                 </div>
             )}
          </div>
      </div>
    </div>
  );
}