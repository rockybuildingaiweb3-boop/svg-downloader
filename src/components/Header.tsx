import React, { useState } from 'react';
import {
  Download,
  Terminal,
  ShieldCheck,
  ChevronDown,
  Package,
  Layers,
  Sparkles,
  GitCompare,
  Database,
  Activity,
  Languages,
  Command,
  Search
} from 'lucide-react';
import { useTranslation } from '../i18n/context';
import { SupportedLanguage } from '../i18n/types';
import { REGISTRY_SOURCES } from '../data/catalog';

export type ActiveTabType = 'icons' | 'sources' | 'coverage' | 'conflicts' | 'comparison' | 'script';

interface HeaderProps {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  totalIcons: number;
  totalAssets?: number;
  totalSources?: number;
  selectedCount: number;
  onDownloadMainstreamZip: () => void;
  onDownloadMainstreamBundle: () => void;
  onOpenCommandPalette: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  totalIcons,
  totalAssets,
  totalSources,
  onDownloadMainstreamZip,
  onDownloadMainstreamBundle,
  onOpenCommandPalette,
}) => {
  const { t, language, setLanguage, availableLanguages, format } = useTranslation();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showMoreTabsMenu, setShowMoreTabsMenu] = useState(false);

  const currentLangObj = availableLanguages.find(l => l.code === language) || availableLanguages[0];

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tier 1: Top Bar (Brand + Quick Search + Language + Primary Action) */}
        <div className="flex items-center justify-between py-2.5 gap-3 border-b border-slate-100">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs shrink-0">
              <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
                  {t.header.registryTitle}
                </h1>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-3xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-2.5 h-2.5 mr-1 text-emerald-600" />
                  {t.header.multiSourceBadge}
                </span>
              </div>
              <p className="text-2xs text-slate-500 mt-0.5 hidden sm:block">
                {format(t.header.registryStatsBanner, {
                  identities: totalIcons.toLocaleString(),
                  assets: (totalAssets ?? totalIcons).toLocaleString(),
                  sources: (totalSources ?? REGISTRY_SOURCES.length).toLocaleString()
                })}
              </p>
            </div>
          </div>

          {/* Right Controls: Quick Search, Language Switcher & Export */}
          <div className="flex items-center gap-2">
            {/* Quick Command Palette Button - Responsive */}
            <button
              onClick={onOpenCommandPalette}
              className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-xl border border-slate-200/80 transition-colors cursor-pointer shrink-0"
              title={t.header.openCommandPalette}
              aria-label={t.header.searchAndCommands}
            >
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="hidden sm:inline font-medium">{t.header.quickSearch}</span>
              </div>
              <kbd className="hidden md:inline-block font-mono text-2xs bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-400 shrink-0">
                Ctrl+K
              </kbd>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors cursor-pointer"
                title={t.header.language}
              >
                <span>{currentLangObj.flag}</span>
                <span className="hidden sm:inline">{currentLangObj.label}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showLangMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowLangMenu(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-40 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                    {availableLanguages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLangMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between cursor-pointer ${
                          language === lang.code
                            ? 'bg-indigo-50 text-indigo-700 font-semibold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </span>
                        {language === lang.code && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Quick Action Export Dropdown */}
            <div className="relative">
              <div className="inline-flex rounded-xl shadow-2xs">
                <button
                  id="btn-download-all-zip"
                  onClick={onDownloadMainstreamBundle}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-l-xl text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
                  title={t.header.downloadBundleTooltip}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.header.downloadMainstreamBundle}</span>
                  <span className="sm:hidden">{t.header.bundleBtn}</span>
                </button>

                <button
                  id="btn-export-dropdown-toggle"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="px-2.5 py-2 text-white bg-slate-900 hover:bg-slate-800 border-l border-slate-700 rounded-r-xl transition-colors cursor-pointer"
                  title={t.header.exportOptions}
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
                      className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 flex items-start gap-2.5 text-slate-700 cursor-pointer"
                    >
                      <Package className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-900 block">{t.header.downloadMainstreamBundle}</span>
                        <span className="text-slate-500 text-2xs block">
                          {t.header.bundleExportSubtitle}
                        </span>
                      </div>
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => {
                        onDownloadMainstreamZip();
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 flex items-start gap-2.5 text-slate-700 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-900 block">{t.header.downloadMainstreamZip}</span>
                        <span className="text-slate-500 text-2xs block">
                          {t.header.zipExportSubtitle}
                        </span>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>

        </div>

        {/* Tier 2: Secondary Navigation Bar (Primary Tabs + More Dropdown) */}
        <div className="py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              id="tab-icons"
              onClick={() => setActiveTab('icons')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === 'icons'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t.header.tabIdentities} ({totalIcons.toLocaleString()})</span>
            </button>

            <button
              id="tab-sources"
              onClick={() => setActiveTab('sources')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === 'sources'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.header.tabSources}</span>
            </button>

            <button
              id="tab-coverage"
              onClick={() => setActiveTab('coverage')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === 'coverage'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.header.tabCoverage}</span>
            </button>

            {/* Secondary Tools Dropdown (Conflicts, Comparison, Script) */}
            <div className="relative inline-block">
              <button
                id="btn-header-more-tools"
                onClick={() => setShowMoreTabsMenu(!showMoreTabsMenu)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  ['conflicts', 'comparison', 'script'].includes(activeTab)
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title={t.header.tabMore}
              >
                {activeTab === 'conflicts' && <GitCompare className="w-3.5 h-3.5 text-amber-400" />}
                {activeTab === 'comparison' && <Sparkles className="w-3.5 h-3.5 text-pink-400" />}
                {activeTab === 'script' && <Terminal className="w-3.5 h-3.5 text-slate-400" />}
                {!['conflicts', 'comparison', 'script'].includes(activeTab) && (
                  <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>
                  {activeTab === 'conflicts'
                    ? t.header.tabConflicts
                    : activeTab === 'comparison'
                    ? t.header.tabComparison
                    : activeTab === 'script'
                    ? t.header.tabScript
                    : t.header.tabMore}
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showMoreTabsMenu ? 'rotate-180' : ''}`} />
              </button>

              {showMoreTabsMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMoreTabsMenu(false)}
                  />
                  <div className="absolute left-0 mt-1.5 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <button
                      id="tab-conflicts"
                      onClick={() => {
                        setActiveTab('conflicts');
                        setShowMoreTabsMenu(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2 cursor-pointer ${
                        activeTab === 'conflicts'
                          ? 'bg-amber-50 text-amber-900 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <GitCompare className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{t.header.tabConflicts}</span>
                    </button>

                    <button
                      id="tab-comparison"
                      onClick={() => {
                        setActiveTab('comparison');
                        setShowMoreTabsMenu(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2 cursor-pointer ${
                        activeTab === 'comparison'
                          ? 'bg-pink-50 text-pink-900 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                      <span>{t.header.tabComparison}</span>
                    </button>

                    <button
                      id="tab-script"
                      onClick={() => {
                        setActiveTab('script');
                        setShowMoreTabsMenu(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2 cursor-pointer ${
                        activeTab === 'script'
                          ? 'bg-slate-100 text-slate-900 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Terminal className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{t.header.tabScript}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
