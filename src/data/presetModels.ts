import { ModelConfig } from '../types';

export const PRESET_MODELS: ModelConfig[] = [
  {
    id: 'model-lancy-ref',
    name: 'LANCY Reference Model (Western High-Fashion Face)',
    faceDescription: 'Gương mặt người mẫu phương Tây cố định: Tóc nâu sẫm (dark brunette), mắt nâu trầm, xương gò má cao, sống mũi thon thẳng kiêu sa, cấu trúc xương góc mặt cực kỳ sắc nét',
    expression: 'Biểu cảm lạnh, đài các, nghiêm túc, không cười, ánh mắt điềm tĩnh kiêu sa chuẩn Haute Couture',
    hairStyle: 'Tóc búi thấp gợn sóng mượt (Sleek Low Chignon Bun at Nape)',
    previewAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'model-lancy-straight',
    name: 'LANCY Reference Model (Straight Dark Hair)',
    faceDescription: 'Gương mặt người mẫu phương Tây cố định với mái tóc đen/nâu sẫm suôn thẳng kẹp sau vành tai, thần thái quý cô sang trọng',
    expression: 'Thần thái lạnh lùng, tĩnh lặng, không cười, góc nhìn nghiêng 3/4 thanh lịch',
    hairStyle: 'Tóc suôn thẳng mượt kẹp sau tai (Sleek Straight Dark Hair Tucked Behind Ears)',
    previewAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop',
  },
];

export const HAIR_STYLE_OPTIONS = [
  { label: 'Tóc Búi Thấp Sleek Low Bun (Như Ảnh Mẫu 1)', value: 'sleek low chignon bun tied neatly at the nape with center part' },
  { label: 'Tóc Suôn Thẳng Mượt Kẹp Sau Tai (Như Ảnh Mẫu 2)', value: 'long silky straight dark brown hair center-parted and tucked behind ears' },
  { label: 'Tóc Sóng Nhẹ Bồng Bềnh Editorial', value: 'soft romantic loose editorial hair waves falling gently around shoulders' },
  { label: 'Tóc Kẹp Nửa Đầu Thanh Nhã Lady', value: 'elegant half-up pinned hairstyle with natural face-framing strands' },
];

export const ACCESSORY_STYLE_OPTIONS = [
  { label: 'Phụ Kiện HNW Elite (Khuyên Bạch Kim, Túi Da Ý, Giày Mũi Nhọn)', value: 'Fine platinum drop earrings, structured smooth Italian calfskin leather tote bag, luxury pointed-toe leather pumps, vintage wrist watch' },
  { label: 'Phụ Kiện Ngọc Trai & Lụa LANCY', value: 'Freshwater baroque pearl earrings, silk neck scarf, structured mini vanity leather bag, delicate satin slingback pumps' },
  { label: 'Phụ Kiện Tối Giản Tiết Chế (Quiet Luxury)', value: 'Subtle brushed gold geometric studs, envelope clutch in warm beige leather, classic suede block-heel pumps' },
];
