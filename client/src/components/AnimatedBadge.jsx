import { useState, useEffect, useRef } from 'react';

const AnimatedBadge = () => {
  const wordsToType = ["Pekerja Rumah Tangga", "Baby Sitter", "Perawat Lansia"];
  const [text, setText] = useState('');
  const wordIndex = useRef(0);
  const letterIndex = useRef(0);
  const isDeleting = useRef(false);

  useEffect(() => {
    let timeoutId;

    const typeAnimation = () => {
      const currentWord = wordsToType[wordIndex.current];
      let newText = '';
      let speed = 100; // Kecepatan mengetik

      if (isDeleting.current) {
        // Menghapus
        newText = currentWord.substring(0, letterIndex.current - 1);
        letterIndex.current--;
        speed = 50; // Lebih cepat saat menghapus
      } else {
        // Mengetik
        newText = currentWord.substring(0, letterIndex.current + 1);
        letterIndex.current++;
      }

      setText(newText);

      if (!isDeleting.current && letterIndex.current === currentWord.length) {
        // Jeda setelah selesai mengetik satu kata
        speed = 2000;
        isDeleting.current = true;
      } else if (isDeleting.current && letterIndex.current === 0) {
        // Pindah ke kata berikutnya setelah teks habis dihapus
        isDeleting.current = false;
        wordIndex.current = (wordIndex.current + 1) % wordsToType.length;
        speed = 500;
      }

      timeoutId = setTimeout(typeAnimation, speed);
    };

    timeoutId = setTimeout(typeAnimation, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    // Tambahkan 'transition-all' agar perubahan lebar border terasa halus
    <span className="inline-flex items-center py-1 px-4 rounded-full bg-purple-100 text-purple-700 text-sm font-bold mb-6 shadow-sm border border-purple-200 transition-all duration-100 ease-linear">
      <span className="mr-1">Penyalur</span>
      
      {/* PERBAIKAN: 
          1. Saya HAPUS 'w-[190px]' agar lebarnya otomatis mengikuti teks.
          2. Tetap pakai 'whitespace-nowrap' agar teks tidak turun baris.
      */}
      <span className="relative inline-flex justify-start whitespace-nowrap min-w-[2px]">
        <span className="z-10">{text}</span>
        
        {/* Kursor Berkedip */}
        <span 
          className="w-[2px] h-4 bg-purple-700 ml-0.5 animate-pulse" 
          style={{ animationDuration: '0.8s' }}
        ></span>
      </span>

      <span className="ml-1">Terpercaya</span>
    </span>
  );
};

export default AnimatedBadge;