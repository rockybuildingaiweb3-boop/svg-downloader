import React, { useState } from 'react';
import { Download, Copy, Check, Code, Maximize2, ShieldCheck, Layers } from 'lucide-react';
import { ColorMode, IconItem } from '../types';
import {
  fetchRawSvg,
  getFormattedSvg,
  downloadSingleSvg,
  generateReactJsx,
  copyToClipboard
} from '../utils/svgHelpers';

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

  const handleCopySvg = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const raw = await fetchRawSvg(icon.fileName);
    const text = getFormattedSvg(raw, icon.hex, colorMode, 24);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedType('svg');
      setTimeout(() => setCopiedType(null), 1500);
    }
  };

  const handleCopyJsx = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const raw = await fetchRawSvg(icon.fileName);
    const jsx = generateReactJsx(icon, raw);
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

  const sourceBadge = () => {
    if (icon.source === 'devicon') {
      return (
        <span className="text-[9px] px-1.5 py-0.5 rounded font-medium bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-0.5">
          Devicon
        </span>
      );
    }
    if (icon.source === 'official' || icon.source === 'wikimedia') {
      return (
        <span className="text-[9px] px-1.5 py-0.5 rounded font-medium bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-0.5">
          官方
        </span>
      );
    }
    return (
      <span className="text-[9px] px-1.5 py-0.5 rounded font-medium bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-0.5">
        Simple Icons
      </span>
    );
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
          {sourceBadge()}
          {icon.alternativeSources && icon.alternativeSources.length > 0 && (
            <span
              title={`包含 ${icon.alternativeSources.length} 个备选源 (如 ${icon.alternativeSources[0].source})`}
              className="text-[9px] px-1 py-0.2 rounded font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5"
            >
              <Layers className="w-2.5 h-2.5" />
              多源
            </span>
          )}
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
        <div className="transition-transform duration-200 group-hover:scale-110 flex items-center justify-center w-10 h-10">
          <img
            src={`/icons/${icon.fileName}`}
            alt={icon.title}
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      {/* Bottom Info: Title & Filename */}
      <div className="mt-2 text-center">
        <div className="flex items-center justify-center gap-1">
          <h3 className="text-sm font-semibold text-slate-800 truncate" title={icon.title}>
            {icon.title}
          </h3>
          {icon.verified && (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" title="XML与SHA256校验通过" />
          )}
        </div>
        <p className="text-[11px] font-mono text-slate-400 mt-0.5 truncate" title={icon.fileName}>
          {icon.fileName}
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
          title={`下载 ${icon.fileName}`}
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        <button
          id={`btn-inspect-svg-${icon.slug}`}
          onClick={() => onInspect(icon)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-xs transition-colors"
          title="查看代码与规范详情"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
