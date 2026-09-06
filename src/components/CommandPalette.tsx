import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Layers,
  GitCompare,
  Sparkles,
  Terminal,
  Database,
  Activity,
  Languages,
  ExternalLink,
  ChevronRight,
  Command
} from 'lucide-react';
import { useTranslation } from '../i18n/context';
import { SupportedLanguage } from '../i18n/types';
import { CURATED_ICONS } from '../data/curatedIcons';
import { IconItem } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: 'icons' | 'conflicts' | 'script' | 'comparison' | 'sources' | 'coverage') => void;
  onInspectIcon: (icon: IconItem) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onInspectIcon,
}) => {
  const { t, language, setLanguage, availableLanguages } = useTranslation();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Build items based on query
  const items = React.useMemo(() => {
    const q = query.toLowerCase().trim();
    const result: Array<{
      id: string;
      title: string;
      subtitle?: string;
      category: 'nav' | 'lang' | 'icon';
      icon: React.ReactNode;
      action: () => void;
    }> = [];

    // Nav items
    const navItems = [
      { id: 'nav-icons', title: t.header.tabIcons, icon: <Layers className="w-4 h-4 text-indigo-500" />, tab: 'icons' as const },
      { id: 'nav-sources', title: t.header.tabSources, icon: <Database className="w-4 h-4 text-emerald-500" />, tab: 'sources' as const },
      { id: 'nav-coverage', title: t.header.tabCoverage, icon: <Activity className="w-4 h-4 text-blue-500" />, tab: 'coverage' as const },
      { id: 'nav-conflicts', title: t.header.tabConflicts, icon: <GitCompare className="w-4 h-4 text-amber-500" />, tab: 'conflicts' as const },
      { id: 'nav-comparison', title: t.header.tabComparison, icon: <Sparkles className="w-4 h-4 text-pink-500" />, tab: 'comparison' as const },
      { id: 'nav-script', title: t.header.tabScript, icon: <Terminal className="w-4 h-4 text-slate-500" />, tab: 'script' as const },
    ];

    navItems.forEach(item => {
      if (!q || item.title.toLowerCase().includes(q) || item.id.includes(q)) {
        result.push({
          id: item.id,
          title: item.title,
          category: 'nav',
          icon: item.icon,
          action: () => {
            onNavigateTab(item.tab);
            onClose();
          },
        });
      }
    });

    // Language switch items
    availableLanguages.forEach(lang => {
      if (!q || lang.label.toLowerCase().includes(q) || lang.code.includes(q)) {
        result.push({
          id: `lang-${lang.code}`,
          title: `${lang.flag} ${lang.label} (${lang.code})`,
          subtitle: lang.code === language ? 'Current language' : undefined,
          category: 'lang',
          icon: <Languages className="w-4 h-4 text-violet-500" />,
          action: () => {
            setLanguage(lang.code as SupportedLanguage);
            onClose();
          },
        });
      }
    });

    // Brand icons matching query
    if (q) {
      const matchedIcons = CURATED_ICONS.filter(icon => {
        return (
          icon.title.toLowerCase().includes(q) ||
          icon.id.toLowerCase().includes(q) ||
          (icon.aliases && icon.aliases.some(a => a.toLowerCase().includes(q)))
        );
      }).slice(0, 10);

      matchedIcons.forEach(icon => {
        result.push({
          id: `icon-${icon.id}`,
          title: `${icon.title}`,
          subtitle: `${icon.category} · ${icon.assets?.length || 1} assets`,
          category: 'icon',
          icon: (
            <div className="w-4 h-4 flex items-center justify-center">
              <img src={`/icons/${icon.fileName}`} alt={icon.title} className="w-4 h-4 object-contain" />
            </div>
          ),
          action: () => {
            onInspectIcon(icon);
            onClose();
          },
        });
      });
    }

    return result;
  }, [query, t, language, availableLanguages, onNavigateTab, onInspectIcon, onClose, setLanguage]);

  // Handle arrow keys navigation & Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, items.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + items.length) % Math.max(1, items.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (items[selectedIndex]) {
        items[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 fade-in duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={t.commandPalette.placeholder}
            className="w-full text-sm bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-2xs font-mono text-slate-400 bg-slate-100 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-50">
          {items.length > 0 ? (
            items.map((item, idx) => (
              <button
                key={item.id}
                onClick={item.action}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                  selectedIndex === idx
                    ? 'bg-indigo-50 text-indigo-900'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div className="truncate">
                    <span className="font-semibold block truncate">{item.title}</span>
                    {item.subtitle && (
                      <span className="text-2xs text-slate-400 block truncate">{item.subtitle}</span>
                    )}
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              {t.commandPalette.noResults}
            </div>
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-400">
          <span>Navigate with <kbd className="font-mono bg-white px-1 py-0.5 rounded border">↑</kbd> <kbd className="font-mono bg-white px-1 py-0.5 rounded border">↓</kbd></span>
          <span>Select with <kbd className="font-mono bg-white px-1 py-0.5 rounded border">↵ Enter</kbd></span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
