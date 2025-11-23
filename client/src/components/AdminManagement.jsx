import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Trash2, Edit, Save, X, Shield } from "lucide-react";

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // State Form
  const [formData, setFormData] = useState({
    username: "", email: "", phone: "", password: "", role: "admin"
  });

  // Ambil data admin saat komponen dibuka
  const fetchAdmins = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admins");
      setAdmins(res.data);
    } catch (error) {
      toast.error("Gagal memuat data admin");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Reset Form
  const resetForm = () => {
    setFormData({ username: "", email: "", phone: "", password: "", role: "admin" });
    setIsEditing(false);
    setEditId(null);
  };

  // Handle Submit (Tambah / Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Mode Edit
        await axios.put(`http://localhost:5000/api/admins/${editId}`, formData);
        toast.success("Admin berhasil diupdate");
      } else {
        // Mode Tambah Baru
        if (!formData.password) return toast.error("Password wajib diisi untuk admin baru");
        await axios.post("http://localhost:5000/api/admins", formData);
        toast.success("Admin baru berhasil dibuat");
      }
      fetchAdmins();
      resetForm();
    } catch (error) {
      toast.error("Gagal menyimpan data");
    }
  };

  // Handle Klik Edit
  const handleEdit = (admin) => {
    setIsEditing(true);
    setEditId(admin.id);
    setFormData({
      username: admin.username,
      email: admin.email || "",
      phone: admin.phone || "",
      role: admin.role,
      password: "" // Password dikosongkan (hanya diisi jika ingin diganti)
    });
  };

  // Handle Hapus
  const handleDelete = async (id) => {
    if (window.confirm("Yakin hapus admin ini?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admins/${id}`);
        toast.success("Admin dihapus");
        fetchAdmins();
      } catch (error) {
        // Tampilkan pesan error spesifik dari server (misal: Superadmin terakhir)
        const pesanError = error.response?.data?.message || "Gagal menghapus";
        toast.error(pesanError);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Shield className="text-purple-600" /> Manajemen User (Admin)
      </h2>

      {/* FORM ADMIN */}
      <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 mb-8">
        <h3 className="font-semibold text-slate-700 mb-4">{isEditing ? "Edit Admin" : "Tambah Admin Baru"}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Username" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="p-2 border rounded" />
          <input type="email" placeholder="Email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="p-2 border rounded" />
          <input type="text" placeholder="No. Telepon (Opsional)" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="p-2 border rounded" />
          
          <div className="relative">
            <input type="password" placeholder={isEditing ? "Password (Kosongkan jika tidak ubah)" : "Password"} required={!isEditing} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-2 border rounded" />
          </div>

          <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="p-2 border rounded">
            <option value="admin">Admin Biasa</option>
            <option value="superadmin">Super Admin</option>
          </select>

          <div className="md:col-span-2 flex gap-2 mt-2">
            <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-2">
                <Save size={18} /> {isEditing ? "Update Data" : "Simpan Admin"}
            </button>
            {isEditing && (
                <button type="button" onClick={resetForm} className="bg-slate-300 text-slate-700 px-4 py-2 rounded hover:bg-slate-400 flex items-center gap-2">
                    <X size={18} /> Batal
                </button>
            )}
          </div>
        </form>
      </div>

      {/* TABEL DAFTAR ADMIN */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 text-sm uppercase">
              <th className="p-3 border-b">Username</th>
              <th className="p-3 border-b">Role</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">No. Telp</th>
              <th className="p-3 border-b text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700">
            {admins.map((admin) => (
              <tr key={admin.id} className="border-b hover:bg-slate-50">
                <td className="p-3 font-medium">{admin.username}</td>
                <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${admin.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {admin.role}
                    </span>
                </td>
                <td className="p-3">{admin.email || "-"}</td>
                <td className="p-3">{admin.phone || "-"}</td>
                <td className="p-3 flex justify-center gap-2">
                    <button onClick={() => handleEdit(admin)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit size={18}/></button>
                    <button onClick={() => handleDelete(admin.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}