import React, { useState } from 'react';
import { Download, Copy, Check, Code, Maximize2 } from 'lucide-react';
import { ColorMode, IconItem } from '../types';
import { getFormattedSvg, downloadSingleSvg, generateReactJsx, copyToClipboard } from '../utils/svgHelpers';

interface IconCardProps {
  icon: IconItem;
  isSelected: boolean;
  colorMode: ColorMode;
  onToggleSelect: (slug: string) => void;
  onInspect: (icon: IconItem) => void;
}

export const IconCard: React.FC<IconCardProps> = ({
  icon,
  isSelected,
  colorMode,
  onToggleSelect,
  onInspect,
}) => {
  const [copiedType, setCopiedType] = useState<'svg' | 'jsx' | 'hex' | null>(null);

  const formattedSvg = getFormattedSvg(icon.svg, icon.hex, colorMode, 32);

  const handleCopySvg = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = getFormattedSvg(icon.svg, icon.hex, colorMode, 24);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedType('svg');
      setTimeout(() => setCopiedType(null), 1500);
    }
  };

  const handleCopyJsx = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const jsx = generateReactJsx(icon);
    const ok = await copyToClipboard(jsx);
    if (ok) {
      setCopiedType('jsx');
      setTimeout(() => setCopiedType(null), 1500);
    }
  };

  const handleCopyHex = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await copyToClipboard(`#${icon.hex}`);
    if (ok) {
      setCopiedType('hex');
      setTimeout(() => setCopiedType(null), 1500);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadSingleSvg(icon, colorMode);
  };

  return (
    <div
      id={`icon-card-${icon.slug}`}
      onClick={() => onInspect(icon)}
      className={`group relative rounded-xl p-4 border transition-all duration-150 cursor-pointer flex flex-col justify-between ${
        isSelected
          ? 'bg-blue-50/50 border-blue-400 ring-1 ring-blue-400/40 shadow-xs'
          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      {/* Top Header: Select Checkbox, Source & Hex Tag */}
      <div className="flex items-center justify-between w-full mb-3" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-1.5">
          <label className="flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(icon.slug)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </label>
          <span
            className={`text-[9px] px-1 py-0.2 rounded font-medium ${
              icon.source === 'devicon'
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : icon.source === 'official-archive'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {icon.source === 'devicon' ? 'Devicon' : icon.source === 'official-archive' ? '官方' : 'Simple'}
          </span>
        </div>

        <button
          onClick={handleCopyHex}
          title={`点击复制官方品牌色 #${icon.hex}`}
          className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-1"
        >
          <span
            className="w-2 h-2 rounded-full inline-block border border-black/10"
            style={{ backgroundColor: `#${icon.hex}` }}
          />
          {copiedType === 'hex' ? '已复制' : `#${icon.hex}`}
        </button>
      </div>

      {/* Center: Vector SVG Preview */}
      <div className="flex items-center justify-center py-4 my-1">
        <div
          className="transition-transform duration-200 group-hover:scale-110 flex items-center justify-center w-12 h-12"
          dangerouslySetInnerHTML={{ __html: formattedSvg }}
        />
      </div>

      {/* Bottom Info: Title & Filename */}
      <div className="mt-2 text-center">
        <h3 className="text-sm font-semibold text-slate-800 truncate" title={icon.title}>
          {icon.title}
        </h3>
        <p className="text-[11px] font-mono text-slate-400 mt-0.5 truncate" title={`${icon.slug}.svg`}>
          {icon.slug}.svg
        </p>
      </div>

      {/* Hover Action Bar */}
      <div
        className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-around gap-1 opacity-90 group-hover:opacity-100 transition-opacity"
        onClick={e => e.stopPropagation()}
      >
        <button
          id={`btn-copy-svg-${icon.slug}`}
          onClick={handleCopySvg}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs transition-colors"
          title="复制 SVG 代码"
        >
          {copiedType === 'svg' ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>

        <button
          id={`btn-copy-jsx-${icon.slug}`}
          onClick={handleCopyJsx}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs transition-colors"
          title="复制 React JSX 组件"
        >
          {copiedType === 'jsx' ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Code className="w-3.5 h-3.5" />
          )}
        </button>

        <button
          id={`btn-download-svg-${icon.slug}`}
          onClick={handleDownload}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs transition-colors"
          title={`下载 ${icon.slug}.svg`}
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        <button
          id={`btn-inspect-svg-${icon.slug}`}
          onClick={() => onInspect(icon)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-xs transition-colors"
          title="查看代码与缩放详情"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
