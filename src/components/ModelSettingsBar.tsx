import React from 'react';
import { User, Sparkles, Sliders, Palette, ShieldCheck, RefreshCw, Wand2, Upload, Trash2, Camera } from 'lucide-react';
import { PRESET_MODELS, HAIR_STYLE_OPTIONS, ACCESSORY_STYLE_OPTIONS } from '../data/presetModels';
import { PRESET_BACKGROUNDS } from '../data/presetBackgrounds';
import { ModelConfig, BackgroundConfig } from '../types';

interface ModelSettingsBarProps {
  selectedModel: ModelConfig;
  selectedHairStyle: string;
  customHairImage: string | null;
  selectedBackground: BackgroundConfig;
  customBackgroundImage: string | null;
  selectedAccessoryStyle: string;
  customPoseImage: string | null;
  customNotes: string;
  isGeneratingPrompts: boolean;
  onSelectModel: (model: ModelConfig) => void;
  onChangeHairStyle: (hair: string) => void;
  onUploadCustomHairImage: (base64: string | null) => void;
  onSelectBackground: (bg: BackgroundConfig) => void;
  onUploadCustomBackgroundImage: (base64: string | null) => void;
  onChangeAccessoryStyle: (acc: string) => void;
  onUploadCustomPoseImage: (base64: string | null) => void;
  onChangeCustomNotes: (notes: string) => void;
  onGenerateCatalogPrompts: () => void;
}

