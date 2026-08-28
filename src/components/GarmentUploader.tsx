import React, { useState } from 'react';
import { Upload, Sparkles, Shirt, Check, RefreshCw, Image as ImageIcon, Info, Trash2 } from 'lucide-react';
import { PRESET_GARMENTS } from '../data/presetGarments';
import { GarmentAnalysis, PresetGarment } from '../types';

interface GarmentUploaderProps {
  selectedPreset: PresetGarment | null;
  customFrontImage: string | null;
  customBackImage: string | null;
  customDescription: string;
  garmentAnalysis: GarmentAnalysis | null;
  isAnalyzing: boolean;
  onSelectPreset: (preset: PresetGarment) => void;
  onUploadCustomFrontImage: (base64: string | null) => void;
  onUploadCustomBackImage: (base64: string | null) => void;
  onChangeCustomDescription: (desc: string) => void;
  onRunAnalysis: () => void;
}

export const GarmentUploader: React.FC<GarmentUploaderProps> = ({
  selectedPreset,
  customFrontImage,
  customBackImage,
  customDescription,
  garmentAnalysis,
  isAnalyzing,
  onSelectPreset,
  onUploadCustomFrontImage,
  onUploadCustomBackImage,
  onChangeCustomDescription,
  onRunAnalysis,
}) => {
  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');

  const handleFrontFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onUploadCustomFrontImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleBackFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onUploadCustomBackImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const hasCustomImages = !!(customFrontImage || customBackImage);

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-950/80 border border-amber-800/60 rounded-xl text-amber-400">
            <Shirt className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-stone-100">
              Sản Phẩm Thời Trang LANCY (Garment Input)
            </h2>
            <p className="text-xs text-stone-400">
              Tải lên 2 ảnh sản phẩm thực tế (Mặt trước & Mặt sau) hoặc chọn mẫu LANCY có sẵn
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex p-1 bg-stone-950 rounded-lg border border-stone-800 text-xs">
          <button
            onClick={() => setActiveTab('preset')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'preset'
                ? 'bg-amber-600 text-stone-950 shadow-sm font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Mẫu Sản Phẩm LANCY
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'custom'
                ? 'bg-amber-600 text-stone-950 shadow-sm font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Tải Ảnh Của Bạn (Mặt Trước & Sau)
          </button>
        </div>
      </div>

      {/* Preset Selector View */}
      {activeTab === 'preset' && (
        <div className="space-y-4">
          <p className="text-xs text-stone-400">
            Chọn 1 trong các mẫu thời trang cao cấp thuộc bộ sưu tập LANCY:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {PRESET_GARMENTS.map((item) => {
              const isSelected = selectedPreset?.id === item.id && !hasCustomImages;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectPreset(item)}
                  className={`relative group rounded-xl overflow-hidden border text-left transition-all bg-stone-950 ${
                    isSelected
                      ? 'border-amber-500 ring-2 ring-amber-500/40 shadow-lg shadow-amber-950/50 scale-[1.02]'
                      : 'border-stone-800 hover:border-amber-700/60 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="aspect-[3/4] w-full overflow-hidden relative">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-amber-500 text-stone-950 p-1 rounded-full shadow-md">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent p-2.5 pt-6">
                      <p className="text-[10px] text-amber-300 font-semibold uppercase tracking-wider">
                        {item.category}
                      </p>
                      <p className="text-xs font-serif font-medium text-stone-100 line-clamp-1">
                        {item.name}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom 2-Image Upload View (Front + Back) */}
      {activeTab === 'custom' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Slot 1: Front View */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-amber-300 flex items-center justify-between">
                <span>1. Ảnh Mặt Trước (Front View)</span>
                <span className="text-[10px] text-stone-400 font-normal">Quyết định cổ áo, cúc & ngực</span>
              </label>

              <label className="relative flex flex-col items-center justify-center h-48 border-2 border-dashed border-stone-700 hover:border-amber-500/80 rounded-xl cursor-pointer bg-stone-950/80 hover:bg-stone-950 transition-all group p-3 text-center">
                {customFrontImage ? (
                  <div className="relative w-full h-full rounded-lg overflow-hidden group/img">
                    <img
                      src={customFrontImage}
                      alt="Garment Front View"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-stone-950/70 opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center transition-opacity space-y-2 p-2">
                      <span className="text-xs text-stone-100 bg-stone-900/90 px-3 py-1 rounded-md font-medium border border-stone-700">
                        Bấm để đổi ảnh mặt trước
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUploadCustomFrontImage(null);
                        }}
                        className="flex items-center space-x-1 text-[11px] text-red-400 bg-red-950/80 px-2.5 py-1 rounded-md border border-red-800/60 hover:bg-red-900/80"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Xóa ảnh mặt trước</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 p-2">
                    <div className="p-2.5 bg-stone-800/80 rounded-full text-stone-400 group-hover:text-amber-400 group-hover:scale-110 transition-all inline-block">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-medium text-stone-300">
                      Tải ảnh MẶT TRƯỚC quần áo
                    </p>
                    <p className="text-[10px] text-stone-500">
                      Ảnh chụp thẳng mặt trước (cổ áo, cúc, túi ngực, vạt áo)
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFrontFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Slot 2: Back View */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-amber-300 flex items-center justify-between">
                <span>2. Ảnh Mặt Sau (Back View)</span>
                <span className="text-[10px] text-stone-400 font-normal">Quyết định sống lưng, vai & đường xẻ</span>
              </label>

              <label className="relative flex flex-col items-center justify-center h-48 border-2 border-dashed border-stone-700 hover:border-amber-500/80 rounded-xl cursor-pointer bg-stone-950/80 hover:bg-stone-950 transition-all group p-3 text-center">
                {customBackImage ? (
                  <div className="relative w-full h-full rounded-lg overflow-hidden group/img">
                    <img
                      src={customBackImage}
                      alt="Garment Back View"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-stone-950/70 opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center transition-opacity space-y-2 p-2">
                      <span className="text-xs text-stone-100 bg-stone-900/90 px-3 py-1 rounded-md font-medium border border-stone-700">
                        Bấm để đổi ảnh mặt sau
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUploadCustomBackImage(null);
                        }}
                        className="flex items-center space-x-1 text-[11px] text-red-400 bg-red-950/80 px-2.5 py-1 rounded-md border border-red-800/60 hover:bg-red-900/80"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Xóa ảnh mặt sau</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 p-2">
                    <div className="p-2.5 bg-stone-800/80 rounded-full text-stone-400 group-hover:text-amber-400 group-hover:scale-110 transition-all inline-block">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-medium text-stone-300">
                      Tải ảnh MẶT SAU quần áo
                    </p>
                    <p className="text-[10px] text-stone-500">
                      Ảnh chụp mặt sau (chi tiết sống lưng, vai áo, đường xẻ tà, dây đai)
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBackFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Description Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-stone-300">
              Ghi chú bổ sung về chất liệu / phom dáng / chi tiết dệt (Tùy chọn)
            </label>
            <textarea
              value={customDescription}
              onChange={(e) => onChangeCustomDescription(e.target.value)}
              placeholder="Ví dụ: Mẫu khoác len dạ mỏng cashmere, cúc sừng mạ vàng, cổ vest, xẻ lưng trung tâm 15cm..."
              className="w-full h-18 bg-stone-950 border border-stone-800 rounded-lg p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500/80 resize-none placeholder:text-stone-600"
            />
          </div>
        </div>
      )}

      {/* Garment Analysis Trigger & Output */}
      <div className="pt-2 border-t border-stone-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-stone-800 text-stone-950 font-semibold text-xs transition-all shadow-md shadow-amber-950/40"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
              <span>Gemini AI Đang Phân Tích Cả 2 Mặt Vải...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-stone-950 fill-stone-950" />
              <span>Phân Tích Chi Tiết 2 Mặt Vải & Tailoring Với Gemini AI</span>
            </>
          )}
        </button>

        {garmentAnalysis && (
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="bg-amber-950/80 text-amber-300 border border-amber-800/50 px-2.5 py-1 rounded-md font-medium">
              Chất liệu: {garmentAnalysis.fabricAndTexture}
            </span>
            <span className="bg-stone-800 text-stone-300 border border-stone-700/80 px-2.5 py-1 rounded-md">
              Tông màu: {garmentAnalysis.colorPalette}
            </span>
          </div>
        )}
      </div>

      {/* Detailed Analysis Cards */}
      {garmentAnalysis && (
        <div className="p-4 bg-stone-950 rounded-xl border border-amber-900/30 text-xs space-y-2 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-stone-300">
            <div>
              <p className="font-semibold text-amber-300">Phom dáng & Mặt Trước:</p>
              <p className="text-stone-400">{garmentAnalysis.silhouetteAndFit}</p>
            </div>
            <div>
              <p className="font-semibold text-amber-300">Chi tiết Tailoring & Mặt Sau:</p>
              <p className="text-stone-400">{garmentAnalysis.keyTailoringDetails}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

