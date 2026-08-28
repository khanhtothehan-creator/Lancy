import React, { useState } from 'react';
import { Copy, Check, Sparkles, RefreshCw, Maximize2, Download, AlertCircle, Eye, Ratio } from 'lucide-react';
import { ShotPrompt } from '../types';

interface ShotCardProps {
  shot: ShotPrompt;
  onRenderImage: (shotId: ShotPrompt['id']) => void;
  onOpenLightbox: (imageUrl: string, title: string) => void;
}

export const ShotCard: React.FC<ShotCardProps> = ({
  shot,
  onRenderImage,
  onOpenLightbox,
}) => {
  const [copiedEN, setCopiedEN] = useState(false);
  const [copiedVN, setCopiedVN] = useState(false);

  const handleCopyEN = () => {
    navigator.clipboard.writeText(shot.promptEN);
    setCopiedEN(true);
    setTimeout(() => setCopiedEN(false), 2000);
  };

  const handleCopyVN = () => {
    navigator.clipboard.writeText(shot.promptVN);
    setCopiedVN(true);
    setTimeout(() => setCopiedVN(false), 2000);
  };

  const handleDownload = () => {
    if (!shot.renderedImageUrl) return;
    const a = document.createElement('a');
    a.href = shot.renderedImageUrl;
    a.download = `LANCY-Catalog-${shot.id}-${shot.aspectRatio.replace(':', 'x')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-stone-700 transition-all">
      {/* Top Header */}
      <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <h3 className="font-serif font-bold text-sm text-stone-100">{shot.title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-amber-300 border border-stone-700">
            Tỉ lệ {shot.aspectRatio}
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="p-5 space-y-4 flex-1">
        {/* Rendered Image Preview Stage */}
        <div className="relative aspect-square w-full bg-stone-950 rounded-xl overflow-hidden border border-stone-800/80 group">
          {shot.renderedImageUrl ? (
            <>
              <img
                src={shot.renderedImageUrl}
                alt={shot.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                <button
                  onClick={() => onOpenLightbox(shot.renderedImageUrl!, shot.title)}
                  className="p-2 bg-stone-900/90 text-stone-100 rounded-lg hover:bg-stone-800 text-xs flex items-center space-x-1.5 backdrop-blur-sm border border-stone-700"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Xem Phóng To</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 bg-amber-600 text-stone-950 font-semibold rounded-lg hover:bg-amber-500 text-xs flex items-center space-x-1.5 shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải Về HD</span>
                </button>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3 bg-stone-950/80">
              <div className="p-3 bg-stone-900 border border-stone-800 rounded-2xl text-stone-500">
                <Eye className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-medium text-stone-300">
                  {shot.isRendering ? 'Gemini AI Đang Render 8K Image...' : 'Sẵn sàng Render ảnh AI Visual'}
                </p>
                <p className="text-[10px] text-stone-500 max-w-xs mt-1">
                  {shot.poseDescription}
                </p>
              </div>

              <button
                onClick={() => onRenderImage(shot.id)}
                disabled={shot.isRendering}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:bg-stone-800 text-stone-950 font-semibold text-xs transition-all shadow-md flex items-center space-x-2"
              >
                {shot.isRendering ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
                    <span>Đang Tạo Ảnh 8K...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-stone-950" />
                    <span>Render Visual Với AI</span>
                  </>
                )}
              </button>
            </div>
          )}

          {shot.error && (
            <div className="absolute bottom-2 inset-x-2 p-2 bg-red-950/90 border border-red-800 rounded text-[11px] text-red-200 flex items-center space-x-1.5">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="truncate">{shot.error}</span>
            </div>
          )}
        </div>

        {/* English Prompt Box */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-amber-300 tracking-wider uppercase">
              English Prompt (Midjourney / Imagen 3)
            </span>
            <button
              onClick={handleCopyEN}
              className="text-[11px] text-stone-400 hover:text-amber-300 flex items-center space-x-1 bg-stone-950 px-2 py-0.5 rounded border border-stone-800"
            >
              {copiedEN ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedEN ? 'Đã Sao Chép!' : 'Sao chép EN'}</span>
            </button>
          </div>
          <div className="p-3 bg-stone-950 rounded-lg border border-stone-800/80 font-mono text-[11px] text-stone-300 leading-relaxed max-h-32 overflow-y-auto select-all">
            {shot.promptEN}
          </div>
        </div>

        {/* Vietnamese Translation / Pose Guide */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-stone-400">Gợi Ý Dáng Pose & Bối Cảnh (Tiếng Việt)</span>
            <button
              onClick={handleCopyVN}
              className="text-[10px] text-stone-500 hover:text-stone-300 flex items-center space-x-1"
            >
              {copiedVN ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedVN ? 'Đã chép' : 'Sao chép VN'}</span>
            </button>
          </div>
          <p className="text-xs text-stone-300 italic bg-stone-950/50 p-2.5 rounded border border-stone-800/50">
            "{shot.promptVN}"
          </p>
        </div>

        {/* Negative Prompt */}
        <div className="text-[10px] text-stone-500 bg-stone-950/40 p-2 rounded border border-stone-800/40">
          <span className="font-semibold text-stone-400">Negative Prompt: </span>
          <span>{shot.negativePrompt}</span>
        </div>
      </div>
    </div>
  );
};
