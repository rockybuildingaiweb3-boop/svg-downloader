import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  ChevronDown,
  RotateCcw,
  Palette,
  Compass,
  Tag,
  Heart,
  Clock,
  Command,
  LayoutGrid,
  List,
  Table as TableIcon,
  ArrowUpDown,
  Plus,
  Trash2,
  FolderPlus,
  Download,
  Copy,
  ExternalLink,
  HelpCircle,
  Eye,
  Sliders
} from 'lucide-react';
import {
  IconCategory,
  IconItem,
  IconSource,
  AssetRole,
  UsageContext,
  TrustState,
  DownloadReceipt,
  BrowseLevel,
  ConcreteAssetItem,
  SortOption,
  CoverageFilterOption,
  ViewMode,
  UserCollection,
  getSemanticSourceLabel
} from './types';
import { REGISTRY_IDENTITIES, REGISTRY_ASSETS, REGISTRY_SOURCES, REGISTRY_STATS, BUILD_METADATA, ASSET_MAP, ICON_MAP } from './data/catalog';
import { ENABLED_SOURCES, getEnabledProvidersCount } from './data/sourceRegistry';
import { CATEGORY_DEFINITIONS, TAXONOMY_DOMAINS, StandardCategoryId } from './taxonomy/taxonomy';
import { computeCategoryStats } from './taxonomy/categoryResolver';
import { Header, ActiveTabType } from './components/Header';
import { IconCard } from './components/IconCard';
import { ConcreteAssetCard } from './components/ConcreteAssetCard';
import { IconInspectorModal } from './components/IconInspectorModal';
import { BatchActionBar } from './components/BatchActionBar';
import { ScriptPanel } from './components/ScriptPanel';
import { AiVsOfficialSection } from './components/AiVsOfficialModal';
import { ConflictsSection } from './components/ConflictsSection';
import { SourcesSection } from './components/SourcesSection';
import { CoverageSection } from './components/CoverageSection';
import { CommandPalette } from './components/CommandPalette';
import { downloadZip, downloadEngineeringZip, downloadConcreteAssetsZip, downloadSingleSvg, copyRawSvg } from './utils/svgHelpers';
import { searchCatalogAssetAware, parseSearchIntent } from './utils/assetResolver';
import { useTranslation } from './i18n/context';
import {
  getLocalizedCategoryLabel,
  getLocalizedRoleLabel,
  getLocalizedContextLabel,
  getLocalizedVariantLabel,
  getLocalizedTrustLabel,
  getLocalizedStatusLabel,
  getLocalizedEntityTypeLabel,
  getLocalizedSourceLabel
} from './utils/localizedLabels';

const PRIMARY_CATEGORY_IDS = [
  'all',
  'brands',
  'technology',
  'developer-tools',
  'cloud',
  'ai',
  'web3',
  'apps',
  'social'
] as const;

