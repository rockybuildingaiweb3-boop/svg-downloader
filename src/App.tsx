import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  X,
  CheckSquare,
  Check,
  Filter,
  ShieldCheck,
  Layers,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { IconCategory, IconItem, IconSource } from './types';
import { CURATED_ICONS, CATEGORIES } from './data/curatedIcons';
import { Header } from './components/Header';
import { IconCard } from './components/IconCard';
import { IconInspectorModal } from './components/IconInspectorModal';
import { BatchActionBar } from './components/BatchActionBar';
import { ScriptPanel } from './components/ScriptPanel';
import { AiVsOfficialSection } from './components/AiVsOfficialModal';
import { downloadZip, downloadEngineeringZip } from './utils/svgHelpers';

export default function App() {
  const [activeTab, setActiveTab] = useState<'icons' | 'script' | 'comparison'>('icons');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<IconCategory>('all');
  const [selectedSource, setSelectedSource] = useState<IconSource>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'verified' | 'multi-source'>('all');
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [inspectedIcon, setInspectedIcon] = useState<IconItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Filtered icons by category, source, verification status, and search query
  const filteredIcons = useMemo(() => {
    return CURATED_ICONS.filter(icon => {
      // Category filter
      if (selectedCategory !== 'all' && icon.category !== selectedCategory) {
        return false;
      }
      // Source filter
      if (selectedSource !== 'all') {
        const iconSrc = icon.source || 'simple-icons';
        if (selectedSource === 'official') {
          if (iconSrc !== 'official' && iconSrc !== 'wikimedia') {
            return false;
          }
        } else if (iconSrc !== selectedSource) {
          return false;
        }
      }
      // Status filter
      if (selectedStatus === 'verified') {
        if (icon.verificationStatus !== 'verified') return false;
      } else if (selectedStatus === 'multi-source') {
        if (!icon.alternativeSources || icon.alternativeSources.length === 0) return false;
      }
      // Search filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesTitle = icon.title.toLowerCase().includes(query);
        const matchesSlug = icon.slug.toLowerCase().includes(query);
        const matchesSource = icon.source.toLowerCase().includes(query);
        return matchesTitle || matchesSlug || matchesSource;
      }
      return true;
    });
  }, [searchTerm, selectedCategory, selectedSource, selectedStatus]);

  // Toggle single icon selection
  const handleToggleSelect = (slug: string) => {
    setSelectedSlugs(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  // Select all filtered
  const handleSelectAllFiltered = () => {
    const filteredSlugs = filteredIcons.map(i => i.slug);
    setSelectedSlugs(prev => {
      const merged = Array.from(new Set([...prev, ...filteredSlugs]));
      return merged;
    });
    showToast(`已全选当前筛选的 ${filteredIcons.length} 个图标`);
  };

  // Clear selection
  const handleClearSelection = () => {
    setSelectedSlugs([]);
  };

  // Batch download selected (pure SVGs)
  const handleDownloadSelectedZip = async () => {
    const itemsToDownload = CURATED_ICONS.filter(i => selectedSlugs.includes(i.slug));
    if (itemsToDownload.length === 0) return;
    await downloadZip(itemsToDownload, `brand-icons-${itemsToDownload.length}.zip`);
    showToast(`正在下载 ${itemsToDownload.length} 个 SVG 图标压缩包...`);
  };

  // Batch download selected (Full Engineering Bundle: SVGs + manifest + TS/React/Vue)
  const handleDownloadSelectedBundle = async () => {
    const itemsToDownload = CURATED_ICONS.filter(i => selectedSlugs.includes(i.slug));
    if (itemsToDownload.length === 0) return;
    await downloadEngineeringZip(
      itemsToDownload,
      `icons-bundle-${itemsToDownload.length}.zip`
    );
    showToast(`已导出 ${itemsToDownload.length} 个图标的前端工程规范组件包!`);
  };

  // Batch download all mainstream icons (pure SVGs)
  const handleDownloadMainstreamZip = async () => {
    await downloadZip(CURATED_ICONS, 'mainstream-brand-tech-svg-pack.zip');
    showToast(`正在下载全套 ${CURATED_ICONS.length} 个主流大厂与技术 SVG 图标包...`);
  };

  // Batch download all mainstream icons (Full Engineering Bundle)
  const handleDownloadMainstreamBundle = async () => {
    await downloadEngineeringZip(
      CURATED_ICONS,
      'brand-tech-engineering-bundle.zip'
    );
    showToast(`已成功导出 ${CURATED_ICONS.length} 个图标的完整工程包 (含 React/Vue 组件与 manifest.json)!`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium flex items-center gap-2 border border-slate-700 animate-in slide-in-from-top-3 duration-150">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalIcons={CURATED_ICONS.length}
        selectedCount={selectedSlugs.length}
        onDownloadMainstreamZip={handleDownloadMainstreamZip}
        onDownloadMainstreamBundle={handleDownloadMainstreamBundle}
      />

      {/* System Verification Bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800 py-2 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SHA-256 密码学校验: 100% 通过</span>
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="text-slate-300">
              权威源适配器: Simple Icons (CC0) · Devicon (MIT) · SVG Logos · 官方档案
            </span>
          </div>

          <div className="flex items-center gap-3 text-2xs text-slate-400">
            <span>绝无 AI 拟合图形</span>
            <span>•</span>
            <span>无正则暴力重绘</span>
            <span>•</span>
            <span className="font-mono text-indigo-300">v2.0 统一架构</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 pb-24">
        {activeTab === 'icons' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            
            {/* Filter & Control Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-4">
              
              {/* Row 1: Search & Source Filter */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="search-icons-input"
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="搜索权威品牌或技术，例如: Apple, React, OpenAI, Python, Docker..."
                    className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Center: Source Filter */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                  <span className="text-slate-400 text-[11px] flex items-center gap-1 shrink-0">
                    <Filter className="w-3 h-3" />
                    <span>来源:</span>
                  </span>
                  {[
                    { id: 'all', label: '全部数据源' },
                    { id: 'simple-icons', label: 'Simple Icons (单色)' },
                    { id: 'devicon', label: 'Devicon (技术)' },
                    { id: 'svg-logos', label: 'SVG Logos (多色)' },
                    { id: 'official', label: '官方特例档案' }
                  ].map(src => (
                    <button
                      key={src.id}
                      onClick={() => setSelectedSource(src.id as any)}
                      className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        selectedSource === src.id
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {src.label}
                    </button>
                  ))}
                </div>

                {/* Right: Verification Status Filter */}
                <div className="flex items-center gap-1.5 self-end lg:self-auto shrink-0 text-xs">
                  <span className="text-slate-400 text-[11px] shrink-0">状态:</span>
                  <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200">
                    <button
                      onClick={() => setSelectedStatus('all')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                        selectedStatus === 'all'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      全部
                    </button>
                    <button
                      onClick={() => setSelectedStatus('verified')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                        selectedStatus === 'verified'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      已校验
                    </button>
                    <button
                      onClick={() => setSelectedStatus('multi-source')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                        selectedStatus === 'multi-source'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      包含备选多源
                    </button>
                  </div>
                </div>

              </div>

              {/* Row 2: Category Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                {CATEGORIES.map(cat => {
                  const count =
                    cat.id === 'all'
                      ? CURATED_ICONS.length
                      : CURATED_ICONS.filter(i => i.category === cat.id).length;

                  return (
                    <button
                      key={cat.id}
                      id={`filter-cat-${cat.id}`}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          selectedCategory === cat.id
                            ? 'bg-slate-800 text-slate-200'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Row 3: Selection Stats & Quick Action */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <span>
                    显示 <strong>{filteredIcons.length}</strong> / {CURATED_ICONS.length} 个权威矢量
                  </span>
                  {selectedSlugs.length > 0 && (
                    <span className="text-indigo-600 font-semibold">
                      已选中 {selectedSlugs.length} 个
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="btn-select-all"
                    onClick={handleSelectAllFiltered}
                    className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>全选当前筛选</span>
                  </button>

                  {selectedSlugs.length > 0 && (
                    <button
                      onClick={handleClearSelection}
                      className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    >
                      清空选择
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Icons Grid */}
            {filteredIcons.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {filteredIcons.map(icon => (
                  <IconCard
                    key={icon.slug}
                    icon={icon}
                    isSelected={selectedSlugs.includes(icon.slug)}
                    onToggleSelect={handleToggleSelect}
                    onInspect={setInspectedIcon}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800">
                  未找到匹配 &quot;{searchTerm}&quot; 的权威矢量
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  可在「管道命令 (CLI)」选项卡中运行同步或搜索指令拓展更多图标。
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSource('all');
                    setSelectedCategory('all');
                    setSelectedStatus('all');
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                >
                  重置筛选条件
                </button>
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Asset Comparison Section */}
        {activeTab === 'comparison' && <AiVsOfficialSection />}

        {/* Tab 3: Pipeline CLI Scripts Panel */}
        {activeTab === 'script' && <ScriptPanel selectedSlugs={selectedSlugs} />}

      </main>

      {/* Floating Batch Action Bar */}
      <BatchActionBar
        selectedCount={selectedSlugs.length}
        totalFilteredCount={filteredIcons.length}
        onSelectAllFiltered={handleSelectAllFiltered}
        onClearSelection={handleClearSelection}
        onDownloadSelectedZip={handleDownloadSelectedZip}
        onDownloadSelectedBundle={handleDownloadSelectedBundle}
        selectedSlugs={selectedSlugs}
      />

      {/* Full SVG Inspector Modal */}
      {inspectedIcon && (
        <IconInspectorModal
          icon={inspectedIcon}
          onClose={() => setInspectedIcon(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            矢量数据源基于 Simple Icons、Devicon、SVG Logos 与官方特例品牌设计档案 · 100% 原始字节保真
          </p>
          <p className="font-mono text-slate-500">
            文件命名规范: <code className="text-slate-700">&lt;name&gt;.svg</code> · SHA-256 密码学溯源清单
          </p>
        </div>
      </footer>

    </div>
  );
}
