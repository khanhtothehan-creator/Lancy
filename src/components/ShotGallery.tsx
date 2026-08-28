import React, { useState } from 'react';
import { Camera, Layers, Grid, Sparkles, Download, Check, Copy } from 'lucide-react';
import { ShotPrompt, CatalogPromptsResponse, GarmentAnalysis } from '../types';
import { ShotCard } from './ShotCard';
import { StylingCollageCard } from './StylingCollageCard';

interface ShotGalleryProps {
  prompts: CatalogPromptsResponse;
  garmentAnalysis: GarmentAnalysis | null;
  onRenderImage: (shotId: ShotPrompt['id']) => void;
  onRenderAllImages: () => void;
  onOpenLightbox: (imageUrl: string, title: string) => void;
  isRenderingAll: boolean;
}

export const ShotGallery: React.FC<ShotGalleryProps> = ({
  prompts,
  garmentAnalysis,
  onRenderImage,
  onRenderAllImages,
  onOpenLightbox,
  isRenderingAll,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'shot1' | 'shot2' | 'shot3' | 'shot4' | 'shot5'>('all');
  const [copiedAll, setCopiedAll] = useState(false);

  const shotList: ShotPrompt[] = [
    prompts.shot1_fullBody,
    prompts.shot2_closeUp,
    prompts.shot3_coverKneeUp,
    prompts.shot4_backView,
    prompts.shot5_triptychCollage,
  ];

  const handleCopyAllPrompts = () => {
    const fullText = shotList
      .map(
        (s, idx) =>
          `=== SHOT ${idx + 1}: ${s.title.toUpperCase()} (Aspect Ratio ${s.aspectRatio}) ===\n[English Prompt]\n${s.promptEN}\n\n[Mô tả Tiếng Việt]\n${s.promptVN}\n\n[Negative Prompt]\n${s.negativePrompt}\n`
      )
      .join('\n----------------------------------------\n\n');

    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Gallery Toolbar Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-950 border border-amber-800 rounded-xl text-amber-400">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-stone-100">
              Bộ 5 Góc Chụp Catalog Chuẩn LANCY (8K Visual Prompts)
            </h2>
            <p className="text-xs text-stone-400">
              5 Góc chụp tiêu chuẩn: Toàn thân, Cận cảnh, Ảnh bìa trung tâm, Quay lưng đằng sau, và Ảnh ghép 3 phong cách 1:1
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <button
            onClick={handleCopyAllPrompts}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-amber-200 text-xs font-semibold transition-all shadow-sm"
          >
            {copiedAll ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedAll ? 'Đã Sao Chép Bộ 5 Prompt!' : 'Sao Chép Cả 5 Prompt'}</span>
          </button>

          <button
            onClick={onRenderAllImages}
            disabled={isRenderingAll}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-stone-800 text-stone-950 font-bold text-xs transition-all shadow-md shadow-amber-950/50"
          >
            <Sparkles className="w-4 h-4 fill-stone-950" />
            <span>{isRenderingAll ? 'Đang Render Cả 5 Visual AI...' : 'Render Tất Cả 5 Visual AI'}</span>
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-stone-950 rounded-xl border border-stone-800 text-xs">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'all'
              ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          Tất Cả 5 Góc Chụp
        </button>
        <button
          onClick={() => setActiveTab('shot1')}
          className={`px-3.5 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'shot1'
              ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          1. Ảnh Toàn Thân (Full-Body)
        </button>
        <button
          onClick={() => setActiveTab('shot2')}
          className={`px-3.5 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'shot2'
              ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          2. Ảnh Cận Cảnh (Close-up)
        </button>
        <button
          onClick={() => setActiveTab('shot3')}
          className={`px-3.5 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'shot3'
              ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          3. Ảnh Bìa (Cover Knee-Up)
        </button>
        <button
          onClick={() => setActiveTab('shot4')}
          className={`px-3.5 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'shot4'
              ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          4. Ảnh Quay Lưng (Back View)
        </button>
        <button
          onClick={() => setActiveTab('shot5')}
          className={`px-3.5 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'shot5'
              ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          5. Ảnh Ghép 3 Phong Cách 1:1
        </button>
      </div>

      {/* Grid Display */}
      {activeTab === 'all' ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ShotCard shot={prompts.shot1_fullBody} onRenderImage={onRenderImage} onOpenLightbox={onOpenLightbox} />
            <ShotCard shot={prompts.shot2_closeUp} onRenderImage={onRenderImage} onOpenLightbox={onOpenLightbox} />
            <ShotCard shot={prompts.shot3_coverKneeUp} onRenderImage={onRenderImage} onOpenLightbox={onOpenLightbox} />
            <ShotCard shot={prompts.shot4_backView} onRenderImage={onRenderImage} onOpenLightbox={onOpenLightbox} />
          </div>

          {/* Shot 5 Featured Banner */}
          <StylingCollageCard
            shot={prompts.shot5_triptychCollage}
            garmentAnalysis={garmentAnalysis}
            onRenderImage={onRenderImage}
            onOpenLightbox={onOpenLightbox}
          />
        </div>
      ) : (
        <div>
          {activeTab === 'shot1' && <ShotCard shot={prompts.shot1_fullBody} onRenderImage={onRenderImage} onOpenLightbox={onOpenLightbox} />}
          {activeTab === 'shot2' && <ShotCard shot={prompts.shot2_closeUp} onRenderImage={onRenderImage} onOpenLightbox={onOpenLightbox} />}
          {activeTab === 'shot3' && <ShotCard shot={prompts.shot3_coverKneeUp} onRenderImage={onRenderImage} onOpenLightbox={onOpenLightbox} />}
          {activeTab === 'shot4' && <ShotCard shot={prompts.shot4_backView} onRenderImage={onRenderImage} onOpenLightbox={onOpenLightbox} />}
          {activeTab === 'shot5' && (
            <StylingCollageCard
              shot={prompts.shot5_triptychCollage}
              garmentAnalysis={garmentAnalysis}
              onRenderImage={onRenderImage}
              onOpenLightbox={onOpenLightbox}
            />
          )}
        </div>
      )}
    </div>
  );
};
