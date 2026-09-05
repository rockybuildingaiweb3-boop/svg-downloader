import React, { useState, useEffect } from 'react';
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
  Binary
} from 'lucide-react';
import { IconItem } from '../types';
import {
  fetchRawSvg,
  downloadSingleSvg,
  generateReactJsx,
  generateVueSfc,
  copyRawSvg,
  computeClientSha256
} from '../utils/svgHelpers';

interface IconInspectorModalProps {
  icon: IconItem | null;
  onClose: () => void;
  onSelectVariant?: (icon: IconItem, variantKey: string) => void;
}

export const IconInspectorModal: React.FC<IconInspectorModalProps> = ({
  icon,
  onClose,
}) => {
  const [rawSvg, setRawSvg] = useState<string>('');
  const [previewSize, setPreviewSize] = useState<number>(64);
  const [activeCodeTab, setActiveCodeTab] = useState<'svg' | 'jsx' | 'vue' | 'html'>('svg');
  const [bgMode, setBgMode] = useState<'white' | 'dark' | 'grid'>('white');
  const [isCopied, setIsCopied] = useState(false);
  const [liveSha256, setLiveSha256] = useState<string>('');

  const iconFileName = icon?.fileName;

  useEffect(() => {
    if (!iconFileName) {
      setRawSvg('');
      setLiveSha256('');
      return;
    }
    let active = true;
    fetchRawSvg(iconFileName).then(async content => {
      if (active && content) {
        setRawSvg(content);
        const hash = await computeClientSha256(content);
        if (active) setLiveSha256(hash);
      }
    });
    return () => {
      active = false;
    };
  }, [iconFileName]);

  if (!icon) return null;

  const cleanHex = icon.hex ? (icon.hex.startsWith('#') ? icon.hex : `#${icon.hex}`) : '#111827';
  const rawSvgCode = rawSvg || '<!-- Loading authentic canonical SVG... -->';
  const jsxCode = generateReactJsx(icon, rawSvg);
  const vueCode = generateVueSfc(icon, rawSvg);

  const htmlImgCode = `<!-- HTML Direct Embed -->
<img 
  src="/icons/${icon.fileName}" 
  alt="${icon.title} Vector" 
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
      : htmlImgCode;

  const handleCopy = async () => {
    const ok = await copyRawSvg(currentCode);
    if (ok) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div
      id="icon-inspector-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span
              className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
              style={{ backgroundColor: cleanHex }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 leading-tight">
                  {icon.title}
                </h2>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  {icon.source} v{icon.sourceVersion}
                </span>
                {icon.verificationStatus === 'verified' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    官方校验通过
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-slate-500 mt-0.5">
                {icon.fileName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-modal-download-svg"
              onClick={() => downloadSingleSvg(icon)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>下载 {icon.fileName}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="关闭"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Visual Preview Stage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium text-slate-700">原生矢量渲染预览 (100% 原始字节与几何)</span>
              
              {/* Controls: BG mode & Size */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md border border-slate-200">
                  <button
                    onClick={() => setBgMode('white')}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                      bgMode === 'white' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    浅色
                  </button>
                  <button
                    onClick={() => setBgMode('dark')}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                      bgMode === 'dark' ? 'bg-slate-800 text-white shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    深色
                  </button>
                  <button
                    onClick={() => setBgMode('grid')}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                      bgMode === 'grid' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    网格
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {[24, 32, 64, 128].map(size => (
                    <button
                      key={size}
                      onClick={() => setPreviewSize(size)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors ${
                        previewSize === size
                          ? 'border-slate-800 bg-slate-800 text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {size}px
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview Box */}
            <div
              className={`h-48 rounded-xl border flex items-center justify-center transition-colors ${
                bgMode === 'white'
                  ? 'bg-slate-50/70 border-slate-200'
                  : bgMode === 'dark'
                  ? 'bg-slate-900 border-slate-800'
                  : 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:12px_12px] bg-slate-50 border-slate-200'
              }`}
            >
              <div
                style={{ width: `${previewSize}px`, height: `${previewSize}px` }}
                className="transition-all duration-150 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                dangerouslySetInnerHTML={{ __html: rawSvg }}
              />
            </div>
          </div>

          {/* Provenance & Architecture Info */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              权威源溯源与密码学完整性元数据
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">权威来源</span>
                <span className="font-medium text-slate-800">{icon.source}</span>
                <span className="text-[10px] text-slate-500 block">v{icon.sourceVersion}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">官方品牌元数据色</span>
                <span className="font-mono font-medium text-slate-800">{cleanHex}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">当前变体 (Variant)</span>
                <span className="font-mono font-medium text-slate-800">{icon.variant || 'default'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">密码学 SHA-256</span>
                <span className="font-mono text-[10px] text-slate-700 truncate block" title={icon.sha256 || liveSha256}>
                  {(icon.sha256 || liveSha256) ? `${(icon.sha256 || liveSha256).slice(0, 12)}...` : '计算中'}
                </span>
              </div>
            </div>

            {/* Alternative Sources if available */}
            {icon.alternativeSources && icon.alternativeSources.length > 0 && (
              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
                <div className="font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>其他备选来源版本 (Alternative Catalog Candidates):</span>
                </div>
                <div className="space-y-1.5">
                  {icon.alternativeSources.map((alt, idx) => (
                    <div key={idx} className="flex items-center justify-between text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800">{alt.source}</span>
                        <span className="text-2xs text-slate-400 font-mono">id: {alt.sourceId}</span>
                        {alt.license && <span className="text-2xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{alt.license}</span>}
                      </div>
                      {alt.variants && alt.variants.length > 0 && (
                        <span className="text-2xs text-slate-500 font-mono">
                          变体: {alt.variants.join(', ')}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Code Tabs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveCodeTab('svg')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeCodeTab === 'svg'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  原生 SVG
                </button>
                <button
                  onClick={() => setActiveCodeTab('jsx')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeCodeTab === 'jsx'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  React JSX
                </button>
                <button
                  onClick={() => setActiveCodeTab('vue')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeCodeTab === 'vue'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Vue 3 SFC
                </button>
                <button
                  onClick={() => setActiveCodeTab('html')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeCodeTab === 'html'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  HTML Tag
                </button>
              </div>

              <button
                id="btn-copy-inspector-code"
                onClick={handleCopy}
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

            <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto max-h-48">
              <code>{currentCode}</code>
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
};

export default IconInspectorModal;