export default function App() {
  const { t, format } = useTranslation();
  const [activeTab, setActiveTab] = useState<ActiveTabType>('icons');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isMoreCategoriesOpen, setIsMoreCategoriesOpen] = useState<boolean>(false);
  const moreCategoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreCategoriesRef.current && !moreCategoriesRef.current.contains(event.target as Node)) {
        setIsMoreCategoriesOpen(false);
      }
    }
    if (isMoreCategoriesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMoreCategoriesOpen]);
  
  // Local Collections: Explicit separated identity and asset models
  const [favoriteIdentityIds, setFavoriteIdentityIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('svg_registry_favorite_identities') || localStorage.getItem('svg_registry_favorites') || '[]');
    } catch {
      return [];
    }
  });

  const [favoriteAssetIds, setFavoriteAssetIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('svg_registry_favorite_assets') || '[]');
    } catch {
      return [];
    }
  });

  const [recentIdentityIds, setRecentIdentityIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('svg_registry_recent_identities') || localStorage.getItem('svg_registry_recents') || '[]');
    } catch {
      return [];
    }
  });

  const [recentAssetIds, setRecentAssetIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('svg_registry_recent_assets') || '[]');
    } catch {
      return [];
    }
  });

  const [userCollections, setUserCollections] = useState<UserCollection[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('svg_registry_user_collections') || '[]');
    } catch {
      return [];
    }
  });

  const [selectedCollection, setSelectedCollection] = useState<'all' | 'favorites' | 'recents' | 'selected' | 'custom'>('all');
  const [activeCustomCollectionId, setActiveCustomCollectionId] = useState<string | null>(null);
  const [showNewCollectionModal, setShowNewCollectionModal] = useState<boolean>(false);
  const [newCollectionName, setNewCollectionName] = useState<string>('');

  // Domain hierarchy tabs ('all' | 'technology' | 'consumer' | 'business')
  const [selectedDomain, setSelectedDomain] = useState<'all' | 'technology' | 'consumer' | 'business'>('all');

  // Standard & Advanced Filters
  const [selectedCategory, setSelectedCategory] = useState<IconCategory>('all');
  const [selectedSource, setSelectedSource] = useState<IconSource>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'verified' | 'multi-source' | 'unresolved'>('all');
  const [selectedRole, setSelectedRole] = useState<AssetRole>('all');
  const [selectedContext, setSelectedContext] = useState<UsageContext>('all');
  const [selectedVariant, setSelectedVariant] = useState<string>('all');
  const [selectedTrustState, setSelectedTrustState] = useState<'all' | TrustState>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Sorting & Coverage filtering (Tier 1 & Tier 2)
  const [selectedSort, setSelectedSort] = useState<SortOption>('relevance');
  const [selectedCoverageFilter, setSelectedCoverageFilter] = useState<CoverageFilterOption>('all');

  // View Mode: Grid, Compact, Table (Tier 2)
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(36);

  // Dual Browsing Level: 'identities' vs 'assets'
  const [browseLevel, setBrowseLevel] = useState<BrowseLevel>('identities');
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);

  // Identity active asset overrides
  const [activeAssetOverrides, setActiveAssetOverrides] = useState<Record<string, string>>({});

  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [inspectedIcon, setInspectedIcon] = useState<IconItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [collectionTarget, setCollectionTarget] = useState<{ type: 'identity' | 'asset'; id: string; title: string } | null>(null);
  const [quickNewColName, setQuickNewColName] = useState<string>('');

  // Dynamic Category Stats computed from the active registry
  const categoryStatsData = useMemo(() => {
    return computeCategoryStats(REGISTRY_IDENTITIES);
  }, []);

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

  const toggleFavoriteIdentity = (id: string) => {
    setFavoriteIdentityIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem('svg_registry_favorite_identities', JSON.stringify(next));
      } catch {}
      showToast(next.includes(id) ? format(t.toasts.addedToFavorites, { name: id }) : format(t.toasts.removedFromFavorites, { name: id }));
      return next;
    });
  };

  const toggleFavoriteAsset = (assetId: string) => {
    setFavoriteAssetIds(prev => {
      const next = prev.includes(assetId) ? prev.filter(x => x !== assetId) : [...prev, assetId];
      try {
        localStorage.setItem('svg_registry_favorite_assets', JSON.stringify(next));
      } catch {}
      showToast(next.includes(assetId) ? format(t.toasts.addedToFavorites, { name: assetId }) : format(t.toasts.removedFromFavorites, { name: assetId }));
      return next;
    });
  };

  const handleDownloadReceipt = (receipt: DownloadReceipt) => {
    setRecentIdentityIds(prev => {
      const filtered = prev.filter(x => x !== receipt.identityId);
      const next = [receipt.identityId, ...filtered].slice(0, 30);
      try {
        localStorage.setItem('svg_registry_recent_identities', JSON.stringify(next));
      } catch {}
      return next;
    });
    if (receipt.fileName) {
      setRecentAssetIds(prev => {
        const filtered = prev.filter(x => x !== receipt.fileName);
        const next = [receipt.fileName, ...filtered].slice(0, 30);
        try {
          localStorage.setItem('svg_registry_recent_assets', JSON.stringify(next));
        } catch {}
        return next;
      });
    }
    showToast(format(t.toasts.downloadedFile, { name: `${receipt.fileName} (SHA: ${receipt.rawSha256.substring(0, 8)}...)` }));
  };

  // Custom Collections CRUD
  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return;
    const newCol: UserCollection = {
      id: `col-${Date.now()}`,
      name: newCollectionName.trim(),
      identityIds: browseLevel === 'identities' ? [...selectedSlugs] : [],
      assetIds: browseLevel === 'assets' ? [...selectedAssetIds] : [],
      createdAt: new Date().toISOString()
    };
    const updated = [...userCollections, newCol];
    setUserCollections(updated);
    try {
      localStorage.setItem('svg_registry_user_collections', JSON.stringify(updated));
    } catch {}
    setNewCollectionName('');
    setShowNewCollectionModal(false);
    setActiveCustomCollectionId(newCol.id);
    setSelectedCollection('custom');
    showToast(`${newCol.name} (${t.workspace.collections})`);
  };

  const handleDeleteCollection = (id: string) => {
    const col = userCollections.find(c => c.id === id);
    const updated = userCollections.filter(c => c.id !== id);
    setUserCollections(updated);
    try {
      localStorage.setItem('svg_registry_user_collections', JSON.stringify(updated));
    } catch {}
    if (activeCustomCollectionId === id) {
      setActiveCustomCollectionId(null);
      setSelectedCollection('all');
    }
    if (col) {
      showToast(`${col.name}`);
    }
  };

  const handleToggleItemInCollection = (colId: string, itemType: 'identity' | 'asset', itemId: string) => {
    const targetCol = userCollections.find(c => c.id === colId);
    if (!targetCol) return;
    const isPresent = itemType === 'identity' ? targetCol.identityIds.includes(itemId) : targetCol.assetIds.includes(itemId);

    const updated = userCollections.map(col => {
      if (col.id !== colId) return col;
      if (itemType === 'identity') {
        return {
          ...col,
          identityIds: isPresent ? col.identityIds.filter(id => id !== itemId) : [...col.identityIds, itemId]
        };
      } else {
        return {
          ...col,
          assetIds: isPresent ? col.assetIds.filter(id => id !== itemId) : [...col.assetIds, itemId]
        };
      }
    });

    setUserCollections(updated);
    try {
      localStorage.setItem('svg_registry_user_collections', JSON.stringify(updated));
    } catch {}

    const actionText = isPresent ? 'Removed from' : 'Added to';
    showToast(`${actionText} ${targetCol.name}`);
  };

  const handleCreateCollectionWithItem = (name: string, itemType: 'identity' | 'asset', itemId: string) => {
    if (!name.trim()) return;
    const newCol: UserCollection = {
      id: `col-${Date.now()}`,
      name: name.trim(),
      identityIds: itemType === 'identity' ? [itemId] : [],
      assetIds: itemType === 'asset' ? [itemId] : [],
      createdAt: new Date().toISOString()
    };
    const updated = [...userCollections, newCol];
    setUserCollections(updated);
    try {
      localStorage.setItem('svg_registry_user_collections', JSON.stringify(updated));
    } catch {}
    setQuickNewColName('');
    showToast(`${newCol.name} (${t.workspace.collections})`);
  };

  // Helper: Authoritative identity source provider count (no guessing, no || 1)
  const getIdentitySourceCount = (icon: IconItem): number => {
    if (typeof icon.providerCount === 'number') {
      return icon.providerCount;
    }
    if (icon.sourceCoverage) {
      return Object.values(icon.sourceCoverage).filter(s => s === 'available').length;
    }
    if (icon.assets && icon.assets.length > 0) {
      const provs = new Set(icon.assets.map(a => a.sourceProvider));
      return provs.size;
    }
    if (icon.alternativeSources && icon.alternativeSources.length > 0) {
      return icon.alternativeSources.length + (icon.sourceProvider ? 1 : 0);
    }
    return icon.sourceProvider ? 1 : 0;
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedCollection,
    activeCustomCollectionId,
    selectedDomain,
    selectedCategory,
    selectedSource,
    selectedStatus,
    selectedRole,
    selectedContext,
    selectedVariant,
    selectedTrustState,
    selectedSort,
    selectedCoverageFilter,
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
    if (selectedCoverageFilter !== 'all') count++;
    return count;
  }, [selectedRole, selectedContext, selectedVariant, selectedTrustState, selectedCoverageFilter]);

  const hasActiveFilters = useMemo(() => {
    return (
      selectedDomain !== 'all' ||
      selectedCategory !== 'all' ||
      selectedSource !== 'all' ||
      selectedStatus !== 'all' ||
      selectedRole !== 'all' ||
      selectedContext !== 'all' ||
      selectedVariant !== 'all' ||
      selectedTrustState !== 'all' ||
      selectedCoverageFilter !== 'all' ||
      selectedSort !== 'relevance' ||
      searchTerm.trim() !== ''
    );
  }, [
    selectedDomain,
    selectedCategory,
    selectedSource,
    selectedStatus,
    selectedRole,
    selectedContext,
    selectedVariant,
    selectedTrustState,
    selectedCoverageFilter,
    selectedSort,
    searchTerm,
  ]);

  // Get categories available in currently selected domain
  const currentDomainCategories = useMemo(() => {
    if (selectedDomain === 'all') {
      return CATEGORY_DEFINITIONS.filter(cat => PRIMARY_CATEGORY_IDS.includes(cat.id as any));
    }
    const domainDef = TAXONOMY_DOMAINS.find(d => d.id === selectedDomain);
    if (!domainDef) return [];
    return CATEGORY_DEFINITIONS.filter(cat => domainDef.categories.includes(cat.id));
  }, [selectedDomain]);

  // Filtered icons
  const filteredIcons = useMemo(() => {
    const rawFiltered = REGISTRY_IDENTITIES.filter(icon => {
      // 0. Local Collection filter
      if (selectedCollection === 'favorites') {
        if (!favoriteIdentityIds.includes(icon.id)) return false;
      } else if (selectedCollection === 'recents') {
        if (!recentIdentityIds.includes(icon.id)) return false;
      } else if (selectedCollection === 'selected') {
        if (!selectedSlugs.includes(icon.slug)) return false;
      } else if (selectedCollection === 'custom' && activeCustomCollectionId) {
        const col = userCollections.find(c => c.id === activeCustomCollectionId);
        if (!col || (!col.identityIds.includes(icon.id) && !col.identityIds.includes(icon.slug))) return false;
      }

      // 1. Domain filter
      if (selectedDomain !== 'all') {
        const domainDef = TAXONOMY_DOMAINS.find(d => d.id === selectedDomain);
        if (domainDef) {
          const cats: string[] = Array.isArray(icon.categories) && icon.categories.length > 0
            ? icon.categories
            : (icon.category ? [icon.category] : ['uncategorized']);
          const matchesDomain = cats.some(c => domainDef.categories.includes(c as any)) ||
            (icon.primaryCategory && domainDef.categories.includes(icon.primaryCategory as any));
          if (!matchesDomain) return false;
        }
      }

      // 2. Category filter (multi-category aware)
      if (selectedCategory !== 'all') {
        const cats: string[] = Array.isArray(icon.categories) && icon.categories.length > 0
          ? icon.categories
          : (icon.category ? [icon.category] : ['uncategorized']);
        if (!cats.includes(selectedCategory) && icon.primaryCategory !== selectedCategory && icon.category !== selectedCategory) {
          return false;
        }
      }

      // 3. Source filter
      if (selectedSource !== 'all') {
        const matchesProvider = icon.sourceProvider === selectedSource ||
          (icon.sourceCoverage && icon.sourceCoverage[selectedSource] === 'available') ||
          (icon.assets && icon.assets.some(a => a.sourceProvider === selectedSource));
        if (!matchesProvider) return false;
      }

      // 4. Coverage filter (Authoritative count)
      if (selectedCoverageFilter !== 'all') {
        const count = getIdentitySourceCount(icon);
        if (selectedCoverageFilter === 'single' && count !== 1) return false;
        if (selectedCoverageFilter === 'three-plus' && count < 3) return false;
        if (selectedCoverageFilter === 'four-plus' && count < 4) return false;
        if (selectedCoverageFilter === 'five' && count < 5) return false;
      }

      // 5. Status filter
      if (selectedStatus === 'verified') {
        if (icon.verificationStatus !== 'verified') return false;
      } else if (selectedStatus === 'multi-source') {
        if (!icon.alternativeSources || icon.alternativeSources.length === 0) return false;
      } else if (selectedStatus === 'unresolved') {
        if (icon.verificationStatus !== 'unresolved') return false;
      }

      // 6. Asset Role filter
      if (selectedRole !== 'all') {
        const hasMatchingRole =
          icon.role === selectedRole ||
          (icon.assets && icon.assets.some(a => a.role === selectedRole));
        if (!hasMatchingRole) return false;
      }

      // 7. Context filter
      if (selectedContext !== 'all') {
        const hasMatchingContext =
          (icon.context && icon.context.includes(selectedContext)) ||
          (icon.assets && icon.assets.some(a => a.context && a.context.includes(selectedContext)));
        if (!hasMatchingContext) return false;
      }

      // 8. Variant filter
      if (selectedVariant !== 'all') {
        const hasMatchingVariant =
          icon.graphicVariant?.toLowerCase() === selectedVariant.toLowerCase() ||
          icon.variant?.toLowerCase() === selectedVariant.toLowerCase() ||
          (icon.assets && icon.assets.some(a => a.graphicVariant?.toLowerCase() === selectedVariant.toLowerCase()));
        if (!hasMatchingVariant) return false;
      }

      // 9. Trust State filter
      if (selectedTrustState !== 'all') {
        if (icon.trustState !== selectedTrustState) return false;
      }

      return true;
    });

    const hasOverrides = Object.keys(activeAssetOverrides).length > 0;
    const baseFiltered = hasOverrides
      ? rawFiltered.map(icon => {
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
        })
      : rawFiltered;

    // Search query
    let resultItems = baseFiltered;
    if (searchTerm.trim()) {
      const searchResults = searchCatalogAssetAware(searchTerm, baseFiltered);
      resultItems = searchResults.map(res => {
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
    }

    // Apply Sorting
    if (selectedSort !== 'relevance') {
      const cloned = [...resultItems];
      cloned.sort((a, b) => {
        if (selectedSort === 'name-asc') {
          return (a.title || '').localeCompare(b.title || '');
        }
        if (selectedSort === 'name-desc') {
          return (b.title || '').localeCompare(a.title || '');
        }
        if (selectedSort === 'most-assets') {
          return (b.assetCount ?? b.assets?.length ?? 0) - (a.assetCount ?? a.assets?.length ?? 0);
        }
        if (selectedSort === 'most-providers') {
          return getIdentitySourceCount(b) - getIdentitySourceCount(a);
        }
        if (selectedSort === 'confidence') {
          const cA = a.categoryConfidence ?? 0.8;
          const cB = b.categoryConfidence ?? 0.8;
          return cB - cA;
        }
        if (selectedSort === 'recently-updated') {
          const dA = (a as any).updatedAt || (a as any).createdAt || '';
          const dB = (b as any).updatedAt || (b as any).createdAt || '';
          return dB.localeCompare(dA);
        }
        return 0;
      });
      return cloned;
    }

    return resultItems;
  }, [
    searchTerm,
    selectedCollection,
    activeCustomCollectionId,
    userCollections,
    favoriteIdentityIds,
    recentIdentityIds,
    selectedSlugs,
    selectedDomain,
    selectedCategory,
    selectedSource,
    selectedCoverageFilter,
    selectedStatus,
    selectedRole,
    selectedContext,
    selectedVariant,
    selectedTrustState,
    selectedSort,
    activeAssetOverrides
  ]);

  // Paginated Icons (Identities Mode)
  const totalPages = Math.max(1, Math.ceil(filteredIcons.length / pageSize));
  const paginatedIcons = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredIcons.slice(startIndex, startIndex + pageSize);
  }, [filteredIcons, currentPage, pageSize]);

  // Filtered concrete assets for "Browse by Assets" mode
  const filteredAssets = useMemo(() => {
    const rawFiltered = REGISTRY_ASSETS.filter(asset => {
      // 0. Selected collection filter
      if (selectedCollection === 'favorites') {
        if (!favoriteAssetIds.includes(asset.assetId)) return false;
      } else if (selectedCollection === 'recents') {
        if (!recentAssetIds.includes(asset.file) && !recentAssetIds.includes(asset.assetId)) return false;
      } else if (selectedCollection === 'selected') {
        if (!selectedAssetIds.includes(asset.assetId)) return false;
      } else if (selectedCollection === 'custom' && activeCustomCollectionId) {
        const col = userCollections.find(c => c.id === activeCustomCollectionId);
        if (!col || (!col.assetIds.includes(asset.assetId) && !col.identityIds.includes(asset.identityId || ''))) return false;
      }

      // 1. Domain filter
      if (selectedDomain !== 'all') {
        const domainDef = TAXONOMY_DOMAINS.find(d => d.id === selectedDomain);
        if (domainDef) {
          const cats: string[] = Array.isArray(asset.categories) && asset.categories.length > 0
            ? asset.categories
            : (asset.category ? [asset.category] : ['uncategorized']);
          const matchesDomain = cats.some(c => domainDef.categories.includes(c as any)) ||
            (asset.primaryCategory && domainDef.categories.includes(asset.primaryCategory as any));
          if (!matchesDomain) return false;
        }
      }

      // 2. Category filter (multi-category aware)
      if (selectedCategory !== 'all') {
        const cats: string[] = Array.isArray(asset.categories) && asset.categories.length > 0
          ? asset.categories
          : (asset.category ? [asset.category] : ['uncategorized']);
        if (!cats.includes(selectedCategory) && asset.primaryCategory !== selectedCategory && asset.category !== selectedCategory) {
          return false;
        }
      }

      // 3. Source filter
      if (selectedSource !== 'all') {
        if (asset.sourceProvider !== selectedSource) return false;
      }

      // 4. Coverage filter
      if (selectedCoverageFilter !== 'all') {
        const parent = ICON_MAP[asset.identitySlug || asset.identityId];
        if (parent) {
          const count = getIdentitySourceCount(parent);
          if (selectedCoverageFilter === 'single' && count !== 1) return false;
          if (selectedCoverageFilter === 'three-plus' && count < 3) return false;
          if (selectedCoverageFilter === 'four-plus' && count < 4) return false;
          if (selectedCoverageFilter === 'five' && count < 5) return false;
        }
      }

      // 5. Status filter
      if (selectedStatus === 'verified' && asset.verificationStatus !== 'verified') return false;

      // 6. Role filter
      if (selectedRole !== 'all' && asset.role !== selectedRole) return false;

      // 7. Context filter
      if (selectedContext !== 'all' && (!asset.context || !asset.context.includes(selectedContext))) return false;

      // 8. Variant filter
      if (selectedVariant !== 'all' && asset.graphicVariant?.toLowerCase() !== selectedVariant.toLowerCase()) return false;

      // 9. Trust state filter
      if (selectedTrustState !== 'all' && asset.trustState !== selectedTrustState) return false;

      // 10. Search query
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchesTitle = asset.identityTitle?.toLowerCase().includes(q);
        const matchesSlug = asset.identitySlug?.toLowerCase().includes(q);
        const matchesFile = asset.file.toLowerCase().includes(q);
        const matchesId = asset.assetId.toLowerCase().includes(q);
        return matchesTitle || matchesSlug || matchesFile || matchesId;
      }

      return true;
    });

    if (selectedSort !== 'relevance') {
      const cloned = [...rawFiltered];
      cloned.sort((a, b) => {
        if (selectedSort === 'name-asc') {
          return (a.identityTitle || a.file).localeCompare(b.identityTitle || b.file);
        }
        if (selectedSort === 'name-desc') {
          return (b.identityTitle || b.file).localeCompare(a.identityTitle || a.file);
        }
        if (selectedSort === 'recently-updated') {
          const dA = (a as any).updatedAt || '';
          const dB = (b as any).updatedAt || '';
          return dB.localeCompare(dA);
        }
        return 0;
      });
      return cloned;
    }

    return rawFiltered;
  }, [
    selectedCollection,
    activeCustomCollectionId,
    userCollections,
    favoriteAssetIds,
    recentAssetIds,
    selectedAssetIds,
    selectedDomain,
    selectedCategory,
    selectedSource,
    selectedCoverageFilter,
    selectedStatus,
    selectedRole,
    selectedContext,
    selectedVariant,
    selectedTrustState,
    selectedSort,
    searchTerm
  ]);

  const totalAssetPages = Math.max(1, Math.ceil(filteredAssets.length / pageSize));
  const paginatedAssets = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAssets.slice(startIndex, startIndex + pageSize);
  }, [filteredAssets, currentPage, pageSize]);

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
    showToast(format(t.toasts.setPrimaryAsset, { name: identityId }));
  };

  const handleToggleSelect = (slug: string) => {
    setSelectedSlugs(prev => {
      const isSel = prev.includes(slug);
      return isSel ? prev.filter(s => s !== slug) : [...prev, slug];
    });
  };

  const handleToggleSelectAsset = (assetId: string) => {
    setSelectedAssetIds(prev => {
      const isSel = prev.includes(assetId);
      return isSel ? prev.filter(id => id !== assetId) : [...prev, assetId];
    });
  };

  const handleSelectAllFiltered = () => {
    if (browseLevel === 'identities') {
      const filteredSlugs = filteredIcons
        .filter(i => i.verificationStatus !== 'unresolved')
        .map(i => i.slug);
      setSelectedSlugs(prev => Array.from(new Set([...prev, ...filteredSlugs])));
      showToast(format(t.toasts.selectedAllIdentities, { count: filteredSlugs.length }));
    } else {
      const filteredIds = filteredAssets
        .filter(a => a.verificationStatus !== 'unresolved')
        .map(a => a.assetId);
      setSelectedAssetIds(prev => Array.from(new Set([...prev, ...filteredIds])));
      showToast(format(t.toasts.selectedAllAssets, { count: filteredIds.length }));
    }
  };

  const handleClearSelection = () => {
    setSelectedSlugs([]);
    setSelectedAssetIds([]);
    showToast(t.toasts.clearedSelection);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDomain('all');
    setSelectedCategory('all');
    setSelectedSource('all');
    setSelectedStatus('all');
    setSelectedRole('all');
    setSelectedContext('all');
    setSelectedVariant('all');
    setSelectedTrustState('all');
    setSelectedSort('relevance');
    setSelectedCoverageFilter('all');
    setCurrentPage(1);
    showToast(t.toasts.filtersReset);
  };

  const handleDownloadSelectedZip = async () => {
    if (browseLevel === 'identities') {
      const itemsToDownload = REGISTRY_IDENTITIES.filter(i => selectedSlugs.includes(i.slug) && i.verificationStatus !== 'unresolved');
      if (itemsToDownload.length === 0) return;
      await downloadZip(itemsToDownload, `brand-icons-${itemsToDownload.length}.zip`);
      showToast(format(t.toasts.downloadingAssets, { count: itemsToDownload.length }));
    } else {
      const assetsToDownload = selectedAssetIds
        .map(id => ASSET_MAP[id] || REGISTRY_ASSETS.find(a => a.assetId === id))
        .filter(Boolean);
      if (assetsToDownload.length === 0) return;
      await downloadConcreteAssetsZip(assetsToDownload as any[], `selected-svg-assets-${assetsToDownload.length}.zip`);
      showToast(format(t.toasts.downloadingConcreteAssets, { count: assetsToDownload.length }));
    }
  };

  const handleDownloadSelectedBundle = async () => {
    const itemsToDownload = REGISTRY_IDENTITIES.filter(i => selectedSlugs.includes(i.slug) && i.verificationStatus !== 'unresolved');
    if (itemsToDownload.length === 0) return;
    await downloadEngineeringZip(
      itemsToDownload,
      `icons-bundle-${itemsToDownload.length}.zip`
    );
    showToast(format(t.toasts.exportedBundle, { count: itemsToDownload.length }));
  };

  const handleDownloadMainstreamZip = async () => {
    const validItems = REGISTRY_IDENTITIES.filter(i => i.verificationStatus !== 'unresolved');
    await downloadZip(validItems, 'authoritative-brand-tech-svg-pack.zip');
    showToast(format(t.toasts.downloadingFullPack, { count: validItems.length }));
  };

  const handleDownloadMainstreamBundle = async () => {
    const validItems = REGISTRY_IDENTITIES.filter(i => i.verificationStatus !== 'unresolved');
    await downloadEngineeringZip(
      validItems,
      'authoritative-engineering-bundle.zip'
    );
    showToast(format(t.toasts.exportedEngineeringBundle, { count: validItems.length }));
  };

  const handleDownloadRegistryJson = () => {
    const blob = new Blob([JSON.stringify(REGISTRY_IDENTITIES, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `svg-registry-${REGISTRY_IDENTITIES.length}-identities.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(t.header.downloadRegistryJson);
  };

  const getCategoryLabel = (catId: string) => {
    return t.filters.categories[catId] || catId;
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
        totalIcons={REGISTRY_IDENTITIES.length}
        totalAssets={REGISTRY_ASSETS.length}
        totalSources={REGISTRY_SOURCES.length}
        selectedCount={browseLevel === 'identities' ? selectedSlugs.length : selectedAssetIds.length}
        onDownloadMainstreamZip={handleDownloadMainstreamZip}
        onDownloadMainstreamBundle={handleDownloadMainstreamBundle}
        onDownloadSelectedZip={handleDownloadSelectedZip}
        onDownloadRegistryJson={handleDownloadRegistryJson}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Compact Dark Status Bar (Tier 1 Requirement) */}
      <div className="bg-slate-950 text-slate-400 border-b border-slate-800 py-1.5 px-4 sm:px-6 lg:px-8 text-2xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Registry v{BUILD_METADATA.registryVersion || '2.0.0'}</span>
            </span>
            <span className="text-slate-700">·</span>
            <span className="text-slate-300">
              {BUILD_METADATA.registryGeneratedAt ? `Updated ${BUILD_METADATA.registryGeneratedAt.substring(0, 10)}` : 'Production Release'}
            </span>
            <span className="text-slate-700">·</span>
            <span className="text-indigo-300 font-medium">
              {REGISTRY_STATS.verifiedIdentities.toLocaleString()} Verified Identities
            </span>
            <span className="text-slate-700">·</span>
            <span className="text-slate-400">
              Canonical Arbitration Engine
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-400">
            <span className="text-emerald-300 flex items-center gap-1 font-medium">
              <Check className="w-3 h-3 text-emerald-400" /> {t.header.zeroFakeSvgs}
            </span>
            <span className="text-slate-700">·</span>
            <span className="text-slate-400 font-mono">
              {REGISTRY_STATS.conflictsCount} {t.header.collisionsResolved}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 pb-24">
        {/* Tab 1: Icons & Brands */}
        {activeTab === 'icons' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            
            {/* Search-First Hero Section (IA Tier 1) */}
            <div className="bg-gradient-to-b from-white via-slate-50/70 to-slate-100/50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
              <div className="max-w-3xl space-y-1.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                  {t.header.registryTitle}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.header.registrySubtitle}
                </p>
                <div className="pt-1 flex items-center gap-2 text-2xs font-mono text-slate-500 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs font-semibold text-slate-700">
                    <Layers className="w-3 h-3 text-indigo-600" />
                    <span>{REGISTRY_IDENTITIES.length.toLocaleString()} {t.header.tabIdentities.toLowerCase()}</span>
                  </span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs font-semibold text-slate-700">
                    <Sparkles className="w-3 h-3 text-pink-600" />
                    <span>{REGISTRY_ASSETS.length.toLocaleString()} {t.header.browseAssetsTitle.toLowerCase()}</span>
                  </span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs font-semibold text-slate-700">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>{ENABLED_SOURCES.length} {t.sourcesView.title.toLowerCase()}</span>
                  </span>
                </div>
              </div>

              {/* Main Prominent Search Bar */}
              <div className="relative max-w-2xl pt-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="search-icons-input"
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder={t.filters.searchPlaceholder}
                  className="w-full pl-11 pr-24 py-3 text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-xs transition-all text-slate-800 placeholder-slate-400"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {searchTerm ? (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
                      title={t.filters.clearSearchTerm}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-2xs font-mono font-medium text-slate-400 bg-slate-100 border border-slate-200 rounded-lg">
                      <Command className="w-3 h-3" />K
                    </kbd>
                  )}
                </div>
              </div>

              {/* Clean Intent Chips (No raw debug score clutter) */}
              {parsedIntent && (parsedIntent.roleConstraint || parsedIntent.contextConstraint || parsedIntent.variantPreference || (parsedIntent.sourcePreference && parsedIntent.sourcePreference !== 'all') || parsedIntent.categoryConstraint || parsedIntent.entityTypeConstraint) && (
                <div className="flex items-center gap-2 text-xs text-indigo-950 font-medium flex-wrap pt-1">
                  <span className="text-2xs font-semibold text-indigo-700 flex items-center gap-1 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    {t.filters.intentAnalysis}:
                  </span>
                  {parsedIntent.targetIdentity && (
                    <span className="bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-lg text-indigo-900 text-xs">
                      {parsedIntent.targetIdentity}
                    </span>
                  )}
                  {parsedIntent.roleConstraint && (
                    <span className="bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-lg text-indigo-900 text-xs">
                      {t.filters.roleConstraint}: {parsedIntent.roleConstraint}
                    </span>
                  )}
                  {parsedIntent.contextConstraint && (
                    <span className="bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-lg text-indigo-900 text-xs">
                      {t.filters.contextConstraint}: {parsedIntent.contextConstraint}
                    </span>
                  )}
                  {parsedIntent.variantPreference && (
                    <span className="bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-lg text-indigo-900 text-xs">
                      {t.filters.variantPreference}: {parsedIntent.variantPreference}
                    </span>
                  )}
                  {parsedIntent.sourcePreference && (
                    <span className="bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-lg text-indigo-900 text-xs">
                      {t.filters.sourcePlatform}: {parsedIntent.sourcePreference}
                    </span>
                  )}
                  {parsedIntent.categoryConstraint && (
                    <span className="bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-lg text-indigo-900 text-xs">
                      {t.filters.chipCategory}: {parsedIntent.categoryConstraint}
                    </span>
                  )}
                  {parsedIntent.entityTypeConstraint && (
                    <span className="bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-lg text-indigo-900 text-xs">
                      {t.filters.entityTypes?.[parsedIntent.entityTypeConstraint] || parsedIntent.entityTypeConstraint}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Browse Level Segmented Control & Domain Navigation */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3.5">
              
              {/* Row 1: Browse Mode + Workspace Collections Tabs */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                
                {/* Segmented Browse Mode Switcher */}
                <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80 shrink-0">
                  <button
                    id="btn-browse-identities"
                    onClick={() => { setBrowseLevel('identities'); setCurrentPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      browseLevel === 'identities'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{t.header.tabIdentities}</span>
                    <span className="font-mono text-2xs text-slate-500">({REGISTRY_IDENTITIES.length.toLocaleString()})</span>
                  </button>
                  <button
                    id="btn-browse-assets"
                    onClick={() => { setBrowseLevel('assets'); setCurrentPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      browseLevel === 'assets'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                    <span>{t.header.assetsWord}</span>
                    <span className="font-mono text-2xs text-slate-500">({REGISTRY_ASSETS.length.toLocaleString()})</span>
                  </button>
                </div>

                {/* Workspace Tabs: All, Favorites, Recents, Custom Collections */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar flex-wrap">
                  <button
                    id="tab-collection-all"
                    onClick={() => { setSelectedCollection('all'); setActiveCustomCollectionId(null); }}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      selectedCollection === 'all'
                        ? 'bg-slate-900 text-white shadow-xs font-semibold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{t.filters.collections.all}</span>
                  </button>

                  <button
                    id="tab-collection-favorites"
                    onClick={() => { setSelectedCollection('favorites'); setActiveCustomCollectionId(null); }}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      selectedCollection === 'favorites'
                        ? 'bg-rose-600 text-white shadow-xs font-semibold'
                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${selectedCollection === 'favorites' ? 'fill-current' : ''}`} />
                    <span>{t.filters.collections.favorites}</span>
                    <span className="font-mono text-2xs">({browseLevel === 'identities' ? favoriteIdentityIds.length : favoriteAssetIds.length})</span>
                  </button>

                  <button
                    id="tab-collection-recents"
                    onClick={() => { setSelectedCollection('recents'); setActiveCustomCollectionId(null); }}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      selectedCollection === 'recents'
                        ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t.filters.collections.recents}</span>
                    <span className="font-mono text-2xs">({browseLevel === 'identities' ? recentIdentityIds.length : recentAssetIds.length})</span>
                  </button>

                  {userCollections.map(col => (
                    <div key={col.id} className="relative inline-flex items-center">
                      <button
                        onClick={() => { setSelectedCollection('custom'); setActiveCustomCollectionId(col.id); }}
                        className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                          selectedCollection === 'custom' && activeCustomCollectionId === col.id
                            ? 'bg-purple-700 text-white shadow-xs font-semibold'
                            : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                        }`}
                      >
                        <FolderPlus className="w-3.5 h-3.5" />
                        <span>{col.name}</span>
                        <span className="font-mono text-2xs">({browseLevel === 'identities' ? col.identityIds.length : col.assetIds.length})</span>
                      </button>
                      {activeCustomCollectionId === col.id && (
                        <button
                          onClick={() => handleDeleteCollection(col.id)}
                          className="ml-1 p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                          title={t.workspace.deleteCollection}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={() => setShowNewCollectionModal(true)}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                    title={t.workspace.createCollection}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.workspace.createCollection}</span>
                  </button>

                  {(browseLevel === 'identities' ? selectedSlugs.length : selectedAssetIds.length) > 0 && (
                    <button
                      id="tab-collection-selected"
                      onClick={() => { setSelectedCollection('selected'); setActiveCustomCollectionId(null); }}
                      className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                        selectedCollection === 'selected'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                      }`}
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>{t.filters.collections.selected} ({browseLevel === 'identities' ? selectedSlugs.length : selectedAssetIds.length})</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Row 2: Hierarchical Domain Tabs (Technology, Consumer, Business) */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
                  <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider mr-1">
                    {t.filters.categories.all}:
                  </span>
                  {(['all', 'technology', 'consumer', 'business'] as const).map(domainKey => (
                    <button
                      key={domainKey}
                      onClick={() => {
                        setSelectedDomain(domainKey);
                        setSelectedCategory('all');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        selectedDomain === domainKey
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {t.filters.domainOptions[domainKey] || domainKey}
                    </button>
                  ))}
                </div>

                {/* Subcategory Pills corresponding to selected domain */}
                <div className="flex items-center gap-1.5 flex-wrap text-xs pt-1">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-indigo-600 text-white font-semibold shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{selectedDomain === 'all' ? t.filters.categories.all : `${t.filters.domainOptions[selectedDomain] || selectedDomain} (All)`}</span>
                  </button>

                  {currentDomainCategories.map(cat => {
                    const stat = categoryStatsData.categoryStats[cat.id];
                    const count = stat ? stat.identitiesCount : 0;
                    if (count === 0 && cat.id !== 'all') return null;

                    return (
                      <button
                        key={cat.id}
                        id={`filter-cat-${cat.id}`}
                        onClick={() => setSelectedCategory(cat.id as any)}
                        className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                          selectedCategory === cat.id
                            ? 'bg-slate-800 text-white shadow-2xs font-semibold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                        }`}
                      >
                        <span>{getCategoryLabel(cat.id)}</span>
                        <span className={`text-2xs px-1.5 py-0.2 rounded-full font-mono ${
                          selectedCategory === cat.id ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {count.toLocaleString()}
                        </span>
                      </button>
                    );
                  })}

                  {/* More Categories Dropdown when on 'all' domain */}
                  {selectedDomain === 'all' && (() => {
                    const secondaryCats = CATEGORY_DEFINITIONS.filter(cat => !PRIMARY_CATEGORY_IDS.includes(cat.id as any));
                    const isSecondaryActive = secondaryCats.some(cat => cat.id === selectedCategory);
                    const activeSecondaryCat = secondaryCats.find(cat => cat.id === selectedCategory);

                    return (
                      <div className="relative inline-block" ref={moreCategoriesRef}>
                        <button
                          id="btn-more-categories"
                          type="button"
                          onClick={() => setIsMoreCategoriesOpen(prev => !prev)}
                          className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                            isSecondaryActive
                              ? 'bg-slate-900 text-white shadow-xs font-semibold'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                          }`}
                        >
                          <span>
                            {isSecondaryActive && activeSecondaryCat
                              ? getCategoryLabel(activeSecondaryCat.id)
                              : t.filters.moreCategories}
                          </span>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMoreCategoriesOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isMoreCategoriesOpen && (
                          <div className="absolute left-0 mt-1.5 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-72 overflow-y-auto">
                            <div className="space-y-1">
                              {secondaryCats.map(cat => {
                                const stat = categoryStatsData.categoryStats[cat.id];
                                const count = stat ? stat.identitiesCount : 0;
                                if (count === 0) return null;
                                const isSelected = selectedCategory === cat.id;

                                return (
                                  <button
                                    key={cat.id}
                                    id={`filter-cat-${cat.id}`}
                                    onClick={() => {
                                      setSelectedCategory(cat.id as any);
                                      setIsMoreCategoriesOpen(false);
                                    }}
                                    className={`w-full px-3 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                                      isSelected
                                        ? 'bg-indigo-50 text-indigo-900 font-semibold'
                                        : 'text-slate-700 hover:bg-slate-100'
                                    }`}
                                  >
                                    <span>{getCategoryLabel(cat.id)}</span>
                                    <span className={`text-2xs px-1.5 py-0.5 rounded-full font-mono ${
                                      isSelected ? 'bg-indigo-200/80 text-indigo-800' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                      {count.toLocaleString()}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Row 3: Sort, Coverage Filter, Source Platform, Advanced Filters, View Mode */}
              <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                
                {/* Left controls: Sorting & Coverage Dropdowns */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                    <label htmlFor="select-sort" className="text-2xs text-slate-500 font-medium">
                      {t.filters.sortLabel}:
                    </label>
                    <select
                      id="select-sort"
                      value={selectedSort}
                      onChange={e => setSelectedSort(e.target.value as SortOption)}
                      className="text-xs bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option value="relevance">{t.filters.sortOptions.relevance}</option>
                      <option value="name-asc">{t.filters.sortOptions['name-asc']}</option>
                      <option value="name-desc">{t.filters.sortOptions['name-desc']}</option>
                      <option value="most-assets">{t.filters.sortOptions['most-assets']}</option>
                      <option value="most-providers">{t.filters.sortOptions['most-providers']}</option>
                      <option value="confidence">{t.filters.sortOptions.confidence}</option>
                      <option value="recently-updated">{t.filters.sortOptions['recently-updated']}</option>
                    </select>
                  </div>

                  {/* Coverage Filter Dropdown */}
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <label htmlFor="select-coverage" className="text-2xs text-slate-500 font-medium">
                      {t.filters.coverageFilterLabel}:
                    </label>
                    <select
                      id="select-coverage"
                      value={selectedCoverageFilter}
                      onChange={e => setSelectedCoverageFilter(e.target.value as CoverageFilterOption)}
                      className="text-xs bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option value="all">{t.filters.coverageFilterOptions.all}</option>
                      <option value="single">{t.filters.coverageFilterOptions.single}</option>
                      <option value="three-plus">{t.filters.coverageFilterOptions['three-plus']}</option>
                      <option value="four-plus">{t.filters.coverageFilterOptions['four-plus']}</option>
                      <option value="five">{t.filters.coverageFilterOptions.five}</option>
                    </select>
                  </div>

                  {/* Source Platform Filter */}
                  <div className="flex items-center gap-1 overflow-x-auto text-xs no-scrollbar">
                    {[
                      { id: 'all', label: t.filters.allSources },
                      ...ENABLED_SOURCES.map(src => ({
                        id: src.id,
                        label: getLocalizedSourceLabel(src.id, t) || src.name
                      }))
                    ].map(src => (
                      <button
                        key={src.id}
                        onClick={() => setSelectedSource(src.id as any)}
                        className={`px-2 py-1 rounded-lg text-2xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                          selectedSource === src.id
                            ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {src.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right controls: Advanced Filter Toggle & View Mode Switcher */}
                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                  <button
                    id="btn-toggle-advanced-filters"
                    onClick={() => setShowAdvancedFilters(prev => !prev)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
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

                  {/* View Mode Switcher (Grid / Compact / Table) */}
                  <div className="inline-flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded-xl">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                      title={t.filters.viewModeOptions.grid}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('compact')}
                      className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        viewMode === 'compact' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                      title={t.filters.viewModeOptions.compact}
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                      title={t.filters.viewModeOptions.table}
                    >
                      <TableIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Active Filter Chips */}
              {hasActiveFilters && (
                <div className="flex items-center gap-1.5 flex-wrap pt-2.5 pb-1 border-t border-slate-100 animate-in fade-in duration-150">
                  <span className="text-2xs font-bold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
                    <Filter className="w-3 h-3 text-indigo-500" />
                    <span>{t.filters.activeFilters}:</span>
                  </span>

                  {selectedDomain !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                      <span>Domain: {t.filters.domainOptions[selectedDomain]}</span>
                      <button
                        onClick={() => setSelectedDomain('all')}
                        className="hover:text-slate-950 cursor-pointer ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedCategory !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                      <span>{format(t.filters.chipCategory, { value: getLocalizedCategoryLabel(selectedCategory, t) })}</span>
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className="hover:text-indigo-950 cursor-pointer ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedCoverageFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span>Coverage: {t.filters.coverageFilterOptions[selectedCoverageFilter]}</span>
                      <button
                        onClick={() => setSelectedCoverageFilter('all')}
                        className="hover:text-emerald-950 cursor-pointer ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedSource !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">
                      <span>{format(t.filters.chipSource, { value: getSemanticSourceLabel(selectedSource) })}</span>
                      <button
                        onClick={() => setSelectedSource('all')}
                        className="hover:text-sky-950 cursor-pointer ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedStatus !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span>{format(t.filters.chipStatus, { value: getLocalizedStatusLabel(selectedStatus, t) })}</span>
                      <button
                        onClick={() => setSelectedStatus('all')}
                        className="hover:text-emerald-950 cursor-pointer ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedRole !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                      <span>{format(t.filters.chipRole, { value: getLocalizedRoleLabel(selectedRole, t) })}</span>
                      <button
                        onClick={() => setSelectedRole('all')}
                        className="hover:text-purple-950 cursor-pointer ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedContext !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      <span>{format(t.filters.chipContext, { value: getLocalizedContextLabel(selectedContext, t) })}</span>
                      <button
                        onClick={() => setSelectedContext('all')}
                        className="hover:text-blue-950 cursor-pointer ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedVariant !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-pink-50 text-pink-700 border border-pink-200">
                      <span>{format(t.filters.chipVariant, { value: getLocalizedVariantLabel(selectedVariant, t) })}</span>
                      <button
                        onClick={() => setSelectedVariant('all')}
                        className="hover:text-pink-950 cursor-pointer ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedTrustState !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                      <span>{format(t.filters.chipTrust, { value: getLocalizedTrustLabel(selectedTrustState, t) })}</span>
                      <button
                        onClick={() => setSelectedTrustState('all')}
                        className="hover:text-teal-950 cursor-pointer ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {searchTerm.trim() !== '' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                      <span>{format(t.filters.chipSearch, { value: searchTerm })}</span>
                      <button
                        onClick={() => setSearchTerm('')}
                        className="hover:text-amber-950 cursor-pointer ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1 text-2xs font-semibold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer ml-1"
                  >
                    <X className="w-3 h-3" />
                    <span>{t.filters.clearAll}</span>
                  </button>
                </div>
              )}

              {/* Advanced Filtering Drawer */}
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
                      <option value="all">{t.filters.roleOptions.all || t.filters.allRoles}</option>
                      <option value="symbol">{t.filters.roleOptions.symbol}</option>
                      <option value="logo">{t.filters.roleOptions.logo}</option>
                      <option value="wordmark">{t.filters.roleOptions.wordmark}</option>
                      <option value="app-icon">{t.filters.roleOptions['app-icon']}</option>
                      <option value="favicon">{t.filters.roleOptions.favicon}</option>
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
                      <option value="all">{t.filters.contextOptions.all || t.filters.allContexts}</option>
                      <option value="web">{t.filters.contextOptions.web}</option>
                      <option value="desktop">{t.filters.contextOptions.desktop}</option>
                      <option value="mobile">{t.filters.contextOptions.mobile}</option>
                      <option value="avatar">{t.filters.contextOptions.avatar}</option>
                      <option value="app-store">{t.filters.contextOptions['app-store']}</option>
                      <option value="social">{t.filters.contextOptions.social}</option>
                      <option value="general">{t.filters.contextOptions.general}</option>
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
                      <option value="all">{t.filters.variantOptions.all || t.filters.allVariants}</option>
                      <option value="color">{t.filters.variantOptions.color}</option>
                      <option value="monochrome">{t.filters.variantOptions.monochrome}</option>
                      <option value="original">{t.filters.variantOptions.original}</option>
                      <option value="plain">{t.filters.variantOptions.plain}</option>
                      <option value="line">{t.filters.variantOptions.line}</option>
                      <option value="wordmark">{t.filters.variantOptions.wordmark}</option>
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
                      <option value="all">{t.filters.trustOptions.all || t.filters.allTrustStates}</option>
                      <option value="trusted">{t.filters.trustOptions.trusted}</option>
                      <option value="verified">{t.filters.trustOptions.verified}</option>
                      <option value="community">{t.filters.trustOptions.community}</option>
                      <option value="unverified">{t.filters.trustOptions.unverified}</option>
                      <option value="unknown">{t.filters.trustOptions.unknown || 'Unknown'}</option>
                    </select>
                  </div>

                </div>
              )}

              {/* Selection Bar & Select All */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span>
                    {browseLevel === 'identities' ? (
                      <>
                        <strong className="text-slate-900">{filteredIcons.length.toLocaleString()}</strong> {t.header.tabIdentities.toLowerCase()} · <strong className="text-slate-900">{filteredIcons.reduce((acc, icon) => acc + (icon.assetCount ?? icon.assets?.length ?? 0), 0).toLocaleString()}</strong> {t.header.browseAssetsTitle.toLowerCase()}
                      </>
                    ) : (
                      <>
                        <strong className="text-slate-900">{filteredAssets.length.toLocaleString()}</strong> {t.header.browseAssetsTitle.toLowerCase()}
                      </>
                    )}
                  </span>
                  {(browseLevel === 'identities' ? selectedSlugs.length : selectedAssetIds.length) > 0 && (
                    <span className="text-indigo-600 font-semibold">
                      {browseLevel === 'identities' ? selectedSlugs.length : selectedAssetIds.length} {t.filters.selectedCount}
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

                  {(browseLevel === 'identities' ? selectedSlugs.length : selectedAssetIds.length) > 0 && (
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

            {/* Results Rendering (Grid, Compact, Table, or Rich Empty State) */}
            {(browseLevel === 'identities' ? filteredIcons.length : filteredAssets.length) > 0 ? (
              <div className="space-y-4">
                
                {/* 1. Grid View Mode */}
                {viewMode === 'grid' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                    {browseLevel === 'identities'
                      ? paginatedIcons.map(icon => (
                          <IconCard
                            key={icon.slug}
                            icon={icon}
                            isSelected={selectedSlugs.includes(icon.slug)}
                            onToggleSelect={handleToggleSelect}
                            onInspect={setInspectedIcon}
                            isFavorite={favoriteIdentityIds.includes(icon.id)}
                            onToggleFavorite={toggleFavoriteIdentity}
                            onAddToCollection={(id) => setCollectionTarget({ type: 'identity', id, title: icon.title })}
                            onDownloadReceipt={handleDownloadReceipt}
                          />
                        ))
                      : paginatedAssets.map(asset => {
                          const parent = ICON_MAP[asset.identitySlug || asset.identityId];
                          return (
                            <ConcreteAssetCard
                              key={asset.assetId}
                              asset={asset}
                              parentIcon={parent}
                              isSelected={selectedAssetIds.includes(asset.assetId)}
                              onToggleSelect={handleToggleSelectAsset}
                              onInspect={(icon) => setInspectedIcon(icon)}
                              isFavorite={favoriteAssetIds.includes(asset.assetId)}
                              onToggleFavorite={toggleFavoriteAsset}
                              onAddToCollection={(id) => setCollectionTarget({ type: 'asset', id, title: asset.title || asset.assetId })}
                              onDownloadReceipt={handleDownloadReceipt}
                            />
                          );
                        })
                    }
                  </div>
                )}

                {/* 2. Compact View Mode */}
                {viewMode === 'compact' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2.5">
                    {browseLevel === 'identities'
                      ? paginatedIcons.map(icon => {
                          const isSel = selectedSlugs.includes(icon.slug);
                          const isFav = favoriteIdentityIds.includes(icon.id);
                          return (
                            <article
                              key={icon.slug}
                              className={`bg-white rounded-xl border p-2.5 flex flex-col justify-between transition-all group relative ${
                                isSel ? 'border-indigo-600 ring-2 ring-indigo-500/20' : 'border-slate-200/90 hover:border-indigo-300 hover:shadow-xs'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1 mb-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleToggleSelect(icon.slug)}
                                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                                    isSel ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 hover:border-slate-400 bg-white'
                                  }`}
                                  aria-label={isSel ? t.filters.clearSelection : t.filters.selectAll}
                                >
                                  {isSel && <Check className="w-3 h-3 stroke-[3]" />}
                                </button>

                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => toggleFavoriteIdentity(icon.id)}
                                    className={`p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer ${
                                      isFav ? 'text-rose-600' : 'text-slate-300 hover:text-slate-600'
                                    }`}
                                    aria-label={isFav ? t.card.removeFromFavorites : t.card.addToFavorites}
                                  >
                                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                                  </button>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => setInspectedIcon(icon)}
                                className="flex flex-col items-center justify-center py-2 text-center group cursor-pointer focus:outline-none"
                              >
                                <div className="w-10 h-10 flex items-center justify-center mb-1.5">
                                  <img
                                    src={`/icons/${icon.fileName}`}
                                    alt={icon.title}
                                    className="w-8 h-8 object-contain group-hover:scale-110 transition-transform"
                                    loading="lazy"
                                  />
                                </div>
                                <span className="text-xs font-semibold text-slate-900 truncate w-full group-hover:text-indigo-600">
                                  {icon.title}
                                </span>
                              </button>

                              <div className="flex items-center justify-between gap-1 pt-2 border-t border-slate-100 text-2xs text-slate-500">
                                <span className="truncate">
                                  {icon.primaryCategory || icon.category || 'brand'}
                                </span>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    await downloadSingleSvg(icon.fileName, icon.title);
                                    handleDownloadReceipt({
                                      identityId: icon.id,
                                      title: icon.title,
                                      fileName: icon.fileName,
                                      fileSize: 1024,
                                      sourceProvider: icon.sourceProvider,
                                      sourcePlatform: icon.sourcePlatform || icon.sourceProvider,
                                      role: icon.role || 'logo',
                                      graphicVariant: icon.graphicVariant || 'default',
                                      rawSha256: icon.sha256,
                                      license: icon.license,
                                      verificationStatus: icon.verificationStatus,
                                      timestamp: new Date().toISOString()
                                    });
                                  }}
                                  className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors cursor-pointer"
                                  title={t.card.downloadCanonical}
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </article>
                          );
                        })
                      : paginatedAssets.map(asset => {
                          const isSel = selectedAssetIds.includes(asset.assetId);
                          const isFav = favoriteAssetIds.includes(asset.assetId);
                          const parent = ICON_MAP[asset.identitySlug || asset.identityId];
                          return (
                            <article
                              key={asset.assetId}
                              className={`bg-white rounded-xl border p-2.5 flex flex-col justify-between transition-all group relative ${
                                isSel ? 'border-indigo-600 ring-2 ring-indigo-500/20' : 'border-slate-200/90 hover:border-indigo-300 hover:shadow-xs'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1 mb-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleToggleSelectAsset(asset.assetId)}
                                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                                    isSel ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 hover:border-slate-400 bg-white'
                                  }`}
                                  aria-label={isSel ? t.filters.clearSelection : t.filters.selectAll}
                                >
                                  {isSel && <Check className="w-3 h-3 stroke-[3]" />}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => toggleFavoriteAsset(asset.assetId)}
                                  className={`p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer ${
                                    isFav ? 'text-rose-600' : 'text-slate-300 hover:text-slate-600'
                                  }`}
                                  aria-label={isFav ? t.card.removeFromFavorites : t.card.addToFavorites}
                                >
                                  <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => parent && setInspectedIcon(parent)}
                                className="flex flex-col items-center justify-center py-2 text-center group cursor-pointer focus:outline-none"
                              >
                                <div className="w-10 h-10 flex items-center justify-center mb-1.5">
                                  <img
                                    src={`/icons/${asset.file}`}
                                    alt={asset.identityTitle}
                                    className="w-8 h-8 object-contain group-hover:scale-110 transition-transform"
                                    loading="lazy"
                                  />
                                </div>
                                <span className="text-xs font-semibold text-slate-900 truncate w-full group-hover:text-indigo-600">
                                  {asset.identityTitle}
                                </span>
                              </button>

                              <div className="flex items-center justify-between gap-1 pt-2 border-t border-slate-100 text-2xs text-slate-500">
                                <span className="font-mono text-3xs truncate">
                                  {asset.sourceProvider}
                                </span>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    await downloadSingleSvg(asset.file, asset.identityTitle);
                                    handleDownloadReceipt({
                                      identityId: asset.identityId || asset.assetId,
                                      title: asset.identityTitle || asset.identityId,
                                      fileName: asset.file,
                                      fileSize: 1024,
                                      sourceProvider: asset.sourceProvider,
                                      sourcePlatform: asset.sourcePlatform || asset.sourceProvider,
                                      role: asset.role,
                                      graphicVariant: asset.graphicVariant,
                                      rawSha256: asset.rawSha256,
                                      license: asset.license,
                                      verificationStatus: asset.verificationStatus,
                                      timestamp: new Date().toISOString()
                                    });
                                  }}
                                  className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors cursor-pointer"
                                  title={t.card.downloadThisSvg}
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </article>
                          );
                        })
                    }
                  </div>
                )}

                {/* 3. Table View Mode */}
                {viewMode === 'table' && (
                  <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200/90 shadow-xs">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-2xs font-bold text-slate-600 uppercase tracking-wider">
                          <th scope="col" className="p-3 w-10 text-center">
                            <CheckSquare className="w-3.5 h-3.5 text-slate-400 mx-auto" />
                          </th>
                          <th scope="col" className="p-3 w-14 text-center">{t.tableView.previewCol}</th>
                          <th scope="col" className="p-3 font-semibold">{t.tableView.identityCol}</th>
                          <th scope="col" className="p-3 font-semibold">{t.tableView.categoryCol}</th>
                          <th scope="col" className="p-3 font-semibold">{t.tableView.coverageCol}</th>
                          <th scope="col" className="p-3 font-semibold">{t.tableView.fileCol}</th>
                          <th scope="col" className="p-3 font-semibold">{t.tableView.statusCol}</th>
                          <th scope="col" className="p-3 text-right font-semibold">{t.tableView.actionsCol}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {browseLevel === 'identities'
                          ? paginatedIcons.map(icon => {
                              const isSel = selectedSlugs.includes(icon.slug);
                              const isFav = favoriteIdentityIds.includes(icon.id);
                              const srcCount = getIdentitySourceCount(icon);
                              return (
                                <tr key={icon.slug} className="hover:bg-slate-50/70 transition-colors">
                                  <td className="p-3 text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleSelect(icon.slug)}
                                      className={`w-4 h-4 rounded border mx-auto flex items-center justify-center transition-colors cursor-pointer ${
                                        isSel ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 hover:border-slate-400 bg-white'
                                      }`}
                                    >
                                      {isSel && <Check className="w-3 h-3 stroke-[3]" />}
                                    </button>
                                  </td>
                                  <td className="p-3 text-center">
                                    <button
                                      type="button"
                                      onClick={() => setInspectedIcon(icon)}
                                      className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto hover:border-indigo-300 transition-colors cursor-pointer"
                                    >
                                      <img src={`/icons/${icon.fileName}`} alt={icon.title} className="w-6 h-6 object-contain" loading="lazy" />
                                    </button>
                                  </td>
                                  <td className="p-3">
                                    <button
                                      type="button"
                                      onClick={() => setInspectedIcon(icon)}
                                      className="font-bold text-slate-900 hover:text-indigo-600 transition-colors text-left block"
                                    >
                                      {icon.title}
                                    </button>
                                    <span className="font-mono text-2xs text-slate-400 block">{icon.slug}</span>
                                  </td>
                                  <td className="p-3 text-slate-600">
                                    <span className="font-medium text-slate-800">{getLocalizedCategoryLabel(icon.primaryCategory || icon.category || 'uncategorized', t)}</span>
                                    <span className="text-slate-400 block text-2xs capitalize">{icon.entityType || 'brand'}</span>
                                  </td>
                                  <td className="p-3">
                                    <div className="flex items-center gap-1 text-2xs font-mono">
                                      {ENABLED_SOURCES.map(src => {
                                        const isAvail = (icon.sourceCoverage && icon.sourceCoverage[src.id] === 'available') || icon.sourceProvider === src.id;
                                        return (
                                          <span
                                            key={src.id}
                                            className={`inline-block w-2 h-2 rounded-full ${isAvail ? 'bg-emerald-500' : 'bg-slate-200'}`}
                                            title={`${src.name}: ${isAvail ? 'Available' : 'Unavailable'}`}
                                          />
                                        );
                                      })}
                                      <span className="ml-1 text-slate-500 font-sans">
                                        ({srcCount}/{ENABLED_SOURCES.length})
                                      </span>
                                    </div>
                                  </td>
                                  <td className="p-3">
                                    <span className="font-mono text-2xs text-slate-700 block truncate max-w-[140px]">{icon.fileName}</span>
                                    <span className="font-mono text-3xs text-slate-400 block truncate max-w-[140px]">{icon.sha256?.substring(0, 16)}...</span>
                                  </td>
                                  <td className="p-3">
                                    <span className="inline-flex items-center gap-1 text-2xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                      {t.card.verifiedSvg}
                                    </span>
                                  </td>
                                  <td className="p-3 text-right">
                                    <div className="inline-flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => toggleFavoriteIdentity(icon.id)}
                                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                          isFav ? 'bg-rose-50 border-rose-200 text-rose-600' : 'border-slate-200 text-slate-400 hover:text-slate-700'
                                        }`}
                                        title={isFav ? t.card.removeFromFavorites : t.card.addToFavorites}
                                      >
                                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          await downloadSingleSvg(icon.fileName, icon.title);
                                          handleDownloadReceipt({
                                            identityId: icon.id,
                                            title: icon.title,
                                            fileName: icon.fileName,
                                            fileSize: 1024,
                                            sourceProvider: icon.sourceProvider,
                                            sourcePlatform: icon.sourcePlatform || icon.sourceProvider,
                                            role: icon.role || 'logo',
                                            graphicVariant: icon.graphicVariant || 'default',
                                            rawSha256: icon.sha256,
                                            license: icon.license,
                                            verificationStatus: icon.verificationStatus,
                                            timestamp: new Date().toISOString()
                                          });
                                        }}
                                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors cursor-pointer"
                                        title={t.card.downloadCanonical}
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          : paginatedAssets.map(asset => {
                              const isSel = selectedAssetIds.includes(asset.assetId);
                              const isFav = favoriteAssetIds.includes(asset.assetId);
                              const parent = ICON_MAP[asset.identitySlug || asset.identityId];
                              return (
                                <tr key={asset.assetId} className="hover:bg-slate-50/70 transition-colors">
                                  <td className="p-3 text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleSelectAsset(asset.assetId)}
                                      className={`w-4 h-4 rounded border mx-auto flex items-center justify-center transition-colors cursor-pointer ${
                                        isSel ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 hover:border-slate-400 bg-white'
                                      }`}
                                    >
                                      {isSel && <Check className="w-3 h-3 stroke-[3]" />}
                                    </button>
                                  </td>
                                  <td className="p-3 text-center">
                                    <button
                                      type="button"
                                      onClick={() => parent && setInspectedIcon(parent)}
                                      className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto hover:border-indigo-300 transition-colors cursor-pointer"
                                    >
                                      <img src={`/icons/${asset.file}`} alt={asset.identityTitle} className="w-6 h-6 object-contain" loading="lazy" />
                                    </button>
                                  </td>
                                  <td className="p-3">
                                    <span className="font-bold text-slate-900 block">{asset.identityTitle}</span>
                                    <span className="font-mono text-2xs text-slate-400 block">{asset.assetId}</span>
                                  </td>
                                  <td className="p-3 text-slate-600">
                                    <span className="font-medium text-slate-800 capitalize">{asset.role}</span>
                                    <span className="text-slate-400 block text-2xs capitalize">{asset.graphicVariant || 'default'}</span>
                                  </td>
                                  <td className="p-3">
                                    <span className="font-mono text-2xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                      {asset.sourceProvider}
                                    </span>
                                  </td>
                                  <td className="p-3">
                                    <span className="font-mono text-2xs text-slate-700 block truncate max-w-[140px]">{asset.file}</span>
                                    <span className="font-mono text-3xs text-slate-400 block truncate max-w-[140px]">{asset.rawSha256?.substring(0, 16)}...</span>
                                  </td>
                                  <td className="p-3">
                                    <span className="inline-flex items-center gap-1 text-2xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                      {t.card.verifiedSvg}
                                    </span>
                                  </td>
                                  <td className="p-3 text-right">
                                    <div className="inline-flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => toggleFavoriteAsset(asset.assetId)}
                                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                          isFav ? 'bg-rose-50 border-rose-200 text-rose-600' : 'border-slate-200 text-slate-400 hover:text-slate-700'
                                        }`}
                                        title={isFav ? t.card.removeFromFavorites : t.card.addToFavorites}
                                      >
                                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          await downloadSingleSvg(asset.file, asset.identityTitle);
                                          handleDownloadReceipt({
                                            identityId: asset.identityId || asset.assetId,
                                            title: asset.identityTitle || asset.identityId,
                                            fileName: asset.file,
                                            fileSize: 1024,
                                            sourceProvider: asset.sourceProvider,
                                            sourcePlatform: asset.sourcePlatform || asset.sourceProvider,
                                            role: asset.role,
                                            graphicVariant: asset.graphicVariant,
                                            rawSha256: asset.rawSha256,
                                            license: asset.license,
                                            verificationStatus: asset.verificationStatus,
                                            timestamp: new Date().toISOString()
                                          });
                                        }}
                                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors cursor-pointer"
                                        title={t.card.downloadThisSvg}
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                        }
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination Controls Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-2xl px-4 py-3 border border-slate-200 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <span>
                      {t.pagination.showing} <strong>{(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, browseLevel === 'identities' ? filteredIcons.length : filteredAssets.length)}</strong> / <strong>{browseLevel === 'identities' ? filteredIcons.length : filteredAssets.length}</strong>
                    </span>
                    <span className="text-slate-300">•</span>
                    <label className="flex items-center gap-1">
                      <span>{t.pagination.perPage}:</span>
                      <select
                        value={pageSize}
                        onChange={e => setPageSize(Number(e.target.value))}
                        className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 focus:outline-none cursor-pointer"
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
                    {(() => {
                      const activeTotalPages = browseLevel === 'identities' ? totalPages : totalAssetPages;
                      return (
                        <>
                          <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                            <span>{t.pagination.prev}</span>
                          </button>

                          <div className="flex items-center gap-1 px-1">
                            {Array.from({ length: Math.min(5, activeTotalPages) }, (_, i) => {
                              let pageNum = i + 1;
                              if (activeTotalPages > 5 && currentPage > 3) {
                                pageNum = Math.min(activeTotalPages - 4 + i, currentPage - 2 + i);
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
                            onClick={() => setCurrentPage(p => Math.min(activeTotalPages, p + 1))}
                            disabled={currentPage === activeTotalPages}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span>{t.pagination.next}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </>
                      );
                    })()}
                  </div>
                </div>

              </div>
            ) : (
              /* Rich Context-Aware Empty State (Tier 2 UX) */
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/90 p-8 space-y-4 max-w-xl mx-auto shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100">
                  <Search className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">
                    {t.emptyStates.noResultsTitle}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    {t.emptyStates.noResultsDesc}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left space-y-2 text-xs">
                  <span className="font-bold text-slate-700 block text-2xs uppercase tracking-wider">
                    {t.emptyStates.viewAlternatives}:
                  </span>
                  <ul className="space-y-1 text-slate-600 text-xs">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span>{t.emptyStates.clearFilters}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span>{t.emptyStates.noExactMatch}</span>
                    </li>
                  </ul>
                </div>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    {t.emptyStates.clearFilters}
                  </button>
                  {browseLevel === 'identities' ? (
                    <button
                      onClick={() => setBrowseLevel('assets')}
                      className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer border border-indigo-200"
                    >
                      {t.header.browseAssetsTitle}
                    </button>
                  ) : (
                    <button
                      onClick={() => setBrowseLevel('identities')}
                      className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer border border-indigo-200"
                    >
                      {t.header.browseIdentitiesTitle}
                    </button>
                  )}
                </div>
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
        selectedCount={browseLevel === 'identities' ? selectedSlugs.length : selectedAssetIds.length}
        totalFilteredCount={browseLevel === 'identities' ? filteredIcons.length : filteredAssets.length}
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

      {/* Create New Workspace Collection Modal */}
      {showNewCollectionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-indigo-600" />
                <span>{t.workspace.createCollection}</span>
              </h3>
              <button
                onClick={() => setShowNewCollectionModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="input-collection-name" className="text-2xs font-bold text-slate-600">
                {t.workspace.collectionNamePlaceholder}:
              </label>
              <input
                id="input-collection-name"
                type="text"
                value={newCollectionName}
                onChange={e => setNewCollectionName(e.target.value)}
                placeholder={t.workspace.collectionNamePlaceholder}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                autoFocus
                onKeyDown={e => {
                  if (e.key === 'Enter') handleCreateCollection();
                }}
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowNewCollectionModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                {t.inspector.closeBtn}
              </button>
              <button
                type="button"
                onClick={handleCreateCollection}
                disabled={!newCollectionName.trim()}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl cursor-pointer shadow-xs"
              >
                {t.workspace.createCollection}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Item to Collection Modal */}
      {collectionTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-indigo-600" />
                <span>{t.card.addToCollection || 'Add to Collection'}</span>
              </h3>
              <button
                onClick={() => setCollectionTarget(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              <strong className="text-slate-900">{collectionTarget.title}</strong>
            </p>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {userCollections.length === 0 ? (
                <p className="text-xs text-slate-400 italic">{t.workspace.noCollectionsYet}</p>
              ) : (
                userCollections.map(col => {
                  const isChecked = collectionTarget.type === 'identity'
                    ? col.identityIds.includes(collectionTarget.id)
                    : col.assetIds.includes(collectionTarget.id);
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => handleToggleItemInCollection(col.id, collectionTarget.type, collectionTarget.id)}
                      className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate">{col.name}</span>
                      <span className={`w-4 h-4 rounded flex items-center justify-center border text-2xs ${
                        isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Quick create collection */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5">
              <input
                type="text"
                value={quickNewColName}
                onChange={e => setQuickNewColName(e.target.value)}
                placeholder={t.workspace.collectionNamePlaceholder}
                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                onKeyDown={e => {
                  if (e.key === 'Enter' && quickNewColName.trim()) {
                    handleCreateCollectionWithItem(quickNewColName, collectionTarget.type, collectionTarget.id);
                  }
                }}
              />
              <button
                type="button"
                disabled={!quickNewColName.trim()}
                onClick={() => handleCreateCollectionWithItem(quickNewColName, collectionTarget.type, collectionTarget.id)}
                className="px-2.5 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setCollectionTarget(null)}
                className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                {t.inspector.closeBtn}
              </button>
            </div>
          </div>
        </div>
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
