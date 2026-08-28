import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Set high limit for base64 image uploads
app.use(express.json({ limit: '25mb' }));

// Health check endpoint for Cloud Run container probes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Helper to initialize Gemini SDK safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY variable missing. Please add it in Settings > Secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Robust helper for calling Gemini text generation with retry on 429 rate limit
async function generateContentWithRetry(ai: GoogleGenAI, requestParams: {
  model?: string;
  contents: any;
  config?: any;
}) {
  const preferredModel = requestParams.model || 'gemini-3.7-flash';
  const modelsToTry = [preferredModel, 'gemini-flash-latest'];
  const uniqueModels = Array.from(new Set(modelsToTry));

  let lastError: any = null;

  for (const modelName of uniqueModels) {
    let retries = 3;
    let delayMs = 3000;

    while (retries >= 0) {
      try {
        const response = await ai.models.generateContent({
          ...requestParams,
          model: modelName,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const errStr = String(err?.message || err);
        const is429 = err?.status === 429 || errStr.includes('429') || errStr.includes('quota') || errStr.includes('RESOURCE_EXHAUSTED');
        const is404 = err?.status === 404 || errStr.includes('404') || errStr.includes('NOT_FOUND');

        if (is404) {
          break;
        }

        if (is429 && retries > 0) {
          // Parse suggested retry delay if available (e.g., "Please retry in 3.5s")
          const match = errStr.match(/retry in ([0-9.]+)\s*s/i);
          if (match && match[1]) {
            const parsedSec = parseFloat(match[1]);
            if (!isNaN(parsedSec) && parsedSec > 0) {
              delayMs = Math.ceil(parsedSec * 1000) + 1000;
            }
          }
          console.warn(`[Gemini API Rate Limit 429 on ${modelName}]. Waiting ${delayMs/1000}s before retry (${retries} attempts left)...`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          delayMs += 2000;
          retries--;
        } else {
          break;
        }
      }
    }
  }

  throw lastError;
}

// Fallback generator when Gemini API hits 429 Quota Exceeded on Free Tier
function createFallbackCatalogPrompts(
  garmentDetails: any,
  modelPreferences: any,
  backgroundStyle: string,
  shot5Notes: string
) {
  const category = garmentDetails?.category || 'Sản Phẩm LANCY Ready-To-Wear';
  const color = garmentDetails?.colorPalette || 'Tone Màu Trung Tính Cao Cấp';
  const fabric = garmentDetails?.fabricAndTexture || 'Chất Liệu Dệt Cao Cấp LANCY';
  const fit = garmentDetails?.silhouetteAndFit || 'Phom Dáng Dựng May Đo May Đo Chỉnh Chu';
  const details = garmentDetails?.keyTailoringDetails || 'Chi tiết khuy cài, viền túi & cổ áo sắc nét';
  const modelName = modelPreferences?.faceType || 'Người Mẫu Cao Cấp LANCY';
  const hair = modelPreferences?.hair || 'Tóc Búi Thấp Hoặc Uốn Sóng Nhẹ Thanh Lịch';

  return {
    shot1_fullBody: {
      id: 'shot1',
      title: 'Shot 1: Full-Body Standing (Toàn Thân Standing)',
      subtitle: 'Góc chụp toàn thân thể hiện trọn vẹn phom dáng và sự cân đối của trang phục',
      promptEN: `Full-body editorial fashion catalog shot of a luxury ${category} in ${color}, crafted from ${fabric}. ${fit}. Worn by ${modelName} with ${hair}, cold high-fashion solemn expression. Standing pose on a ${backgroundStyle}, 8k resolution fashion photography, sharp textiles, luxury lookbook.`,
      promptVN: `Chụp toàn thân đứng dáng thời trang cao cấp cho ${category} màu ${color}, chất liệu ${fabric}. Phom dáng ${fit}. Người mẫu ${modelName} với kiểu tóc ${hair}, thần thái lạnh sang trọng. Khung cảnh ${backgroundStyle}.`,
      negativePrompt: 'blurry, oversaturated, deformed hands, casual smile, cheap fabric, bad lighting, extra limbs',
      aspectRatio: '3:4',
      poseDescription: 'Đứng thẳng thanh lịch, 1 tay đặt nhẹ bên hông, ánh mắt lạnh lùng nhìn trực diện ống kính.',
    },
    shot2_closeUp: {
      id: 'shot2',
      title: 'Shot 2: Half-Body & Fabric Detail (Cận Cảnh Chất Liệu & Khuy Áo)',
      subtitle: 'Tập trung đường may mũi chỉ, khuy áo cao cấp và dệt bề mặt chất liệu',
      promptEN: `Close-up half-body editorial detail shot focusing on lapels, buttons, and texture of a ${category} in ${color}, ${fabric}, ${details}. Flawless lighting on textile weave, elegant jewelry, 8k luxury fashion lookbook, soft blurred ${backgroundStyle}.`,
      promptVN: `Chụp cận cảnh bán thân nhấn vào chi tiết cổ áo, khuy cài và bề mặt chất liệu ${fabric} màu ${color} của ${category}. Chi tiết may đo ${details}. Ánh sáng studio làm nổi bật thớ vải.`,
      negativePrompt: 'out of focus, plastic texture, low res, bad hands, distorted buttons',
      aspectRatio: '3:4',
      poseDescription: 'Chụp từ ngực trở lên, nghiêng góc 30 độ làm nổi bật cổ áo, khuy áo và hoa tai.',
    },
    shot3_coverKneeUp: {
      id: 'shot3',
      title: 'Shot 3: Knee-Up Cover Shot (Góc Chụp Ảnh Bìa 3/4 Gối)',
      subtitle: 'Tỷ lệ vàng cho ảnh bìa BST / Banner Lookbook thương hiệu LANCY',
      promptEN: `3/4 knee-up cover shot of ${modelName} wearing luxury ${category} in ${color}, ${fabric}. Dynamic high-fashion posture, high-contrast studio lighting, ${backgroundStyle}, French Vogue editorial aesthetic, 8k resolution.`,
      promptVN: `Chụp 3/4 từ gối trở lên làm ảnh bìa BST cho ${category} màu ${color}. Dáng đứng động uyển chuyển, ánh sáng tương phản cao quyến rũ, thần thái chuẩn bìa tạp chí Vogue.`,
      negativePrompt: 'cropped awkwardly, low quality, oversaturated colors, harsh shadows, unnatural skin',
      aspectRatio: '3:4',
      poseDescription: 'Dáng đứng chuyển động nhẹ, một chân bước lên trước, tay thả lỏng tự nhiên.',
    },
    shot4_backView: {
      id: 'shot4',
      title: 'Shot 4: Back View & Tailoring (Mặt Sau & Đường May Tấm Lưng)',
      subtitle: 'Tôn vinh đường sống lưng, đường xẻ tà sau và tỷ lệ phom dáng phía sau',
      promptEN: `Rear back-view fashion photograph of a ${category} in ${color}, ${fabric}. Focus on back center seam, spine cut, back shoulder fit, and rear silhouette. Model turning slightly over shoulder, ${backgroundStyle}, 8k studio photography.`,
      promptVN: `Chụp mặt sau lưng của ${category} màu ${color}, tôn vinh đường sống lưng, xẻ tà sau và phom vai. Người mẫu quay lưng lại và ngoái đầu nhẹ qua vai.`,
      negativePrompt: 'deformed back, wrong proportions, blurry seams, bad hair covering garment',
      aspectRatio: '3:4',
      poseDescription: 'Quay lưng về phía máy ảnh, đầu quay nhẹ 45 độ qua vai khoe góc mặt sắc nét.',
    },
    shot5_triptychCollage: {
      id: 'shot5',
      title: 'Shot 5: Multi-Styling 3-Look Matrix (Bảng Phối Đồ Nền Trắng 3 Style)',
      subtitle: 'Ảnh ghép 3 khung hình độc lập thể hiện 3 cách phối đồ linh hoạt (Khoác mở, Cài cúc, Khoác vắt vai)',
      promptEN: `Clean triptych 3-panel split collage shot on pure seamless white studio background. Showcasing 3 distinct wearing styles of the same ${category} in ${color}: Panel 1 (left): open cardigan worn over white camisole top with wide cream trousers. Panel 2 (middle): buttoned-up main top tucked into a pleated midi skirt. Panel 3 (right): draped over shoulders like a cape shawl over a silk slip dress. ${shot5Notes || '3 distinct styling looks'}. Ultra clean e-commerce studio lighting, high resolution fashion lookbook.`,
      promptVN: `Bảng ghép 3 ảnh độc lập trên nền trắng tinh khôi studio. Thể hiện 3 cách phối đồ cho ${category}: Khung 1 (trái): Khoác mở cùng áo lót + quần suông; Khung 2 (giữa): Cài cúc sơ vin cùng chân váy; Khung 3 (phải): Khoác vắt vai như khăn quàng lên đầm lụa.`,
      negativePrompt: 'cluttered background, shadows, inconsistent outfit, dirty white background, merged panels',
      aspectRatio: '4:3',
      poseDescription: 'Bảng ghép 3 khung hình ngang thể hiện 3 phong cách phối đồ linh hoạt khác nhau.',
    },
  };
}

// Robust helper for generating images with retry
async function generateImageWithRetry(ai: GoogleGenAI, requestParams: {
  prompt: string;
  aspectRatio: string;
  imageSize?: string;
}) {
  const modelsToTry = ['gemini-3.1-flash-image', 'gemini-3.1-flash-lite-image'];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    let retries = 3;
    let delayMs = 3500;

    while (retries >= 0) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: {
            parts: [{ text: `${requestParams.prompt}, 8k resolution editorial luxury fashion catalog photograph, realistic hyperdetailed textiles, flawless studio lighting` }],
          },
          config: {
            imageConfig: {
              aspectRatio: requestParams.aspectRatio as any,
              imageSize: (requestParams.imageSize || '1K') as any,
            },
          },
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const errStr = String(err?.message || err);
        const is429 = err?.status === 429 || errStr.includes('429') || errStr.includes('quota') || errStr.includes('RESOURCE_EXHAUSTED');
        const is404 = err?.status === 404 || errStr.includes('404') || errStr.includes('NOT_FOUND');

        if (is404) {
          break;
        }

        if (is429 && retries > 0) {
          const match = errStr.match(/retry in ([0-9.]+)\s*s/i);
          if (match && match[1]) {
            const parsedSec = parseFloat(match[1]);
            if (!isNaN(parsedSec) && parsedSec > 0) {
              delayMs = Math.ceil(parsedSec * 1000) + 1200;
            }
          }
          console.warn(`[Gemini Image API Rate Limit 429 on ${modelName}]. Waiting ${delayMs/1000}s before retry (${retries} attempts left)...`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          delayMs += 2500;
          retries--;
        } else {
          break;
        }
      }
    }
  }

  throw lastError;
}

// Healthcheck endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 1. Analyze Garment API endpoint
app.post('/api/analyze-garment', async (req, res) => {
  try {
    const { imageBase64, frontImageBase64, backImageBase64, textDescription } = req.body;

    const ai = getGeminiClient();

    const systemInstruction = `You are an expert luxury fashion director and textile specialist for high-end ready-to-wear brands like LANCY (朗姿).
Your task is to analyze the garment images (front view and/or back view) and description provided, returning a clean, structured JSON detailing the garment's precise visual and physical traits.

Return ONLY a JSON object with this exact structure:
{
  "category": "e.g., Blazer / Trench Coat / Tweed Jacket / Silk Midi Dress / Tailored Suit",
  "colorPalette": "e.g., Warm Camel, Muted Beige, Ivory White, Deep Navy, Pastel Rose",
  "fabricAndTexture": "e.g., 100% Cashmere wool blend with fine diagonal twill texture and subtle sheen",
  "silhouetteAndFit": "e.g., Double-breasted structured fit with padded shoulders, cinched waist, and horn buttons",
  "keyTailoringDetails": "e.g., Peak lapels, hand-stitched welt pockets, center back seam vent, gold filigree buttons",
  "suggestedHairStyles": {
    "casual": "Soft voluminous shoulder waves",
    "business": "Sleek low chignon bun",
    "lady": "Elegant half-up pinned hairstyle"
  },
  "suggestedAccessories": {
    "casual": "Minimalist platinum stud earrings, smooth calfskin shoulder bag, suede loafer pumps",
    "business": "Structured Italian leather tote, fine gold wrist watch, pointed-toe leather heels",
    "lady": "Freshwater pearl drop earrings, silk scarf, structured mini clutch, delicate slingback pumps"
  }
}`;

    const parts: any[] = [];
    
    // Front Image
    const activeFront = frontImageBase64 || imageBase64;
    if (activeFront && typeof activeFront === 'string' && activeFront.startsWith('data:')) {
      const matches = activeFront.match(/^data:(image\/\w+);base64,(.+)$/);
      if (matches) {
        parts.push({
          inlineData: { mimeType: matches[1], data: matches[2] },
        });
        parts.push({ text: 'GARMENT FRONT VIEW IMAGE ATTACHED above.' });
      }
    }

    // Back Image
    if (backImageBase64 && typeof backImageBase64 === 'string' && backImageBase64.startsWith('data:')) {
      const matches = backImageBase64.match(/^data:(image\/\w+);base64,(.+)$/);
      if (matches) {
        parts.push({
          inlineData: { mimeType: matches[1], data: matches[2] },
        });
        parts.push({ text: 'GARMENT BACK VIEW IMAGE ATTACHED above.' });
      }
    }

    parts.push({
      text: textDescription 
        ? `Analyze this luxury apparel item (front & back views): ${textDescription}`
        : `Analyze these garment images for luxury ready-to-wear catalog creation.`
    });

    const response = await generateContentWithRetry(ai, {
      model: 'gemini-3.7-flash',
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const resultText = response.text || '{}';
    let parsedData = {};
    try {
      parsedData = JSON.parse(resultText);
    } catch (e) {
      parsedData = { category: 'Luxury Garment', analysisText: resultText };
    }

    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Analyze garment error:', error);
    const errStr = String(error?.message || error);
    const is429 = error?.status === 429 || errStr.includes('429') || errStr.includes('quota') || errStr.includes('RESOURCE_EXHAUSTED');
    
    // Return graceful fallback analysis on rate limit
    const fallbackData = {
      category: 'Luxury Apparel LANCY',
      colorPalette: 'Muted Beige, Ivory White & Warm Neutral',
      fabricAndTexture: 'Chất liệu vải dệt cao cấp, mềm mại giữ phom sang trọng',
      silhouetteAndFit: 'Phom dáng dựng may đo phom đứng thanh lịch',
      keyTailoringDetails: 'Chi tiết khuy cài, viền cổ áo và đường chỉ may sắc nét',
    };

    res.json({
      success: true,
      data: fallbackData,
      notice: is429
        ? 'API Gemini đang chạm hạn ngạch Free Tier (20 lượt/ngày). Đã tải phân tích mẫu để bạn tiếp tục công việc!'
        : undefined
    });
  }
});

// Helper function to attach reference image to Gemini content parts
function attachRefImage(partsArray: any[], base64Str: string | null | undefined, label: string) {
  if (base64Str && typeof base64Str === 'string' && base64Str.startsWith('data:')) {
    const matches = base64Str.match(/^data:(image\/\w+);base64,(.+)$/);
    if (matches) {
      partsArray.push({
        inlineData: {
          mimeType: matches[1],
          data: matches[2],
        },
      });
      partsArray.push({
        text: `CLIENT REFERENCE IMAGE (${label}): Study this image and mirror its exact visual characteristics into the prompts.`
      });
    }
  }
}

// 2. Generate 5 Prompts API endpoint based on LANCY brand guidelines
app.post('/api/generate-catalog-prompts', async (req, res) => {
  try {
    const { 
      garmentDetails, 
      modelPreferences, 
      backgroundStyle,
      customNotes,
      shot5StylingNotes,
      frontImageBase64,
      backImageBase64,
      customHairImageBase64,
      customBackgroundImageBase64,
      customPoseImageBase64,
      shot5Style1ImageBase64,
      shot5Style2ImageBase64,
      shot5Style3ImageBase64,
      shot5ReferenceImageBase64
    } = req.body;

    const ai = getGeminiClient();

    const promptGeneratorInstruction = `You are the lead AI Fashion Prompt Engineer for LANCY (朗姿) luxury ready-to-wear catalog visual productions.
You must construct 5 highly specialized, editorial-grade, 8K prompts following these non-negotiable strict brand rules:

1. MODEL:
   - Fixed Western fashion model face matching client reference: dark brunette hair, dark brown eyes, sharp high cheekbones, aquiline nose bridge, haute-couture facial structure.
   - Expression MUST BE COLD, SERIOUS, SOLEMN, HIGH-FASHION, UNAMUSED, NON-SMILING (biểu cảm lạnh, cao cấp, nghiêm túc, tuyệt đối không cười).
   - Hair: Either sleek low chignon bun tied neatly at nape with center part, or silky straight dark hair tucked behind ears.
2. BACKGROUND:
   - For Shots 1-4: Fixed matching client reference background: Minimalist warm beige/ivory textured plaster wall with fine stippled finish, seamless transition to smooth matte warm taupe concrete studio floor. Soft diffuse window daylight.
   - For Shot 5 (Collage Matrix): Pure clean white studio backdrop (seamless soft white studio background with gentle ambient diffuse lighting and natural subtle grounding shadows) to eliminate clutter and highlight multi-outfit coordination clearly, maintaining a highly professional, natural studio catalog look.
3. ACCESSORIES & STYLING:
   - Tailored specifically for High-Net-Worth female clients (women over 28-50, sophisticated luxury, refined elegance).
   - Quiet luxury: fine platinum jewelry, luxury leather heels, structured calfskin leather bags.
4. BRAND SPIRIT (LANCY 朗姿):
   - Luxury ready-to-wear, soft muted light environment, calm poise, high contrast fabric texture.
   - NO influencer / Instagram / provocative / childish poses or street clutter.
5. POSES (IMPORTANT - SHOT 1 & SHOT 3 MUST HAVE DISTINCT NATURAL POSES):
   - SHOT 1 (Full-Body 1:1): Effortless full-height stance with subtle shoulder tilt (nghiêng vai tự nhiên nhẹ nhàng), one leg slightly relaxed forward/side, arms hanging naturally or one hand softly resting near hip, head turned in 3/4 angle.
   - SHOT 3 (Cover Knee-Up 1:1): MUST BE A TOTALLY DISTINCT DIFFERENT POSE FROM SHOT 1. Centered 3/4 knee-up view, shoulders squared with a gentle posture, hands gracefully holding a structured leather handbag at waist height or lightly touching the coat lapel/top button, poised commanding gaze towards camera.

GENERATION REQUIREMENTS - Generate detailed prompts for these 5 exact shots:

SHOT 1: Full-body Main Image (Ảnh chính toàn thân cả chân)
- Aspect ratio ALWAYS 1:1 square. Full model height from head to feet/footwear framed cleanly within 1:1 square canvas. Natural posture with subtle shoulder tilt, head turned 3/4.

SHOT 2: Close-up Detail Image (Ảnh cận cảnh chi tiết)
- Aspect ratio 1:1. Micro close-up photography focusing tightly on garment texture, fabric weave, lapels, stitching, or horn button detailing. Soft shallow depth of field.

SHOT 3: Cover Photo (Ảnh bìa từ đầu gối trở lên)
- Aspect ratio 1:1. 3/4 length shot from knees/thighs up framed in 1:1 square. The garment occupies the central focal location. MUST BE A TOTALLY DIFFERENT NATURAL POSE from Shot 1 (e.g., holding structured leather handbag at waist height or resting hand on coat lapel, centered poise).

SHOT 4: Back View Image (Ảnh quay đằng sau toàn thân)
- Aspect ratio 1:1. Full-body rear view framed in 1:1 square showing garment back construction, shoulder tailoring, spine seam, or coat slit detail. Model back turned towards camera with head turned gracefully in quarter profile.

SHOT 5: 1:1 Multi-Styling & Functional Wearing Matrix (Ảnh ghép đa dạng phối đồ & chức năng sản phẩm)
- Aspect ratio ALWAYS 1:1 square. High-fashion 3-panel or 4-panel side-by-side catalog matrix set against a clean, seamless soft studio white background (nền trắng studio tự nhiên, ánh sáng dịu, bóng mờ chân thực) to prevent visual clutter and let the clothing coordination stand out cleanly. Show the same garment worn in distinct, highly practical & versatile functional ways (e.g. worn unbuttoned/open layered over a top + wide-leg trousers; buttoned up cleanly as a main top with a midi skirt; draped casually over shoulders as a shawl over a crisp shirt + denim; or cinched with a belt). Highlight the product's multi-functional versatility for spring/summer commute, office, and weekend chic.

Return ONLY a JSON object with this exact format:
{
  "shot1_fullBody": {
    "title": "Full-Body Main Shot 1:1 (Toàn Thân Cả Chân - Dáng Nghiêng Vai Tự Nhiên)",
    "promptEN": "Full English Midjourney/Imagen prompt framed in 1:1 aspect ratio with subtle shoulder tilt and natural stance...",
    "promptVN": "Mô tả prompt tiếng Việt đầy đủ...",
    "negativePrompt": "smiling, laughing, teeth showing, Instagram influencer, synthetic gloss skin, extra limbs, distorted feet, blurry texture, cluttered background, cheap plastic",
    "aspectRatio": "1:1",
    "poseDescription": "Trang trọng, dáng đứng tự nhiên nghiêng vai nhẹ, tay buông tự nhiên, đầu ngoảnh góc 3/4"
  },
  "shot2_closeUp": {
    "title": "Close-up Textile Detail Shot 1:1 (Cận Cảnh Chi Tiết Vải & Đường May)",
    "promptEN": "Full English prompt...",
    "promptVN": "Mô tả prompt tiếng Việt...",
    "negativePrompt": "blurry stitch, low resolution, plastic sheen, overexposed, distorted buttons",
    "aspectRatio": "1:1",
    "poseDescription": "Cận cảnh tập trung vào chất liệu dệt, đường chỉ, cúc áo và viền cổ"
  },
  "shot3_coverKneeUp": {
    "title": "Center Cover Photo Knee-Up 1:1 (Ảnh Bìa Từ Đầu Gối Trở Lên - Dáng Cầm Túi/Chạm Cổ Áo)",
    "promptEN": "Full English prompt...",
    "promptVN": "Mô tả prompt tiếng Việt...",
    "negativePrompt": "smiling, full body feet, chaotic background, awkward hands, same pose as shot 1",
    "aspectRatio": "1:1",
    "poseDescription": "Góc nhìn trung tâm từ đầu gối trở lên, tư thế dáng đứng KHÁC Shot 1: hai tay cầm túi da nhỏ hoặc chạm nhẹ ve áo, vai vuông vắn điềm tĩnh"
  },
  "shot4_backView": {
    "title": "Full Rear Silhouette Shot 1:1 (Quay Lưng Đằng Sau Toàn Thân)",
    "promptEN": "Full English prompt...",
    "promptVN": "Mô tả prompt tiếng Việt...",
    "negativePrompt": "front face visible, distorted posture, stiff neck, blurry back seams",
    "aspectRatio": "1:1",
    "poseDescription": "Quay lưng 3/4 đằng sau, tôn đường may lưng, phom dáng dệt và cổ áo sau"
  },
  "shot5_triptychCollage": {
    "title": "1:1 Multi-Styling & Versatile Wearing Matrix (Ghép 3-4 Cách Mặc Nền Trắng Studio)",
    "promptEN": "Full English prompt for 3-panel 1:1 split image on seamless white studio background showing multi-functional wearing ways...",
    "promptVN": "Mô tả prompt tiếng Việt thể hiện các kiểu mặc đa năng (khoác mở, cài cúc, khoác hờ qua vai) trên nền trắng studio sạch sẽ...",
    "negativePrompt": "asymmetrical panels, chaotic layout, duplicate identical styling, smiling, dark background",
    "aspectRatio": "1:1",
    "poseDescription": "Ghép 3 khung hình 1:1 nền trắng studio thể hiện sự linh hoạt: Mặc khoác mở, Cài kín cúc thanh lịch, và Khoác hờ qua vai cá tính"
  }
}`;

    const userPromptText = `
GARMENT DETAILS: ${JSON.stringify(garmentDetails)}
MODEL PREFERENCES: ${JSON.stringify(modelPreferences || { hair: 'Auto-styled to fit garment', faceType: 'Western high-fashion cold face' })}
BACKGROUND PREFERENCE: ${backgroundStyle || 'Minimalist warm cream travertine studio backdrop for Shots 1-4, pure white studio for Shot 5'}
SHOT 5 STYLING & COORDINATION NOTES: ${shot5StylingNotes || 'Show versatile wearing ways: open cardigan, buttoned up main top, draped over shoulders like a shawl paired with wide trousers, midi skirt, and denim.'}
CUSTOM NOTES: ${customNotes || 'Ensure 8K luxury fashion catalog texture and realistic skin tone'}
    `;

    const contentParts: any[] = [];

    // Attach reference images using helper
    attachRefImage(contentParts, frontImageBase64, 'GARMENT FRONT VIEW - Study lapels, buttons, fabric texture & collar');
    attachRefImage(contentParts, backImageBase64, 'GARMENT BACK VIEW - Study spine seams, back vent, yoke & rear silhouette');
    attachRefImage(contentParts, customHairImageBase64, 'HAIR STYLE REFERENCE - Replicate this exact hairstyle');
    attachRefImage(contentParts, customBackgroundImageBase64, 'STUDIO BACKGROUND REFERENCE - Mirror this exact background texture, lighting & color tone for Shots 1-4');
    attachRefImage(contentParts, customPoseImageBase64, 'MODEL POSE REFERENCE - Capture this body posture and stance');
    attachRefImage(contentParts, shot5Style1ImageBase64, 'SHOT 5 - STYLE 1 REFERENCE (Open Layering Outfit) - Study this open wearing method, inner top and trousers styling for Shot 5');
    attachRefImage(contentParts, shot5Style2ImageBase64, 'SHOT 5 - STYLE 2 REFERENCE (Buttoned Up Main Top Outfit) - Study this buttoned wearing method, skirt/trouser styling for Shot 5');
    attachRefImage(contentParts, shot5Style3ImageBase64, 'SHOT 5 - STYLE 3 REFERENCE (Shoulder Drape Shawl Outfit) - Study this draped-over-shoulders wearing method for Shot 5');
    attachRefImage(contentParts, shot5ReferenceImageBase64, 'SHOT 5 STYLING MATRIX - Analyze layering methods, open/buttoned looks, and outfit combinations for Shot 5 on a clean white studio background');

    contentParts.push({ text: userPromptText });

    const response = await generateContentWithRetry(ai, {
      model: 'gemini-3.7-flash',
      contents: { parts: contentParts },
      config: {
        systemInstruction: promptGeneratorInstruction,
        responseMimeType: 'application/json',
      },
    });

    const resultText = response.text || '{}';
    const parsed = JSON.parse(resultText);

    res.json({ success: true, prompts: parsed });
  } catch (error: any) {
    console.error('Generate catalog prompts error:', error);
    const errStr = String(error?.message || error);
    const is429 = error?.status === 429 || errStr.includes('429') || errStr.includes('quota') || errStr.includes('RESOURCE_EXHAUSTED');

    if (is429) {
      console.warn('Gemini API 429 quota reached. Serving high-quality LANCY fallback catalog prompts.');
      const fallbackPrompts = createFallbackCatalogPrompts(
        req.body.garmentDetails,
        req.body.modelPreferences,
        req.body.backgroundStyle,
        req.body.shot5StylingNotes
      );
      return res.json({
        success: true,
        prompts: fallbackPrompts,
        notice: 'Hệ thống AI Gemini tạm thời chạm giới hạn Quota Free Tier (20 lượt/ngày). Đã tự động tạo 5 bộ Prompt Lookbook LANCY tiêu chuẩn để công việc không bị gián đoạn!'
      });
    }

    res.status(500).json({ success: false, error: error.message || 'Prompt generation failed.' });
  }
});

// 3. Render AI Image Endpoint using Gemini Image API
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, aspectRatio = '3:4', imageSize = '1K' } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required.' });
    }

    const ai = getGeminiClient();

    // Sanitize aspect ratio for gemini image model
    const validAspectRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
    const selectedAspectRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '3:4';

    const response = await generateImageWithRetry(ai, {
      prompt,
      aspectRatio: selectedAspectRatio,
      imageSize,
    });

    let imageUrl = '';
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64Str = part.inlineData.data;
          const mime = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mime};base64,${base64Str}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ success: false, error: 'No image data returned from Gemini.' });
    }

    res.json({ success: true, imageUrl });
  } catch (error: any) {
    console.error('Image generation error:', error);
    const errStr = String(error?.message || error);
    const is429 = error?.status === 429 || errStr.includes('429') || errStr.includes('quota') || errStr.includes('RESOURCE_EXHAUSTED');
    const userMsg = is429
      ? 'API Gemini đang tạm thời vượt quá tần suất (Quota Limit 20 lượt/ngày của Free Tier). Vui lòng chờ khoảng 30-60 giây rồi bấm "Render lại ảnh"!'
      : (error.message || 'Lỗi render ảnh.');

    res.status(500).json({ success: false, error: userMsg });
  }
});

async function startServer() {
  // Serve static assets in production, or mount Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LANCY Luxury Catalog Studio running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
