import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";

export default function BlogList() {
  const [articles, setArticles] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL || 'https://api.halopekerja.com';

  useEffect(() => {
    axios.get(`${API_URL}/api/articles`).then(res => setArticles(res.data));
  }, [API_URL]);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <Helmet>
        <title>Blog & Tips - Penyalur Pembantu Indonesia</title>
        <meta name="description" content="Baca tips seputar manajemen rumah tangga, pengasuhan anak, dan perawatan lansia." />
      </Helmet>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10 text-slate-800">Artikel Terbaru</h1>
        <div className="grid md:grid-cols-3 gap-8">
            {articles.map(article => (
                <Link to={`/blog/${article.slug}`} key={article.id} className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition">
                    <div className="h-48 bg-slate-200 overflow-hidden">
                        {article.image_url && <img src={`${API_URL}/uploads/${article.image_url}`} className="w-full h-full object-cover"/>}
                    </div>
                    <div className="p-6">
                        <h2 className="font-bold text-lg text-slate-800 mb-2">{article.title}</h2>
                        <p className="text-slate-500 text-sm line-clamp-3">{article.meta_description || "Baca selengkapnya..."}</p>
                        <span className="text-purple-600 text-sm font-bold mt-4 block">Baca Artikel →</span>
                    </div>
                </Link>
            ))}
        </div>
      </div>
    </div>
  );
}