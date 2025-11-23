import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <button
              onClick={() => handleToggle(index)}
              className="w-full flex justify-between items-center p-6 text-left"
            >
              <h3 className="font-bold text-slate-800 text-lg">{item.q}</h3>
              <ChevronDown
                className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                size={20}
              />
            </button>
            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <p className="text-slate-600 px-6 pb-6">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}