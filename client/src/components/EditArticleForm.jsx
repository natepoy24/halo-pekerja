import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Save, Loader2 } from 'lucide-react';

const EditArticleForm = ({ articleId, onCancel, onSuccess }) => {
    const [article, setArticle] = useState({
        title: '',
        content: '',
        meta_title: '',
        meta_description: '',
        image_alt: ''
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState('');

    const API_URL = 'https://api.halopekerja.com';

    useEffect(() => {
        const fetchArticle = async () => {
            setIsFetching(true);
            try {
                const response = await axios.get(`${API_URL}/api/articles`);
                const articleToEdit = response.data.find(art => art.id === parseInt(articleId));

                if (articleToEdit) {
                    setArticle({
                        title: articleToEdit.title,
                        content: articleToEdit.content,
                        meta_title: articleToEdit.meta_title || '',
                        meta_description: articleToEdit.meta_description || '',
                        image_alt: articleToEdit.image_alt || ''
                    });
                    if (articleToEdit.image_url) {
                        setPreview(`${API_URL}/uploads/${articleToEdit.image_url}`);
                    }
                } else {
                    setError('Artikel tidak ditemukan.');
                }
            } catch (err) {
                setError('Gagal memuat data artikel.');
                console.error(err);
            } finally {
                setIsFetching(false);
            }
        };

        fetchArticle();
    }, [articleId, API_URL]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setArticle(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append('title', article.title);
        formData.append('content', article.content);
        formData.append('meta_title', article.meta_title);
        formData.append('meta_description', article.meta_description);
        formData.append('image_alt', article.image_alt);
        if (image) {
            formData.append('image', image);
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/api/articles/${articleId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success('Artikel berhasil diperbarui!');
            if (onSuccess) onSuccess();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal memperbarui artikel.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div className="text-center p-10">Memuat data artikel...</div>;
    }

    return (
        <div>
            <Toaster position="top-center" />
            <h2 className="text-xl font-bold mb-4 text-slate-800">Edit Artikel</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700">Judul Artikel</label>
                    <input type="text" name="title" value={article.title} onChange={handleChange} required className="w-full p-2 border rounded" />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700">Isi Konten</label>
                    <textarea name="content" value={article.content} onChange={handleChange} rows="10" required className="w-full p-2 border rounded" />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700">Gambar Unggulan (Kosongkan jika tidak ingin ganti)</label>
                    <input type="file" name="image" onChange={handleImageChange} accept="image/*" className="w-full text-sm text-slate-500" />
                    {preview && <img src={preview} alt="Preview" className="mt-4 w-48 h-auto rounded-lg" />}
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700">Teks Alternatif Gambar (Alt Text)</label>
                    <input type="text" name="image_alt" value={article.image_alt} onChange={handleChange} className="w-full p-2 border rounded" 
                        placeholder="Deskripsi singkat tentang gambar untuk SEO" />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 space-y-3">
                    <h3 className="font-bold text-blue-800 text-sm">Pengaturan SEO (Opsional)</h3>
                    <div>
                        <label className="block text-xs font-bold text-blue-700">Meta Title</label>
                        <input type="text" name="meta_title" value={article.meta_title} onChange={handleChange} className="w-full p-2 border rounded text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-blue-700">Meta Description</label>
                        <textarea name="meta_description" value={article.meta_description} onChange={handleChange} rows="2" className="w-full p-2 border rounded text-sm" />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button type="submit" disabled={isLoading} className="bg-purple-600 text-white px-6 py-2 rounded font-bold flex items-center gap-2 hover:bg-purple-700 disabled:opacity-50">
                        {isLoading ? <Loader2 className="animate-spin"/> : <Save size={18} />} Simpan Perubahan
                    </button>
                    {onCancel && (
                        <button type="button" onClick={onCancel} className="text-slate-600 text-sm font-medium hover:text-purple-600">Batal</button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default EditArticleForm;