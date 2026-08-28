import React, { useState } from 'react';
import { Copy, Check, Sparkles, RefreshCw, Maximize2, Download, Layers, Shirt, Briefcase, HeartHandshake } from 'lucide-react';
import { ShotPrompt, GarmentAnalysis } from '../types';

interface StylingCollageCardProps {
  shot: ShotPrompt;
  garmentAnalysis: GarmentAnalysis | null;
  shot5ReferenceImage?: string | null;
  onRenderImage: (shotId: ShotPrompt['id']) => void;
  onOpenLightbox: (imageUrl: string, title: string) => void;
}

export const StylingCollageCard: React.FC<StylingCollageCardProps> = ({
  shot,
  garmentAnalysis,
  shot5ReferenceImage,
  onRenderImage,
  onOpenLightbox,
}) => {
  const [copiedEN, setCopiedEN] = useState(false);

  const handleCopyEN = () => {
    navigator.clipboard.writeText(shot.promptEN);
    setCopiedEN(true);
    setTimeout(() => setCopiedEN(false), 2000);
  };

  const handleDownload = () => {
    if (!shot.renderedImageUrl) return;
    const a = document.createElement('a');
    a.href = shot.renderedImageUrl;
    a.download = `LANCY-Multi-Styling-Collage-1x1.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-stone-900 border-2 border-amber-900/40 rounded-2xl overflow-hidden shadow-2xl space-y-4">
      {/* Top Banner */}
      <div className="p-4 bg-gradient-to-r from-stone-950 via-amber-950/40 to-stone-950 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-600/20 border border-amber-500/40 rounded-lg text-amber-300">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-stone-100">{shot.title}</h3>
            <p className="text-xs text-amber-300/90 font-medium">
              Ảnh Ghép Tỉ Lệ 1:1 • Đa Dạng Biến Tấu Cách Mặc & Chức Năng Sản Phẩm (Commute - Business - Chic)
            </p>
          </div>
        </div>

        <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60 font-semibold">
          KÍCH THƯỚC 1:1 8K
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* 3 Functional Wearing & Coordination Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Style 1: Open Layering */}
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs">
              <Shirt className="w-4 h-4" />
              <span>1. Cách Mặc Khoác Mở (Layering Open)</span>
            </div>
            <p className="text-xs text-stone-300">
              {garmentAnalysis?.suggestedAccessories?.casual ||
                'Khoác hờ mở cúc nhẹ nhàng bên ngoài áo hai dây camisole trắng/đen, phối cùng quần tây suông ống rộng/jeans cạp cao & túi da đeo vai nhã nhặn.'}
            </p>
          </div>

          {/* Style 2: Buttoned / Main Top */}
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs">
              <Briefcase className="w-4 h-4" />
              <span>2. Cách Mặc Cài Cúc Thanh Lịch (Buttoned Main Top)</span>
            </div>
            <p className="text-xs text-stone-300">
              {garmentAnalysis?.suggestedAccessories?.business ||
                'Cài kín cúc làm trang phục chính sơ vin cùng chân váy midi chữ A/chân váy bút chì hoặc quần ống đứng, phối túi xách tote công sở & giày gót nhọn.'}
            </p>
          </div>

          {/* Style 3: Shoulder Drape / Cape Shawl */}
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs">
              <HeartHandshake className="w-4 h-4" />
              <span>3. Cách Khoác Hờ Vắt Vai (Shoulder Drape Shawl)</span>
            </div>
            <p className="text-xs text-stone-300">
              {garmentAnalysis?.suggestedAccessories?.lady ||
                'Vắt nhẹ hai tay áo qua vai như chiếc khăn quàng cổ thời thượng bên ngoài áo sơ mi poplin xanh/trắng, phối quần denim & giày loafer cổ điển.'}
            </p>
          </div>
        </div>

        {/* Visual Render Stage & Reference Image Preview for Shot 5 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {shot5ReferenceImage && (
            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2 text-center flex flex-col items-center">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-amber-300">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Ảnh Mẫu Phối Đồ Tham Khảo (Shot 5 Input)</span>
              </div>
              <div className="relative aspect-square w-full max-w-xs rounded-xl overflow-hidden border border-amber-900/40 bg-stone-900">
                <img
                  src={shot5ReferenceImage}
                  alt="Shot 5 Styling Reference"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => onOpenLightbox(shot5ReferenceImage, 'Ảnh Mẫu Phối Đồ Tham Khảo Shot 5')}
                />
              </div>
              <p className="text-[11px] text-stone-400">AI Gemini sử dụng ảnh tham khảo này để thiết kế prompt ghép 3-4 dáng mặc linh hoạt</p>
            </div>
          )}

          <div className={`relative aspect-square w-full max-w-xl mx-auto bg-stone-950 rounded-2xl overflow-hidden border border-amber-900/30 group ${!shot5ReferenceImage ? 'md:col-span-2 max-w-md' : ''}`}>
          {shot.renderedImageUrl ? (
            <>
              <img
                src={shot.renderedImageUrl}
                alt={shot.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                <button
                  onClick={() => onOpenLightbox(shot.renderedImageUrl!, shot.title)}
                  className="p-2.5 bg-stone-900/90 text-stone-100 rounded-lg hover:bg-stone-800 text-xs flex items-center space-x-1.5 backdrop-blur-sm border border-stone-700"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>Phóng To Kích Thước 1:1</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2.5 bg-amber-600 text-stone-950 font-semibold rounded-lg hover:bg-amber-500 text-xs flex items-center space-x-1.5 shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải Ảnh Tỉ Lệ 1:1 HD</span>
                </button>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-4 bg-stone-950">
              <div className="p-4 bg-amber-950/40 border border-amber-800/50 rounded-2xl text-amber-400">
                <Layers className="w-10 h-10" />
              </div>
              <div className="max-w-md space-y-1">
                <p className="text-sm font-semibold text-stone-200">
                  {shot.isRendering ? 'Gemini AI Đang Render Khung Ghép 3 Phong Cách 1:1...' : 'Sẵn Sàng Render Ảnh Ghép 3 Tỉ Lệ 1:1'}
                </p>
                <p className="text-xs text-stone-400">
                  3 Khung hình dọc ghép song song 1:1 thể hiện trọn vẹn 3 ý tưởng phối đồ cho cùng một kiểu dáng áo.
                </p>
              </div>

              <button
                onClick={() => onRenderImage(shot.id)}
                disabled={shot.isRendering}
                className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-stone-800 text-stone-950 font-bold text-xs transition-all shadow-lg flex items-center space-x-2"
              >
                {shot.isRendering ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
                    <span>Đang Tạo Visual 1:1...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-stone-950" />
                    <span>Render Visual Tỉ Lệ 1:1 8K</span>
                  </>
                )}
              </button>
            </div>
          )}
          </div>
        </div>

        {/* English Prompt */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 tracking-wider uppercase">
              1:1 Triptych Master Prompt (English)
            </span>
            <button
              onClick={handleCopyEN}
              className="px-3 py-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 text-xs font-semibold rounded-lg border border-amber-500/30 flex items-center space-x-1.5 transition-colors"
            >
              {copiedEN ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedEN ? 'Đã Sao Chép Prompt 1:1!' : 'Sao Chép Master Prompt 1:1'}</span>
            </button>
          </div>
          <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800 font-mono text-xs text-stone-300 leading-relaxed max-h-36 overflow-y-auto select-all">
            {shot.promptEN}
          </div>
        </div>
      </div>
    </div>
  );
};
