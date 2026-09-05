import React, { useState } from 'react';
import {
  Download,
  Terminal,
  ShieldCheck,
  ChevronDown,
  Package,
  Layers,
  Sparkles,
  GitCompare
} from 'lucide-react';

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
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  权威品牌与科技矢量资产库
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  权威源同步架构
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Simple Icons · Devicon · SVG Logos · 官方档案 | 100% 原始字节保真与 SHA-256 密码学溯源
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
              <span>权威矢量目录 ({totalIcons})</span>
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
              <GitCompare className="w-3.5 h-3.5 text-indigo-600" />
              <span>实测对比工具</span>
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
              <span>管道命令 (CLI)</span>
            </button>
          </div>

          {/* Quick Action Export Dropdown */}
          <div className="relative">
            <div className="inline-flex rounded-lg shadow-xs">
              <button
                id="btn-download-all-zip"
                onClick={onDownloadMainstreamBundle}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-l-lg text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
                title="打包下载包含原始 SVG、manifest.json 与 TS/React/Vue 强类型组件的完整工程包"
              >
                <Package className="w-3.5 h-3.5" />
                <span>下载工程级集成包</span>
              </button>

              <button
                id="btn-export-dropdown-toggle"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-2 py-2 text-white bg-slate-900 hover:bg-slate-800 border-l border-slate-700 rounded-r-lg transition-colors cursor-pointer"
                title="更多导出选项"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {showExportMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => {
                      onDownloadMainstreamBundle();
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 flex items-start gap-2.5 text-slate-700"
                  >
                    <Package className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-900 block">工程集成包 (.zip)</span>
                      <span className="text-slate-500 text-2xs block">
                        含原始矢量、manifest.json、TypeScript 注册表及 React/Vue 组件
                      </span>
                    </div>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={() => {
                      onDownloadMainstreamZip();
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 flex items-start gap-2.5 text-slate-700"
                  >
                    <Download className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-900 block">纯原生 SVG 资产包</span>
                      <span className="text-slate-500 text-2xs block">仅打包主流官方未经修改的 raw SVG 文件</span>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
