// Hook inti React dan utilitas.
import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

// Ikon dari lucide-react untuk elemen UI.
import { Plus, Users, Edit, LogOut, Menu, Trash2, LayoutDashboard, Shield, FileText, ExternalLink, Settings } from "lucide-react";

// Impor komponen untuk berbagai tampilan dashboard.
import AddPekerjaForm from "../components/AddPekerjaForm";
import EditPekerjaForm from "../components/EditPekerjaForm";
import AdminManagement from "../components/AdminManagement";
import ArticleForm from "../components/ArticleForm";
import EditArticleForm from "../components/EditArticleForm";
import SettingsForm from "../components/SettingsForm"; // Komponen untuk pengaturan website.
import PageSeoForm from "../components/PageSeoForm"; // Komponen untuk SEO per halaman.

export default function Dashboard() {
  // State untuk mengelola tampilan saat ini (misal: 'list', 'add', 'settings').
  const [view, setView] = useState("list");
  const [workers, setWorkers] = useState([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // State untuk informasi pengguna yang login.
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  // State untuk manajemen artikel.
  const [articles, setArticles] = useState([]);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  
  // URL API terpusat.
  const API_URL = 'https://api.halopekerja.com';

  // Mengambil data pekerja dari API.
  const fetchWorkers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/workers`);
      setWorkers(response.data);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mengambil data artikel dari API.
  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/articles`);
      setArticles(response.data);
    } catch (error) {
      console.error("Gagal ambil data artikel:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Pengambilan data awal dan pengecekan otentikasi pengguna saat komponen dimuat.
  useEffect(() => {
    fetchWorkers();
    fetchArticles();
    const role = localStorage.getItem("adminRole");
    const name = localStorage.getItem("adminName");
    setUserRole(role);
    setUserName(name);
  }, []);

  // Handler untuk navigasi ke tampilan edit.
  const handleEditClick = (id) => {
    setSelectedWorkerId(id);
    setView("edit");
  };

  const handleEditArticleClick = (id) => {
    setSelectedArticleId(id);
    setView("edit-article");
  };

  // Callback untuk pengiriman/pembaruan data pekerja yang berhasil.
  const handleSuccess = () => {
    setView("list");
    fetchWorkers();
  };

  // Callback untuk pengiriman/pembaruan data artikel yang berhasil.
  const handleArticleSuccess = () => {
    setView("list-articles");
    fetchArticles();
  };

  // Menangani penghapusan data pekerja.
  const handleDeleteClick = async (id, nama) => {
    if (window.confirm(`Yakin ingin menghapus data "${nama}"?`)) {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`${API_URL}/api/workers/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Data berhasil dihapus");
            fetchWorkers(); // Refresh data
        } catch (error) {
            toast.error("Gagal menghapus data");
        }
    }
  };

  // Menangani penghapusan artikel.
  const handleArticleDeleteClick = async (id, title) => {
    if (window.confirm(`Yakin ingin menghapus artikel "${title}"?`)) {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`${API_URL}/api/articles/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Artikel berhasil dihapus");
            fetchArticles(); // Refresh data
        } catch (error) {
            toast.error("Gagal menghapus artikel");
            console.error(error);
        }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      <Toaster position="top-center" />

      {/* Navigasi Sidebar */}
      <aside className={`bg-slate-900 text-white transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"} flex flex-col fixed h-full z-20`}>
        <div className="p-6 flex items-center justify-between bg-slate-950">
            {sidebarOpen ? (
                <h1 className="font-bold text-xl tracking-wider">ADMIN</h1>
            ) : (
                <h1 className="font-bold text-xl mx-auto">A</h1>
            )}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
            <p className={`px-4 text-xs text-slate-500 font-semibold tracking-wider ${sidebarOpen ? 'block' : 'hidden'}`}>PEKERJA</p>
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

            <div className="my-4 border-t border-slate-800"></div>
            <p className={`px-4 text-xs text-slate-500 font-semibold tracking-wider ${sidebarOpen ? 'block' : 'hidden'}`}>ARTIKEL</p>

            <button 
                onClick={() => setView("list-articles")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${view === 'list-articles' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
                <FileText size={20} />
                {sidebarOpen && <span>Data Artikel</span>}
            </button>

            <button 
                onClick={() => setView("add-article")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${view === 'add-article' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
                <Plus size={20} />
                {sidebarOpen && <span>Tambah Artikel</span>}
            </button>


            {/* Bagian menu khusus Superadmin */}
            {userRole === 'superadmin' && (
                <>
                    <div className="my-4 border-t border-slate-800"></div>
                    <p className={`px-4 text-xs text-slate-500 font-semibold tracking-wider ${sidebarOpen ? 'block' : 'hidden'}`}>SYSTEM</p>
                    
                    {/* Tombol Pengaturan SEO Global */}
                    <button onClick={() => setView("settings")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${view === 'settings' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <Settings size={20} />
                        {sidebarOpen && <span>Pengaturan Global</span>}
                    </button>

                    {/* Tombol SEO Halaman */}
                    <button onClick={() => setView("page-seo")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${view === 'page-seo' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <LayoutDashboard size={20} />
                        {sidebarOpen && <span>SEO Halaman</span>}
                    </button>

                    <button onClick={() => setView("users")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${view === 'users' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <Shield size={20} />
                        {sidebarOpen && <span>Data User</span>}
                    </button>
                </>
            )}
        </nav>

        {/* Tombol Keluar */}
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

      {/* Area Konten Utama */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        
        <header className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                    <Menu size={24} />
                </button>
                <h2 className="text-lg font-semibold text-slate-800">
                    {view === 'list' && "Dashboard Pekerja"}
                    {view === 'users' && "Manajemen User & Admin"}
                    {view === 'list-articles' && "Manajemen Artikel"}
                    {view === 'add-article' && "Tulis Artikel Baru"}
                    {view === 'edit-article' && "Edit Artikel"}
                    {view === 'settings' && "Pengaturan Website Global"}
                    {view === 'page-seo' && "Editor SEO Per Halaman"}
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

        <main className="p-8">
            
            {/* Tampilan: Daftar Pekerja */}
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
                                    
                                    <div className="aspect-[4/3] bg-slate-200 relative overflow-hidden">
                                        {worker.photo_url ? (
                                            <img 
                                                src={`${API_URL}/uploads/${worker.photo_url}`} 
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

                                    <div className="p-4">
                                        <h3 className="font-bold text-slate-800 text-lg">{worker.name}</h3>
                                        <p className="text-sm text-purple-600 mb-3 font-medium">{worker.category}</p>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleEditClick(worker.id)}
                                                className="flex-1 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition flex items-center justify-center gap-2"
                                            >
                                                <Edit size={16} /> Edit
                                            </button>
                                            
                                            <button 
                                                onClick={() => handleDeleteClick(worker.id, worker.name)}
                                                className="w-10 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
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

            {/* Tampilan: Tambah Pekerja */}
            {view === "add" && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <button onClick={() => setView("list")} className="mb-4 text-sm text-slate-500 hover:text-purple-600 flex items-center gap-1">&larr; Kembali ke List</button>
                    <AddPekerjaForm onSuccess={handleSuccess} />
                </div>
            )}

            {/* Tampilan: Edit Pekerja */}
            {view === "edit" && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <EditPekerjaForm workerId={selectedWorkerId} onCancel={() => setView("list")} onSuccess={handleSuccess} />
                </div>
            )}

            {/* Tampilan: Manajemen User (hanya superadmin) */}
            {view === "users" && userRole === 'superadmin' && (
                <AdminManagement />
            )}

            {/* Tampilan: Daftar Artikel */}
            {view === "list-articles" && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-slate-800">Daftar Artikel</h2>
                        <button onClick={() => setView("add-article")} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2 font-medium">
                            <Plus size={18} /> Tulis Artikel
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-100 text-slate-600 text-sm uppercase">
                                    <th className="p-3 border-b">Judul</th>
                                    <th className="p-3 border-b">Slug</th>
                                    <th className="p-3 border-b">Tanggal</th>
                                    <th className="p-3 border-b text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-slate-700">
                                {isLoading ? (
                                    <tr><td colSpan="4" className="text-center p-8 text-slate-500">Memuat artikel...</td></tr>
                                ) : articles.length === 0 ? (
                                    <tr><td colSpan="4" className="text-center p-8 text-slate-500">Belum ada artikel.</td></tr>
                                ) : (
                                articles.map((article) => (
                                <tr key={article.id} className="border-b hover:bg-slate-50">
                                    <td className="p-3 font-medium">{article.title}</td>
                                    <td className="p-3 text-slate-500">/blog/{article.slug}</td>
                                    <td className="p-3">{new Date(article.created_at).toLocaleDateString()}</td>
                                    <td className="p-3 flex justify-center gap-2">
                                        <button onClick={() => handleEditArticleClick(article.id)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit size={18}/></button>
                                        <button onClick={() => handleArticleDeleteClick(article.id, article.title)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18}/></button>
                                        <Link to={`/blog/${article.slug}`} target="_blank" className="p-1 text-gray-400 hover:bg-gray-100 rounded" title="Lihat"><ExternalLink size={16}/></Link>
                                    </td>
                                </tr>
                                )))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Tampilan: Tambah Artikel */}
            {view === "add-article" && (
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                     <button onClick={() => setView("list-articles")} className="mb-4 text-sm text-slate-500 hover:text-purple-600 flex items-center gap-1">&larr; Kembali</button>
                     <ArticleForm onSuccess={handleArticleSuccess} />
                 </div>
            )}

            {/* Tampilan: Edit Artikel */}
            {view === "edit-article" && (
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <button onClick={() => setView("list-articles")} className="mb-4 text-sm text-slate-500 hover:text-purple-600 flex items-center gap-1">&larr; Kembali</button>
                    <EditArticleForm 
                        articleId={selectedArticleId} 
                        onSuccess={handleArticleSuccess} 
                        onCancel={() => setView("list-articles")} 
                    />
                 </div>
            )}

            {/* Tampilan: Pengaturan SEO (hanya superadmin) */}
            {view === "settings" && userRole === 'superadmin' && (
                 <SettingsForm />
            )}

            {/* Tampilan: Editor SEO per Halaman (hanya superadmin) */}
            {view === "page-seo" && userRole === 'superadmin' && (
                 <PageSeoForm />
            )}

        </main>
      </div>
    </div>
  );
}