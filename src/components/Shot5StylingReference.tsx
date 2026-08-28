import React, { useState } from 'react';
import { Layers, Upload, Check, Trash2, Info, Sparkles, Shirt, Briefcase, HeartHandshake } from 'lucide-react';

interface Shot5StylingReferenceProps {
  shot5Style1Image: string | null;
  shot5Style2Image: string | null;
  shot5Style3Image: string | null;
  shot5StylingNotes: string;
  onUploadShot5Style1Image: (base64: string | null) => void;
  onUploadShot5Style2Image: (base64: string | null) => void;
  onUploadShot5Style3Image: (base64: string | null) => void;
  onChangeShot5Notes: (notes: string) => void;
}

const PRESET_STYLING_REFERENCES = [
  {
    id: 'french-commute',
    title: 'Gợi Ý Phối Đồ Cardigan / Khoác Dệt Mỏng LANCY',
    subtitle: '3 Phong Cách: Khoác Mở - Cài Cúc Sơ Vin - Khoác Vai',
    description: 'Style 1: Khoác mở cùng camisole + quần suông; Style 2: Cài kín cúc sơ vin với chân váy midi; Style 3: Khoác vắt vai như khăn quàng.',
  },
  {
    id: 'quiet-luxury-tweed',
    title: 'Gợi Ý Phối Đồ Áo Tweed & Blazer LANCY',
    subtitle: '3 Phong Cách: Dạo Phố - Công Sở - Sự Kiện',
    description: 'Style 1: Phối jeans cạp cao + loafer; Style 2: Phối quần cigarette may đo + túi tote; Style 3: Phối đầm lụa xếp ly + khuyên tai ngọc trai.',
  },
];