export const ModelSettingsBar: React.FC<ModelSettingsBarProps> = ({
  selectedModel,
  selectedHairStyle,
  customHairImage,
  selectedBackground,
  customBackgroundImage,
  selectedAccessoryStyle,
  customPoseImage,
  customNotes,
  isGeneratingPrompts,
  onSelectModel,
  onChangeHairStyle,
  onUploadCustomHairImage,
  onSelectBackground,
  onUploadCustomBackgroundImage,
  onChangeAccessoryStyle,
  onUploadCustomPoseImage,
  onChangeCustomNotes,
  onGenerateCatalogPrompts,
}) => {
  const handleHairFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      onUploadCustomHairImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleBgFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      onUploadCustomBackgroundImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePoseFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      onUploadCustomPoseImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-950/80 border border-amber-800/60 rounded-xl text-amber-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-stone-100">
              Cấu Hình Người Mẫu, Kiểu Tóc, Bối Cảnh & Dáng Pose LANCY
            </h2>
            <p className="text-xs text-stone-400">
              Tùy chỉnh mẫu mặt, tải ảnh tham khảo Kiểu Tóc, Bối Cảnh Studio & Dáng Pose Model
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-1.5 text-xs text-amber-300 font-medium bg-amber-950/40 border border-amber-800/50 px-3 py-1 rounded-lg">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Biểu Cảm Lạnh • Không Cười</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Model Face & Pose Reference */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-stone-300 flex items-center space-x-1.5">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>1. Mẫu Mặt Thiên Tây & Ảnh Pose</span>
          </label>
          
          <div className="space-y-2">
            {PRESET_MODELS.map((model) => {
              const isSelected = selectedModel.id === model.id;
              return (
                <button
                  key={model.id}
                  onClick={() => onSelectModel(model)}
                  className={`w-full flex items-center space-x-3 p-2 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-amber-950/50 border-amber-500 text-stone-100 ring-1 ring-amber-500/50'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <img
                    src={model.previewAvatar}
                    alt={model.name}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate text-stone-200">{model.name}</p>
                    <p className="text-[10px] text-amber-400/90 truncate">{model.expression}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Pose Reference Image Upload */}
          <div className="pt-1 space-y-1.5">
            <span className="text-[11px] font-medium text-amber-300 block">
              Tải ảnh tham khảo Dáng Pose Model:
            </span>
            <label className="relative flex items-center justify-between p-2 bg-stone-950 border border-dashed border-stone-700 hover:border-amber-500 rounded-xl cursor-pointer transition-all">
              {customPoseImage ? (
                <div className="flex items-center space-x-2.5 w-full">
                  <img src={customPoseImage} alt="Pose Ref" className="w-10 h-10 rounded-lg object-cover border border-stone-700" />
                  <span className="text-[11px] text-amber-300 font-medium truncate flex-1">Đã chọn ảnh Pose</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onUploadCustomPoseImage(null); }}
                    className="p-1 bg-red-950 text-red-400 rounded hover:bg-red-900"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-stone-400 hover:text-stone-200">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span className="text-xs">Tải ảnh dáng pose tự chọn</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handlePoseFileChange} className="hidden" />
            </label>
          </div>
        </div>

        {/* 2. Hair Style & Custom Hair Upload */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-stone-300 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>2. Kiểu Tóc & Ảnh Tóc Tham Khảo</span>
          </label>
          
          <div className="space-y-1">
            {HAIR_STYLE_OPTIONS.map((hair) => (
              <button
                key={hair.value}
                onClick={() => onChangeHairStyle(hair.value)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all truncate ${
                  selectedHairStyle === hair.value && !customHairImage
                    ? 'bg-amber-600 text-stone-950 border-amber-500 font-semibold shadow-sm'
                    : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700'
                }`}
              >
                {hair.label}
              </button>
            ))}
          </div>

          {/* Custom Hair Image Upload Slot */}
          <div className="pt-1 space-y-1.5">
            <span className="text-[11px] font-medium text-amber-300 block">
              Tải ảnh tham khảo Kiểu Tóc riêng:
            </span>
            <label className="relative flex items-center justify-between p-2 bg-stone-950 border border-dashed border-stone-700 hover:border-amber-500 rounded-xl cursor-pointer transition-all">
              {customHairImage ? (
                <div className="flex items-center space-x-2.5 w-full">
                  <img src={customHairImage} alt="Hair Ref" className="w-10 h-10 rounded-lg object-cover border border-stone-700" />
                  <span className="text-[11px] text-amber-300 font-medium truncate flex-1">Đã chọn ảnh tóc</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onUploadCustomHairImage(null); }}
                    className="p-1 bg-red-950 text-red-400 rounded hover:bg-red-900"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-stone-400 hover:text-stone-200">
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span className="text-xs">Tải mẫu tóc tự chọn</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleHairFileChange} className="hidden" />
            </label>
          </div>
        </div>

        {/* 3. Background Studio & Custom Background Upload */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-stone-300 flex items-center space-x-1.5">
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span>3. Background Studio & Ảnh Bối Cảnh</span>
          </label>
          
          <div className="space-y-1.5">
            {PRESET_BACKGROUNDS.map((bg) => {
              const isSelected = selectedBackground.id === bg.id && !customBackgroundImage;
              return (
                <button
                  key={bg.id}
                  onClick={() => onSelectBackground(bg)}
                  className={`w-full flex items-center space-x-2.5 p-2 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-amber-950/50 border-amber-500 text-stone-100 ring-1 ring-amber-500/50'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <img
                    src={bg.previewImage}
                    alt={bg.name}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate text-stone-200">{bg.name}</p>
                    <p className="text-[10px] text-stone-400 truncate">{bg.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Background Upload Slot */}
          <div className="pt-1 space-y-1.5">
            <span className="text-[11px] font-medium text-amber-300 block">
              Tải ảnh tham khảo Bối Cảnh Studio:
            </span>
            <label className="relative flex items-center justify-between p-2 bg-stone-950 border border-dashed border-stone-700 hover:border-amber-500 rounded-xl cursor-pointer transition-all">
              {customBackgroundImage ? (
                <div className="flex items-center space-x-2.5 w-full">
                  <img src={customBackgroundImage} alt="Bg Ref" className="w-10 h-10 rounded-lg object-cover border border-stone-700" />
                  <span className="text-[11px] text-amber-300 font-medium truncate flex-1">Đã chọn ảnh bối cảnh</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onUploadCustomBackgroundImage(null); }}
                    className="p-1 bg-red-950 text-red-400 rounded hover:bg-red-900"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-stone-400 hover:text-stone-200">
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span className="text-xs">Tải mẫu bối cảnh studio</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleBgFileChange} className="hidden" />
            </label>
          </div>
        </div>

        {/* 4. Accessories & Custom Notes */}
        <div className="space-y-3 flex flex-col justify-between">
          <div>
            <label className="text-xs font-semibold text-stone-300 flex items-center space-x-1.5 mb-2">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>4. Phụ Kiện Phối Cho Quý Cô</span>
            </label>
            <div className="space-y-1.5">
              {ACCESSORY_STYLE_OPTIONS.map((acc) => (
                <button
                  key={acc.value}
                  onClick={() => onChangeAccessoryStyle(acc.value)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium border transition-all truncate ${
                    selectedAccessoryStyle === acc.value
                      ? 'bg-amber-600 text-stone-950 border-amber-500 font-semibold shadow-sm'
                      : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <label className="text-[11px] font-medium text-stone-400 block mb-1">
              Ghi chú riêng cho bộ prompt (Ví dụ: Thắt đai lưng da, đồng hồ mạ vàng...)
            </label>
            <input
              type="text"
              value={customNotes}
              onChange={(e) => onChangeCustomNotes(e.target.value)}
              placeholder="Yêu cầu bổ sung cho prompt..."
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/80 placeholder:text-stone-600"
            />
          </div>
        </div>
      </div>

      {/* Main Action Call To Action */}
      <div className="pt-4 border-t border-stone-800 flex justify-center">
        <button
          onClick={onGenerateCatalogPrompts}
          disabled={isGeneratingPrompts}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-sm tracking-wide transition-all shadow-xl shadow-amber-950/60 flex items-center justify-center space-x-3 group"
        >
          {isGeneratingPrompts ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Đang Đọc Tất Cả Ảnh Tham Khảo & Khởi Tạo Prompts...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>TẠO BỘ 5 PROMPT & AI CATALOG CHUẨN LANCY (8K)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
