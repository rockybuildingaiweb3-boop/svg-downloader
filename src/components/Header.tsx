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

export type ActiveTabType = 'icons' | 'sources' | 'coverage' | 'conflicts' | 'comparison' | 'script';

interface HeaderProps {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  totalIcons: number;
  selectedCount: number;
  onDownloadMainstreamZip: () => void;
  onDownloadMainstreamBundle: () => void;
  onOpenCommandPalette: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  totalIcons,
  onDownloadMainstreamZip,
  onDownloadMainstreamBundle,
  onOpenCommandPalette,
}) => {
  const { t, language, setLanguage, availableLanguages } = useTranslation();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const currentLangObj = availableLanguages.find(l => l.code === language) || availableLanguages[0];

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-3.5 gap-3.5">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs shrink-0">
                <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                    {t.header.registryTitle}
                  </h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-2xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                    {t.header.multiSourceBadge}
                  </span>
                </div>
                <p className="text-2xs text-slate-500 mt-0.5 hidden sm:block">
                  {t.header.registrySubtitle}
                </p>
              </div>
            </div>

            {/* Mobile Command Palette shortcut */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={onOpenCommandPalette}
                className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                aria-label="Search and commands"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80 overflow-x-auto">
            <button
              id="tab-icons"
              onClick={() => setActiveTab('icons')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === 'icons'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t.header.tabIcons} ({totalIcons})</span>
            </button>

            <button
              id="tab-sources"
              onClick={() => setActiveTab('sources')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === 'sources'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t.header.tabSources}</span>
            </button>

            <button
              id="tab-coverage"
              onClick={() => setActiveTab('coverage')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === 'coverage'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-blue-500" />
              <span>{t.header.tabCoverage}</span>
            </button>

            <button
              id="tab-conflicts"
              onClick={() => setActiveTab('conflicts')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === 'conflicts'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.header.tabConflicts}</span>
            </button>

            <button
              id="tab-comparison"
              onClick={() => setActiveTab('comparison')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === 'comparison'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>{t.header.tabComparison}</span>
            </button>

            <button
              id="tab-script"
              onClick={() => setActiveTab('script')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === 'script'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.header.tabScript}</span>
            </button>
          </div>

          {/* Right Tools: Command Palette, Language Switcher & Export */}
          <div className="flex items-center gap-2">
            {/* Quick Command Palette Button */}
            <button
              onClick={onOpenCommandPalette}
              className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 bg-slate-100 hover:bg-slate-200/80 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              title="Open Command Palette (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Quick Search</span>
              <kbd className="font-mono text-2xs bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-400">
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
                  title="Download verified manifest bundle with React/Vue type definitions"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.header.downloadMainstreamBundle}</span>
                  <span className="sm:hidden">Bundle</span>
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
                          Full JSON manifest, TypeScript types, and raw SVGs
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
                          Pure verified raw SVG files only
                        </span>
                      </div>
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
