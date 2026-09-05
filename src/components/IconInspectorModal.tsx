import React, { useState, useEffect } from 'react';
import { X, Download, Copy, Check, ShieldCheck, Layers, ExternalLink } from 'lucide-react';
import { ColorMode, IconItem } from '../types';
import {
  fetchRawSvg,
  getFormattedSvg,
  downloadSingleSvg,
  generateReactJsx,
  copyToClipboard
} from '../utils/svgHelpers';

interface IconInspectorModalProps {
  icon: IconItem | null;
  colorMode: ColorMode;
  onClose: () => void;
}

export const IconInspectorModal: React.FC<IconInspectorModalProps> = ({
  icon,
  colorMode,
  onClose,
}) => {
  const [rawSvg, setRawSvg] = useState<string>('');
  const [previewSize, setPreviewSize] = useState<number>(64);
  const [activeCodeTab, setActiveCodeTab] = useState<'svg' | 'jsx' | 'vue' | 'html'>('svg');
  const [bgMode, setBgMode] = useState<'white' | 'dark' | 'grid'>('white');
  const [isCopied, setIsCopied] = useState(false);

  const iconFileName = icon?.fileName;

  useEffect(() => {
    if (!iconFileName) {
      setRawSvg('');
      return;
    }
    let active = true;
    fetchRawSvg(iconFileName).then(content => {
      if (active) setRawSvg(content);
    });
    return () => {
      active = false;
    };
  }, [iconFileName]);

  if (!icon) return null;

  const formattedSvg = getFormattedSvg(rawSvg, icon.hex, colorMode, previewSize);
  const rawSvgCode = rawSvg || '<!-- Loading authentic canonical SVG... -->';
  const jsxCode = generateReactJsx(icon, rawSvg);
  const vueCode = `<!-- Vue 3 单文件组件引用 -->
<script setup lang="ts">
import { Icon } from './icons/vue';
</script>

<template>
  <Icon name="${icon.slug}" :size="24" />
</template>`;

  const htmlImgCode = `<!-- HTML 直接引用 -->
<img 
  src="/icons/${icon.fileName}" 
  alt="${icon.title} Icon" 
  width="24" 
  height="24" 
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
    const ok = await copyToClipboard(currentCode);
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
              style={{ backgroundColor: `#${icon.hex}` }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 leading-tight">
                  {icon.title}
                </h2>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  {icon.source} v{icon.sourceVersion}
                </span>
                {icon.verified && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    已校验
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
              onClick={() => downloadSingleSvg(icon, colorMode)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
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
              <span className="font-medium text-slate-700">实时矢量渲染预览 (绝对保留官方几何与色彩)</span>
              
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
                dangerouslySetInnerHTML={{ __html: formattedSvg }}
                className="transition-all duration-150 flex items-center justify-center"
              />
            </div>
          </div>

          {/* Provenance & Architecture Info */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              权威源溯源与校验元数据
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">权威来源</span>
                <span className="font-medium text-slate-800">{icon.source}</span>
                <span className="text-[10px] text-slate-500 block">v{icon.sourceVersion}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">官方品牌色</span>
                <span className="font-mono font-medium text-slate-800">#{icon.hex}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">变体 (Variant)</span>
                <span className="font-mono font-medium text-slate-800">{icon.variant || 'default'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">SHA-256 校验哈希</span>
                <span className="font-mono text-[10px] text-slate-700 truncate block" title={icon.sha256}>
                  {icon.sha256 ? `${icon.sha256.slice(0, 10)}...` : '计算中'}
                </span>
              </div>
            </div>

            {/* License & Source URL */}
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs flex flex-wrap items-center justify-between gap-2">
              <div className="text-slate-600 text-[11px]">
                <strong className="text-slate-700">授权许可:</strong> {icon.license || 'Brand Trademark / CC0'}
              </div>
              {icon.sourceUrl && (
                <a
                  href={icon.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1 text-[11px]"
                >
                  <span>官方指南网址</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Alternative Sources if present */}
            {icon.alternativeSources && icon.alternativeSources.length > 0 && (
              <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100 text-xs">
                <div className="flex items-center gap-1.5 font-medium text-emerald-800 mb-1 text-[11px]">
                  <Layers className="w-3 h-3" />
                  <span>已识别的互补备选源 (未生成重名文件):</span>
                </div>
                <div className="space-y-1 text-[11px] text-emerald-700">
                  {icon.alternativeSources.map((alt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="font-mono bg-emerald-100/80 px-1 py-0.2 rounded text-[10px]">{alt.source}</span>
                      <span>ID: {alt.sourceId} (v{alt.sourceVersion})</span>
                      {alt.variants && (
                        <span className="text-emerald-600/90 text-[10px]">
                          [{alt.variants.join(', ')}]
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Code Viewer Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              {/* Code format tabs */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveCodeTab('svg')}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    activeCodeTab === 'svg'
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  权威 Raw SVG 源码
                </button>
                <button
                  onClick={() => setActiveCodeTab('jsx')}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    activeCodeTab === 'jsx'
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  React 组件 (JSX)
                </button>
                <button
                  onClick={() => setActiveCodeTab('vue')}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    activeCodeTab === 'vue'
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Vue 3 引用
                </button>
                <button
                  onClick={() => setActiveCodeTab('html')}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    activeCodeTab === 'html'
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  HTML 引用
                </button>
              </div>

              <button
                id="btn-copy-code-content"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>复制代码</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Block Container */}
            <div className="relative rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-56 border border-slate-800 leading-relaxed select-all">
              <pre>
                <code>{currentCode}</code>
              </pre>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
