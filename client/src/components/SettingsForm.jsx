import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Save, Globe, Search, Loader2 } from "lucide-react";

export default function SettingsForm() {
  // State awal HARUS string kosong, jangan null
  const [formData, setFormData] = useState({
    site_name: "",
    meta_description: "",
    meta_keywords: "",
    google_verification_code: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // URL API PRODUCTION
  const API_URL = 'https://api.halopekerja.com';

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/settings`);
      // Pastikan data yang masuk ke state tidak undefined/null
      setFormData({
        site_name: res.data.site_name || "",
        meta_description: res.data.meta_description || "",
        meta_keywords: res.data.meta_keywords || "",
        google_verification_code: res.data.google_verification_code || ""
      });
    } catch (error) {
      toast.error("Gagal memuat pengaturan");
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.put(`${API_URL}/api/settings`, formData);
      toast.success("Pengaturan SEO berhasil disimpan!");
    } catch (error) {
      toast.error("Gagal menyimpan pengaturan");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div className="p-8 text-center text-slate-500">Memuat pengaturan...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Globe className="text-purple-600" /> Pengaturan Website & SEO Global
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Identitas Dasar */}
        <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b pb-2">Identitas Dasar</h3>
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Website (Site Title)</label>
                <input 
                  type="text" 
                  value={formData.site_name} 
                  onChange={e => setFormData({...formData, site_name: e.target.value})} 
                  className="w-full p-2 border rounded outline-purple-500" 
                  placeholder="Nama Website"
                />
                <p className="text-xs text-slate-500 mt-1">Akan muncul di tab browser (misal: Penyalur Pembantu Indonesia)</p>
            </div>
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Deskripsi Global (Meta Description)</label>
                <textarea 
                  rows="3" 
                  value={formData.meta_description} 
                  onChange={e => setFormData({...formData, meta_description: e.target.value})} 
                  className="w-full p-2 border rounded outline-purple-500"
                  placeholder="Deskripsi singkat website..."
                ></textarea>
                <p className="text-xs text-slate-500 mt-1">Deskripsi default jika halaman tidak memiliki deskripsi khusus.</p>
            </div>
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Kata Kunci (Keywords)</label>
                <input 
                  type="text" 
                  value={formData.meta_keywords} 
                  onChange={e => setFormData({...formData, meta_keywords: e.target.value})} 
                  className="w-full p-2 border rounded outline-purple-500" 
                  placeholder="penyalur pembantu, yayasan art, dll..." 
                />
            </div>
        </div>

        {/* Integrasi Google */}
        <div className="space-y-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wider border-b border-blue-200 pb-2 flex items-center gap-2">
                <Search size={16}/> Integrasi Google Search Console
            </h3>
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Google Verification Code</label>
                <input 
                  type="text" 
                  value={formData.google_verification_code} 
                  onChange={e => setFormData({...formData, google_verification_code: e.target.value})} 
                  className="w-full p-2 border rounded outline-blue-500 font-mono text-sm" 
                  placeholder="Contoh: 4nGk4-Un1k-DaR1-G00gL3..." 
                />
                <p className="text-xs text-slate-500 mt-1">
                    Masukkan kode verifikasi dari tag HTML Google Search Console. <br/>
                    (Hanya kodenya saja, misal yang ada di dalam content="<b>KODE_INI</b>")
                </p>
            </div>
        </div>

        <button type="submit" disabled={isLoading} className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700 transition shadow-md flex items-center gap-2">
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} 
            {isLoading ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </form>
    </div>
  );
}