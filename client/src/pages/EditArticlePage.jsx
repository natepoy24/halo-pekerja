import React from 'react';
import { Link } from 'react-router-dom';
import EditArticleForm from '../../components/EditArticleForm'; // Menggunakan form yang sudah ada

const EditArticlePage = () => {
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/admin" className="text-sm text-slate-500 hover:text-purple-600 flex items-center gap-1">
            &larr; Kembali ke Dashboard
          </Link>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Edit Artikel</h2>
          {/* Komponen form edit artikel dirender di sini */}
          <EditArticleForm />
        </div>
      </div>
    </div>
  );
};

export default EditArticlePage;