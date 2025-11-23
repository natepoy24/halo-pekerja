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

// Komponen Satpam (Protected Route)
// Tugasnya ngecek: "Ada token gak?"
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    // Kalau gak ada token, lempar ke login
    return <Navigate to="/login" replace />;
  }
  
  // Kalau ada, silakan masuk
  return children;
};

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          {/* Rute Publik dengan Header & Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/layanan" element={<Services />} />
            <Route path="/tentang-kami" element={<About />} />
            <Route path="/galeri" element={<Gallery />} />
            <Route path="/kontak" element={<Contact />} />
            <Route path="/pekerja/:id" element={<WorkerDetail />} />
          </Route>

          {/* Rute Standalone */}
          <Route path="/login" element={<Login />} />
          {/* Rute Admin yang Dijaga Satpam */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;