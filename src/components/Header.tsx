import React, { useState } from 'react';
import { Download, Terminal, CheckCircle2, AlertTriangle, Layers, ChevronDown, Package, FileCode } from 'lucide-react';

interface HeaderProps {
  activeTab: 'icons' | 'script' | 'comparison';
  setActiveTab: (tab: 'icons' | 'script' | 'comparison') => void;
  totalIcons: number;
  selectedCount: number;
  onDownloadMainstreamZip: () => void;
  onDownloadMainstreamBundle: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  totalIcons,
  onDownloadMainstreamZip,
  onDownloadMainstreamBundle,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Brand &amp; Tech SVG Downloader
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                  Simple + Devicon 双引擎
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                告别 AI 绘制失真图标 · 官方精准矢量 · 支持 SHA-256 溯源与 React/Vue 强类型组件
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
            <button
              id="tab-icons"
              onClick={() => setActiveTab('icons')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'icons'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>图标库 ({totalIcons})</span>
            </button>

            <button
              id="tab-script"
              onClick={() => setActiveTab('script')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'script'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>自动化同步脚本 (CLI)</span>
            </button>

            <button
              id="tab-comparison"
              onClick={() => setActiveTab('comparison')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'comparison'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>为什么不用 AI 生成？</span>
            </button>
          </div>

          {/* Quick Action Export Dropdown */}
          <div className="relative">
            <div className="inline-flex rounded-lg shadow-xs">
              <button
                id="btn-download-all-zip"
                onClick={onDownloadMainstreamBundle}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-l-lg text-white bg-slate-900 hover:bg-slate-800 transition-colors active:scale-[0.98]"
                title="打包下载包含 SVG、manifest.json 与 TS/React/Vue 强类型组件工程包"
              >
                <Package className="w-3.5 h-3.5 text-blue-400" />
                <span>导出工程规范包 ({totalIcons} 图标 + 组件)</span>
              </button>

              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-2 py-2 text-slate-300 bg-slate-900 hover:bg-slate-800 border-l border-slate-700 rounded-r-lg transition-colors"
                title="更多导出选项"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Dropdown Menu */}
            {showExportMenu && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setShowExportMenu(false)}
              >
                <button
                  onClick={onDownloadMainstreamBundle}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-start gap-2.5 transition-colors"
                >
                  <Package className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block">
                      前端工程规范包 (.zip)
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      包含所有 SVG + manifest.json + index.ts + React &amp; Vue 组件
                    </span>
                  </div>
                </button>

                <div className="h-px bg-slate-100 my-1" />

                <button
                  onClick={onDownloadMainstreamZip}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-start gap-2.5 transition-colors"
                >
                  <FileCode className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block">
                      纯 SVG 矢量压缩包 (.zip)
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      仅包含 {totalIcons} 个标准小写命名 SVG 文件
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
