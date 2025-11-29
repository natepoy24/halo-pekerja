import { useState, useEffect } from 'react';
import axios from 'axios';

export default function usePageSeo(pageName) {
    const [seoData, setSeoData] = useState(null);
    // URL API Production
    const API_URL = 'https://api.halopekerja.com';

    useEffect(() => {
        const fetchSeo = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/page-seo/${pageName}`);
                setSeoData(res.data);
            } catch (error) {
                console.error(`Gagal memuat SEO untuk halaman ${pageName}:`, error);
                // Opsional: Set default data jika gagal
                setSeoData({
                    meta_title: 'Penyalur Pembantu Indonesia',
                    meta_description: 'Layanan penyalur tenaga kerja rumah tangga terpercaya.',
                    meta_keywords: 'penyalur pembantu, art, baby sitter'
                });
            }
        };

        if (pageName) {
            fetchSeo();
        }
    }, [pageName]);

    return seoData;
}