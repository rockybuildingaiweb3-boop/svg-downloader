import React, { useState, useMemo } from 'react';
import {
  GitCompare,
  ShieldCheck,
  Layers,
  Search,
  ArrowRight,
  CheckCircle2,
  Filter,
  Maximize2,
  FileCheck
} from 'lucide-react';
import conflictsData from '../../generated/conflicts.json';
import { CURATED_ICONS } from '../data/curatedIcons';
import { IconItem } from '../types';
import { useTranslation } from '../i18n/context';

interface ConflictsSectionProps {
  onInspectIcon?: (icon: IconItem) => void;
}

interface ConflictItem {
  id: string;
  inputQuery: string;
  canonicalAssetId: string;
  resolvedSource: string;
  policyApplied: string;
  totalAssetsInFamily: number;
  competingAssets: Array<{
    assetId: string;
    sourceProvider: string;
    sourceCollection: string;
    role: string;
    graphicVariant: string;
    context: string[];
    license: string;
  }>;
  resolution: string;
}

export const ConflictsSection: React.FC<ConflictsSectionProps> = ({ onInspectIcon }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState<string>('all');

  const iconMap = useMemo(() => {
    const map = new Map<string, IconItem>();
    for (const item of CURATED_ICONS) {
      map.set(item.slug, item);
    }
    return map;
  }, []);

  const conflictsList = ((conflictsData as any).conflicts || []) as ConflictItem[];

  const filteredConflicts = useMemo(() => {
    return conflictsList.filter(item => {
      if (selectedPolicy !== 'all' && item.policyApplied !== selectedPolicy) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchesId = item.id.toLowerCase().includes(q);
        const matchesQuery = item.inputQuery.toLowerCase().includes(q);
        const matchesSource = item.resolvedSource.toLowerCase().includes(q);
        return matchesId || matchesQuery || matchesSource;
      }
      return true;
    });
  }, [conflictsList, searchTerm, selectedPolicy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <GitCompare className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {t.conflictsView.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t.conflictsView.subtitle}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="font-bold block">{t.conflictsView.zeroCollisionsTitle}</span>
                <span className="text-2xs text-emerald-600">{t.conflictsView.zeroCollisionsDesc}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-2xs">{t.conflictsView.identitiesAuditedTitle}</span>
            <span className="text-base font-extrabold text-slate-900">{CURATED_ICONS.length}</span>
            <span className="text-2xs text-slate-500 block">{t.conflictsView.identitiesAuditedDesc}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-2xs">{t.conflictsView.multiSourceCandidatesTitle}</span>
            <span className="text-base font-extrabold text-indigo-600">{conflictsData.totalConflictsDetected || 83}</span>
            <span className="text-2xs text-slate-500 block">{t.conflictsView.multiSourceCandidatesDesc}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-2xs">{t.conflictsView.arbitrationStrategyTitle}</span>
            <span className="text-base font-extrabold text-emerald-600 font-mono capitalize">
              {conflictsData.policy || 'brand'}
            </span>
            <span className="text-2xs text-slate-500 block">{t.conflictsView.arbitrationStrategyDesc}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-2xs">{t.conflictsView.ledgerStatusTitle}</span>
            <span className="text-base font-extrabold text-slate-800 flex items-center gap-1">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-mono text-xs">{t.conflictsView.ledgerStatusDesc}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={t.conflictsView.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-800 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="text-2xs flex items-center gap-1 font-medium">
            <Filter className="w-3 h-3" />
            <span>{t.filters.showingCount}:</span>
          </span>
          <span className="font-bold text-slate-800">
            {filteredConflicts.length} / {conflictsList.length}
          </span>
        </div>
      </div>

      {/* Conflicts List */}
      <div className="space-y-3">
        {filteredConflicts.map(item => {
          const icon = iconMap.get(item.id);
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Left: Brand info & Canonical Choice */}
                <div className="flex items-start gap-4">
                  {icon && (
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center shrink-0">
                      <img
                        src={`/icons/${icon.fileName}`}
                        alt={icon.title}
                        className="w-8 h-8 object-contain"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">
                        {icon?.title || item.id}
                      </h3>
                      <span className="text-2xs font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        slug: {item.id}
                      </span>
                      <span className="text-2xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100 flex items-center gap-1">
                        <Layers className="w-2.5 h-2.5" />
                        <span>{item.totalAssetsInFamily} assets</span>
                      </span>
                    </div>

                    {/* Canonical choice callout */}
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-slate-400 text-2xs">{t.conflictsView.selectedCanonical}:</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{item.resolvedSource}</span>
                      </span>
                      <span className="font-mono text-2xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        ID: {item.canonicalAssetId}
                      </span>
                      <span className="text-2xs text-slate-400">
                        (file: <code className="font-mono text-slate-700">{icon?.fileName || `${item.id}.svg`}</code>)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Inspect Action */}
                {icon && onInspectIcon && (
                  <button
                    onClick={() => onInspectIcon(icon)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-xl transition-colors shrink-0 self-start lg:self-center cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>{t.card.inspectAsset}</span>
                  </button>
                )}
              </div>

              {/* Policy Decision Resolution Statement */}
              <div className="mt-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/80 text-xs text-indigo-950">
                <span className="font-bold text-indigo-900 block mb-0.5">{t.conflictsView.resolutionExplanation}:</span>
                <p className="text-2xs text-indigo-800 font-mono">{item.resolution}</p>
              </div>

              {/* Competing Alternatives Breakdown */}
              <div className="mt-3 pt-3 border-t border-slate-100">
                <span className="text-2xs font-bold text-slate-500 block mb-2">
                  {t.conflictsView.competingAssets} ({item.competingAssets.length}):
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {item.competingAssets.map(comp => (
                    <div
                      key={comp.assetId}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs flex items-start gap-2.5"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-slate-800">
                            {comp.sourceProvider} ({comp.role}, {comp.graphicVariant})
                          </span>
                          <span className="text-2xs font-mono text-slate-400 truncate">{comp.assetId}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-2xs text-slate-500">
                          <span>collection: {comp.sourceCollection}</span>
                          <span>•</span>
                          <span>context: {comp.context?.join(', ') || 'general'}</span>
                        </div>
                        <p className="text-2xs text-slate-400 mt-0.5 truncate">
                          license: {comp.license}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default ConflictsSection;
