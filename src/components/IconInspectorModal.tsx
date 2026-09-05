import React, { useState } from 'react';
import { X, Download, Copy, Check } from 'lucide-react';
import { ColorMode, IconItem } from '../types';
import { getFormattedSvg, downloadSingleSvg, generateReactJsx, copyToClipboard } from '../utils/svgHelpers';

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
  if (!icon) return null;

  const [previewSize, setPreviewSize] = useState<number>(64);
  const [activeCodeTab, setActiveCodeTab] = useState<'svg' | 'jsx' | 'vue' | 'html'>('svg');
  const [bgMode, setBgMode] = useState<'white' | 'dark' | 'grid'>('white');
  const [isCopied, setIsCopied] = useState(false);

  const formattedSvg = getFormattedSvg(icon.svg, icon.hex, colorMode, previewSize);
  const rawSvgCode = getFormattedSvg(icon.svg, icon.hex, colorMode, 24);
  const jsxCode = generateReactJsx(icon);
  const vueCode = `<!-- Vue 3 单文件组件引用 -->
<script setup lang="ts">
import { Icon } from './icons/vue';
</script>

<template>
  <Icon name="${icon.slug}" :size="24" />
</template>`;

  const htmlImgCode = `<!-- HTML 直接引用 -->
<img 
  src="/icons/${icon.slug}.svg" 
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
                <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  {icon.source === 'devicon' ? 'Devicon 技术源' : icon.source === 'official-archive' ? '官方特例源' : 'Simple Icons 品牌源'}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-500 mt-0.5">
                {icon.slug}.svg
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
              <span>下载 {icon.slug}.svg</span>
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
              <span className="font-medium text-slate-700">实时矢量渲染预览</span>
              
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
                className="transition-all duration-150"
              />
            </div>
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
                  SVG 源码
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

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[11px]">标准文件名</span>
              <span className="font-mono font-medium text-slate-700">{icon.slug}.svg</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[11px]">官方品牌色</span>
              <span className="font-mono font-medium text-slate-700">#{icon.hex}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[11px]">归属数据源</span>
              <span className="font-mono font-medium text-slate-700">{icon.source || 'simple-icons'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[11px]">矢量规范标准</span>
              <span className="font-medium text-emerald-700 flex items-center gap-1">
                <Check className="w-3 h-3" />
                100% 官方指南
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
