import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminForm.css'; // Re-use the same CSS for consistency

const EditArticleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState({
        title: '',
        content: '',
        meta_title: '',
        meta_description: ''
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const API_URL = process.env.REACT_APP_API_URL || 'https://halopekerja.com';

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                // We need a route to get an article by ID for editing.
                // Let's assume we will add a GET /api/articles/id/:id route on the server.
                // For now, let's fetch all and find by ID. This is inefficient but works without server changes.
                // A better approach is to add a dedicated GET /api/articles/id/:id endpoint.
                const response = await axios.get(`${API_URL}/api/articles`);
                const articleToEdit = response.data.find(art => art.id === parseInt(id));

                if (articleToEdit) {
                    setArticle({
                        title: articleToEdit.title,
                        content: articleToEdit.content,
                        meta_title: articleToEdit.meta_title || '',
                        meta_description: articleToEdit.meta_description || ''
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
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id, API_URL]);

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
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('title', article.title);
        formData.append('content', article.content);
        formData.append('meta_title', article.meta_title);
        formData.append('meta_description', article.meta_description);
        if (image) {
            formData.append('image', image);
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/api/articles/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setSuccess('Artikel berhasil diperbarui!');
            setTimeout(() => navigate('/admin/blog'), 2000); // Redirect after 2 seconds
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memperbarui artikel.');
            console.error(err);
        }
    };

    if (loading) {
        return <div className="admin-container">Memuat data artikel...</div>;
    }

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h2>Edit Artikel</h2>
                <button onClick={() => navigate('/admin/blog')} className="btn btn-secondary">Kembali</button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                    <label htmlFor="title">Judul Artikel</label>
                    <input type="text" id="title" name="title" value={article.title} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="content">Isi Konten</label>
                    <textarea id="content" name="content" value={article.content} onChange={handleChange} rows="10" required></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="image">Gambar Unggulan (Kosongkan jika tidak ingin ganti)</label>
                    <input type="file" id="image" name="image" onChange={handleImageChange} accept="image/*" />
                    {preview && <img src={preview} alt="Preview" className="image-preview" />}
                </div>

                <hr />
                <h4>Pengaturan SEO (Opsional)</h4>

                <div className="form-group">
                    <label htmlFor="meta_title">Meta Title</label>
                    <input type="text" id="meta_title" name="meta_title" value={article.meta_title} onChange={handleChange} />
                    <small>Judul yang akan tampil di tab browser dan hasil pencarian Google.</small>
                </div>

                <div className="form-group">
                    <label htmlFor="meta_description">Meta Description</label>
                    <textarea id="meta_description" name="meta_description" value={article.meta_description} onChange={handleChange} rows="3"></textarea>
                    <small>Deskripsi singkat (max 160 karakter) untuk hasil pencarian Google.</small>
                </div>

                <button type="submit" className="btn btn-primary">Simpan Perubahan</button>
            </form>
        </div>
    );
};

export default EditArticleForm;