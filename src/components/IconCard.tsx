import React, { useState } from 'react';
import { Download, Copy, Check, Code, Maximize2, ShieldCheck, Layers, AlertCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { IconItem, getSemanticSourceLabel, getTrustStateBadge } from '../types';
import {
  fetchRawSvg,
  downloadSingleSvg,
  generateReactJsx,
  copyRawSvg,
  AssetNotFoundError
} from '../utils/svgHelpers';

interface IconCardProps {
  icon: IconItem;
  isSelected: boolean;
  onToggleSelect: (slug: string) => void;
  onInspect: (icon: IconItem) => void;
}

export const IconCard: React.FC<IconCardProps> = ({
  icon,
  isSelected,
  onToggleSelect,
  onInspect,
}) => {
  const [copiedType, setCopiedType] = useState<'svg' | 'jsx' | 'hex' | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const cleanHex = icon.hex ? (icon.hex.startsWith('#') ? icon.hex : `#${icon.hex}`) : '#111827';
  const isUnresolved = icon.verificationStatus === 'unresolved';

  // Total assets and sources count
  const totalAssetsCount = icon.totalAssets || icon.assets?.length || 1;
  const sourcesCount = icon.sourcesCount || icon.sourceRecords?.length || 1;

  // Semantically correct source label & separate trust state
  const semanticSourceLabel = getSemanticSourceLabel(icon.sourceProvider || icon.source, icon.sourceCollection);
  const trustBadge = getTrustStateBadge(icon.trustState || 'verified');

  const handleCopySvg = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUnresolved) return;
    const raw = await fetchRawSvg(icon.fileName);
    if (!raw) return;
    const ok = await copyRawSvg(raw);
    if (ok) {
      setCopiedType('svg');
      setTimeout(() => setCopiedType(null), 1500);
    }
  };

  const handleCopyJsx = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUnresolved) return;
    const raw = await fetchRawSvg(icon.fileName);
    if (!raw) return;
    const jsx = generateReactJsx(icon, raw);
    const ok = await copyRawSvg(jsx);
    if (ok) {
      setCopiedType('jsx');
      setTimeout(() => setCopiedType(null), 1500);
    }
  };

  const handleCopyHex = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await copyRawSvg(cleanHex);
    if (ok) {
      setCopiedType('hex');
      setTimeout(() => setCopiedType(null), 1500);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUnresolved) return;
    try {
      await downloadSingleSvg(icon);
      setDownloadError(null);
    } catch (err: any) {
      setDownloadError(err.message || '无法下载未解析的资产');
      setTimeout(() => setDownloadError(null), 3000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onInspect(icon);
    }
  };

  return (
    <div
      id={`icon-card-${icon.slug}`}
      role="button"
      tabIndex={0}
      aria-label={`检视 ${icon.title} 品牌资产家族 (包含 ${totalAssetsCount} 个形态)`}
      onClick={() => onInspect(icon)}
      onKeyDown={handleKeyDown}
      className={`group relative rounded-xl p-3.5 border transition-all duration-150 cursor-pointer flex flex-col justify-between focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
        isSelected
          ? 'bg-blue-50/50 border-blue-400 ring-1 ring-blue-400/40 shadow-xs'
          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      {/* Top Header: Select Checkbox, Source Label & Trust Badge */}
      <div className="flex items-center justify-between w-full mb-2" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-1.5 flex-wrap">
          <label className="flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(icon.slug)}
              disabled={isUnresolved}
              aria-label={`多选 ${icon.title}`}
              className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-40"
            />
          </label>

          {/* Semantic Source Label */}
          <span className="text-[9px] px-1.5 py-0.5 rounded font-medium bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-0.5">
            {semanticSourceLabel}
          </span>

          {/* Separate Trust State Badge */}
          <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium border flex items-center gap-0.5 ${trustBadge.bgClass} ${trustBadge.textClass} ${trustBadge.borderClass}`}>
            {trustBadge.label}
          </span>
        </div>

        {/* Brand Hex Pill */}
        <button
          onClick={handleCopyHex}
          title={`点击复制官方品牌元数据色 ${cleanHex}`}
          aria-label={`复制品牌色值 ${cleanHex}`}
          className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-1 shrink-0 focus:ring-1 focus:ring-slate-400 focus:outline-none"
        >
          <span
            className="w-2 h-2 rounded-full inline-block border border-black/10 shrink-0"
            style={{ backgroundColor: cleanHex }}
            aria-hidden="true"
          />
          <span className="truncate">{copiedType === 'hex' ? '已复制' : cleanHex}</span>
        </button>
      </div>

      {/* Asset Family Summary Badge: e.g. "4 assets · 3 sources" */}
      <div className="flex items-center justify-between gap-1 mb-1">
        <span
          title={`品牌资产家族包含 ${totalAssetsCount} 个形态，来源横跨 ${sourcesCount} 个源平台`}
          className="text-[9px] px-1.5 py-0.5 rounded font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1"
        >
          <Layers className="w-2.5 h-2.5" />
          <span>{totalAssetsCount} 资产 · {sourcesCount} 来源</span>
        </span>

        {/* Granular verification tags */}
        <div className="flex items-center gap-1">
          {icon.xmlValid && (
            <span title="XML结构验证通过" className="text-[8px] px-1 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
              XML
            </span>
          )}
          {icon.integrityVerified && (
            <span title="SHA-256完整性校验通过" className="text-[8px] px-1 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono">
              SHA
            </span>
          )}
        </div>
      </div>

      {/* Center: Vector SVG Preview */}
      <div className="flex items-center justify-center py-3 my-0.5 min-h-[48px]">
        {isUnresolved ? (
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-rose-50 border border-rose-200 text-center">
            <AlertTriangle className="w-5 h-5 text-rose-500 mb-0.5" />
            <span className="text-[10px] font-medium text-rose-700">未解析 (Unresolved)</span>
            <span className="text-[8px] text-rose-500">无官方真实资产</span>
          </div>
        ) : (
          <div className="transition-transform duration-200 group-hover:scale-110 flex items-center justify-center w-10 h-10">
            <img
              src={`/icons/${icon.fileName}`}
              alt={`${icon.title} 标志`}
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const el = e.currentTarget;
                el.style.display = 'none';
                const parent = el.parentElement;
                if (parent && !parent.querySelector('.err-badge')) {
                  const span = document.createElement('span');
                  span.className = 'err-badge text-[9px] text-rose-600 bg-rose-50 px-1 py-0.5 rounded border border-rose-200';
                  span.innerText = '未加载';
                  parent.appendChild(span);
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Role & Context Tags */}
      <div className="flex items-center justify-center gap-1 mb-1.5 flex-wrap">
        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium capitalize">
          {icon.role || 'logo'}
        </span>
        {icon.graphicVariant && icon.graphicVariant !== 'default' && (
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-50 text-slate-500 font-mono">
            {icon.graphicVariant}
          </span>
        )}
        {icon.context && icon.context.length > 0 && icon.context[0] !== 'general' && (
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-50 text-sky-700 font-mono">
            {icon.context[0]}
          </span>
        )}
      </div>

      {/* Bottom Info: Title & Filename */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-1">
          <h3 className="text-xs font-semibold text-slate-800 truncate" title={icon.title}>
            {icon.title}
          </h3>
          {icon.verificationStatus === 'verified' && (
            <ShieldCheck className="w-3 h-3 text-emerald-500 flex-shrink-0" title="XML语法与SHA-256完整性校验通过" />
          )}
          {icon.verificationStatus === 'warning' && (
            <AlertCircle className="w-3 h-3 text-amber-500 flex-shrink-0" title="包含多色或特殊元数据" />
          )}
          {icon.verificationStatus === 'unresolved' && (
            <AlertTriangle className="w-3 h-3 text-rose-500 flex-shrink-0" title="未解析 / 官方源不可用" />
          )}
        </div>
        <p className="text-[10px] font-mono text-slate-400 mt-0.5 truncate" title={icon.fileName}>
          {icon.fileName}
        </p>
        {downloadError && (
          <p className="text-[9px] text-rose-600 font-medium mt-0.5 animate-pulse">
            {downloadError}
          </p>
        )}
      </div>

      {/* Hover Action Bar */}
      <div
        className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-around gap-1 opacity-90 group-hover:opacity-100 transition-opacity"
        onClick={e => e.stopPropagation()}
      >
        <button
          id={`btn-copy-svg-${icon.slug}`}
          onClick={handleCopySvg}
          disabled={isUnresolved}
          aria-label={`复制 ${icon.title} 原始 SVG 代码`}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:ring-1 focus:ring-slate-400 focus:outline-none"
          title={isUnresolved ? '未解析资产不可复制' : '复制原始原生 SVG 代码 (100% 原始字节)'}
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
          disabled={isUnresolved}
          aria-label={`复制 ${icon.title} React JSX 组件`}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:ring-1 focus:ring-slate-400 focus:outline-none"
          title={isUnresolved ? '未解析资产不可生成组件' : '复制 React JSX 组件'}
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
          disabled={isUnresolved}
          aria-label={`下载 ${icon.title} 原始矢量文件`}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:ring-1 focus:ring-slate-400 focus:outline-none"
          title={isUnresolved ? '未找到真实的官方源资产，已禁用下载' : `下载原始 ${icon.fileName}`}
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        <button
          id={`btn-inspect-svg-${icon.slug}`}
          onClick={() => onInspect(icon)}
          aria-label={`打开 ${icon.title} 品牌资产家族档案`}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-xs transition-colors focus:ring-1 focus:ring-slate-400 focus:outline-none"
          title="打开品牌资产家族档案 (Asset Family Inspector)"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default IconCard;
