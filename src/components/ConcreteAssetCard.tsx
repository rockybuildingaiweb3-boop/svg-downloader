import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Code,
  Maximize2,
  ShieldCheck,
  Layers,
  Heart
} from 'lucide-react';
import { ConcreteAssetItem, DownloadReceipt, IconItem } from '../types';
import { useTranslation } from '../i18n/context';
import {
  fetchRawSvg,
  generateReactJsx,
  copyRawSvg,
  triggerBlobDownload
} from '../utils/svgHelpers';

interface ConcreteAssetCardProps {
  asset: ConcreteAssetItem;
  isSelected: boolean;
  onToggleSelect: (assetId: string) => void;
  onInspect: (icon: IconItem) => void;
  parentIcon?: IconItem;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onDownloadReceipt?: (receipt: DownloadReceipt) => void;
}

export const ConcreteAssetCard: React.FC<ConcreteAssetCardProps> = ({
  asset,
  isSelected,
  onToggleSelect,
  onInspect,
  parentIcon,
  isFavorite = false,
  onToggleFavorite,
  onDownloadReceipt,
}) => {
  const { t } = useTranslation();
  const [copiedType, setCopiedType] = useState<'svg' | 'jsx' | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleCopySvg = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const raw = await fetchRawSvg(asset.file);
    if (!raw) return;
    const ok = await copyRawSvg(raw);
    if (ok) {
      setCopiedType('svg');
      setTimeout(() => setCopiedType(null), 1500);
    }
  };

  const handleCopyJsx = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const raw = await fetchRawSvg(asset.file);
    if (!raw) return;
    const mockItem: any = parentIcon || {
      id: asset.identityId,
      slug: asset.identityId,
      title: asset.identityTitle || asset.identityId,
      fileName: asset.file,
      source: asset.sourceProvider
    };
    const jsx = generateReactJsx(mockItem, raw);
    const ok = await copyRawSvg(jsx);
    if (ok) {
      setCopiedType('jsx');
      setTimeout(() => setCopiedType(null), 1500);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const raw = await fetchRawSvg(asset.file);
      if (!raw) throw new Error(`Could not load ${asset.file}`);
      const blob = new Blob([raw], { type: 'image/svg+xml;charset=utf-8' });
      triggerBlobDownload(blob, asset.file);

      if (onDownloadReceipt) {
        onDownloadReceipt({
          fileName: asset.file,
          identityId: asset.identityId,
          title: asset.identityTitle || asset.identityId,
          fileSize: raw.length,
          sourceProvider: asset.sourceProvider,
          sourcePlatform: asset.sourcePlatform || asset.sourceProvider,
          role: asset.role,
          graphicVariant: asset.graphicVariant,
          rawSha256: asset.rawSha256,
          license: asset.license,
          verificationStatus: asset.verificationStatus,
          timestamp: new Date().toISOString()
        });
      }
    } catch (err: any) {
      setDownloadError(err.message || 'Download failed');
      setTimeout(() => setDownloadError(null), 3000);
    }
  };

  const handleCardClick = () => {
    if (parentIcon) {
      onInspect(parentIcon);
    }
  };

  return (
    <div
      id={`asset-card-${asset.assetId}`}
      role="button"
      tabIndex={0}
      aria-label={`${asset.identityTitle || asset.identityId} - ${asset.file}`}
      onClick={handleCardClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className={`group relative rounded-2xl p-4 border transition-all duration-200 cursor-pointer flex flex-col justify-between focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
        isSelected
          ? 'bg-indigo-50/40 border-indigo-400 ring-1 ring-indigo-400/30 shadow-xs'
          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      {/* Top Header: Select Checkbox & Badges */}
      <div className="flex items-center justify-between w-full mb-2" onClick={e => e.stopPropagation()}>
        <label className="flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(asset.assetId)}
            aria-label={`Select ${asset.file}`}
            className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
        </label>

        <div className="flex items-center gap-1">
          <span className="text-2xs font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 uppercase tracking-wider">
            {asset.role}
          </span>
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(asset.identityId);
              }}
              className={`p-1 rounded-lg text-xs transition-colors cursor-pointer ${
                isFavorite
                  ? 'text-rose-500 hover:text-rose-600 bg-rose-50'
                  : 'text-slate-300 hover:text-rose-500 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-3 h-3 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Center: Vector SVG Preview */}
      <div className="flex items-center justify-center py-4 my-1 min-h-[56px]">
        <div className="transition-transform duration-200 group-hover:scale-110 flex items-center justify-center w-11 h-11">
          <img
            src={`/icons/${asset.file}`}
            alt={`${asset.identityTitle || asset.identityId} - ${asset.file}`}
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
      </div>

      {/* Bottom Info: Title, Filename & Provider */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-1">
          <h3 className="text-xs font-bold text-slate-800 truncate" title={asset.identityTitle || asset.identityId}>
            {asset.identityTitle || asset.identityId}
          </h3>
          {asset.isCanonical && (
            <span className="text-3xs font-bold px-1 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200">
              Canonical
            </span>
          )}
          {asset.verificationStatus === 'verified' && (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" title="Verified Vector" />
          )}
        </div>

        <p className="text-2xs font-mono text-slate-500 truncate" title={asset.file}>
          {asset.file}
        </p>

        {/* Source & Variant Badges */}
        <div className="flex items-center justify-center gap-1 flex-wrap pt-0.5">
          <span className="text-3xs font-medium px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
            {asset.sourcePlatform || asset.sourceProvider}
          </span>
          <span className="text-3xs font-mono px-1 py-0.5 rounded bg-slate-100 text-slate-600">
            {asset.graphicVariant}
          </span>
          {asset.rawSha256 && (
            <span className="text-3xs font-mono px-1 py-0.5 rounded bg-slate-50 text-slate-400 border border-slate-100">
              {asset.rawSha256.substring(0, 6)}
            </span>
          )}
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
          id={`btn-copy-svg-${asset.assetId}`}
          onClick={handleCopySvg}
          aria-label="Copy SVG Code"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 text-xs transition-colors cursor-pointer"
          title="Copy SVG"
        >
          {copiedType === 'svg' ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>

        <button
          id={`btn-copy-jsx-${asset.assetId}`}
          onClick={handleCopyJsx}
          aria-label="Copy React JSX"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 text-xs transition-colors cursor-pointer"
          title="Copy React JSX"
        >
          {copiedType === 'jsx' ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Code className="w-3.5 h-3.5" />
          )}
        </button>

        <button
          id={`btn-download-svg-${asset.assetId}`}
          onClick={handleDownload}
          aria-label="Download SVG"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 text-xs transition-colors cursor-pointer"
          title="Download SVG"
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        {parentIcon && (
          <button
            id={`btn-inspect-svg-${asset.assetId}`}
            onClick={() => onInspect(parentIcon)}
            aria-label="Inspect Asset Family"
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 text-xs transition-colors cursor-pointer"
            title="Inspect Asset Family"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ConcreteAssetCard;
