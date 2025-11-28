import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import WorkerDetail from "./pages/WorkerDetail";
import PublicLayout from "./components/PublicLayout";
import BlogList from "./pages/BlogList";
import BlogDetail from "./pages/BlogDetail";
import EditArticlePage from "./pages/admin/EditArticlePage";

// Komponen untuk melindungi rute yang memerlukan otentikasi.
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          {/* Rute publik yang menggunakan layout standar (Header & Footer). */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/layanan" element={<Services />} />
            <Route path="/tentang-kami" element={<About />} />
            <Route path="/galeri" element={<Gallery />} />
            <Route path="/kontak" element={<Contact />} />
            <Route path="/pekerja/:id" element={<WorkerDetail />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
          </Route>

          {/* Rute yang tidak menggunakan layout standar. */}
          <Route path="/login" element={<Login />} />
          {/* Rute admin yang dilindungi. */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          {/* Rute untuk halaman edit artikel. */}
          <Route 
            path="/admin/edit-article/:id" 
            element={
              <ProtectedRoute>
                <EditArticlePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;