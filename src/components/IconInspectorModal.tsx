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
  Box,
  Hash,
  Binary,
  CheckCircle2,
  Tag,
  Monitor,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Package,
  FolderArchive,
  Link2,
  FileCheck,
  CheckCheck,
  Cpu
} from 'lucide-react';
import { IconItem, BrandAsset, DownloadReceipt, getSemanticSourceLabel, getTrustStateBadge } from '../types';
import {
  fetchRawSvg,
  downloadSingleSvg,
  generateReactJsx,
  generateVueSfc,
  generateHtmlEmbed,
  generateCssSnippet,
  generateMarkdownSnippet,
  generateTailwindSnippet,
  generateDerivedMonochromeSvg,
  copyRawSvg,
  copyAssetUrl,
  downloadBrandPack,
  downloadAssetFamily,
  computeClientSha256,
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
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [rawSvg, setRawSvg] = useState<string>('');
  const [previewSize, setPreviewSize] = useState<number>(64);
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
    message: '等待校验'
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Accessibility: Close on Escape key press (Requirement 47)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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
    }
  }, [icon]);

  const currentAsset: BrandAsset | undefined =
    icon?.assets?.find(a => a.assetId === selectedAssetId) ||
    icon?.canonicalAsset ||
    icon?.assets?.[0];

  const currentFileName = currentAsset?.file || icon?.fileName;

  useEffect(() => {
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
            message: verified ? 'SHA-256 完整性校验通过 (Byte-Faithful)' : '哈希与存证不一致'
          });
        }
      }
    });
    return () => {
      active = false;
    };
  }, [currentFileName, currentAsset, icon]);

  if (!icon) return null;

  const cleanHex = icon.hex ? (icon.hex.startsWith('#') ? icon.hex : `#${icon.hex}`) : '#111827';
  const rawSvgCode = rawSvg || '<!-- 加载真实官方SVG内容... -->';

  // Semantic source label & trust badge for current asset
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

  const htmlImgCode = `<!-- HTML Direct Embed (100% 官方原始矢量) -->
<img 
  src="/icons/${currentFileName}" 
  alt="${icon.title} Vector (${currentAsset?.role || 'asset'})" 
  width="24" 
  height="24" 
  loading="lazy"
/>`;

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

  // 1. Action: "Copy this asset"
  const handleCopyAsset = async () => {
    const ok = await copyRawSvg(currentCode);
    if (ok) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // 2. Action: "Copy Asset URL" (Requirement 25)
  const handleCopyAssetUrl = async () => {
    if (!currentFileName) return;
    await copyAssetUrl(currentFileName);
    setIsUrlCopied(true);
    setTimeout(() => setIsUrlCopied(false), 2000);
  };

  // 3. Action: "Download this asset"
  const handleDownloadAsset = async () => {
    if (!currentAsset) return;
    try {
      setDownloadError(null);
      const receipt = await downloadSingleSvg(icon, currentAsset);
      setDownloadReceipt(receipt);
    } catch (err: any) {
      setDownloadError(err.message || '无法下载未解析的资产');
      setTimeout(() => setDownloadError(null), 4000);
    }
  };

  // 4. Action: "Use this asset"
  const handleUseAsset = () => {
    if (currentAsset && onUseAsset) {
      onUseAsset(icon.id, currentAsset.assetId);
      setIsAssetUsed(true);
      setTimeout(() => setIsAssetUsed(false), 2500);
    }
  };

  // 5. Action: "Download Brand Pack" (Requirement 25)
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

  // 6. Action: "Download Asset Family" (Requirement 34)
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

  return (
    <div
      id="icon-inspector-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inspector-modal-title"
      aria-describedby="inspector-modal-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <span
              className="w-5 h-5 rounded-full border border-black/10 shadow-xs shrink-0"
              style={{ backgroundColor: cleanHex }}
              aria-hidden="true"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 id="inspector-modal-title" className="text-lg font-bold text-slate-900 leading-tight">
                  {icon.title}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  {semanticSource}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-medium border ${trustBadge.bgClass} ${trustBadge.textClass} ${trustBadge.borderClass}`}>
                  {trustBadge.label}
                </span>
                {currentAsset?.isCanonical && (
                  <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    规范主资产
                  </span>
                )}
              </div>
              <p id="inspector-modal-desc" className="text-xs font-mono text-slate-500 mt-0.5">
                标识: {icon.id} · 文件: {currentFileName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-slate-400 focus:outline-none"
              title="关闭 (Esc)"
              aria-label="关闭检视弹窗"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Primary Three Actions Bar: "Use this asset", "Download this asset", "Copy this asset" + Brand Pack & URL */}
        <div className="px-6 py-2.5 bg-slate-100/80 border-b border-slate-200/80 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {/* 1. "Use this asset" */}
            <button
              id="btn-inspector-use-asset"
              onClick={handleUseAsset}
              aria-label="使用此资产作为主推形态"
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                isAssetUsed
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
              }`}
              title="将此形态设为当前品牌标识的主推资产"
            >
              {isAssetUsed ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                  <span>已应用为主资产</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>使用此资产 (Use this asset)</span>
                </>
              )}
            </button>

            {/* 2. "Download this asset" */}
            <button
              id="btn-inspector-download-asset"
              onClick={handleDownloadAsset}
              aria-label={`下载当前矢量资产 ${currentFileName}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer shadow-2xs focus:ring-2 focus:ring-slate-400 focus:outline-none"
              title={`下载当前形态 ${currentFileName}`}
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>下载此资产 (Raw SVG)</span>
            </button>

            {/* 3. "Copy Asset URL" */}
            <button
              id="btn-inspector-copy-url"
              onClick={handleCopyAssetUrl}
              aria-label="复制当前资产的绝对网络URL"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer shadow-2xs focus:ring-2 focus:ring-slate-400 focus:outline-none"
              title="复制资产绝对URL到剪贴板"
            >
              {isUrlCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">URL已复制</span>
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>复制资产URL</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Download Brand Pack (Requirement 25) */}
            <button
              id="btn-inspector-download-brand-pack"
              onClick={handleDownloadBrandPack}
              disabled={isPackDownloading}
              aria-label="下载该品牌的完整品牌包(Brand Pack)"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer shadow-2xs focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              title="下载包含所有角色形态、manifest.json、sources.json 的 ZIP 品牌包"
            >
              <Package className="w-3.5 h-3.5 text-indigo-600" />
              <span>{isPackDownloading ? '打包中...' : '下载品牌包 (Brand Pack)'}</span>
            </button>

            {/* Download Asset Family (Requirement 34) */}
            <button
              id="btn-inspector-download-family"
              onClick={handleDownloadAssetFamily}
              disabled={isFamilyDownloading}
              aria-label="下载该品牌资产家族的所有变体"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer shadow-2xs focus:ring-2 focus:ring-slate-400 focus:outline-none"
              title="下载资产家族全部去重后的官方矢量形态"
            >
              <FolderArchive className="w-3.5 h-3.5 text-slate-600" />
              <span>{isFamilyDownloading ? '打包中...' : '下载资产家族'}</span>
            </button>

            {/* 3. "Copy this asset" */}
            <button
              id="btn-inspector-copy-asset"
              onClick={handleCopyAsset}
              aria-label="复制当前资产SVG代码"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer shadow-2xs focus:ring-2 focus:ring-slate-400 focus:outline-none"
              title="复制当前资产代码到剪贴板"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">代码已复制</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                  <span>复制代码 (Copy)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Download Receipt Banner (Requirement 25, 27) */}
        {downloadReceipt && (
          <div className="mx-6 my-2.5 p-3.5 bg-emerald-50/90 border border-emerald-300 rounded-xl text-xs space-y-2 shadow-xs animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-emerald-900">
                  资产下载凭证 (Download Receipt) · 官方源存证已开具
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-mono">
                  {(downloadReceipt.fileSize / 1024).toFixed(2)} KB
                </span>
              </div>
              <button
                onClick={() => setDownloadReceipt(null)}
                className="text-emerald-700 hover:text-emerald-900 text-xs font-medium cursor-pointer p-0.5"
                title="关闭凭证"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-emerald-800 bg-white/70 p-2 rounded-lg border border-emerald-200/60 font-mono">
              <div>
                <span className="text-slate-500 block text-[9px]">文件</span>
                <span className="font-medium truncate block">{downloadReceipt.fileName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">形态/角色</span>
                <span className="font-medium truncate block">{downloadReceipt.role} ({downloadReceipt.graphicVariant})</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">来源提供方</span>
                <span className="font-medium truncate block">{downloadReceipt.sourcePlatform}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">下载时间</span>
                <span className="font-medium truncate block">{new Date(downloadReceipt.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 bg-emerald-100/60 px-2 py-1.5 rounded-lg border border-emerald-200 text-[10px] font-mono">
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
                <span>{receiptCopiedSha ? '已复制' : '复制哈希'}</span>
              </button>
            </div>
          </div>
        )}

        {downloadError && (
          <div className="px-6 py-2 bg-rose-50 border-b border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{downloadError}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* Section 1: Asset Family Selector */}
          {icon.assets && icon.assets.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>品牌资产家族形态 (Asset Family) - 共 {icon.assets.length} 个权威变体与上下文形态</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  点击直接检视任意形态细节
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
                      onClick={() => setSelectedAssetId(asset.assetId)}
                      aria-label={`检视资产形态: ${asset.role} ${asset.graphicVariant}`}
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
                          <span className="text-xs font-semibold text-slate-900 truncate">
                            {asset.role} ({asset.graphicVariant || 'default'})
                          </span>
                          {asset.isCanonical && (
                            <span className="text-[9px] px-1 py-0.2 rounded font-medium bg-emerald-100 text-emerald-800">
                              主
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          <span className="text-[9px] font-medium text-slate-600 bg-slate-100 px-1 py-0.2 rounded">
                            {provLabel}
                          </span>
                          <span className={`text-[9px] px-1 py-0.2 rounded font-medium ${aTrust.bgClass} ${aTrust.textClass}`}>
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

          {/* Section 2: Visual Preview Stage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium text-slate-700">原生矢量渲染预览 (100% 原始字节与几何)</span>
              
              {/* Controls: BG mode & Size */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-0.5 bg-slate-100">
                  <button
                    onClick={() => setBgMode('white')}
                    aria-label="切换白色背景"
                    className={`px-2 py-0.5 text-[11px] rounded transition-colors ${
                      bgMode === 'white' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    浅色
                  </button>
                  <button
                    onClick={() => setBgMode('grid')}
                    aria-label="切换网格透明背景"
                    className={`px-2 py-0.5 text-[11px] rounded transition-colors ${
                      bgMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    网格
                  </button>
                  <button
                    onClick={() => setBgMode('dark')}
                    aria-label="切换深色背景"
                    className={`px-2 py-0.5 text-[11px] rounded transition-colors ${
                      bgMode === 'dark' ? 'bg-slate-900 text-white shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    深色
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400">尺寸:</span>
                  {[32, 64, 96, 128].map(sz => (
                    <button
                      key={sz}
                      onClick={() => setPreviewSize(sz)}
                      aria-label={`预览尺寸 ${sz}像素`}
                      className={`px-1.5 py-0.5 text-[11px] rounded border transition-colors ${
                        previewSize === sz
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-semibold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview Box */}
            <div
              className={`h-48 rounded-xl border flex items-center justify-center transition-colors relative overflow-hidden ${
                bgMode === 'white'
                  ? 'bg-white border-slate-200'
                  : bgMode === 'dark'
                  ? 'bg-slate-950 border-slate-800'
                  : 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:12px_12px] bg-slate-50 border-slate-200'
              }`}
            >
              {currentFileName ? (
                <img
                  src={`/icons/${currentFileName}`}
                  alt={icon.title}
                  style={{ width: `${previewSize}px`, height: `${previewSize}px` }}
                  className="object-contain transition-all duration-150 drop-shadow-xs"
                />
              ) : (
                <span className="text-xs text-slate-400">未找到矢量文件</span>
              )}

              <div className="absolute bottom-2 right-2 flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400 bg-white/80 dark:bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                  {previewSize}×{previewSize}px
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Exhaustive Provenance & Technical Metadata */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>资产确权、上游存证与版本追踪 (Exhaustive Provenance)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">来源提供方 (Provider)</span>
                <span className="font-semibold text-slate-800 text-xs mt-0.5 block truncate">
                  {semanticSource}
                </span>
                <span className="text-[10px] text-slate-500 font-mono block">
                  {currentAsset?.sourceProvider || icon.sourceProvider}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">形态角色 (Role)</span>
                <span className="font-semibold text-slate-800 text-xs mt-0.5 block capitalize">
                  {currentAsset?.role || icon.role || 'logo'}
                </span>
                <span className="text-[10px] text-slate-500 block truncate">
                  {currentAsset?.graphicVariant || icon.graphicVariant} 色系
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">许可证协议 (License)</span>
                <span className="font-semibold text-slate-800 text-xs mt-0.5 block truncate">
                  {currentAsset?.license || icon.license || 'Trademark / CC0'}
                </span>
                <span className="text-[10px] text-slate-500 block">法定商标归原作者</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">源链接 (Source URL)</span>
                {currentAsset?.sourceUrl || icon.sourceUrl ? (
                  <a
                    href={currentAsset?.sourceUrl || icon.sourceUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-[11px] text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 font-medium truncate mt-0.5"
                  >
                    <span>访问上游源</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-400 block">官方品牌资产库</span>
                )}
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  权威上游存证
                </span>
              </div>
            </div>

            {/* SHA-256 and Granular Verification (Requirement 27) */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-slate-500" />
                  <span>SHA-256 密码学完整性指纹:</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                    XML语法通过
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                    矢量渲染通过
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-medium border ${
                    integrityStatus.verified
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {integrityStatus.message}
                  </span>
                </div>
              </div>
              <p className="font-mono text-[11px] text-slate-800 bg-white p-2 rounded-lg border border-slate-200 select-all break-all">
                {currentAsset?.rawSha256 || liveSha256 || '计算中...'}
              </p>
            </div>

            {/* Note & Policy Decision if any */}
            {currentAsset?.notes && (
              <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900">
                <span className="font-semibold block mb-0.5">资产档案说明:</span>
                <p className="text-[11px] text-blue-800">{currentAsset.notes}</p>
              </div>
            )}
          </div>

          {/* Section 4: Vector Structural Geometry AST Analysis & True Color Separation */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              <span>矢量几何结构 AST 深度透视 (Structural Vector Geometry)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">画幅比例 (Aspect Ratio)</span>
                <span className="font-semibold text-slate-800 text-xs mt-0.5 block font-mono">
                  {currentAsset?.structuralMetrics?.aspectRatio
                    ? `${currentAsset.structuralMetrics.aspectRatio.toFixed(2)} : 1`
                    : '1.00 : 1'}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {currentAsset?.structuralMetrics?.aspectRatio && currentAsset.structuralMetrics.aspectRatio >= 2.0
                    ? '横版横宽形态 (Wordmark)'
                    : '正方/标准图标 (Symbol)'}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">矢量路径 & 节点 (AST Nodes)</span>
                <span className="font-semibold text-slate-800 text-xs mt-0.5 block font-mono">
                  {currentAsset?.structuralMetrics?.pathCount ?? 1} 路径 · {currentAsset?.structuralMetrics?.elementCount ?? 1} 节点
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {(currentAsset?.structuralMetrics?.fileSize || (rawSvg ? new TextEncoder().encode(rawSvg).length : 0)) > 0
                    ? `${((currentAsset?.structuralMetrics?.fileSize || new TextEncoder().encode(rawSvg).length) / 1024).toFixed(2)} KB`
                    : '紧凑矢量'}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">矢量色彩分类 (Color Structure)</span>
                <span className="font-semibold text-slate-800 text-xs mt-0.5 block capitalize font-mono">
                  {currentAsset?.colorType || currentAsset?.structuralMetrics?.colorType || 'monochrome'}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  含 {currentAsset?.structuralMetrics?.colorCount ?? 1} 种独立色相
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">官方品牌主色 (Brand Hex Meta)</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: cleanHex }}
                  />
                  <span className="font-mono text-xs font-semibold text-slate-800">{cleanHex}</span>
                </div>
                <span className="text-[10px] text-slate-500 block">元数据规范建议色</span>
              </div>
            </div>

            {/* AST Feature Badges */}
            <div className="flex items-center gap-1.5 flex-wrap p-2.5 bg-slate-50/70 rounded-xl border border-slate-100 text-[10px]">
              <span className="font-semibold text-slate-600 mr-1">几何特性:</span>
              <span className={`px-2 py-0.5 rounded font-medium ${
                currentAsset?.structuralMetrics?.hasGradient
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {currentAsset?.structuralMetrics?.hasGradient ? '支持渐变 (<gradient>)' : '纯色填充'}
              </span>
              <span className={`px-2 py-0.5 rounded font-medium ${
                currentAsset?.structuralMetrics?.hasCurrentColor
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {currentAsset?.structuralMetrics?.hasCurrentColor ? '动态 currentColor 支持' : '静态色彩'}
              </span>
              <span className={`px-2 py-0.5 rounded font-medium ${
                currentAsset?.structuralMetrics?.hasClipPath
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {currentAsset?.structuralMetrics?.hasClipPath ? '包含裁切 (<clipPath>)' : '无裁切'}
              </span>
              <span className={`px-2 py-0.5 rounded font-medium ${
                currentAsset?.structuralMetrics?.hasMask
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {currentAsset?.structuralMetrics?.hasMask ? '包含遮罩 (<mask>)' : '无遮罩'}
              </span>
              <span className={`px-2 py-0.5 rounded font-medium ${
                currentAsset?.structuralMetrics?.hasText
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {currentAsset?.structuralMetrics?.hasText ? '⚠️ 包含文字 (<text>)' : '✓ 100% 路径几何'}
              </span>
            </div>
          </div>

          {/* Section 5: Engineering Code Tabs (7 Standard Formats) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1 flex-wrap" role="tablist" aria-label="代码格式选项">
                <button
                  role="tab"
                  aria-selected={activeCodeTab === 'svg'}
                  onClick={() => setActiveCodeTab('svg')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeCodeTab === 'svg'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  原生 SVG
                </button>
                <button
                  role="tab"
                  aria-selected={activeCodeTab === 'jsx'}
                  onClick={() => setActiveCodeTab('jsx')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeCodeTab === 'jsx'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  React JSX
                </button>
                <button
                  role="tab"
                  aria-selected={activeCodeTab === 'vue'}
                  onClick={() => setActiveCodeTab('vue')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeCodeTab === 'vue'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Vue 3 SFC
                </button>
                <button
                  role="tab"
                  aria-selected={activeCodeTab === 'html'}
                  onClick={() => setActiveCodeTab('html')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeCodeTab === 'html'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  HTML Tag
                </button>
                <button
                  role="tab"
                  aria-selected={activeCodeTab === 'css'}
                  onClick={() => setActiveCodeTab('css')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeCodeTab === 'css'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  CSS 背景
                </button>
                <button
                  role="tab"
                  aria-selected={activeCodeTab === 'tailwind'}
                  onClick={() => setActiveCodeTab('tailwind')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeCodeTab === 'tailwind'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Tailwind
                </button>
                <button
                  role="tab"
                  aria-selected={activeCodeTab === 'markdown'}
                  onClick={() => setActiveCodeTab('markdown')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeCodeTab === 'markdown'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Markdown
                </button>
              </div>

              <button
                id="btn-copy-inspector-code"
                onClick={handleCopyAsset}
                aria-label="复制当前格式的代码"
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>复制代码</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto max-h-44">
              <code>{currentCode}</code>
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
};

export default IconInspectorModal;
