import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Save, Upload, Loader2 } from "lucide-react";

export default function ArticleForm({ onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "", content: "", meta_title: "", meta_description: "", image: null
  });

  const API_URL = process.env.REACT_APP_API_URL || 'https://api.halopekerja.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      // Ganti URL sesuai domain API kamu nanti
      await axios.post(`${API_URL}/api/articles`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Artikel berhasil diterbitkan!");
      if (onSuccess) onSuccess();
      setFormData({ title: "", content: "", meta_title: "", meta_description: "", image: null });
    } catch (error) {
      toast.error("Gagal posting artikel.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
      <h2 className="text-xl font-bold mb-4 text-slate-800">Tulis Artikel Baru (SEO)</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Judul & Konten Utama */}
        <div>
            <label className="block text-sm font-bold text-slate-700">Judul Artikel</label>
            <input type="text" required className="w-full p-2 border rounded" 
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>
        <div>
            <label className="block text-sm font-bold text-slate-700">Isi Artikel</label>
            <textarea required rows="10" className="w-full p-2 border rounded" 
                value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} 
                placeholder="Tulis artikel di sini..." />
        </div>
        <div>
            <label className="block text-sm font-bold text-slate-700">Gambar Utama</label>
            <input type="file" accept="image/*" onChange={e => setFormData({...formData, image: e.target.files[0]})} className="w-full text-sm text-slate-500" />
        </div>

        {/* BAGIAN KHUSUS SEO */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 space-y-3">
            <h3 className="font-bold text-blue-800 text-sm">Pengaturan SEO (Untuk Google)</h3>
            <div>
                <label className="block text-xs font-bold text-blue-700">Meta Title (Judul di Google)</label>
                <input type="text" className="w-full p-2 border rounded text-sm" placeholder="Contoh: Tips Mencari ART Terpercaya 2025"
                    value={formData.meta_title} onChange={e => setFormData({...formData, meta_title: e.target.value})} />
            </div>
            <div>
                <label className="block text-xs font-bold text-blue-700">Meta Description (Deskripsi di Google)</label>
                <textarea rows="2" className="w-full p-2 border rounded text-sm" placeholder="Deskripsi singkat yang menarik..."
                    value={formData.meta_description} onChange={e => setFormData({...formData, meta_description: e.target.value})} />
            </div>
        </div>

        <button type="submit" disabled={isLoading} className="bg-purple-600 text-white px-6 py-2 rounded font-bold flex items-center gap-2 hover:bg-purple-700">
            {isLoading ? <Loader2 className="animate-spin"/> : <Save size={18} />} Terbitkan
        </button>
      </form>
    </div>
  );
}