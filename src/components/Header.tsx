import React from 'react';
import { Sparkles, BookOpen, Download, ShieldCheck, Camera, Layers } from 'lucide-react';

interface HeaderProps {
  onOpenBrandGuide: () => void;
  onExportAllPrompts: () => void;
  hasPrompts: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBrandGuide,
  onExportAllPrompts,
  hasPrompts,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-amber-900/30 text-stone-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center space-x-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-700 via-amber-600 to-amber-400 p-0.5 shadow-lg shadow-amber-950/40">
            <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center">
              <Camera className="w-5 h-5 text-amber-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif tracking-[0.25em] text-xl font-bold text-stone-100 uppercase">
                LANCY
              </span>
              <span className="font-serif tracking-[0.15em] text-xs font-medium text-amber-400/90 border border-amber-500/30 px-2 py-0.5 rounded bg-amber-950/40">
                朗姿 8K STUDIO
              </span>
            </div>
            <p className="text-xs text-stone-400 tracking-wide font-light">
              AI Fashion Catalog Prompt Studio • Luxury Ready-To-Wear
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 text-xs text-stone-400 bg-stone-800/80 px-3 py-1.5 rounded-lg border border-stone-700/60">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Thần Thái Lạnh • Phương Tây • Chân Thật</span>
          </div>

          <button
            onClick={onOpenBrandGuide}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700/80 text-xs font-medium text-amber-200 transition-colors shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Quy Chuẩn LANCY</span>
          </button>

          {hasPrompts && (
            <button
              onClick={onExportAllPrompts}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-semibold text-xs transition-all shadow-md shadow-amber-950/50"
            >
              <Download className="w-4 h-4" />
              <span>Xuất Bộ 5 Prompt (TXT)</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
