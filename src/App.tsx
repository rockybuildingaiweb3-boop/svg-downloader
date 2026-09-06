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
  AlertCircle,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Palette,
  Compass,
  Tag,
  Heart,
  Clock,
  Bookmark,
  FileCheck
} from 'lucide-react';
import {
  IconCategory,
  IconItem,
  IconSource,
  AssetRole,
  UsageContext,
  TrustState,
  DownloadReceipt,
  getSemanticSourceLabel,
  getTrustStateBadge
} from './types';
import { CURATED_ICONS, CATEGORIES } from './data/curatedIcons';
import { Header } from './components/Header';
import { IconCard } from './components/IconCard';
import { IconInspectorModal } from './components/IconInspectorModal';
import { BatchActionBar } from './components/BatchActionBar';
import { ScriptPanel } from './components/ScriptPanel';
import { AiVsOfficialSection } from './components/AiVsOfficialModal';
import { ConflictsSection } from './components/ConflictsSection';
import { downloadZip, downloadEngineeringZip } from './utils/svgHelpers';
import { searchCatalogAssetAware, parseSearchIntent } from './utils/assetResolver';

export default function App() {
  const [activeTab, setActiveTab] = useState<'icons' | 'conflicts' | 'script' | 'comparison'>('icons');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Local Collections: Favorites and Recent Downloads
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('svg_registry_favorites') || '[]');
    } catch {
      return [];
    }
  });

  const [recents, setRecents] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('svg_registry_recents') || '[]');
    } catch {
      return [];
    }
  });

  const [selectedCollection, setSelectedCollection] = useState<'all' | 'favorites' | 'recents' | 'selected'>('all');

  // Standard & Advanced Filters (Requirement 24)
  const [selectedCategory, setSelectedCategory] = useState<IconCategory>('all');
  const [selectedSource, setSelectedSource] = useState<IconSource>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'verified' | 'multi-source' | 'unresolved'>('all');
  const [selectedRole, setSelectedRole] = useState<AssetRole>('all');
  const [selectedContext, setSelectedContext] = useState<UsageContext>('all');
  const [selectedVariant, setSelectedVariant] = useState<string>('all');
  const [selectedTrustState, setSelectedTrustState] = useState<'all' | TrustState>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Pagination (Requirement 18: Full catalog rendering without rendering thousands of DOM nodes)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(36);

  // Identity active asset overrides (User chosen asset from "Use this asset" in Inspector)
  const [activeAssetOverrides, setActiveAssetOverrides] = useState<Record<string, string>>({});

  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [inspectedIcon, setInspectedIcon] = useState<IconItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem('svg_registry_favorites', JSON.stringify(next));
      } catch {}
      showToast(next.includes(id) ? `已将 ${id} 加入收藏` : `已将 ${id} 移出收藏`);
      return next;
    });
  };

  const handleDownloadReceipt = (receipt: DownloadReceipt) => {
    setRecents(prev => {
      const filtered = prev.filter(x => x !== receipt.identityId);
      const next = [receipt.identityId, ...filtered].slice(0, 30);
      try {
        localStorage.setItem('svg_registry_recents', JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast(`已下载 ${receipt.fileName} (SHA: ${receipt.rawSha256.substring(0, 8)}...)`);
  };

  // Reset page when filters or collection change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedCollection,
    selectedCategory,
    selectedSource,
    selectedStatus,
    selectedRole,
    selectedContext,
    selectedVariant,
    selectedTrustState,
    pageSize
  ]);

  // Parse natural-language search intent
  const parsedIntent = useMemo(() => {
    if (!searchTerm.trim()) return null;
    return parseSearchIntent(searchTerm);
  }, [searchTerm]);

  // Active filters count for badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedRole !== 'all') count++;
    if (selectedContext !== 'all') count++;
    if (selectedVariant !== 'all') count++;
    if (selectedTrustState !== 'all') count++;
    return count;
  }, [selectedRole, selectedContext, selectedVariant, selectedTrustState]);

  // Filtered icons by category, source, verification status, role, context, variant, and search query
  const filteredIcons = useMemo(() => {
    const baseFiltered = CURATED_ICONS.map(icon => {
      // If user selected a specific asset for this identity, apply override
      const overrideAssetId = activeAssetOverrides[icon.id];
      if (overrideAssetId && icon.assets) {
        const found = icon.assets.find(a => a.assetId === overrideAssetId);
        if (found) {
          return {
            ...icon,
            fileName: found.file,
            sha256: found.rawSha256,
            role: found.role,
            graphicVariant: found.graphicVariant,
            context: found.context,
            sourceProvider: found.sourceProvider,
            sourceCollection: found.sourceCollection,
            canonicalAssetId: found.assetId,
            canonicalAsset: found,
            trustState: found.trustState || icon.trustState,
            sourcePlatform: getSemanticSourceLabel(found.sourceProvider, found.sourceCollection)
          };
        }
      }
      return icon;
    }).filter(icon => {
      // 0. Local Collection filter (Favorites / Recents / Selected)
      if (selectedCollection === 'favorites') {
        if (!favorites.includes(icon.id)) return false;
      } else if (selectedCollection === 'recents') {
        if (!recents.includes(icon.id)) return false;
      } else if (selectedCollection === 'selected') {
        if (!selectedSlugs.includes(icon.slug)) return false;
      }

      // 1. Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'mainstream') {
          // Curated high priority
          if (icon.category !== 'mainstream' && icon.category !== 'brands' && icon.category !== 'technologies') {
            // Keep if in mainstream collection
          }
        } else if (icon.category !== selectedCategory) {
          return false;
        }
      }

      // 2. Source filter (Requirement 16)
      if (selectedSource !== 'all') {
        const iconSrc = icon.sourceProvider || icon.source || 'simple-icons';
        if (selectedSource === 'official') {
          if (iconSrc !== 'official') return false;
        } else if (selectedSource === 'wikimedia') {
          if (iconSrc !== 'wikimedia') return false;
        } else if (selectedSource === 'svg-logos') {
          if (iconSrc !== 'iconify' && icon.source !== 'svg-logos' && icon.sourceCollection !== 'logos') return false;
        } else if (iconSrc !== selectedSource) {
          return false;
        }
      }

      // 3. Status filter (Requirement 17)
      if (selectedStatus === 'verified') {
        if (icon.verificationStatus !== 'verified') return false;
      } else if (selectedStatus === 'multi-source') {
        if (!icon.alternativeSources || icon.alternativeSources.length === 0) return false;
      } else if (selectedStatus === 'unresolved') {
        if (icon.verificationStatus !== 'unresolved') return false;
      }

      // 4. Asset Role filter (Requirement 24)
      if (selectedRole !== 'all') {
        const hasMatchingRole =
          icon.role === selectedRole ||
          (icon.assets && icon.assets.some(a => a.role === selectedRole));
        if (!hasMatchingRole) return false;
      }

      // 5. Context filter (Requirement 24)
      if (selectedContext !== 'all') {
        const hasMatchingContext =
          (icon.context && icon.context.includes(selectedContext)) ||
          (icon.assets && icon.assets.some(a => a.context && a.context.includes(selectedContext)));
        if (!hasMatchingContext) return false;
      }

      // 6. Variant filter (Requirement 24)
      if (selectedVariant !== 'all') {
        const hasMatchingVariant =
          icon.graphicVariant?.toLowerCase() === selectedVariant.toLowerCase() ||
          icon.variant?.toLowerCase() === selectedVariant.toLowerCase() ||
          (icon.assets && icon.assets.some(a => a.graphicVariant?.toLowerCase() === selectedVariant.toLowerCase()));
        if (!hasMatchingVariant) return false;
      }

      // 7. Trust State filter (Requirement 16)
      if (selectedTrustState !== 'all') {
        if (icon.trustState !== selectedTrustState) return false;
      }

      return true;
    });

    // 8. Asset-Aware Search (Requirement: search understands title, identity, slug, aliases, source, role, context, variant)
    if (!searchTerm.trim()) {
      return baseFiltered;
    }

    const searchResults = searchCatalogAssetAware(searchTerm, baseFiltered);
    return searchResults.map(res => {
      let iconToReturn = res.icon;
      if (res.matchedAsset && res.matchedAsset.assetId !== res.icon.canonicalAssetId) {
        iconToReturn = {
          ...res.icon,
          fileName: res.matchedAsset.file,
          sha256: res.matchedAsset.rawSha256,
          role: res.matchedAsset.role,
          graphicVariant: res.matchedAsset.graphicVariant,
          context: res.matchedAsset.context,
          sourceProvider: res.matchedAsset.sourceProvider,
          sourceCollection: res.matchedAsset.sourceCollection,
          canonicalAssetId: res.matchedAsset.assetId,
          canonicalAsset: res.matchedAsset,
          trustState: res.matchedAsset.trustState || res.icon.trustState,
          sourcePlatform: getSemanticSourceLabel(res.matchedAsset.sourceProvider, res.matchedAsset.sourceCollection)
        };
      }
      return {
        ...iconToReturn,
        matchScore: res.matchScore,
        matchChecklist: res.matchChecklist,
        matchReason: res.matchReason
      };
    });
  }, [
    searchTerm,
    selectedCollection,
    favorites,
    recents,
    selectedSlugs,
    selectedCategory,
    selectedSource,
    selectedStatus,
    selectedRole,
    selectedContext,
    selectedVariant,
    selectedTrustState,
    activeAssetOverrides
  ]);

  // Paginated Icons (Requirement 18)
  const totalPages = Math.max(1, Math.ceil(filteredIcons.length / pageSize));
  const paginatedIcons = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredIcons.slice(startIndex, startIndex + pageSize);
  }, [filteredIcons, currentPage, pageSize]);

  // Handle user switching active asset for an identity from modal (Requirement 23)
  const handleUseAsset = (identityId: string, assetId: string) => {
    setActiveAssetOverrides(prev => ({
      ...prev,
      [identityId]: assetId
    }));
    // Also update inspectedIcon if currently open
    setInspectedIcon(prev => {
      if (!prev || prev.id !== identityId) return prev;
      const targetAsset = prev.assets?.find(a => a.assetId === assetId);
      if (!targetAsset) return prev;
      return {
        ...prev,
        fileName: targetAsset.file,
        canonicalAssetId: targetAsset.assetId,
        canonicalAsset: targetAsset,
        role: targetAsset.role,
        graphicVariant: targetAsset.graphicVariant,
        sourcePlatform: getSemanticSourceLabel(targetAsset.sourceProvider, targetAsset.sourceCollection)
      };
    });
    showToast(`已将 ${identityId} 设为主资产形态`);
  };

  // Toggle single icon selection
  const handleToggleSelect = (slug: string) => {
    setSelectedSlugs(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  // Select all currently filtered
  const handleSelectAllFiltered = () => {
    const filteredSlugs = filteredIcons
      .filter(i => i.verificationStatus !== 'unresolved')
      .map(i => i.slug);
    setSelectedSlugs(prev => Array.from(new Set([...prev, ...filteredSlugs])));
    showToast(`已全选当前筛选的 ${filteredSlugs.length} 个图标`);
  };

  // Clear selection
  const handleClearSelection = () => {
    setSelectedSlugs([]);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedSource('all');
    setSelectedStatus('all');
    setSelectedRole('all');
    setSelectedContext('all');
    setSelectedVariant('all');
    setSelectedTrustState('all');
    setCurrentPage(1);
    showToast('已重置所有检索与筛选条件');
  };

  // Batch download selected (pure SVGs)
  const handleDownloadSelectedZip = async () => {
    const itemsToDownload = CURATED_ICONS.filter(i => selectedSlugs.includes(i.slug) && i.verificationStatus !== 'unresolved');
    if (itemsToDownload.length === 0) return;
    await downloadZip(itemsToDownload, `brand-icons-${itemsToDownload.length}.zip`);
    showToast(`正在下载 ${itemsToDownload.length} 个 SVG 图标压缩包...`);
  };

  // Batch download selected (Full Engineering Bundle)
  const handleDownloadSelectedBundle = async () => {
    const itemsToDownload = CURATED_ICONS.filter(i => selectedSlugs.includes(i.slug) && i.verificationStatus !== 'unresolved');
    if (itemsToDownload.length === 0) return;
    await downloadEngineeringZip(
      itemsToDownload,
      `icons-bundle-${itemsToDownload.length}.zip`
    );
    showToast(`已导出 ${itemsToDownload.length} 个图标的前端工程规范组件包!`);
  };

  // Batch download all mainstream icons (pure SVGs)
  const handleDownloadMainstreamZip = async () => {
    const validItems = CURATED_ICONS.filter(i => i.verificationStatus !== 'unresolved');
    await downloadZip(validItems, 'authoritative-brand-tech-svg-pack.zip');
    showToast(`正在下载全套 ${validItems.length} 个权威品牌与技术 SVG 压缩包...`);
  };

  // Batch download all mainstream icons (Full Engineering Bundle)
  const handleDownloadMainstreamBundle = async () => {
    const validItems = CURATED_ICONS.filter(i => i.verificationStatus !== 'unresolved');
    await downloadEngineeringZip(
      validItems,
      'authoritative-engineering-bundle.zip'
    );
    showToast(`已成功导出 ${validItems.length} 个图标的完整工程包 (含 React/Vue 组件与 manifest.json)!`);
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

      {/* System Verification & Architecture Banner */}
      <div className="bg-slate-900 text-white border-b border-slate-800 py-2 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>多源权威资产注册表 (Verified Multi-Source Icon Asset Registry)</span>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="text-slate-300">
              数据模型: 品牌概念 (Identity) → 资产家族 (Asset Family) → 权威资产 (Asset)
            </span>
          </div>

          <div className="flex items-center gap-3 text-2xs text-slate-400">
            <span className="text-emerald-300 flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-400" /> 原始字节不可变
            </span>
            <span>•</span>
            <span>无伪造占位符</span>
            <span>•</span>
            <span className="font-mono text-indigo-300">Fast-XML 规范验证</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 pb-24">
        {activeTab === 'icons' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
            
            {/* Filter & Control Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3.5">
              
              {/* Row 1: Search & Source Filter & Advanced Filter Toggle */}
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

                {/* Center: Semantically Correct Source Filter (Requirement 16) */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
                  <span className="text-slate-400 text-[11px] flex items-center gap-1 shrink-0">
                    <Filter className="w-3 h-3" />
                    <span>源平台:</span>
                  </span>
                  {[
                    { id: 'all', label: '全部数据源' },
                    { id: 'simple-icons', label: 'Simple Icons' },
                    { id: 'devicon', label: 'Devicon' },
                    { id: 'svg-logos', label: 'SVG Logos' },
                    { id: 'official', label: 'Official Vendor' },
                    { id: 'wikimedia', label: 'Wikimedia Commons' }
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

                {/* Right: Advanced Filters Toggle Button */}
                <button
                  id="btn-toggle-advanced-filters"
                  onClick={() => setShowAdvancedFilters(prev => !prev)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                    showAdvancedFilters || activeFiltersCount > 0
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                  <span>高级筛选 (角色/场景/变体)</span>
                  {activeFiltersCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

              </div>

              {/* Explainable Search Intent Bar (Requirement 24) */}
              {parsedIntent && (
                <div className="flex items-center justify-between gap-2 p-2.5 bg-indigo-50/90 border border-indigo-200 rounded-xl text-xs text-indigo-950 font-mono flex-wrap animate-in fade-in duration-150">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-indigo-700 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      意图分析:
                    </span>
                    <span>目标品牌: <strong>{parsedIntent.targetIdentity || '通用搜索'}</strong></span>
                    {parsedIntent.roleConstraint && (
                      <span className="bg-indigo-100/90 px-1.5 py-0.5 rounded text-indigo-800">
                        形态: {parsedIntent.roleConstraint}
                      </span>
                    )}
                    {parsedIntent.contextConstraint && (
                      <span className="bg-indigo-100/90 px-1.5 py-0.5 rounded text-indigo-800">
                        场景: {parsedIntent.contextConstraint}
                      </span>
                    )}
                    {parsedIntent.variantPreference && (
                      <span className="bg-indigo-100/90 px-1.5 py-0.5 rounded text-indigo-800">
                        偏好: {parsedIntent.variantPreference}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-500 font-sans">
                      ({parsedIntent.mode === 'strict' ? '严格命中' : '智能优选'})
                    </span>
                  </div>
                  <span className="text-[11px] font-sans text-indigo-700 font-medium">
                    精准命中 {filteredIcons.length} 项
                  </span>
                </div>
              )}

              {/* Local Collections Tabs: All, Favorites, Recents, Selected */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 no-scrollbar pt-1 border-t border-slate-100">
                <button
                  id="tab-collection-all"
                  onClick={() => setSelectedCollection('all')}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    selectedCollection === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>全部标识 ({CURATED_ICONS.length})</span>
                </button>

                <button
                  id="tab-collection-favorites"
                  onClick={() => setSelectedCollection('favorites')}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    selectedCollection === 'favorites'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${selectedCollection === 'favorites' ? 'fill-current' : ''}`} />
                  <span>我的收藏 ({favorites.length})</span>
                </button>

                <button
                  id="tab-collection-recents"
                  onClick={() => setSelectedCollection('recents')}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    selectedCollection === 'recents'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>最近下载 ({recents.length})</span>
                </button>

                {selectedSlugs.length > 0 && (
                  <button
                    id="tab-collection-selected"
                    onClick={() => setSelectedCollection('selected')}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      selectedCollection === 'selected'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                    }`}
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>已选中项 ({selectedSlugs.length})</span>
                  </button>
                )}
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

              {/* Row 3: Requirement 24 - Context and Variant Filtering Drawer */}
              {showAdvancedFilters && (
                <div className="pt-3 pb-1 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in duration-150">
                  
                  {/* Filter 1: Asset Role (Requirement 24) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-indigo-600" />
                      <span>资产角色 (Asset Role)</span>
                    </label>
                    <select
                      id="filter-asset-role"
                      value={selectedRole}
                      onChange={e => setSelectedRole(e.target.value as any)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="all">全部角色 (All Roles)</option>
                      <option value="symbol">Symbol (图标符号)</option>
                      <option value="logo">Logo (完整标志)</option>
                      <option value="wordmark">Wordmark (文字组合标)</option>
                      <option value="app-icon">App Icon (应用图标)</option>
                      <option value="favicon">Favicon (网站极简标)</option>
                    </select>
                  </div>

                  {/* Filter 2: Context (Requirement 24) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                      <Compass className="w-3 h-3 text-sky-600" />
                      <span>使用上下文 (Context)</span>
                    </label>
                    <select
                      id="filter-context"
                      value={selectedContext}
                      onChange={e => setSelectedContext(e.target.value as any)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="all">全部上下文 (All Contexts)</option>
                      <option value="web">Web (网页与云平台)</option>
                      <option value="desktop">Desktop (桌面端应用)</option>
                      <option value="mobile">Mobile (移动端平台)</option>
                      <option value="app-store">App Store (应用商店)</option>
                      <option value="social">Social (社交与媒体头像)</option>
                      <option value="general">General (通用展示)</option>
                    </select>
                  </div>

                  {/* Filter 3: Variant (Requirement 24) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                      <Palette className="w-3 h-3 text-pink-600" />
                      <span>视觉形态 (Variant)</span>
                    </label>
                    <select
                      id="filter-variant"
                      value={selectedVariant}
                      onChange={e => setSelectedVariant(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="all">全部形态 (All Variants)</option>
                      <option value="color">Color (多色标准彩标)</option>
                      <option value="monochrome">Monochrome (单色矢量)</option>
                      <option value="original">Original (品牌原生配色)</option>
                      <option value="plain">Plain (纯净几何轮廓)</option>
                      <option value="line">Line (描边与线框)</option>
                      <option value="wordmark">Wordmark (横版组合字标)</option>
                    </select>
                  </div>

                  {/* Filter 4: Trust State (Requirement 16) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>独立信任状态 (Trust State)</span>
                    </label>
                    <select
                      id="filter-trust-state"
                      value={selectedTrustState}
                      onChange={e => setSelectedTrustState(e.target.value as any)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="all">全部信任状态 (All Trust)</option>
                      <option value="trusted">Trusted (官方设计规范认证)</option>
                      <option value="verified">Verified (上游密码学校验)</option>
                      <option value="community">Community (开源社区维护)</option>
                      <option value="unverified">Unverified (未认证资产)</option>
                    </select>
                  </div>

                </div>
              )}

              {/* Row 4: Selection Stats & Quick Action */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span>
                    显示 <strong>{filteredIcons.length}</strong> / {CURATED_ICONS.length} 个权威品牌标识
                  </span>
                  {selectedSlugs.length > 0 && (
                    <span className="text-indigo-600 font-semibold">
                      已选中 {selectedSlugs.length} 项
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={handleResetFilters}
                      className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>重置筛选</span>
                    </button>
                  )}

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

            {/* Icons Grid (Requirement 18: Full Catalog via Pagination) */}
            {paginatedIcons.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                  {paginatedIcons.map(icon => (
                    <IconCard
                      key={icon.slug}
                      icon={icon}
                      isSelected={selectedSlugs.includes(icon.slug)}
                      onToggleSelect={handleToggleSelect}
                      onInspect={setInspectedIcon}
                      isFavorite={favorites.includes(icon.id)}
                      onToggleFavorite={toggleFavorite}
                      onDownloadReceipt={handleDownloadReceipt}
                    />
                  ))}
                </div>

                {/* Pagination Controls Bar (Requirement 18) */}
                <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-xl px-4 py-3 border border-slate-200 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <span>
                      显示第 <strong>{(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredIcons.length)}</strong> 项，共 <strong>{filteredIcons.length}</strong> 项
                    </span>
                    <span className="text-slate-300">•</span>
                    <label className="flex items-center gap-1">
                      <span>每页显示:</span>
                      <select
                        value={pageSize}
                        onChange={e => setPageSize(Number(e.target.value))}
                        className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 focus:outline-none"
                      >
                        <option value={24}>24 项</option>
                        <option value={36}>36 项</option>
                        <option value={72}>72 项</option>
                        <option value={144}>144 项</option>
                      </select>
                    </label>
                  </div>

                  {/* Page Navigation */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>上一页</span>
                    </button>

                    <div className="flex items-center gap-1 px-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum = i + 1;
                        if (totalPages > 5 && currentPage > 3) {
                          pageNum = Math.min(totalPages - 4 + i, currentPage - 2 + i);
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                              currentPage === pageNum
                                ? 'bg-slate-900 text-white shadow-2xs'
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>下一页</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800">
                  未找到匹配当前筛选条件的品牌标识
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  可尝试清除关键词或重置角色、使用场景与变体筛选。
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                >
                  重置筛选条件
                </button>
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Multi-Source Conflicts & Policy Resolution */}
        {activeTab === 'conflicts' && <ConflictsSection onInspectIcon={setInspectedIcon} />}

        {/* Tab 3: Asset Comparison Section */}
        {activeTab === 'comparison' && <AiVsOfficialSection />}

        {/* Tab 4: Pipeline CLI Scripts Panel */}
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

      {/* Full Asset Family Inspector Modal (Requirement 23) */}
      {inspectedIcon && (
        <IconInspectorModal
          icon={inspectedIcon}
          onClose={() => setInspectedIcon(null)}
          onUseAsset={handleUseAsset}
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
