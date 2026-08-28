import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GarmentUploader } from './components/GarmentUploader';
import { Shot5StylingReference } from './components/Shot5StylingReference';
import { ModelSettingsBar } from './components/ModelSettingsBar';
import { ShotGallery } from './components/ShotGallery';
import { BrandGuideModal } from './components/BrandGuideModal';
import { LightboxModal } from './components/LightboxModal';
import { PRESET_GARMENTS } from './data/presetGarments';
import { PRESET_MODELS, HAIR_STYLE_OPTIONS, ACCESSORY_STYLE_OPTIONS } from './data/presetModels';
import { PRESET_BACKGROUNDS } from './data/presetBackgrounds';
import {
  PresetGarment,
  ModelConfig,
  BackgroundConfig,
  GarmentAnalysis,
  CatalogPromptsResponse,
  ShotPrompt,
} from './types';
import { Sparkles, AlertCircle, Info, RefreshCw } from 'lucide-react';

export default function App() {
  // 1. State for Garment Selection
  const [selectedPreset, setSelectedPreset] = useState<PresetGarment | null>(PRESET_GARMENTS[0]);
  const [customFrontImage, setCustomFrontImage] = useState<string | null>(null);
  const [customBackImage, setCustomBackImage] = useState<string | null>(null);
  const [customDescription, setCustomDescription] = useState<string>('');
  const [garmentAnalysis, setGarmentAnalysis] = useState<GarmentAnalysis | null>(null);
  const [isAnalyzingGarment, setIsAnalyzingGarment] = useState<boolean>(false);

  // 2. State for Model & Studio Settings
  const [selectedModel, setSelectedModel] = useState<ModelConfig>(PRESET_MODELS[0]);
  const [selectedHairStyle, setSelectedHairStyle] = useState<string>(HAIR_STYLE_OPTIONS[0].value);
  const [customHairImage, setCustomHairImage] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<BackgroundConfig>(PRESET_BACKGROUNDS[0]);
  const [customBackgroundImage, setCustomBackgroundImage] = useState<string | null>(null);
  const [selectedAccessoryStyle, setSelectedAccessoryStyle] = useState<string>(ACCESSORY_STYLE_OPTIONS[0].value);
  const [customPoseImage, setCustomPoseImage] = useState<string | null>(null);
  const [customNotes, setCustomNotes] = useState<string>('');

  // 2b. State for Shot 5 Multi-Styling Reference (3 Upload Slots for 3 Styles)
  const [shot5Style1Image, setShot5Style1Image] = useState<string | null>(null);
  const [shot5Style2Image, setShot5Style2Image] = useState<string | null>(null);
  const [shot5Style3Image, setShot5Style3Image] = useState<string | null>(null);
  const [shot5StylingNotes, setShot5StylingNotes] = useState<string>('Biến tấu đa dạng 3-4 cách mặc: Khoác mở cúc nhẹ nhàng layer cùng camisole trắng/đen + quần suông; Cài kín cúc làm áo chính sơ vin cùng chân váy/jeans; Khoác hờ vắt vai như khăn quàng cổ thời thượng.');

  // 3. State for Generated Prompts & Visuals
  const [catalogPrompts, setCatalogPrompts] = useState<CatalogPromptsResponse | null>(null);
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState<boolean>(false);
  const [isRenderingAll, setIsRenderingAll] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [noticeMsg, setNoticeMsg] = useState<string | null>(null);

  // 4. State for Modals
  const [isBrandGuideOpen, setIsBrandGuideOpen] = useState<boolean>(false);
  const [lightboxState, setLightboxState] = useState<{ isOpen: boolean; imageUrl: string | null; title: string }>({
    isOpen: false,
    imageUrl: null,
    title: '',
  });

  // Auto analyze initial preset garment on load
  useEffect(() => {
    runGarmentAnalysis();
  }, []);

  // Handle Preset Selection
  const handleSelectPreset = (preset: PresetGarment) => {
    setSelectedPreset(preset);
    setCustomFrontImage(null);
    setCustomBackImage(null);
    setCustomDescription('');
    // Auto populate initial analysis from preset
    setGarmentAnalysis({
      category: preset.category,
      colorPalette: preset.color,
      fabricAndTexture: preset.fabric,
      silhouetteAndFit: preset.description,
      keyTailoringDetails: preset.details,
    });
  };

  // Run Gemini API Garment Analysis
  const runGarmentAnalysis = async () => {
    setIsAnalyzingGarment(true);
    setErrorMsg(null);
    try {
      const activeFront = customFrontImage || selectedPreset?.imageUrl;
      const activeBack = customBackImage;
      const activeDesc = customDescription || selectedPreset?.description || '';

      const response = await fetch('/api/analyze-garment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frontImageBase64: activeFront?.startsWith('data:') ? activeFront : undefined,
          backImageBase64: activeBack?.startsWith('data:') ? activeBack : undefined,
          imageBase64: !activeFront?.startsWith('data:') && activeFront ? activeFront : undefined,
          textDescription: activeDesc,
        }),
      });

      const resData = await response.json();
      if (resData.notice) {
        setNoticeMsg(resData.notice);
      }
      if (resData.success && resData.data) {
        setGarmentAnalysis(resData.data);
      } else {
        // Fallback to preset if error
        if (selectedPreset) {
          setGarmentAnalysis({
            category: selectedPreset.category,
            colorPalette: selectedPreset.color,
            fabricAndTexture: selectedPreset.fabric,
            silhouetteAndFit: selectedPreset.description,
            keyTailoringDetails: selectedPreset.details,
          });
        }
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      // Fallback
      if (selectedPreset) {
        setGarmentAnalysis({
          category: selectedPreset.category,
          colorPalette: selectedPreset.color,
          fabricAndTexture: selectedPreset.fabric,
          silhouetteAndFit: selectedPreset.description,
          keyTailoringDetails: selectedPreset.details,
        });
      }
    } finally {
      setIsAnalyzingGarment(false);
    }
  };

  // Generate 5 Prompts for LANCY Catalog
  const handleGenerateCatalogPrompts = async () => {
    setIsGeneratingPrompts(true);
    setErrorMsg(null);
    try {
      const activeGarment = garmentAnalysis || {
        category: selectedPreset?.category || 'Luxury Ready-To-Wear',
        colorPalette: selectedPreset?.color || 'Muted Cream & Sand',
        fabricAndTexture: selectedPreset?.fabric || 'Wool Cashmere blend',
        silhouetteAndFit: selectedPreset?.description || 'Tailored double-breasted fit',
        keyTailoringDetails: selectedPreset?.details || 'Horn buttons, hand-stitched lapels',
      };

      const response = await fetch('/api/generate-catalog-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garmentDetails: activeGarment,
          modelPreferences: {
            faceType: selectedModel.name,
            faceDescription: selectedModel.faceDescription,
            expression: selectedModel.expression,
            hair: customHairImage ? 'Custom hair reference image attached' : selectedHairStyle,
            accessories: selectedAccessoryStyle,
          },
          backgroundStyle: customBackgroundImage
            ? 'Custom studio background reference attached'
            : `${selectedBackground.name}: ${selectedBackground.description}`,
          customNotes,
          shot5StylingNotes,
          frontImageBase64: customFrontImage,
          backImageBase64: customBackImage,
          customHairImageBase64: customHairImage,
          customBackgroundImageBase64: customBackgroundImage,
          customPoseImageBase64: customPoseImage,
          shot5Style1ImageBase64: shot5Style1Image,
          shot5Style2ImageBase64: shot5Style2Image,
          shot5Style3ImageBase64: shot5Style3Image,
        }),
      });

      const resData = await response.json();
      if (resData.notice) {
        setNoticeMsg(resData.notice);
      }
      if (resData.success && resData.prompts) {
        setCatalogPrompts(resData.prompts);
      } else {
        setErrorMsg(resData.error || 'Khởi tạo prompt thất bại. Vui lòng kiểm tra GEMINI_API_KEY.');
      }
    } catch (err: any) {
      console.error('Prompt Gen error:', err);
      setErrorMsg(err.message || 'Lỗi kết nối máy chủ tạo prompt.');
    } finally {
      setIsGeneratingPrompts(false);
    }
  };

  // Render individual AI Image Visual
  const handleRenderImage = async (shotId: ShotPrompt['id']) => {
    if (!catalogPrompts) return;

    const shotKeyMap: Record<ShotPrompt['id'], keyof CatalogPromptsResponse> = {
      shot1: 'shot1_fullBody',
      shot2: 'shot2_closeUp',
      shot3: 'shot3_coverKneeUp',
      shot4: 'shot4_backView',
      shot5: 'shot5_triptychCollage',
    };

    const key = shotKeyMap[shotId];
    const targetShot = catalogPrompts[key];
    if (!targetShot) return;

    // Set rendering state
    setCatalogPrompts((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [key]: { ...prev[key], isRendering: true, error: undefined },
      };
    });

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: targetShot.promptEN,
          aspectRatio: targetShot.aspectRatio,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.imageUrl) {
        setCatalogPrompts((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            [key]: {
              ...prev[key],
              renderedImageUrl: resData.imageUrl,
              isRendering: false,
            },
          };
        });
      } else {
        setCatalogPrompts((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            [key]: {
              ...prev[key],
              isRendering: false,
              error: resData.error || 'Render ảnh thất bại.',
            },
          };
        });
      }
    } catch (err: any) {
      setCatalogPrompts((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          [key]: {
            ...prev[key],
            isRendering: false,
            error: err.message || 'Lỗi render ảnh.',
          },
        };
      });
    }
  };

  // Render All 5 Images sequentially to prevent API rate limits
  const handleRenderAllImages = async () => {
    if (!catalogPrompts) return;
    setIsRenderingAll(true);
    const shotIds: Array<ShotPrompt['id']> = ['shot1', 'shot2', 'shot3', 'shot4', 'shot5'];
    for (let i = 0; i < shotIds.length; i++) {
      await handleRenderImage(shotIds[i]);
      if (i < shotIds.length - 1) {
        // Short pause between image generation requests to respect API rate limits
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
    }
    setIsRenderingAll(false);
  };

  // Export all prompts as TXT file
  const handleExportAllPrompts = () => {
    if (!catalogPrompts) return;
    const shots = [
      catalogPrompts.shot1_fullBody,
      catalogPrompts.shot2_closeUp,
      catalogPrompts.shot3_coverKneeUp,
      catalogPrompts.shot4_backView,
      catalogPrompts.shot5_triptychCollage,
    ];

    const content = `===========================================================
LANCY (朗姿) 8K LUXURY FASHION CATALOG PROMPT PACKAGE
Generated for: ${garmentAnalysis?.category || selectedPreset?.name || 'Garment'}
Model: ${selectedModel.name} | Expression: ${selectedModel.expression}
Hair: ${selectedHairStyle}
Studio Background: ${selectedBackground.name}
===========================================================

` + shots.map((s, i) => `-----------------------------------------------------------
[SHOT ${i + 1}] ${s.title.toUpperCase()}
Aspect Ratio: ${s.aspectRatio}
Pose Guide (VN): ${s.poseDescription}

--- English Prompt (Midjourney / Imagen 3) ---
${s.promptEN}

--- Mô Tả Tiếng Việt ---
${s.promptVN}

--- Negative Prompt ---
${s.negativePrompt}
`).join('\n\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LANCY-Catalog-Prompts-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Top Navigation */}
      <Header
        onOpenBrandGuide={() => setIsBrandGuideOpen(true)}
        onExportAllPrompts={handleExportAllPrompts}
        hasPrompts={!!catalogPrompts}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Announcement */}
        <div className="p-4 bg-amber-950/40 border border-amber-900/50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2.5 text-amber-300">
            <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <p>
              <strong>Studio Tạo Catalog Thời Trang LANCY:</strong> Gương mặt người mẫu phương Tây cố định, biểu cảm lạnh cao cấp, không cười, background studio tự nhiên 8K.
            </p>
          </div>
          <button
            onClick={() => setIsBrandGuideOpen(true)}
            className="text-amber-400 underline font-semibold hover:text-amber-200 whitespace-nowrap"
          >
            Xem 5 quy tắc chụp LANCY
          </button>
        </div>

        {/* Notice Info Banner */}
        {noticeMsg && (
          <div className="p-4 bg-sky-950/90 border border-sky-800 rounded-xl text-xs text-sky-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Info className="w-5 h-5 text-sky-400 flex-shrink-0" />
              <span>{noticeMsg}</span>
            </div>
            <button
              onClick={() => setNoticeMsg(null)}
              className="text-sky-400 hover:text-sky-200 font-bold ml-4"
            >
              Đóng
            </button>
          </div>
        )}

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="p-4 bg-red-950/90 border border-red-800 rounded-xl text-xs text-red-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-red-400 hover:text-red-200 font-bold ml-4"
            >
              Đóng
            </button>
          </div>
        )}

        {/* Section 1: Garment Input (Front View & Back View) */}
        <GarmentUploader
          selectedPreset={selectedPreset}
          customFrontImage={customFrontImage}
          customBackImage={customBackImage}
          customDescription={customDescription}
          garmentAnalysis={garmentAnalysis}
          isAnalyzing={isAnalyzingGarment}
          onSelectPreset={handleSelectPreset}
          onUploadCustomFrontImage={(base64) => {
            setCustomFrontImage(base64);
            setSelectedPreset(null);
          }}
          onUploadCustomBackImage={(base64) => {
            setCustomBackImage(base64);
            setSelectedPreset(null);
          }}
          onChangeCustomDescription={setCustomDescription}
          onRunAnalysis={runGarmentAnalysis}
        />

        {/* Section 1b: Shot 5 Styling Reference Input (3 Styles) */}
        <Shot5StylingReference
          shot5Style1Image={shot5Style1Image}
          shot5Style2Image={shot5Style2Image}
          shot5Style3Image={shot5Style3Image}
          shot5StylingNotes={shot5StylingNotes}
          onUploadShot5Style1Image={setShot5Style1Image}
          onUploadShot5Style2Image={setShot5Style2Image}
          onUploadShot5Style3Image={setShot5Style3Image}
          onChangeShot5Notes={setShot5StylingNotes}
        />

        {/* Section 2: Model, Hair, Background & Pose Preferences */}
        <ModelSettingsBar
          selectedModel={selectedModel}
          selectedHairStyle={selectedHairStyle}
          customHairImage={customHairImage}
          selectedBackground={selectedBackground}
          customBackgroundImage={customBackgroundImage}
          selectedAccessoryStyle={selectedAccessoryStyle}
          customPoseImage={customPoseImage}
          customNotes={customNotes}
          isGeneratingPrompts={isGeneratingPrompts}
          onSelectModel={setSelectedModel}
          onChangeHairStyle={setSelectedHairStyle}
          onUploadCustomHairImage={setCustomHairImage}
          onSelectBackground={setSelectedBackground}
          onUploadCustomBackgroundImage={setCustomBackgroundImage}
          onChangeAccessoryStyle={setSelectedAccessoryStyle}
          onUploadCustomPoseImage={setCustomPoseImage}
          onChangeCustomNotes={setCustomNotes}
          onGenerateCatalogPrompts={handleGenerateCatalogPrompts}
        />

        {/* Section 3: Generated 5 Shot Prompts & Visual Gallery */}
        {catalogPrompts ? (
          <ShotGallery
            prompts={catalogPrompts}
            garmentAnalysis={garmentAnalysis}
            shot5ReferenceImage={shot5Style1Image || shot5Style2Image || shot5Style3Image}
            onRenderImage={handleRenderImage}
            onRenderAllImages={handleRenderAllImages}
            onOpenLightbox={(imageUrl, title) =>
              setLightboxState({ isOpen: true, imageUrl, title })
            }
            isRenderingAll={isRenderingAll}
          />
        ) : (
          <div className="p-12 text-center bg-stone-900/50 border border-dashed border-stone-800 rounded-2xl space-y-3">
            <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center mx-auto text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-stone-200 text-base">
              Chưa Có Bộ Prompt Catalog Được Tạo
            </h3>
            <p className="text-xs text-stone-400 max-w-md mx-auto">
              Vui lòng chọn hoặc tải lên sản phẩm thời trang ở trên, sau đó bấm nút{' '}
              <span className="text-amber-400 font-semibold">"TẠO BỘ 5 PROMPT & AI CATALOG CHUẨN LANCY"</span>.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-900 py-8 bg-stone-950 text-center text-xs text-stone-500">
        <p>LANCY (朗姿) Luxury Ready-To-Wear AI Catalog Studio • Powered by Gemini 3.6 Flash & Gemini Image AI</p>
      </footer>

      {/* Brand Guidelines Modal */}
      <BrandGuideModal
        isOpen={isBrandGuideOpen}
        onClose={() => setIsBrandGuideOpen(false)}
      />

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxState.isOpen}
        imageUrl={lightboxState.imageUrl}
        title={lightboxState.title}
        onClose={() => setLightboxState({ isOpen: false, imageUrl: null, title: '' })}
      />
    </div>
  );
}
