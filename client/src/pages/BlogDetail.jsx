import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";

export default function BlogDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/articles/${slug}`).then(res => setArticle(res.data));
  }, [slug]);

  if (!article) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-white py-12 px-4 font-sans">
      {/* INI KUNCI SEO: META TAGS DINAMIS */}
      <Helmet>
        <title>{article.meta_title || article.title}</title>
        <meta name="description" content={article.meta_description || ""} />
        {/* Open Graph untuk Share WA/FB yang cantik */}
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.meta_description} />
        <meta property="og:image" content={`http://localhost:5000/uploads/${article.image_url}`} />
      </Helmet>

      <article className="max-w-3xl mx-auto">
        {article.image_url && (
            <img src={`http://localhost:5000/uploads/${article.image_url}`} className="w-full h-auto rounded-xl shadow-lg mb-8" />
        )}
        <h1 className="text-4xl font-bold text-slate-900 mb-4">{article.title}</h1>
        <p className="text-slate-500 text-sm mb-8">Diterbitkan pada: {new Date(article.created_at).toLocaleDateString()}</p>
        
        {/* Render isi konten (sementara teks biasa, nanti bisa pakai HTML parser) */}
        <div className="prose lg:prose-xl text-slate-700 whitespace-pre-wrap leading-relaxed">
            {article.content}
        </div>
      </article>
    </div>
  );
}