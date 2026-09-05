import React, { useState, useMemo } from 'react';
import { Search, X, SlidersHorizontal, CheckSquare, Check, Filter } from 'lucide-react';
import { ColorMode, IconCategory, IconItem, IconSource } from './types';
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
  const [colorMode, setColorMode] = useState<ColorMode>('brand');
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [inspectedIcon, setInspectedIcon] = useState<IconItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Filtered icons by category, source, and search query
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
      // Search filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesTitle = icon.title.toLowerCase().includes(query);
        const matchesSlug = icon.slug.toLowerCase().includes(query);
        return matchesTitle || matchesSlug;
      }
      return true;
    });
  }, [searchTerm, selectedCategory, selectedSource]);

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
    await downloadZip(itemsToDownload, colorMode, `brand-icons-${itemsToDownload.length}.zip`);
    showToast(`正在下载 ${itemsToDownload.length} 个 SVG 图标压缩包...`);
  };

  // Batch download selected (Full Engineering Bundle: SVGs + manifest + TS/React/Vue)
  const handleDownloadSelectedBundle = async () => {
    const itemsToDownload = CURATED_ICONS.filter(i => selectedSlugs.includes(i.slug));
    if (itemsToDownload.length === 0) return;
    await downloadEngineeringZip(
      itemsToDownload,
      colorMode,
      `icons-bundle-${itemsToDownload.length}.zip`
    );
    showToast(`已导出 ${itemsToDownload.length} 个图标的前端工程规范组件包!`);
  };

  // Batch download all mainstream 90+ icons (pure SVGs)
  const handleDownloadMainstreamZip = async () => {
    await downloadZip(CURATED_ICONS, colorMode, 'mainstream-brand-tech-svg-pack.zip');
    showToast(`正在下载全套 ${CURATED_ICONS.length} 个主流大厂与技术 SVG 图标包...`);
  };

  // Batch download all mainstream 90+ icons (Full Engineering Bundle)
  const handleDownloadMainstreamBundle = async () => {
    await downloadEngineeringZip(
      CURATED_ICONS,
      colorMode,
      'brand-tech-engineering-bundle.zip'
    );
    showToast(`已成功导出 ${CURATED_ICONS.length} 个图标的完整工程包 (含 React/Vue 组件与 manifest.json)!`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
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

      {/* Main Content Area */}
      <main className="flex-1 pb-24">
        {activeTab === 'icons' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            
            {/* Filter & Control Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-4">
              
              {/* Row 1: Search, Source Filter & Color Mode Toggle */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="search-icons-input"
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="搜索品牌或技术，例如: Apple, React, OpenAI, Python, Docker..."
                    className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Center: Source Filter */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                  <span className="text-slate-400 text-[11px] flex items-center gap-1 shrink-0">
                    <Filter className="w-3 h-3" />
                    <span>源:</span>
                  </span>
                  {[
                    { id: 'all', label: '全部数据源' },
                    { id: 'simple-icons', label: 'Simple 品牌' },
                    { id: 'devicon', label: 'Devicon 技术' },
                    { id: 'official', label: '官方特例' }
                  ].map(src => (
                    <button
                      key={src.id}
                      onClick={() => setSelectedSource(src.id as any)}
                      className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                        selectedSource === src.id
                          ? 'bg-slate-800 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {src.label}
                    </button>
                  ))}
                </div>

                {/* Right: Color Mode Selector */}
                <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>着色模式:</span>
                  </span>

                  <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs">
                    <button
                      id="btn-color-brand"
                      onClick={() => setColorMode('brand')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        colorMode === 'brand'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      品牌原色
                    </button>
                    <button
                      id="btn-color-current"
                      onClick={() => setColorMode('currentColor')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        colorMode === 'currentColor'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      currentColor
                    </button>
                    <button
                      id="btn-color-mono-dark"
                      onClick={() => setColorMode('mono-dark')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        colorMode === 'mono-dark'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      极简纯黑
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
                      className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
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
                    显示 <strong>{filteredIcons.length}</strong> / {CURATED_ICONS.length} 个图标
                  </span>
                  {selectedSlugs.length > 0 && (
                    <span className="text-blue-600 font-medium">
                      已选中 {selectedSlugs.length} 个
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="btn-select-all"
                    onClick={handleSelectAllFiltered}
                    className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 transition-colors"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>全选当前筛选</span>
                  </button>

                  {selectedSlugs.length > 0 && (
                    <button
                      onClick={handleClearSelection}
                      className="text-slate-400 hover:text-slate-700 transition-colors"
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
                    colorMode={colorMode}
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
                  未找到匹配 &quot;{searchTerm}&quot; 的图标
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  可在「自动化同步脚本」选项卡中使用 Simple Icons + Devicon 双源同步管道。
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSource('all');
                    setSelectedCategory('all');
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  重置筛选条件
                </button>
              </div>
            )}

          </div>
        )}

        {/* Tab 2: CLI Scripts Panel */}
        {activeTab === 'script' && <ScriptPanel selectedSlugs={selectedSlugs} />}

        {/* Tab 3: AI vs Official Comparison */}
        {activeTab === 'comparison' && <AiVsOfficialSection />}

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
      <IconInspectorModal
        icon={inspectedIcon}
        colorMode={colorMode}
        onClose={() => setInspectedIcon(null)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            矢量数据源基于 Simple Icons 与 Devicon 双引擎及官方品牌设计规范 · 100% 精准无失真
          </p>
          <p className="font-mono text-slate-500">
            规范文件命名格式: <code className="text-slate-700">&lt;name&gt;.svg</code> · 支持 SHA-256 溯源清单
          </p>
        </div>
      </footer>

    </div>
  );
}
