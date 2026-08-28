import React from 'react';
import { X, CheckCircle2, AlertCircle, Camera, UserCheck, Sparkles, Layers } from 'lucide-react';

interface BrandGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandGuideModal: React.FC<BrandGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-stone-900 border border-amber-900/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-800 bg-stone-950/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-950/80 border border-amber-800/50 rounded-lg">
              <Camera className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-stone-100">
                Quy Chuẩn Chụp Catalog LANCY (朗姿) 8K AI
              </h2>
              <p className="text-xs text-stone-400">
                Bộ tiêu chuẩn hình ảnh thương hiệu thời trang cao cấp sẵn sàng may (Luxury Ready-To-Wear)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Rule 1: Model Face */}
          <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-medium">
              <UserCheck className="w-4 h-4" />
              <span>1. Người Mẫu Cố Định & Biểu Cảm Thần Thái</span>
            </div>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-stone-300 font-light pl-2">
              <li><strong>Gương mặt:</strong> Cố định gương mặt người mẫu thiên Tây (Western high-fashion face), cấu trúc xương sắc nét.</li>
              <li><strong>Biểu cảm:</strong> Lạnh lùng, đài các, nghiêm túc, không cười (cold, solemn, non-smiling).</li>
              <li><strong>Kiểu tóc:</strong> Tự do linh hoạt thay đổi kiểu tóc (búi mượt, uốn sóng, bob) để phù hợp với từng phom dáng trang phục.</li>
            </ul>
          </div>

          {/* Rule 2: Background */}
          <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-medium">
              <Sparkles className="w-4 h-4" />
              <span>2. Bối Cảnh Background Studio Tự Nhiên, Đồng Nhất</span>
            </div>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-stone-300 font-light pl-2">
              <li><strong>Tinh thần:</strong> Nền xám ấm / kem nhạt travertine tối giản, đổ bóng cửa sổ dịu nhẹ.</li>
              <li><strong>Độ chân thật:</strong> Bề mặt vật liệu tự nhiên (đá mờ, vữa mịn), tuyệt đối không dùng nền nhựa giả AI, không viền neon.</li>
              <li>Thống nhất tinh thần bối cảnh xuyên suốt tất cả 5 góc chụp cho cùng 1 mã hàng.</li>
            </ul>
          </div>

          {/* Rule 3 & 4: Styling & HNW Women */}
          <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-medium">
              <Layers className="w-4 h-4" />
              <span>3. Phối Đồ & Phụ Kiện Cho Khách Hàng Cao Cấp (High-Net-Worth)</span>
            </div>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-stone-300 font-light pl-2">
              <li>Phụ kiện đắt giá tiết chế: Túi xách da bò Ý, giày cao gót mũi nhọn, trang sức bạch kim / ngọc trai thiên nhiên.</li>
              <li>Tổng thể mang tinh thần <strong>Quiet Luxury</strong>: Sang trọng, tiết chế, không phô trương, không kiểu Influencer / Instagram.</li>
            </ul>
          </div>

          {/* Rule 5: 5 Required Shots */}
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-900/40 space-y-3">
            <h3 className="font-serif font-bold text-amber-300">
              5 Góc Chụp Catalog Tiêu Chuẩn Cho Mỗi Sản Phẩm:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-stone-900 rounded-lg border border-stone-800">
                <p className="font-semibold text-amber-200">1. Ảnh Chính Toàn Thân (Full-Body)</p>
                <p className="text-stone-400">Chụp cả người bao gồm cả chân/giày. Dáng đứng vai nghiêng nhẹ tự nhiên.</p>
              </div>
              <div className="p-2.5 bg-stone-900 rounded-lg border border-stone-800">
                <p className="font-semibold text-amber-200">2. Ảnh Cận Cảnh Chi Tiết (Close-up)</p>
                <p className="text-stone-400">Tỉ lệ 1:1. Chụp chất liệu dệt, đường chỉ may đo, cúc áo, viền cổ.</p>
              </div>
              <div className="p-2.5 bg-stone-900 rounded-lg border border-stone-800">
                <p className="font-semibold text-amber-200">3. Ảnh Bìa (Cover Knee-Up)</p>
                <p className="text-stone-400">Từ đầu gối trở lên, trang phục nằm vị trí góc nhìn trung tâm. Pose dáng khác ảnh toàn thân.</p>
              </div>
              <div className="p-2.5 bg-stone-900 rounded-lg border border-stone-800">
                <p className="font-semibold text-amber-200">4. Ảnh Quay Lưng (Back View)</p>
                <p className="text-stone-400">Toàn thân đằng sau, lộ đường xẻ lưng, form vai và kết cấu phía sau.</p>
              </div>
              <div className="p-2.5 bg-stone-900 rounded-lg border border-stone-800 md:col-span-2">
                <p className="font-semibold text-amber-200">5. Ảnh Ghép Biến Tấu Đa Năng 1:1 (Multi-Styling & Functional Matrix)</p>
                <p className="text-stone-400">1 sản phẩm nhưng thể hiện đa dạng các kiểu mặc (khoác mở cúc, cài cúc làm áo chính, khoác hờ qua vai, thắt đai) phối cùng quần suông, chân váy A, quần denim linh hoạt cho công sở, dạo phố và sự kiện.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-950 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-xs transition-colors"
          >
            Đã Hiểu & Áp Dụng
          </button>
        </div>
      </div>
    </div>
  );
};
