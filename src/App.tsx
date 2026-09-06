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
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Palette,
  Compass,
  Tag,
  Heart,
  Clock,
  Command
} from 'lucide-react';
import {
  IconCategory,
  IconItem,
  IconSource,
  AssetRole,
  UsageContext,
  TrustState,
  DownloadReceipt,
  getSemanticSourceLabel
} from './types';
import { CURATED_ICONS, CATEGORIES } from './data/curatedIcons';
import { Header, ActiveTabType } from './components/Header';
import { IconCard } from './components/IconCard';
import { IconInspectorModal } from './components/IconInspectorModal';
import { BatchActionBar } from './components/BatchActionBar';
import { ScriptPanel } from './components/ScriptPanel';
import { AiVsOfficialSection } from './components/AiVsOfficialModal';
import { ConflictsSection } from './components/ConflictsSection';
import { SourcesSection } from './components/SourcesSection';
import { CoverageSection } from './components/CoverageSection';
import { CommandPalette } from './components/CommandPalette';
import { downloadZip, downloadEngineeringZip } from './utils/svgHelpers';
import { searchCatalogAssetAware, parseSearchIntent } from './utils/assetResolver';
import { useTranslation } from './i18n/context';

export default function App() {
  const { t, format } = useTranslation();
  const [activeTab, setActiveTab] = useState<ActiveTabType>('icons');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
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

  // Standard & Advanced Filters
  const [selectedCategory, setSelectedCategory] = useState<IconCategory>('all');
  const [selectedSource, setSelectedSource] = useState<IconSource>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'verified' | 'multi-source' | 'unresolved'>('all');
  const [selectedRole, setSelectedRole] = useState<AssetRole>('all');
  const [selectedContext, setSelectedContext] = useState<UsageContext>('all');
  const [selectedVariant, setSelectedVariant] = useState<string>('all');
  const [selectedTrustState, setSelectedTrustState] = useState<'all' | TrustState>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(36);

  // Identity active asset overrides
  const [activeAssetOverrides, setActiveAssetOverrides] = useState<Record<string, string>>({});

  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [inspectedIcon, setInspectedIcon] = useState<IconItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Keyboard shortcut for Command Palette (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem('svg_registry_favorites', JSON.stringify(next));
      } catch {}
      showToast(next.includes(id) ? `Added ${id} to favorites` : `Removed ${id} from favorites`);
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
    showToast(`Downloaded ${receipt.fileName} (SHA: ${receipt.rawSha256.substring(0, 8)}...)`);
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

  // Filtered icons
  const filteredIcons = useMemo(() => {
    const baseFiltered = CURATED_ICONS.map(icon => {
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
      // 0. Local Collection filter
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
          if (icon.category !== 'mainstream' && icon.category !== 'brands' && icon.category !== 'technologies') {
            // keep
          }
        } else if (icon.category !== selectedCategory) {
          return false;
        }
      }

      // 2. Source filter
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

      // 3. Status filter
      if (selectedStatus === 'verified') {
        if (icon.verificationStatus !== 'verified') return false;
      } else if (selectedStatus === 'multi-source') {
        if (!icon.alternativeSources || icon.alternativeSources.length === 0) return false;
      } else if (selectedStatus === 'unresolved') {
        if (icon.verificationStatus !== 'unresolved') return false;
      }

      // 4. Asset Role filter
      if (selectedRole !== 'all') {
        const hasMatchingRole =
          icon.role === selectedRole ||
          (icon.assets && icon.assets.some(a => a.role === selectedRole));
        if (!hasMatchingRole) return false;
      }

      // 5. Context filter
      if (selectedContext !== 'all') {
        const hasMatchingContext =
          (icon.context && icon.context.includes(selectedContext)) ||
          (icon.assets && icon.assets.some(a => a.context && a.context.includes(selectedContext)));
        if (!hasMatchingContext) return false;
      }

      // 6. Variant filter
      if (selectedVariant !== 'all') {
        const hasMatchingVariant =
          icon.graphicVariant?.toLowerCase() === selectedVariant.toLowerCase() ||
          icon.variant?.toLowerCase() === selectedVariant.toLowerCase() ||
          (icon.assets && icon.assets.some(a => a.graphicVariant?.toLowerCase() === selectedVariant.toLowerCase()));
        if (!hasMatchingVariant) return false;
      }

      // 7. Trust State filter
      if (selectedTrustState !== 'all') {
        if (icon.trustState !== selectedTrustState) return false;
      }

      return true;
    });

    // 8. Asset-Aware Search
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

  // Paginated Icons
  const totalPages = Math.max(1, Math.ceil(filteredIcons.length / pageSize));
  const paginatedIcons = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredIcons.slice(startIndex, startIndex + pageSize);
  }, [filteredIcons, currentPage, pageSize]);

  const handleUseAsset = (identityId: string, assetId: string) => {
    setActiveAssetOverrides(prev => ({
      ...prev,
      [identityId]: assetId
    }));
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
    showToast(`Set ${identityId} primary asset variant`);
  };

  const handleToggleSelect = (slug: string) => {
    setSelectedSlugs(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const handleSelectAllFiltered = () => {
    const filteredSlugs = filteredIcons
      .filter(i => i.verificationStatus !== 'unresolved')
      .map(i => i.slug);
    setSelectedSlugs(prev => Array.from(new Set([...prev, ...filteredSlugs])));
    showToast(`Selected all ${filteredSlugs.length} filtered assets`);
  };

  const handleClearSelection = () => {
    setSelectedSlugs([]);
  };

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
    showToast('Filters reset to default');
  };

  const handleDownloadSelectedZip = async () => {
    const itemsToDownload = CURATED_ICONS.filter(i => selectedSlugs.includes(i.slug) && i.verificationStatus !== 'unresolved');
    if (itemsToDownload.length === 0) return;
    await downloadZip(itemsToDownload, `brand-icons-${itemsToDownload.length}.zip`);
    showToast(`Downloading ${itemsToDownload.length} verified SVG assets...`);
  };

  const handleDownloadSelectedBundle = async () => {
    const itemsToDownload = CURATED_ICONS.filter(i => selectedSlugs.includes(i.slug) && i.verificationStatus !== 'unresolved');
    if (itemsToDownload.length === 0) return;
    await downloadEngineeringZip(
      itemsToDownload,
      `icons-bundle-${itemsToDownload.length}.zip`
    );
    showToast(`Exported ${itemsToDownload.length} assets with React/Vue definitions and manifest!`);
  };

  const handleDownloadMainstreamZip = async () => {
    const validItems = CURATED_ICONS.filter(i => i.verificationStatus !== 'unresolved');
    await downloadZip(validItems, 'authoritative-brand-tech-svg-pack.zip');
    showToast(`Downloading full set of ${validItems.length} verified SVGs...`);
  };

  const handleDownloadMainstreamBundle = async () => {
    const validItems = CURATED_ICONS.filter(i => i.verificationStatus !== 'unresolved');
    await downloadEngineeringZip(
      validItems,
      'authoritative-engineering-bundle.zip'
    );
    showToast(`Exported full engineering package with ${validItems.length} verified brand assets!`);
  };

  // Helper category label mapping
  const getCategoryLabel = (catId: string) => {
    const map: Record<string, string> = {
      all: t.filters.categories.all,
      mainstream: t.filters.categories.mainstream,
      brands: t.filters.categories.brands,
      technologies: t.filters.categories.technologies,
      apps: t.filters.categories.apps,
      cloud: t.filters.categories.cloud,
      databases: t.filters.categories.databases,
      'developer-tools': t.filters.categories.developerTools,
      design: t.filters.categories.design,
      social: t.filters.categories.social,
      gaming: t.filters.categories.gaming,
      web3: t.filters.categories.web3,
      custom: t.filters.categories.custom,
    };
    return map[catId] || catId;
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
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* System Verification & Architecture Banner */}
      <div className="bg-slate-900 text-white border-b border-slate-800 py-2 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.systemBanner.registryTitle}</span>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="text-slate-300">
              {t.systemBanner.dataModel}
            </span>
          </div>

          <div className="flex items-center gap-3 text-2xs text-slate-400">
            <span className="text-emerald-300 flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-400" /> {t.systemBanner.rawBytesImmutable}
            </span>
            <span>•</span>
            <span>{t.systemBanner.noFakePlaceholders}</span>
            <span>•</span>
            <span className="font-mono text-indigo-300">{t.systemBanner.astValidated}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 pb-24">
        {/* Tab 1: Icons & Brands */}
        {activeTab === 'icons' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
            
            {/* Filter & Control Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3.5">
              
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
                    placeholder={t.filters.searchPlaceholder}
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
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
                  <span className="text-slate-400 text-2xs flex items-center gap-1 shrink-0 font-medium">
                    <Filter className="w-3 h-3" />
                    <span>{t.filters.sourcePlatform}:</span>
                  </span>
                  {[
                    { id: 'all', label: t.filters.allSources },
                    { id: 'simple-icons', label: 'Simple Icons' },
                    { id: 'devicon', label: 'Devicon' },
                    { id: 'svg-logos', label: 'SVG Logos' },
                    { id: 'official', label: 'Official' },
                    { id: 'wikimedia', label: 'Wikimedia' }
                  ].map(src => (
                    <button
                      key={src.id}
                      onClick={() => setSelectedSource(src.id as any)}
                      className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        selectedSource === src.id
                          ? 'bg-slate-900 text-white shadow-2xs font-semibold'
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                    showAdvancedFilters || activeFiltersCount > 0
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{t.filters.advancedFilters}</span>
                  {activeFiltersCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-2xs flex items-center justify-center font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

              </div>

              {/* Explainable Search Intent Bar */}
              {parsedIntent && (
                <div className="flex items-center justify-between gap-2 p-2.5 bg-indigo-50/90 border border-indigo-200 rounded-xl text-xs text-indigo-950 font-mono flex-wrap animate-in fade-in duration-150">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-indigo-700 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      {t.filters.intentAnalysis}:
                    </span>
                    <span>{t.filters.targetBrand}: <strong>{parsedIntent.targetIdentity || 'General Search'}</strong></span>
                    {parsedIntent.roleConstraint && (
                      <span className="bg-indigo-100/90 px-1.5 py-0.5 rounded text-indigo-800">
                        {t.filters.roleConstraint}: {parsedIntent.roleConstraint}
                      </span>
                    )}
                    {parsedIntent.contextConstraint && (
                      <span className="bg-indigo-100/90 px-1.5 py-0.5 rounded text-indigo-800">
                        {t.filters.contextConstraint}: {parsedIntent.contextConstraint}
                      </span>
                    )}
                    {parsedIntent.variantPreference && (
                      <span className="bg-indigo-100/90 px-1.5 py-0.5 rounded text-indigo-800">
                        {t.filters.variantPreference}: {parsedIntent.variantPreference}
                      </span>
                    )}
                    <span className="text-2xs text-slate-500 font-sans">
                      ({parsedIntent.mode === 'strict' ? t.filters.strictMatch : t.filters.preferredMatch})
                    </span>
                  </div>
                  <span className="text-2xs font-sans text-indigo-700 font-semibold">
                    {filteredIcons.length} {t.filters.matchedCount}
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
                      ? 'bg-slate-900 text-white shadow-xs font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{t.filters.collections.all} ({CURATED_ICONS.length})</span>
                </button>

                <button
                  id="tab-collection-favorites"
                  onClick={() => setSelectedCollection('favorites')}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    selectedCollection === 'favorites'
                      ? 'bg-rose-600 text-white shadow-xs font-semibold'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${selectedCollection === 'favorites' ? 'fill-current' : ''}`} />
                  <span>{t.filters.collections.favorites} ({favorites.length})</span>
                </button>

                <button
                  id="tab-collection-recents"
                  onClick={() => setSelectedCollection('recents')}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    selectedCollection === 'recents'
                      ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{t.filters.collections.recents} ({recents.length})</span>
                </button>

                {selectedSlugs.length > 0 && (
                  <button
                    id="tab-collection-selected"
                    onClick={() => setSelectedCollection('selected')}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      selectedCollection === 'selected'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                    }`}
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>{t.filters.collections.selected} ({selectedSlugs.length})</span>
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
                          ? 'bg-slate-900 text-white shadow-xs font-semibold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                      }`}
                    >
                      <span>{getCategoryLabel(cat.id)}</span>
                      <span
                        className={`text-2xs px-1.5 py-0.2 rounded-full font-mono ${
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

              {/* Row 3: Advanced Filtering Drawer */}
              {showAdvancedFilters && (
                <div className="pt-3 pb-1 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in duration-150">
                  
                  {/* Filter 1: Asset Role */}
                  <div className="space-y-1">
                    <label className="text-2xs font-bold text-slate-700 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-indigo-600" />
                      <span>{t.filters.assetRole}</span>
                    </label>
                    <select
                      id="filter-asset-role"
                      value={selectedRole}
                      onChange={e => setSelectedRole(e.target.value as any)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="all">{t.filters.allRoles}</option>
                      <option value="symbol">Symbol (Single mark)</option>
                      <option value="logo">Logo (Complete mark)</option>
                      <option value="wordmark">Wordmark (Logotype)</option>
                      <option value="app-icon">App Icon</option>
                      <option value="favicon">Favicon</option>
                    </select>
                  </div>

                  {/* Filter 2: Context */}
                  <div className="space-y-1">
                    <label className="text-2xs font-bold text-slate-700 flex items-center gap-1">
                      <Compass className="w-3 h-3 text-sky-600" />
                      <span>{t.filters.usageContext}</span>
                    </label>
                    <select
                      id="filter-context"
                      value={selectedContext}
                      onChange={e => setSelectedContext(e.target.value as any)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="all">{t.filters.allContexts}</option>
                      <option value="web">Web & Cloud</option>
                      <option value="desktop">Desktop</option>
                      <option value="mobile">Mobile</option>
                      <option value="app-store">App Store</option>
                      <option value="social">Social & Avatar</option>
                      <option value="general">General</option>
                    </select>
                  </div>

                  {/* Filter 3: Variant */}
                  <div className="space-y-1">
                    <label className="text-2xs font-bold text-slate-700 flex items-center gap-1">
                      <Palette className="w-3 h-3 text-pink-600" />
                      <span>{t.filters.graphicVariant}</span>
                    </label>
                    <select
                      id="filter-variant"
                      value={selectedVariant}
                      onChange={e => setSelectedVariant(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="all">{t.filters.allVariants}</option>
                      <option value="color">Color (Standard multi-color)</option>
                      <option value="monochrome">Monochrome (Single-tone)</option>
                      <option value="original">Original (Native corporate)</option>
                      <option value="plain">Plain (Clean geometry)</option>
                      <option value="line">Line (Outlined)</option>
                      <option value="wordmark">Wordmark (Horizontal)</option>
                    </select>
                  </div>

                  {/* Filter 4: Trust State */}
                  <div className="space-y-1">
                    <label className="text-2xs font-bold text-slate-700 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>{t.filters.trustState}</span>
                    </label>
                    <select
                      id="filter-trust-state"
                      value={selectedTrustState}
                      onChange={e => setSelectedTrustState(e.target.value as any)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="all">{t.filters.allTrustStates}</option>
                      <option value="trusted">Trusted (Vendor Design Guidelines)</option>
                      <option value="verified">Verified (Cryptographic SHA-256)</option>
                      <option value="community">Community (Open-source maintained)</option>
                      <option value="unverified">Unverified</option>
                    </select>
                  </div>

                </div>
              )}

              {/* Row 4: Selection Stats & Quick Action */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span>
                    {t.filters.showingCount} <strong>{filteredIcons.length}</strong> / {CURATED_ICONS.length}
                  </span>
                  {selectedSlugs.length > 0 && (
                    <span className="text-indigo-600 font-semibold">
                      {selectedSlugs.length} {t.filters.selectedCount}
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
                      <span>{t.filters.resetFilters}</span>
                    </button>
                  )}

                  <button
                    id="btn-select-all"
                    onClick={handleSelectAllFiltered}
                    className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>{t.filters.selectAll}</span>
                  </button>

                  {selectedSlugs.length > 0 && (
                    <button
                      onClick={handleClearSelection}
                      className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    >
                      {t.filters.clearSelection}
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Icons Grid with Full Catalog Pagination */}
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

                {/* Pagination Controls Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-2xl px-4 py-3 border border-slate-200 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <span>
                      {t.pagination.showing} <strong>{(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredIcons.length)}</strong> / <strong>{filteredIcons.length}</strong>
                    </span>
                    <span className="text-slate-300">•</span>
                    <label className="flex items-center gap-1">
                      <span>{t.pagination.perPage}:</span>
                      <select
                        value={pageSize}
                        onChange={e => setPageSize(Number(e.target.value))}
                        className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 focus:outline-none"
                      >
                        <option value={24}>24</option>
                        <option value={36}>36</option>
                        <option value={72}>72</option>
                        <option value={144}>144</option>
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
                      <span>{t.pagination.prev}</span>
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
                            className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
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
                      <span>{t.pagination.next}</span>
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
                  {t.pagination.emptyTitle}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {t.pagination.emptyDesc}
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                >
                  {t.filters.resetFilters}
                </button>
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Upstream Sources Section */}
        {activeTab === 'sources' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <SourcesSection />
          </div>
        )}

        {/* Tab 3: Coverage & Health Section */}
        {activeTab === 'coverage' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <CoverageSection />
          </div>
        )}

        {/* Tab 4: Multi-Source Conflicts & Policy Resolution */}
        {activeTab === 'conflicts' && <ConflictsSection onInspectIcon={setInspectedIcon} />}

        {/* Tab 5: Asset Comparison Section */}
        {activeTab === 'comparison' && <AiVsOfficialSection />}

        {/* Tab 6: Pipeline CLI Scripts Panel */}
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

      {/* Full Asset Family Inspector Modal */}
      {inspectedIcon && (
        <IconInspectorModal
          icon={inspectedIcon}
          onClose={() => setInspectedIcon(null)}
          onUseAsset={handleUseAsset}
        />
      )}

      {/* Global Command Palette (Ctrl+K / Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onInspectIcon={(icon) => {
          setInspectedIcon(icon);
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            {t.footer.attribution}
          </p>
          <p className="font-mono text-slate-500">
            {t.footer.namingNorm}
          </p>
        </div>
      </footer>

    </div>
  );
}
