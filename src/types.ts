export type AspectRatio = '1:1' | '3:4' | '4:5' | '16:9';

export interface GarmentAnalysis {
  category: string;
  colorPalette: string;
  fabricAndTexture: string;
  silhouetteAndFit: string;
  keyTailoringDetails: string;
  suggestedHairStyles?: {
    casual: string;
    business: string;
    lady: string;
  };
  suggestedAccessories?: {
    casual: string;
    business: string;
    lady: string;
  };
}

export interface ShotPrompt {
  id: 'shot1' | 'shot2' | 'shot3' | 'shot4' | 'shot5';
  title: string;
  subtitle: string;
  promptEN: string;
  promptVN: string;
  negativePrompt: string;
  aspectRatio: AspectRatio;
  poseDescription: string;
  renderedImageUrl?: string;
  isRendering?: boolean;
  error?: string;
}

export interface CatalogPromptsResponse {
  shot1_fullBody: ShotPrompt;
  shot2_closeUp: ShotPrompt;
  shot3_coverKneeUp: ShotPrompt;
  shot4_backView: ShotPrompt;
  shot5_triptychCollage: ShotPrompt;
}

export interface ModelConfig {
  id: string;
  name: string;
  faceDescription: string;
  expression: string; // Cold, high-fashion, solemn, non-smiling
  hairStyle: string; // Sleek low bun, soft waves, chic bob, etc.
  previewAvatar: string;
}

export interface BackgroundConfig {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  lightingTone: string;
}

export interface PresetGarment {
  id: string;
  name: string;
  category: string;
  color: string;
  imageUrl: string;
  description: string;
  fabric: string;
  details: string;
}
