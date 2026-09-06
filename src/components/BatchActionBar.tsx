import React, { useState } from 'react';
import { Download, CheckSquare, X, Copy, Check, Package } from 'lucide-react';
import { copyRawSvg } from '../utils/svgHelpers';
import { useTranslation } from '../i18n/context';

interface BatchActionBarProps {
  selectedCount: number;
  totalFilteredCount: number;
  onSelectAllFiltered: () => void;
  onClearSelection: () => void;
  onDownloadSelectedZip: () => void;
  onDownloadSelectedBundle: () => void;
  selectedSlugs: string[];
}

export const BatchActionBar: React.FC<BatchActionBarProps> = ({
  selectedCount,
  totalFilteredCount,
  onSelectAllFiltered,
  onClearSelection,
  onDownloadSelectedZip,
  onDownloadSelectedBundle,
  selectedSlugs,
}) => {
  const { t, format } = useTranslation();
  const [copiedNames, setCopiedNames] = useState(false);

  if (selectedCount === 0) return null;

  const handleCopyNames = async () => {
    const list = selectedSlugs.map(s => `${s}.svg`).join('\n');
    const ok = await copyRawSvg(list);
    if (ok) {
      setCopiedNames(true);
      setTimeout(() => setCopiedNames(false), 2000);
    }
  };

  const selectedText = format(t.batchBar.selectedCount, { count: selectedCount });

  return (
    <div
      id="batch-action-bar"
      className="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none animate-in slide-in-from-bottom-5 duration-200"
    >
      <div className="bg-slate-900 text-white rounded-2xl p-2.5 px-4 shadow-2xl border border-slate-700/80 flex flex-wrap items-center gap-3 pointer-events-auto max-w-3xl w-full justify-between">
        
        {/* Left: Counter & Select All toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 rounded-full bg-indigo-600 text-xs font-bold items-center justify-center">
              {selectedCount}
            </span>
            <span className="text-xs font-medium text-slate-200">
              {selectedText}
            </span>
          </div>

          <div className="h-4 w-px bg-slate-700" />

          <button
            id="btn-batch-select-all"
            onClick={onSelectAllFiltered}
            className="text-xs text-slate-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>{t.filters.selectAll} ({totalFilteredCount})</span>
          </button>

          <button
            id="btn-batch-clear-selection"
            onClick={onClearSelection}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>{t.filters.clearSelection}</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            id="btn-batch-copy-names"
            onClick={handleCopyNames}
            title={t.batchBar.copyFileNames}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
          >
            {copiedNames ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedNames ? t.card.copied : t.batchBar.copyFileNames}</span>
          </button>

          <button
            id="btn-batch-download-zip"
            onClick={onDownloadSelectedZip}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.batchBar.downloadZip}</span>
          </button>

          <button
            id="btn-batch-download-bundle"
            onClick={onDownloadSelectedBundle}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-colors shadow-xs active:scale-95 cursor-pointer"
          >
            <Package className="w-3.5 h-3.5" />
            <span>{t.batchBar.downloadBundle}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default BatchActionBar;
