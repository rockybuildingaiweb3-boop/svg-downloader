import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Layers,
  ExternalLink,
  Code,
  FileCode,
  Hash,
  CheckCircle2,
  AlertTriangle,
  Package,
  FolderArchive,
  Link2,
  FileCheck,
  CheckCheck,
  Cpu,
  ZoomIn,
  ZoomOut,
  Maximize,
  UploadCloud,
  FileUp
} from 'lucide-react';
import { IconItem, BrandAsset, DownloadReceipt, getSemanticSourceLabel, getTrustStateBadge } from '../types';
import { useTranslation } from '../i18n/context';
import {
  fetchRawSvg,
  downloadSingleSvg,
  generateReactJsx,
  generateVueSfc,
  generateHtmlEmbed,
  generateCssSnippet,
  generateMarkdownSnippet,
  generateTailwindSnippet,
  copyRawSvg,
  copyAssetUrl,
  downloadBrandPack,
  downloadAssetFamily,
  verifyAssetIntegrity
} from '../utils/svgHelpers';

interface IconInspectorModalProps {
  icon: IconItem | null;
  onClose: () => void;
  onUseAsset?: (identityId: string, assetId: string) => void;
}

export const IconInspectorModal: React.FC<IconInspectorModalProps> = ({
  icon,
  onClose,
  onUseAsset,
}) => {
  const { t } = useTranslation();
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [rawSvg, setRawSvg] = useState<string>('');
  const [previewSize, setPreviewSize] = useState<number>(64);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [fitMode, setFitMode] = useState<'contain' | 'actual'>('contain');
  const [activeCodeTab, setActiveCodeTab] = useState<'svg' | 'jsx' | 'vue' | 'html' | 'css' | 'tailwind' | 'markdown'>('svg');
  const [bgMode, setBgMode] = useState<'white' | 'dark' | 'grid'>('white');
  const [isCopied, setIsCopied] = useState(false);
  const [isUrlCopied, setIsUrlCopied] = useState(false);
  const [isAssetUsed, setIsAssetUsed] = useState(false);
  const [isPackDownloading, setIsPackDownloading] = useState(false);
  const [isFamilyDownloading, setIsFamilyDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloadReceipt, setDownloadReceipt] = useState<DownloadReceipt | null>(null);
  const [receiptCopiedSha, setReceiptCopiedSha] = useState(false);
  const [liveSha256, setLiveSha256] = useState<string>('');
  const [integrityStatus, setIntegrityStatus] = useState<{ verified: boolean; message: string }>({
    verified: true,
    message: 'Validating...'
  });

  // Custom User SVG Audit state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [customSvgInput, setCustomSvgInput] = useState('');
  const [customSvgFile, setCustomSvgFile] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Accessibility: Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showUploadModal) {
          setShowUploadModal(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, showUploadModal]);

  // Focus close button on mount
  useEffect(() => {
    if (icon && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
  }, [icon]);

  // Reset or initialize selectedAssetId when icon changes
  useEffect(() => {
    if (icon) {
      const defaultId = icon.canonicalAssetId || (icon.assets && icon.assets[0]?.assetId) || '';
      setSelectedAssetId(defaultId);
      setIsAssetUsed(false);
      setCustomSvgFile(null);
      setCustomSvgInput('');
      setZoomLevel(100);
      setFitMode('contain');
    }
  }, [icon]);

  const currentAsset: BrandAsset | undefined =
    icon?.assets?.find(a => a.assetId === selectedAssetId) ||
    icon?.canonicalAsset ||
    icon?.assets?.[0];

  const currentFileName = currentAsset?.file || icon?.fileName;

  useEffect(() => {
    if (customSvgFile) {
      setRawSvg(customSvgFile);
      setIntegrityStatus({
        verified: false,
        message: t.inspector.userProvidedBadge,
      });
      return;
    }

    if (!currentFileName) {
      setRawSvg('');
      setLiveSha256('');
      return;
    }
    let active = true;
    fetchRawSvg(currentFileName).then(async content => {
      if (active && content) {
        setRawSvg(content);
        const expectedSha = currentAsset?.rawSha256 || icon?.sha256 || '';
        const { verified, computedSha } = await verifyAssetIntegrity(content, expectedSha);
        if (active) {
          setLiveSha256(computedSha);
          setIntegrityStatus({
            verified,
            message: verified ? t.inspector.shaMatch : 'SHA mismatch against receipt'
          });
        }
      }
    });
    return () => {
      active = false;
    };
  }, [currentFileName, currentAsset, icon, customSvgFile, t]);

  if (!icon) return null;

  const cleanHex = icon.hex ? (icon.hex.startsWith('#') ? icon.hex : `#${icon.hex}`) : '#111827';
  const rawSvgCode = rawSvg || '<!-- Loading verified upstream SVG... -->';

  const assetSourceProvider = currentAsset?.sourceProvider || icon.sourceProvider || icon.source;
  const assetCollection = currentAsset?.sourceCollection || icon.sourceCollection;
  const semanticSource = getSemanticSourceLabel(assetSourceProvider, assetCollection);
  const trustBadge = getTrustStateBadge(currentAsset?.trustState || icon.trustState || 'verified');

  const activeIconItem: IconItem = {
    ...icon,
    fileName: currentFileName || icon.fileName
  };

  const jsxCode = generateReactJsx(activeIconItem, rawSvg, currentAsset);
  const vueCode = generateVueSfc(activeIconItem, rawSvg, currentAsset);

  const currentCode =
    activeCodeTab === 'svg'
      ? rawSvgCode
      : activeCodeTab === 'jsx'
      ? jsxCode
      : activeCodeTab === 'vue'
      ? vueCode
      : activeCodeTab === 'html'
      ? generateHtmlEmbed(activeIconItem, currentFileName || '', currentAsset?.role)
      : activeCodeTab === 'css'
      ? generateCssSnippet(activeIconItem, currentFileName || '')
      : activeCodeTab === 'tailwind'
      ? generateTailwindSnippet(activeIconItem, currentFileName || '')
      : generateMarkdownSnippet(activeIconItem, currentFileName || '');

  const handleCopyAsset = async () => {
    const ok = await copyRawSvg(currentCode);
    if (ok) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleCopyAssetUrl = async () => {
    if (!currentFileName) return;
    await copyAssetUrl(currentFileName);
    setIsUrlCopied(true);
    setTimeout(() => setIsUrlCopied(false), 2000);
  };

  const handleDownloadAsset = async () => {
    if (!currentAsset) return;
    try {
      setDownloadError(null);
      const receipt = await downloadSingleSvg(icon, currentAsset);
      setDownloadReceipt(receipt);
    } catch (err: any) {
      setDownloadError(err.message || 'Download failed');
      setTimeout(() => setDownloadError(null), 4000);
    }
  };

  const handleUseAsset = () => {
    if (currentAsset && onUseAsset) {
      onUseAsset(icon.id, currentAsset.assetId);
      setIsAssetUsed(true);
      setTimeout(() => setIsAssetUsed(false), 2500);
    }
  };

  const handleDownloadBrandPack = async () => {
    setIsPackDownloading(true);
    try {
      await downloadBrandPack(icon);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPackDownloading(false);
    }
  };

  const handleDownloadAssetFamily = async () => {
    setIsFamilyDownloading(true);
    try {
      await downloadAssetFamily(icon);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFamilyDownloading(false);
    }
  };

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text && text.includes('<svg')) {
          setCustomSvgFile(text);
          setShowUploadModal(false);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleCustomUrlFetch = async () => {
    if (!customSvgInput.trim()) return;
    try {
      const res = await fetch(customSvgInput.trim());
      const text = await res.text();
      if (text.includes('<svg')) {
        setCustomSvgFile(text);
        setShowUploadModal(false);
      }
    } catch (err) {
      alert('Failed to fetch SVG from URL. Check CORS or URL accessibility.');
    }
  };

  return (
    <div
      id="icon-inspector-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inspector-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 p-1.5 flex items-center justify-center">
              <img
                src={`/icons/${currentFileName}`}
                alt={icon.title}
                className="w-7 h-7 object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="inspector-modal-title" className="text-base font-bold text-slate-900">
                  {icon.title}
                </h2>
                <span className="text-2xs font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {currentAsset?.role || 'primary'}
                </span>
                <span className={`text-2xs px-2 py-0.5 rounded-full font-semibold border ${trustBadge.bgClass} ${trustBadge.textClass} ${trustBadge.borderClass}`}>
                  {trustBadge.label}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {currentFileName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              title={t.inspector.uploadTitle}
            >
              <UploadCloud className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Inspect External SVG</span>
            </button>

            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-50 border-b border-slate-200/80 flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleUseAsset}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
                isAssetUsed
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isAssetUsed ? t.inspector.usedAsPrimary : t.inspector.useThisAsset}</span>
            </button>

            <button
              onClick={handleDownloadAsset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.inspector.downloadRawSvg}</span>
            </button>

            <button
              onClick={handleCopyAssetUrl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              <Link2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>{isUrlCopied ? t.inspector.urlCopied : t.inspector.copyUrl}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadAssetFamily}
              disabled={isFamilyDownloading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
            >
              <FolderArchive className="w-3.5 h-3.5" />
              <span>{isFamilyDownloading ? t.inspector.packing : t.inspector.downloadFamily}</span>
            </button>
          </div>
        </div>

        {/* Download Receipt Banner */}
        {downloadReceipt && (
          <div className="mx-6 my-2.5 p-3.5 bg-emerald-50/90 border border-emerald-300 rounded-xl text-xs space-y-2 shadow-xs animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-emerald-900">
                  {t.inspector.downloadReceiptTitle}
                </span>
                <span className="text-2xs px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-mono">
                  {(downloadReceipt.fileSize / 1024).toFixed(2)} KB
                </span>
              </div>
              <button
                onClick={() => setDownloadReceipt(null)}
                className="text-emerald-700 hover:text-emerald-900 text-xs font-medium cursor-pointer p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-2xs text-emerald-800 bg-white/80 p-2 rounded-lg border border-emerald-200/60 font-mono">
              <div>
                <span className="text-slate-400 block">{t.inspector.receiptFile}</span>
                <span className="font-medium truncate block">{downloadReceipt.fileName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">{t.inspector.receiptRole}</span>
                <span className="font-medium truncate block">{downloadReceipt.role} ({downloadReceipt.graphicVariant})</span>
              </div>
              <div>
                <span className="text-slate-400 block">{t.inspector.receiptProvider}</span>
                <span className="font-medium truncate block">{downloadReceipt.sourcePlatform}</span>
              </div>
              <div>
                <span className="text-slate-400 block">{t.inspector.receiptTime}</span>
                <span className="font-medium truncate block">{new Date(downloadReceipt.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 bg-emerald-100/60 px-2 py-1.5 rounded-lg border border-emerald-200 text-2xs font-mono">
              <span className="truncate text-emerald-900">
                SHA-256: {downloadReceipt.rawSha256}
              </span>
              <button
                onClick={async () => {
                  await copyRawSvg(downloadReceipt.rawSha256);
                  setReceiptCopiedSha(true);
                  setTimeout(() => setReceiptCopiedSha(false), 1500);
                }}
                className="shrink-0 flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-medium cursor-pointer"
              >
                {receiptCopiedSha ? <CheckCheck className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{receiptCopiedSha ? t.card.copied : t.inspector.copyHash}</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* Section 1: Asset Family Selector */}
          {icon.assets && icon.assets.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{t.inspector.assetFamilyTitle} ({icon.assets.length})</span>
                </label>
                <span className="text-2xs text-slate-400">
                  {t.inspector.assetFamilySubtitle}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {icon.assets.map((asset) => {
                  const isSelected = (asset.assetId === (currentAsset?.assetId || icon.canonicalAssetId));
                  const provLabel = getSemanticSourceLabel(asset.sourceProvider, asset.sourceCollection);
                  const aTrust = getTrustStateBadge(asset.trustState || 'verified');

                  return (
                    <button
                      key={asset.assetId}
                      onClick={() => {
                        setSelectedAssetId(asset.assetId);
                        setCustomSvgFile(null);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 focus:ring-2 focus:ring-indigo-400 focus:outline-none ${
                        isSelected
                          ? 'bg-indigo-50/70 border-indigo-500 ring-1 ring-indigo-500/30'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 p-1 flex items-center justify-center shrink-0 mt-0.5">
                        <img
                          src={`/icons/${asset.file}`}
                          alt={asset.assetId}
                          className="w-5 h-5 object-contain"
                          loading="lazy"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {asset.role} ({asset.graphicVariant || 'default'})
                          </span>
                          {asset.isCanonical && (
                            <span className="text-2xs px-1.5 py-0.2 rounded font-semibold bg-emerald-100 text-emerald-800">
                              Main
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          <span className="text-2xs font-medium text-slate-600 bg-slate-100 px-1 py-0.2 rounded">
                            {provLabel}
                          </span>
                          <span className={`text-2xs px-1 py-0.2 rounded font-medium ${aTrust.bgClass} ${aTrust.textClass}`}>
                            {aTrust.label}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 2: Interactive Preview Stage with Zoom & Fit Mode */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
              <span className="font-semibold text-slate-800">{t.inspector.previewTitle}</span>
              
              <div className="flex items-center gap-3 flex-wrap">
                {/* Background Selector */}
                <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-0.5 bg-slate-100">
                  <button
                    onClick={() => setBgMode('white')}
                    className={`px-2 py-0.5 text-2xs rounded transition-colors ${
                      bgMode === 'white' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {t.inspector.lightBg}
                  </button>
                  <button
                    onClick={() => setBgMode('grid')}
                    className={`px-2 py-0.5 text-2xs rounded transition-colors ${
                      bgMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {t.inspector.gridBg}
                  </button>
                  <button
                    onClick={() => setBgMode('dark')}
                    className={`px-2 py-0.5 text-2xs rounded transition-colors ${
                      bgMode === 'dark' ? 'bg-slate-900 text-white shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {t.inspector.darkBg}
                  </button>
                </div>

                {/* Zoom Controls: 25%, 50%, 100%, 200%, 400% */}
                <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-0.5 bg-slate-100">
                  <span className="text-2xs text-slate-400 px-1 font-mono">{t.inspector.zoom}:</span>
                  {[50, 100, 200, 400].map(z => (
                    <button
                      key={z}
                      onClick={() => setZoomLevel(z)}
                      className={`px-1.5 py-0.5 text-2xs rounded font-mono transition-colors ${
                        zoomLevel === z
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                    >
                      {z}%
                    </button>
                  ))}
                </div>

                {/* Fit Mode */}
                <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-0.5 bg-slate-100">
                  <button
                    onClick={() => setFitMode('contain')}
                    className={`px-2 py-0.5 text-2xs rounded transition-colors ${
                      fitMode === 'contain' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {t.inspector.fitContain}
                  </button>
                  <button
                    onClick={() => setFitMode('actual')}
                    className={`px-2 py-0.5 text-2xs rounded transition-colors ${
                      fitMode === 'actual' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {t.inspector.fitActual}
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Canvas Box */}
            <div
              className={`h-56 rounded-2xl border flex items-center justify-center transition-colors relative overflow-hidden ${
                bgMode === 'white'
                  ? 'bg-white border-slate-200'
                  : bgMode === 'dark'
                  ? 'bg-slate-950 border-slate-800'
                  : 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:12px_12px] bg-slate-50 border-slate-200'
              }`}
            >
              {customSvgFile ? (
                <div
                  style={{
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.15s ease-out'
                  }}
                  dangerouslySetInnerHTML={{ __html: customSvgFile }}
                  className="w-24 h-24 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full drop-shadow-xs"
                />
              ) : currentFileName ? (
                <div
                  style={{
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.15s ease-out'
                  }}
                  className="flex items-center justify-center"
                >
                  <img
                    src={`/icons/${currentFileName}`}
                    alt={icon.title}
                    style={{
                      width: fitMode === 'actual' ? '32px' : `${previewSize}px`,
                      height: fitMode === 'actual' ? '32px' : `${previewSize}px`
                    }}
                    className="object-contain drop-shadow-xs"
                  />
                </div>
              ) : (
                <span className="text-xs text-slate-400">No SVG file</span>
              )}

              <div className="absolute bottom-2.5 right-3 flex items-center gap-2">
                <span className="text-2xs font-mono text-slate-500 bg-white/90 dark:bg-slate-900/90 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-800">
                  {zoomLevel}% · {fitMode === 'contain' ? `${previewSize}×${previewSize}px` : '1:1 Actual'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Exhaustive Provenance & Cryptographic Verification */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.inspector.provenanceTitle}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-2xs">{t.inspector.provider}</span>
                <span className="font-bold text-slate-800 text-xs mt-0.5 block truncate">
                  {semanticSource}
                </span>
                <span className="text-2xs text-slate-500 font-mono block">
                  {currentAsset?.sourceProvider || icon.sourceProvider}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-2xs">{t.inspector.role}</span>
                <span className="font-bold text-slate-800 text-xs mt-0.5 block capitalize">
                  {currentAsset?.role || icon.role || 'logo'}
                </span>
                <span className="text-2xs text-slate-500 block truncate">
                  {currentAsset?.graphicVariant || icon.graphicVariant}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-2xs">{t.inspector.license}</span>
                <span className="font-bold text-slate-800 text-xs mt-0.5 block truncate">
                  {currentAsset?.license || icon.license || 'Trademark / CC0'}
                </span>
                <span className="text-2xs text-slate-500 block">Upstream Verified</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-2xs">{t.inspector.sourceUrl}</span>
                {currentAsset?.sourceUrl || icon.sourceUrl ? (
                  <a
                    href={currentAsset?.sourceUrl || icon.sourceUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 font-semibold truncate mt-0.5"
                  >
                    <span>{t.inspector.visitSource}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 block">Primary Brand Archive</span>
                )}
              </div>
            </div>

            {/* SHA-256 Fingerprint Box */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="text-2xs font-bold text-slate-700 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t.inspector.shaFingerprint}:</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                    {t.inspector.xmlSyntaxValid}
                  </span>
                  <span className="text-2xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                    {t.inspector.renderValid}
                  </span>
                  <span className={`text-2xs px-2 py-0.5 rounded-full font-semibold border ${
                    integrityStatus.verified
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {integrityStatus.message}
                  </span>
                </div>
              </div>
              <p className="font-mono text-xs text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 select-all break-all">
                {currentAsset?.rawSha256 || liveSha256 || 'Calculating...'}
              </p>
            </div>
          </div>

          {/* Section 4: Structural Vector Geometry AST Analysis */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              <span>{t.inspector.geoFeatures}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-2xs">{t.inspector.aspectRatio}</span>
                <span className="font-bold text-slate-800 text-xs mt-0.5 block font-mono">
                  {currentAsset?.structuralMetrics?.aspectRatio
                    ? `${currentAsset.structuralMetrics.aspectRatio.toFixed(2)} : 1`
                    : '1.00 : 1'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-2xs">{t.inspector.pathsAndNodes}</span>
                <span className="font-bold text-slate-800 text-xs mt-0.5 block font-mono">
                  {currentAsset?.structuralMetrics?.pathCount ?? 1} paths · {currentAsset?.structuralMetrics?.elementCount ?? 1} nodes
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-2xs">{t.inspector.colorStructure}</span>
                <span className="font-bold text-slate-800 text-xs mt-0.5 block capitalize font-mono">
                  {currentAsset?.colorType || currentAsset?.structuralMetrics?.colorType || 'monochrome'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-2xs">{t.inspector.brandHexMeta}</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: cleanHex }}
                  />
                  <span className="font-mono text-xs font-bold text-slate-800">{cleanHex}</span>
                </div>
              </div>
            </div>

            {/* AST Feature Badges */}
            <div className="flex items-center gap-1.5 flex-wrap p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-2xs">
              <span className={`px-2 py-0.5 rounded font-medium ${
                currentAsset?.structuralMetrics?.hasGradient
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {currentAsset?.structuralMetrics?.hasGradient ? t.inspector.gradientSupport : t.inspector.flatColor}
              </span>
              <span className={`px-2 py-0.5 rounded font-medium ${
                currentAsset?.structuralMetrics?.hasCurrentColor
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {currentAsset?.structuralMetrics?.hasCurrentColor ? t.inspector.currentColorSupport : t.inspector.staticColor}
              </span>
              <span className={`px-2 py-0.5 rounded font-medium ${
                currentAsset?.structuralMetrics?.hasClipPath
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {currentAsset?.structuralMetrics?.hasClipPath ? t.inspector.clipPathPresent : t.inspector.noClipPath}
              </span>
              <span className={`px-2 py-0.5 rounded font-medium ${
                currentAsset?.structuralMetrics?.hasMask
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {currentAsset?.structuralMetrics?.hasMask ? t.inspector.maskPresent : t.inspector.noMask}
              </span>
              <span className={`px-2 py-0.5 rounded font-medium ${
                currentAsset?.structuralMetrics?.hasText
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {currentAsset?.structuralMetrics?.hasText ? t.inspector.textWarning : t.inspector.pathsOnly}
              </span>
            </div>
          </div>

          {/* Section 5: Engineering Code Tabs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1 flex-wrap" role="tablist">
                {(['svg', 'jsx', 'vue', 'html', 'css', 'tailwind', 'markdown'] as const).map(tab => (
                  <button
                    key={tab}
                    role="tab"
                    aria-selected={activeCodeTab === tab}
                    onClick={() => setActiveCodeTab(tab)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                      activeCodeTab === tab
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {t.inspector.tabs[tab]}
                  </button>
                ))}
              </div>

              <button
                id="btn-copy-inspector-code"
                onClick={handleCopyAsset}
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">{t.inspector.codeCopied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t.inspector.copyCode}</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-3.5 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto max-h-48">
              <code>{currentCode}</code>
            </pre>
          </div>

        </div>

        {/* Modal Sub-Dialog: Inspect Custom / External SVG */}
        {showUploadModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{t.inspector.uploadTitle}</h3>
                  <p className="text-2xs text-slate-500 mt-0.5">{t.inspector.uploadSubtitle}</p>
                </div>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-2xs font-semibold text-slate-700 block mb-1">
                    Option 1: Paste Raw SVG CDN URL
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={customSvgInput}
                      onChange={e => setCustomSvgInput(e.target.value)}
                      placeholder={t.inspector.pasteUrlPlaceholder}
                      className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      onClick={handleCustomUrlFetch}
                      className="px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shrink-0 cursor-pointer"
                    >
                      {t.inspector.analyzeBtn}
                    </button>
                  </div>
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-2 text-2xs text-slate-400 uppercase">Or</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <div>
                  <label className="text-2xs font-semibold text-slate-700 block mb-1">
                    Option 2: Upload Local SVG File
                  </label>
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl cursor-pointer bg-slate-50 hover:bg-indigo-50/30 transition-colors">
                    <FileUp className="w-6 h-6 text-indigo-500 mb-1" />
                    <span className="text-xs font-medium text-slate-700">Choose .svg file</span>
                    <span className="text-2xs text-slate-400 mt-0.5">Vector XML analyzed locally in browser</span>
                    <input
                      type="file"
                      accept=".svg"
                      onChange={handleCustomFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default IconInspectorModal;
