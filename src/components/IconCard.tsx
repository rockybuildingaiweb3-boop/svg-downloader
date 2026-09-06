import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Code,
  Maximize2,
  ShieldCheck,
  Layers,
  AlertTriangle,
  Heart
} from 'lucide-react';
import { IconItem, DownloadReceipt } from '../types';
import { useTranslation } from '../i18n/context';
import {
  fetchRawSvg,
  downloadSingleSvg,
  generateReactJsx,
  copyRawSvg
} from '../utils/svgHelpers';

interface IconCardProps {
  icon: IconItem;
  isSelected: boolean;
  onToggleSelect: (slug: string) => void;
  onInspect: (icon: IconItem) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onDownloadReceipt?: (receipt: DownloadReceipt) => void;
}

export const IconCard: React.FC<IconCardProps> = ({
  icon,
  isSelected,
  onToggleSelect,
  onInspect,
  isFavorite = false,
  onToggleFavorite,
  onDownloadReceipt,
}) => {
  const { t, format } = useTranslation();
  const [copiedType, setCopiedType] = useState<'svg' | 'jsx' | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const isUnresolved = icon.verificationStatus === 'unresolved';
  const totalAssetsCount = icon.totalAssets || icon.assets?.length || 1;
  const sourcesCount = icon.sourcesCount || icon.sourceRecords?.length || 1;

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

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUnresolved) return;
    try {
      const receipt = await downloadSingleSvg(icon);
      setDownloadError(null);
      if (onDownloadReceipt) {
        onDownloadReceipt(receipt);
      }
    } catch (err: any) {
      setDownloadError(err.message || 'Download failed');
      setTimeout(() => setDownloadError(null), 3000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onInspect(icon);
    }
  };

  const assetsAndSourcesText = format(t.card.assetsAndSources, {
    assets: totalAssetsCount,
    sources: sourcesCount,
  });

  return (
    <div
      id={`icon-card-${icon.slug}`}
      role="button"
      tabIndex={0}
      aria-label={`${icon.title} (${assetsAndSourcesText})`}
      onClick={() => onInspect(icon)}
      onKeyDown={handleKeyDown}
      className={`group relative rounded-2xl p-4 border transition-all duration-200 cursor-pointer flex flex-col justify-between focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
        isSelected
          ? 'bg-indigo-50/40 border-indigo-400 ring-1 ring-indigo-400/30 shadow-xs'
          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      {/* Top Header: Select Checkbox & Favorite Toggle */}
      <div className="flex items-center justify-between w-full mb-2" onClick={e => e.stopPropagation()}>
        <label className="flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(icon.slug)}
            disabled={isUnresolved}
            aria-label={`Select ${icon.title}`}
            className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-30"
          />
        </label>

        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(icon.id);
            }}
            title={isFavorite ? t.card.removeFromFavorites : t.card.addToFavorites}
            aria-label={isFavorite ? t.card.removeFromFavorites : t.card.addToFavorites}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              isFavorite
                ? 'text-rose-500 hover:text-rose-600 bg-rose-50'
                : 'text-slate-300 hover:text-rose-500 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      {/* Center: Vector SVG Preview */}
      <div className="flex items-center justify-center py-4 my-1 min-h-[56px]">
        {isUnresolved ? (
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <AlertTriangle className="w-5 h-5 text-amber-500 mb-0.5" />
            <span className="text-2xs font-semibold text-amber-700">{t.card.unresolved}</span>
          </div>
        ) : (
          <div className="transition-transform duration-200 group-hover:scale-110 flex items-center justify-center w-11 h-11">
            <img
              src={`/icons/${icon.fileName}`}
              alt={`${icon.title} logo`}
              width={36}
              height={36}
              className="w-9 h-9 object-contain"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const el = e.currentTarget;
                el.style.display = 'none';
                const parent = el.parentElement;
                if (parent && !parent.querySelector('.err-badge')) {
                  const span = document.createElement('span');
                  span.className = 'err-badge text-2xs text-rose-600 bg-rose-50 px-1 py-0.5 rounded border border-rose-200';
                  span.innerText = 'Error';
                  parent.appendChild(span);
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Bottom Info: Title & Minimalist Badges */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-1">
          <h3 className="text-xs font-bold text-slate-800 truncate" title={icon.title}>
            {icon.title}
          </h3>
          {icon.verificationStatus === 'verified' && (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" title={t.card.verified} />
          )}
        </div>

        {/* Clean Pill: "N assets · M sources" */}
        <div className="flex items-center justify-center">
          <span className="inline-flex items-center gap-1 text-2xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80">
            <Layers className="w-2.5 h-2.5 text-indigo-500" />
            <span>{assetsAndSourcesText}</span>
          </span>
        </div>

        {downloadError && (
          <p className="text-2xs text-rose-600 font-medium animate-pulse">
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
          aria-label={t.card.copySvg}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          title={t.card.copySvg}
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
          aria-label={t.card.copyJsx}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          title={t.card.copyJsx}
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
          aria-label={t.card.downloadSvg}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          title={t.card.downloadSvg}
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        <button
          id={`btn-inspect-svg-${icon.slug}`}
          onClick={() => onInspect(icon)}
          aria-label={t.card.inspectAsset}
          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 text-xs transition-colors cursor-pointer"
          title={t.card.inspectAsset}
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default IconCard;
