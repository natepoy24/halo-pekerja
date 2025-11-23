    import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
// IMPORT ICON BARU: Shield (untuk Admin)
import { Plus, Users, MapPin, Briefcase, Edit, LogOut, Menu, Trash2, LayoutDashboard, Shield } from "lucide-react";
import AddPekerjaForm from "../components/AddPekerjaForm";
import EditPekerjaForm from "../components/EditPekerjaForm";
import AdminManagement from "../components/AdminManagement"; // Import komponen baru

export default function Dashboard() {
  const [view, setView] = useState("list"); // 'list', 'add', 'edit', 'users'
  const [workers, setWorkers] = useState([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // STATE ROLE
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  // --- FUNGSI AMBIL DATA ---
  const fetchWorkers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("https://api.halopekerja.com/api/workers");
      setWorkers(response.data);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
    // AMBIL ROLE DARI LOCALSTORAGE
    const role = localStorage.getItem("adminRole");
    const name = localStorage.getItem("adminName");
    setUserRole(role);
    setUserName(name);
  }, []);

  // --- FUNGSI NAVIGASI ---
  const handleEditClick = (id) => {
    setSelectedWorkerId(id);
    setView("edit");
  };

  const handleSuccess = () => {
    setView("list");
    fetchWorkers(); // Refresh data setelah tambah/edit
  };

  // --- FUNGSI HAPUS DATA ---
  const handleDeleteClick = async (id, nama) => {
    if (window.confirm(`Yakin ingin menghapus data "${nama}"?`)) {
        try {
            await axios.delete(`https://api.halopekerja.com/api/workers/${id}`);
            toast.success("Data berhasil dihapus");
            fetchWorkers(); // Refresh data
        } catch (error) {
            toast.error("Gagal menghapus data");
        }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      <Toaster position="top-center" />

      {/* --- SIDEBAR (MENU KIRI) --- */}
      {/* --- SIDEBAR --- */}
      <aside className={`bg-slate-900 text-white transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"} flex flex-col fixed h-full z-20`}>
        <div className="p-6 flex items-center justify-between bg-slate-950">
            {sidebarOpen ? (
                <h1 className="font-bold text-xl tracking-wider">ADMIN</h1>
            ) : (
                <h1 className="font-bold text-xl mx-auto">A</h1>
            )}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
            {/* Menu Data Pekerja */}
            <button 
                onClick={() => setView("list")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${view === 'list' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
                <LayoutDashboard size={20} />
                {sidebarOpen && <span>Data Pekerja</span>}
            </button>
            
             <button 
                onClick={() => setView("add")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${view === 'add' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
                <Plus size={20} />
                {sidebarOpen && <span>Tambah Pekerja</span>}
            </button>

            {/* MENU KHUSUS SUPERADMIN */}
            {userRole === 'superadmin' && (
                <>
                    <div className="my-4 border-t border-slate-800"></div>
                    <button onClick={() => setView("users")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${view === 'users' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <Shield size={20} />
                        {sidebarOpen && <span>Data User (Admin)</span>}
                    </button>
                </>
            )}
        </nav>

        <div className="p-4 border-t border-slate-800">
             <button 
                onClick={() => {
                    if(window.confirm("Keluar?")) {
                        localStorage.clear();
                        window.location.href = '/login';
                    }
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-lg transition"
             >
                <LogOut size={20} />
                {sidebarOpen && <span>Keluar</span>}
            </button>
        </div>
      </aside>

      {/* --- KONTEN KANAN --- */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        
        {/* Topbar */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                    <Menu size={24} />
                </button>
                <h2 className="text-lg font-semibold text-slate-800">
                    {view === 'list' && "Dashboard Pekerja"}
                    {view === 'users' && "Manajemen User & Admin"}
                </h2>
            </div>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                    {userName.substring(0,2).toUpperCase()}
                </div>
                <div className="text-sm">
                    <p className="font-bold text-slate-700">{userName}</p>
                    <p className="text-xs text-slate-500 capitalize">{userRole}</p>
                </div>
            </div>
        </header>

        {/* Isi Halaman */}
        <main className="p-8">
            
            {/* VIEW 1: LIST PEKERJA */}
            {view === "list" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoading ? (
                            <div className="col-span-full text-center py-20 text-slate-500">Memuat data...</div>
                        ) : workers.length === 0 ? (
                            <div className="col-span-full text-center py-20 bg-white rounded-xl border-2 border-dashed border-slate-300">
                                <p className="text-slate-500 mb-4">Data masih kosong.</p>
                                <button onClick={() => setView("add")} className="text-purple-600 font-bold hover:underline">Tambah Data</button>
                            </div>
                        ) : (
                            workers.map((worker) => (
                                <div key={worker.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition group">
                                    
                                    {/* FOTO 4:3 (Tampilan Penuh) */}
                                    <div className="aspect-[4/3] bg-slate-200 relative overflow-hidden">
                                        {worker.photo_url ? (
                                            <img 
                                                src={`https://api.halopekerja.com/uploads/${worker.photo_url}`} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                                                alt={worker.name} 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400"><Users size={40} /></div>
                                        )}
                                        <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded shadow-sm ${worker.status === 'Tersedia' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                            {worker.status}
                                        </span>
                                    </div>

                                    {/* Detail Data */}
                                    <div className="p-4">
                                        <h3 className="font-bold text-slate-800 text-lg">{worker.name}</h3>
                                        <p className="text-sm text-purple-600 mb-3 font-medium">{worker.category}</p>
                                        
                                        <div className="space-y-2 text-sm text-slate-500 mb-5">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} className="text-slate-400"/> {worker.origin}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Briefcase size={16} className="text-slate-400"/> {worker.experience} Thn Pengalaman
                                            </div>
                                        </div>

                                        {/* TOMBOL AKSI (EDIT & DELETE) */}
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleEditClick(worker.id)}
                                                className="flex-1 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition flex items-center justify-center gap-2"
                                            >
                                                <Edit size={16} /> Edit
                                            </button>
                                            
                                            <button 
                                                onClick={() => handleDeleteClick(worker.id, worker.name)}
                                                className="w-10 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition"
                                                title="Hapus Data"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
            )}

            {/* VIEW ADD */}
            {view === "add" && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <button onClick={() => setView("list")} className="mb-4 text-sm text-slate-500 hover:text-purple-600 flex items-center gap-1">
                        &larr; Kembali ke List
                    </button>
                    <AddPekerjaForm onSuccess={handleSuccess} />
                </div>
            )}

            {/* VIEW 2: EDIT PEKERJA */}
            {view === "edit" && <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"><EditPekerjaForm workerId={selectedWorkerId} onCancel={() => setView("list")} onSuccess={handleSuccess} /></div>}

            {/* VIEW 3: MANAJEMEN USER (SUPERADMIN) */}
            {view === "users" && userRole === 'superadmin' && (
                <AdminManagement />
            )}

        </main>
      </div>
    </div>
  );
}