export const Shot5StylingReference: React.FC<Shot5StylingReferenceProps> = ({
  shot5Style1Image,
  shot5Style2Image,
  shot5Style3Image,
  shot5StylingNotes,
  onUploadShot5Style1Image,
  onUploadShot5Style2Image,
  onUploadShot5Style3Image,
  onChangeShot5Notes,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>('french-commute');

  const createUploadHandler = (onUpload: (base64: string | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onUpload(base64);
      setSelectedPresetId(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: typeof PRESET_STYLING_REFERENCES[0]) => {
    setSelectedPresetId(preset.id);
    onChangeShot5Notes(preset.description);
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-950/80 border border-amber-800/60 rounded-xl text-amber-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-stone-100 flex items-center space-x-2">
              <span>Ảnh Tham Khảo 3 Phong Cách Phối Đồ Cho Shot 5</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-sans font-medium">
                3 Style Matrix (Nền Trắng Studio)
              </span>
            </h2>
            <p className="text-xs text-stone-400">
              Tải 3 ảnh tham khảo tượng trưng cho 3 kiểu mặc & outfit phối đồ khác nhau để Gemini AI render bảng ảnh ghép Shot 5 chuyên nghiệp
            </p>
          </div>
        </div>
      </div>

      {/* 3 Upload Slots for Style 1, Style 2, Style 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Style 1: Open Layering */}
        <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs">
              <Shirt className="w-4 h-4" />
              <span>Style 1: Khoác Mở (Layering Open)</span>
            </div>
            <p className="text-[11px] text-stone-400">
              Chụp kiểu mặc mở cúc khoác ngoài áo camisole/thun + quần tây suông.
            </p>
          </div>

          <label className="relative flex flex-col items-center justify-center h-44 border-2 border-dashed border-stone-700 hover:border-amber-500/80 rounded-lg cursor-pointer bg-stone-900/60 hover:bg-stone-900 transition-all group p-2 text-center">
            {shot5Style1Image ? (
              <div className="relative w-full h-full rounded overflow-hidden group/img">
                <img
                  src={shot5Style1Image}
                  alt="Shot 5 Style 1"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-stone-950/75 opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center transition-opacity space-y-1.5 p-2">
                  <span className="text-[11px] text-stone-100 bg-stone-900 px-2.5 py-1 rounded font-medium border border-stone-700">
                    Bấm để đổi Style 1
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUploadShot5Style1Image(null);
                    }}
                    className="flex items-center space-x-1 text-[10px] text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800/60 hover:bg-red-900"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Xóa Style 1</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 p-2">
                <div className="p-2 bg-stone-800 rounded-full text-stone-400 group-hover:text-amber-400 group-hover:scale-110 transition-all inline-block">
                  <Upload className="w-4 h-4" />
                </div>
                <p className="text-xs font-medium text-stone-300">
                  Tải ảnh Style 1 (Khoác Mở)
                </p>
                <p className="text-[10px] text-stone-500">
                  Ảnh outfit khoác mở nhẹ nhàng dạo phố/commute
                </p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={createUploadHandler(onUploadShot5Style1Image)}
              className="hidden"
            />
          </label>
        </div>

        {/* Style 2: Buttoned / Main Top */}
        <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs">
              <Briefcase className="w-4 h-4" />
              <span>Style 2: Cài Cúc Thanh Lịch (Buttoned)</span>
            </div>
            <p className="text-[11px] text-stone-400">
              Chụp kiểu cài kín cúc sơ vin làm áo chính phối chân váy/quần âu.
            </p>
          </div>

          <label className="relative flex flex-col items-center justify-center h-44 border-2 border-dashed border-stone-700 hover:border-amber-500/80 rounded-lg cursor-pointer bg-stone-900/60 hover:bg-stone-900 transition-all group p-2 text-center">
            {shot5Style2Image ? (
              <div className="relative w-full h-full rounded overflow-hidden group/img">
                <img
                  src={shot5Style2Image}
                  alt="Shot 5 Style 2"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-stone-950/75 opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center transition-opacity space-y-1.5 p-2">
                  <span className="text-[11px] text-stone-100 bg-stone-900 px-2.5 py-1 rounded font-medium border border-stone-700">
                    Bấm để đổi Style 2
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUploadShot5Style2Image(null);
                    }}
                    className="flex items-center space-x-1 text-[10px] text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800/60 hover:bg-red-900"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Xóa Style 2</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 p-2">
                <div className="p-2 bg-stone-800 rounded-full text-stone-400 group-hover:text-amber-400 group-hover:scale-110 transition-all inline-block">
                  <Upload className="w-4 h-4" />
                </div>
                <p className="text-xs font-medium text-stone-300">
                  Tải ảnh Style 2 (Cài Cúc)
                </p>
                <p className="text-[10px] text-stone-500">
                  Ảnh outfit cài cúc chỉn chu công sở
                </p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={createUploadHandler(onUploadShot5Style2Image)}
              className="hidden"
            />
          </label>
        </div>

        {/* Style 3: Shoulder Drape / Cape Shawl */}
        <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs">
              <HeartHandshake className="w-4 h-4" />
              <span>Style 3: Khoác Hờ Vắt Vai (Shoulder Drape)</span>
            </div>
            <p className="text-[11px] text-stone-400">
              Chụp kiểu vắt vai như khăn quàng bên ngoài sơ mi/đầm lụa thời thượng.
            </p>
          </div>

          <label className="relative flex flex-col items-center justify-center h-44 border-2 border-dashed border-stone-700 hover:border-amber-500/80 rounded-lg cursor-pointer bg-stone-900/60 hover:bg-stone-900 transition-all group p-2 text-center">
            {shot5Style3Image ? (
              <div className="relative w-full h-full rounded overflow-hidden group/img">
                <img
                  src={shot5Style3Image}
                  alt="Shot 5 Style 3"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-stone-950/75 opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center transition-opacity space-y-1.5 p-2">
                  <span className="text-[11px] text-stone-100 bg-stone-900 px-2.5 py-1 rounded font-medium border border-stone-700">
                    Bấm để đổi Style 3
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUploadShot5Style3Image(null);
                    }}
                    className="flex items-center space-x-1 text-[10px] text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800/60 hover:bg-red-900"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Xóa Style 3</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 p-2">
                <div className="p-2 bg-stone-800 rounded-full text-stone-400 group-hover:text-amber-400 group-hover:scale-110 transition-all inline-block">
                  <Upload className="w-4 h-4" />
                </div>
                <p className="text-xs font-medium text-stone-300">
                  Tải ảnh Style 3 (Vắt Vai)
                </p>
                <p className="text-[10px] text-stone-500">
                  Ảnh outfit vắt vai sang trọng Chic / Event
                </p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={createUploadHandler(onUploadShot5Style3Image)}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Preset Inspirations & Text Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
        <div className="lg:col-span-2 space-y-2">
          <label className="text-xs font-semibold text-stone-300 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Gợi Ý Mẫu Phối Đồ Nhanh LANCY</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PRESET_STYLING_REFERENCES.map((preset) => {
              const isSelected = selectedPresetId === preset.id && !shot5Style1Image && !shot5Style2Image && !shot5Style3Image;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2.5 rounded-xl border text-left transition-all bg-stone-950 space-y-1 ${
                    isSelected
                      ? 'border-amber-500 ring-1 ring-amber-500/40 bg-amber-950/20'
                      : 'border-stone-800 hover:border-stone-700 opacity-80 hover:opacity-100'
                  }`}
                >
                  <p className="text-xs font-semibold text-stone-200 flex items-center justify-between">
                    <span className="truncate">{preset.title}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                  </p>
                  <p className="text-[10px] text-amber-300 font-medium">{preset.subtitle}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-300 flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>Ghi chú phối đồ Shot 5</span>
          </label>
          <textarea
            value={shot5StylingNotes}
            onChange={(e) => onChangeShot5Notes(e.target.value)}
            placeholder="Mô tả cụ thể quần, giày, túi xách đi kèm cho cả 3 style của Shot 5..."
            className="w-full h-18 bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/80 resize-none placeholder:text-stone-600"
          />
        </div>
      </div>
    </div>
  );
};

