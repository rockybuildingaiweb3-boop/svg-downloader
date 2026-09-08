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
  Heart,
  MoreHorizontal,
  Link2,
  Database
} from 'lucide-react';
import { IconItem, DownloadReceipt } from '../types';
import { ENABLED_SOURCES } from '../data/sourceRegistry';
import { useTranslation } from '../i18n/context';
import {
  fetchRawSvg,
  downloadSingleSvg,
  generateReactJsx,
  copyRawSvg,
  copyAssetUrl
} from '../utils/svgHelpers';
import { getLocalizedCategoryLabel, getLocalizedEntityTypeLabel } from '../utils/localizedLabels';

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
  const [copiedType, setCopiedType] = useState<'svg' | 'jsx' | 'url' | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [imageError, setImageError] = useState<boolean>(false);

  const isUnresolved = icon.verificationStatus === 'unresolved';

  // Strict absence of fallback to 1 (Requirement T0.2): missing data remains null/dash
  const totalAssetsCount = icon.totalAssets || icon.assets?.length;
  const displayAssetsCount = totalAssetsCount !== undefined && totalAssetsCount > 0 ? totalAssetsCount : null;

  const handleCopySvg = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMoreActions(false);
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
    setShowMoreActions(false);
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

  const handleCopyUrl = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMoreActions(false);
    if (isUnresolved) return;
    const ok = await copyAssetUrl(icon.fileName);
    if (ok) {
      setCopiedType('url');
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
      setDownloadError(err.message || t.toasts.downloadFailed);
      setTimeout(() => setDownloadError(null), 3000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onInspect(icon);
    }
  };

  // Authoritative coverage without arithmetic guessing (Requirement T0.1 & T1.11)
  const sourceFound = icon.sourceCoverageFound;
  const sourceChecked = icon.sourceCoverageChecked;
  const hasAuthoritativeCoverage = sourceFound !== undefined && sourceChecked !== undefined && sourceChecked > 0;
  const erroredCount = icon.sourceCoverage
    ? Object.values(icon.sourceCoverage).filter(s => s === 'error' || s === 'timeout').length
    : 0;

  const coverageBadgeText = hasAuthoritativeCoverage
    ? format(t.card.coverageBadge, {
        found: sourceFound,
        total: sourceChecked,
      })
    : (t.card.coverageUnavailable || 'Coverage unavailable');

  // Semantic sparse coverage label (Tier 1)
  let semanticCoverageLabel = '';
  if (hasAuthoritativeCoverage) {
    if (sourceFound === 1) semanticCoverageLabel = t.card.singleSource;
    else if (sourceFound === 2) semanticCoverageLabel = t.card.limitedCoverage;
    else if (sourceFound === 4) semanticCoverageLabel = t.card.strongCoverage;
    else if (sourceFound === 5) semanticCoverageLabel = t.card.fullCoverage;
  }

  // Aspect-ratio-aware SVG preview dimensions (Tier 1)
  const isWordmark = icon.role?.includes('wordmark') || icon.canonicalAsset?.role?.includes('wordmark');
  const isLogo = icon.role === 'logo' || icon.canonicalAsset?.role === 'logo';

  const previewContainerClass = isWordmark
    ? 'max-w-[120px] max-h-[40px] w-auto h-9'
    : isLogo
    ? 'max-w-[140px] max-h-[40px] w-auto h-10'
    : 'max-w-[48px] max-h-[48px] w-11 h-11';

  const entityTypeLabel = getLocalizedEntityTypeLabel(icon.entityType || 'unknown', t);
  const categoryLabel = getLocalizedCategoryLabel(icon.primaryCategory || icon.category || 'uncategorized', t);

  // Localized image alt text without hardcoded "logo" string (Requirement T0.5)
  const localizedAlt = format(t.card.logoAlt, { name: icon.title });

  return (
    <article
      id={`icon-card-${icon.slug}`}
      aria-label={`${icon.title} (${coverageBadgeText})`}
      className={`group relative rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between ${
        isSelected
          ? 'bg-indigo-50/40 border-indigo-400 ring-1 ring-indigo-400/30 shadow-xs'
          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      {/* Top Header: Select Checkbox & Favorite Toggle (Isolated Interactive Controls - T0.3) */}
      <div className="flex items-center justify-between w-full mb-2">
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
            type="button"
            onClick={() => onToggleFavorite(icon.id)}
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

      {/* Main Focusable Interactive Area: SVG Preview & Title for Inspector (Requirement T0.3) */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onInspect(icon)}
        onKeyDown={handleKeyDown}
        aria-label={`${t.card.inspectAsset}: ${icon.title}`}
        className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl p-1 -m-1 transition-colors hover:bg-slate-50/60"
      >
        {/* Center: Responsive Vector SVG Preview */}
        <div className="flex items-center justify-center py-3 my-1 min-h-[56px]">
          {isUnresolved ? (
            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-amber-50 border border-amber-200 text-center">
              <AlertTriangle className="w-5 h-5 text-amber-500 mb-0.5" />
              <span className="text-2xs font-semibold text-amber-700">{t.card.unresolved}</span>
            </div>
          ) : imageError ? (
            <span className="err-badge text-2xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 font-medium">
              {t.card.imageLoadError}
            </span>
          ) : (
            <div className="transition-transform duration-200 group-hover:scale-105 flex items-center justify-center">
              <img
                src={`/icons/${icon.fileName}`}
                alt={localizedAlt}
                className={`${previewContainerClass} object-contain`}
                loading="lazy"
                decoding="async"
                onError={() => setImageError(true)}
              />
            </div>
          )}
        </div>

        {/* Bottom Info: Title, Semantic Line (Entity Type · Category) */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-1">
            <h3 className="text-xs font-bold text-slate-800 truncate" title={icon.title}>
              {icon.title}
            </h3>
            {icon.verificationStatus === 'verified' && (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" title={t.card.verifiedSvg} />
            )}
          </div>

          {/* Semantic Line: Entity Type · Primary Category (Tier 1 - no heavy badge clutter) */}
          <div className="text-3xs text-slate-500 font-medium tracking-wide flex items-center justify-center">
            <span className="text-slate-700 font-semibold">{entityTypeLabel}</span>
            <span className="mx-1 text-slate-300">·</span>
            <span className="text-slate-600">{categoryLabel}</span>
          </div>

          {/* Coverage & Asset Presentation: "4 / 5 providers · 7 assets" + Subtle Visual Matrix Dots */}
          <div className="flex flex-col items-center justify-center gap-0.5 pt-0.5">
            <div className="inline-flex items-center gap-1 text-2xs text-slate-600">
              <Layers className="w-2.5 h-2.5 text-indigo-500 shrink-0" />
              <span className="font-semibold text-slate-700">{coverageBadgeText}</span>
              {displayAssetsCount !== null && (
                <span className="text-slate-500">· {format(t.card.assetCountText, { count: displayAssetsCount })}</span>
              )}
            </div>

            {/* Subtle Visual Matrix Dots (Tier 1) */}
            <div className="flex items-center gap-1 my-0.5" title={coverageBadgeText}>
              {ENABLED_SOURCES.map(source => {
                const hasAsset = (icon.assets && icon.assets.some(a => (a.sourceProvider === 'iconify' ? 'svg-logos' : a.sourceProvider) === source.id)) ||
                  (icon.sourceProvider === 'iconify' ? 'svg-logos' : icon.sourceProvider) === source.id;
                const status = icon.sourceCoverage ? icon.sourceCoverage[source.id] : (hasAsset ? 'available' : undefined);
                const isAvailable = status === 'available';
                const isError = status === 'error' || status === 'timeout';

                return (
                  <span
                    key={source.id}
                    className={`inline-block rounded-full transition-all ${
                      isAvailable
                        ? 'w-1.5 h-1.5 bg-emerald-500'
                        : isError
                        ? 'w-1.5 h-1.5 bg-rose-500'
                        : 'w-1.5 h-1.5 bg-slate-200'
                    }`}
                    title={`${source.name}: ${status || 'unknown'}`}
                  />
                );
              })}
              {semanticCoverageLabel && (
                <span className="text-3xs text-slate-400 ml-1 font-medium">{semanticCoverageLabel}</span>
              )}
            </div>

            {erroredCount > 0 && (
              <span className="inline-flex items-center gap-1 text-3xs font-medium px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                <AlertTriangle className="w-2.5 h-2.5 text-rose-500" />
                <span>{erroredCount === 1 ? t.card.providerErrorSingle : format(t.card.providerErrorMulti, { count: erroredCount })}</span>
              </span>
            )}
          </div>

          {downloadError && (
            <p className="text-2xs text-rose-600 font-medium animate-pulse">
              {downloadError}
            </p>
          )}
        </div>
      </div>

      {/* Action Bar: Primary Inspect & Download + Secondary More Menu (Tier 0 & Tier 1) */}
      <div
        className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-1 relative"
      >
        <div className="flex items-center gap-1 flex-1">
          <button
            type="button"
            id={`btn-inspect-svg-${icon.slug}`}
            onClick={() => onInspect(icon)}
            aria-label={t.card.inspectAsset}
            className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer"
            title={t.card.inspectAsset}
          >
            <Maximize2 className="w-3 h-3" />
            <span className="text-2xs">{t.card.inspectAsset}</span>
          </button>

          <button
            type="button"
            id={`btn-download-svg-${icon.slug}`}
            onClick={handleDownload}
            disabled={isUnresolved}
            aria-label={t.card.downloadCanonical}
            className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title={t.card.downloadCanonical}
          >
            <Download className="w-3 h-3" />
            <span className="text-2xs">{t.card.downloadSvg}</span>
          </button>
        </div>

        {/* Secondary Actions More Menu (Requirement T0.4) */}
        <div className="relative">
          <button
            type="button"
            id={`btn-more-actions-${icon.slug}`}
            onClick={() => setShowMoreActions(prev => !prev)}
            aria-label={t.card.moreActions}
            aria-expanded={showMoreActions}
            aria-haspopup="menu"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title={t.card.moreActions}
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>

          {showMoreActions && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowMoreActions(false)}
              />
              <div
                role="menu"
                aria-orientation="vertical"
                className="absolute right-0 bottom-full mb-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-40 text-xs animate-in fade-in zoom-in-95 duration-100"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleCopySvg}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                >
                  {copiedType === 'svg' ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-400" />
                  )}
                  <span>{t.card.copySvg}</span>
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleCopyJsx}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                >
                  {copiedType === 'jsx' ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Code className="w-3 h-3 text-slate-400" />
                  )}
                  <span>{t.card.copyJsx}</span>
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleCopyUrl}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                >
                  {copiedType === 'url' ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Link2 className="w-3 h-3 text-slate-400" />
                  )}
                  <span>{copiedType === 'url' ? t.card.urlCopied : t.card.copyUrl}</span>
                </button>

                <div className="border-t border-slate-100 my-1" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setShowMoreActions(false);
                    onInspect(icon);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                >
                  <Database className="w-3 h-3 text-indigo-500" />
                  <span>{t.card.viewSources}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default IconCard;

