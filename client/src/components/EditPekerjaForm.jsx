import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Upload, Save, Loader2 } from "lucide-react";

export default function EditPekerjaForm({ workerId, onCancel, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [previewFoto, setPreviewFoto] = useState(null);
  const fileInputRef = useRef(null);
  
  // Daftar bahasa standar untuk checkbox.
  const STANDARD_LANGUAGES = ['Inggris', 'Mandarin', 'Arab', 'Hokkian', 'Melayu'];

  // State untuk mengelola UI dinamis (bahasa & suku).
  const [bahasaLainChecked, setBahasaLainChecked] = useState(false);
  const [bahasaLainInput, setBahasaLainInput] = useState("");
  const [sukuSelect, setSukuSelect] = useState("");

  const [formData, setFormData] = useState({
    nama: "", umur: 18, category: "Asisten Rumah Tangga", status: "Tersedia",
    pengalaman: 0, gaji: 0, lokasi: "", suku: "", status_perkawinan: "Belum Menikah",
    agama: "Islam", pendidikan: "SD",
    bahasa_asing: [], // Hanya menyimpan bahasa standar yang dicentang
    keterampilan: "", kekurangan: "", deskripsi: "", fotoUrl: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idToFetch = workerId || 1; 
        const response = await axios.get(`https://api.halopekerja.com/api/workers/${idToFetch}`);
        const data = response.data;

        // Logika untuk memisahkan bahasa standar dan bahasa lainnya dari database.
        let standardLangs = [];
        let customLangs = [];

        if (data.languages) {
            const allLangs = data.languages.split(',').map(l => l.trim());
            
            allLangs.forEach(lang => {
                if (STANDARD_LANGUAGES.includes(lang)) {
                    standardLangs.push(lang);
                } else if (lang !== "") {
                    customLangs.push(lang);
                }
            });
        }

        if (customLangs.length > 0) {
            setBahasaLainChecked(true);
            setBahasaLainInput(customLangs.join(', '));
        }

        // Logika untuk menentukan nilai dropdown suku.
        const standardSuku = ["Jawa", "Sunda", "Batak", "Madura"];
        let sukuDropdown = "Lainnya";
        if (standardSuku.includes(data.tribe)) {
            sukuDropdown = data.tribe;
        } else if (!data.tribe || data.tribe === '-') {
            sukuDropdown = "";
        }

        setFormData({
            nama: data.name,
            umur: data.age,
            kategori: data.category || "Asisten Rumah Tangga",
            status: data.status,
            pengalaman: data.experience,
            gaji: data.salary,
            lokasi: data.origin,
            suku: data.tribe,
            status_perkawinan: data.marital_status,
            agama: data.religion,
            pendidikan: data.education || "SD",
            bahasa_asing: standardLangs,
            keterampilan: data.skills,
            kekurangan: data.shortcomings,
            deskripsi: data.description,
            fotoUrl: null
        });

        setSukuSelect(sukuDropdown);
        
        if (data.photo_url) {
            setPreviewFoto(`https://api.halopekerja.com/uploads/${data.photo_url}`);
        }

      } catch (error) {
        toast.error("Gagal mengambil data pekerja.");
        console.error(error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [workerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSukuSelectChange = (e) => {
    const val = e.target.value;
    setSukuSelect(val);
    if (val !== "Lainnya") {
      setFormData({ ...formData, suku: val });
    } else {
      setFormData({ ...formData, suku: "" });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, fotoUrl: file });
      setPreviewFoto(URL.createObjectURL(file));
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    
    if (value === "Lainnya") {
        setBahasaLainChecked(checked);
        if (!checked) setBahasaLainInput("");
        return;
    }

    let updatedBahasa = [...formData.bahasa_asing];
    if (checked) updatedBahasa.push(value);
    else updatedBahasa = updatedBahasa.filter((lang) => lang !== value);
    setFormData({ ...formData, bahasa_asing: updatedBahasa });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const dataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'bahasa_asing') {
        // Gabungkan bahasa standar dan bahasa lainnya menjadi satu string.
        let finalLanguages = [...formData.bahasa_asing];
        
        if (bahasaLainChecked && bahasaLainInput.trim() !== "") {
            const manualLangs = bahasaLainInput.split(',').map(s => s.trim()).filter(s => s !== "");
            finalLanguages = [...finalLanguages, ...manualLangs];
        }
        
        const uniqueLangs = [...new Set(finalLanguages)];
        dataToSend.append(key, uniqueLangs.join(', '));

      } else if (key === 'fotoUrl') {
        if (formData.fotoUrl) dataToSend.append(key, formData.fotoUrl);
      } else {
        dataToSend.append(key, formData[key]);
      }
    });

    try {
      const idToUpdate = workerId || 1;
      
      await axios.put(`https://api.halopekerja.com/api/workers/${idToUpdate}`, dataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("Data pekerja berhasil diperbarui!");
      if (onSuccess) onSuccess();

    } catch (error) {
      console.error(error);
      toast.error("Gagal update data.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div className="p-10 text-center text-slate-500">Memuat data...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Toaster position="top-center" />
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100">
        <div className="bg-purple-600 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Edit Data Pekerja
            </h2>
            <p className="text-purple-100 text-sm mt-1">Perbarui informasi pekerja di bawah ini.</p>
          </div>
          {onCancel && (
            <button onClick={onCancel} className="text-white/80 hover:text-white text-sm bg-white/10 px-3 py-1 rounded">
                Batal
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap</label>
              <input type="text" name="nama" value={formData.nama} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Umur</label>
              <input type="number" name="umur" value={formData.umur} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Kategori</label>
              <select name="kategori" value={formData.kategori} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 outline-none">
                <option value="Asisten Rumah Tangga">Asisten Rumah Tangga (ART)</option>
                <option value="Baby Sitter">Baby Sitter</option>
                <option value="Perawat Lansia">Perawat Lansia</option>
                <option value="Supir">Supir</option>
                <option value="Tukang Kebun">Tukang Kebun</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 outline-none">
                <option value="Tersedia">✅ Tersedia</option>
                <option value="Sudah Bekerja">❌ Sudah Bekerja</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Gaji (Rp)</label>
              <input type="number" name="gaji" value={formData.gaji} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Pengalaman (Thn)</label>
              <input type="number" name="pengalaman" value={formData.pengalaman} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Kota Asal</label>
              <input type="text" name="lokasi" value={formData.lokasi} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Suku</label>
              <select name="sukuSelect" value={sukuSelect} onChange={handleSukuSelectChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white outline-none">
                <option value="">-- Pilih Suku --</option>
                <option value="Jawa">Jawa</option>
                <option value="Sunda">Sunda</option>
                <option value="Batak">Batak</option>
                <option value="Madura">Madura</option>
                <option value="Lainnya">Lainnya...</option>
              </select>
              {sukuSelect === "Lainnya" && (
                 <input type="text" name="suku" value={formData.suku} onChange={handleChange} required
                    className="mt-2 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-slate-50" />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Status Perkawinan</label>
              <select name="status_perkawinan" value={formData.status_perkawinan} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white outline-none">
                <option value="Belum Menikah">Belum Menikah</option>
                <option value="Nikah">Menikah</option>
                <option value="Janda">Janda</option>
                <option value="Duda">Duda</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Agama</label>
                    <select name="agama" value={formData.agama} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white outline-none">
                        <option value="Islam">Islam</option>
                        <option value="Protestan">Kristen Protestan</option>
                        <option value="Katolik">Katolik</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Buddha">Buddha</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Pendidikan</label>
                    <select name="pendidikan" value={formData.pendidikan} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white outline-none">
                        <option value="SD">SD</option>
                        <option value="SMP">SMP</option>
                        <option value="SMA">SMA / SMK</option>
                        <option value="Tidak Sekolah">Tidak Sekolah</option>
                    </select>
                </div>
            </div>

            <div className="md:col-span-2 bg-slate-50 p-4 rounded-lg border border-dashed border-slate-300">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Foto (Biarkan jika tidak ingin mengubah)</label>
              <div className="flex items-center gap-4">
                {previewFoto ? (
                  <img src={previewFoto} alt="Preview" className="w-20 h-20 object-cover rounded-full border-2 border-purple-500" />
                ) : (
                  <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-slate-400"><Upload size={24} /></div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Kemampuan Bahasa Asing</label>
              <div className="flex flex-wrap gap-4">
                {STANDARD_LANGUAGES.map((lang) => (
                  <label key={lang} className="flex items-center space-x-2 cursor-pointer">
                    <input 
                        type="checkbox" 
                        value={lang} 
                        checked={formData.bahasa_asing.includes(lang)}
                        onChange={handleCheckboxChange} 
                        className="accent-purple-600 w-4 h-4" 
                    />
                    <span className="text-slate-700">{lang}</span>
                  </label>
                ))}
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                        type="checkbox" 
                        value="Lainnya" 
                        checked={bahasaLainChecked} 
                        onChange={handleCheckboxChange} 
                        className="accent-purple-600 w-4 h-4" 
                    />
                    <span className="text-slate-700">Lainnya...</span>
                </label>
              </div>
              {bahasaLainChecked && (
                  <input 
                    type="text" 
                    value={bahasaLainInput} 
                    onChange={(e) => setBahasaLainInput(e.target.value)} 
                    placeholder="Sebutkan bahasa lain (pisahkan koma jika banyak)..." 
                    className="mt-3 w-full md:w-1/2 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-slate-50" 
                  />
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Keterampilan</label>
              <textarea name="keterampilan" rows={3} value={formData.keterampilan} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Kekurangan</label>
              <textarea name="kekurangan" rows={2} value={formData.kekurangan} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-300 outline-none"></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Deskripsi</label>
              <textarea name="deskripsi" rows={4} value={formData.deskripsi} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"></textarea>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all flex items-center gap-2 disabled:opacity-50">
              {isLoading ? <><Loader2 className="animate-spin" size={20} /> Menyimpan...</> : <><Save size={20} /> Update Data</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}