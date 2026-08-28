import React from 'react';
import { X, Download, ZoomIn } from 'lucide-react';

interface LightboxModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  title: string;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  imageUrl,
  title,
  onClose,
}) => {
  if (!isOpen || !imageUrl) return null;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `LANCY-${title.replace(/\s+/g, '-')}-8K.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fadeIn">
      <div className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center justify-center space-y-4">
        {/* Top Controls */}
        <div className="w-full flex items-center justify-between text-stone-100 bg-stone-900/80 p-4 rounded-xl border border-stone-800 backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <ZoomIn className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif font-bold text-sm sm:text-base">{title} (LANCY 8K Catalog Visual)</h3>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-lg transition-colors flex items-center space-x-1.5 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Tải Ảnh High-Res</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div className="relative max-h-[78vh] w-full flex items-center justify-center overflow-hidden rounded-2xl border border-stone-800 bg-stone-950">
          <img
            src={imageUrl}
            alt={title}
            referrerPolicy="no-referrer"
            className="max-h-[78vh] w-auto object-contain rounded-xl shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};
