import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Activity,
  BarChart3,
  Layers,
  Palette,
  FileCheck2,
  Database,
  GitFork,
  Scale,
} from 'lucide-react';
import { useTranslation } from '../i18n/context';
import { REGISTRY_IDENTITIES } from '../data/registry';
import { computeCategoryStats } from '../taxonomy/categoryResolver';
import { CATEGORY_DEFINITIONS } from '../taxonomy/taxonomy';
import { computeRegistryCoverageSummary, computeRegistryHealth, HealthDimension } from '../utils/sourceCoverage';
import conflictsData from '../../generated/conflicts.json';

interface CoverageSectionProps {
  onDrillDown?: (filter: { provider?: string; sourcesCount?: number; category?: string; status?: string }) => void;
}

export const CoverageSection: React.FC<CoverageSectionProps> = ({ onDrillDown }) => {
  const { t } = useTranslation();

  // Compute live statistics dynamically from actual active registry
  const { stats, coverageSummary, categoryData, health } = React.useMemo(() => {
    const categoryStats = computeCategoryStats(REGISTRY_IDENTITIES);
    const coverageSummary = computeRegistryCoverageSummary(REGISTRY_IDENTITIES);

    let multiColorCount = 0;
    const roleCounts: Record<string, number> = {};
    const variantCounts: Record<string, number> = {};

    for (const item of REGISTRY_IDENTITIES) {
      if (item.assets && item.assets.length > 0) {
        for (const asset of item.assets) {
          if (asset.graphicVariant === 'color' || asset.graphicVariant === 'original') {
            multiColorCount++;
          }
          const r = asset.role || 'icon';
          roleCounts[r] = (roleCounts[r] || 0) + 1;

          const v = asset.graphicVariant || 'monochrome';
          variantCounts[v] = (variantCounts[v] || 0) + 1;
        }
      }
    }

    const conflictsCount =
      (conflictsData as any).totalConflictsDetected ??
      (conflictsData as any).conflicts?.length ??
      0;

    return {
      stats: {
        totalIdentities: REGISTRY_IDENTITIES.length,
        totalAssets: categoryStats.totalAssets,
        multiColorCount,
        conflictsCount,
        uncategorizedCount: categoryStats.uncategorizedCount,
        needsReviewCount: categoryStats.needsReviewCount,
        roleCounts,
        variantCounts,
      },
      coverageSummary,
      categoryData: categoryStats.categoryStats,
      health: computeRegistryHealth(REGISTRY_IDENTITIES),
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Summary Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {t.coverageView.title}
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                <span>{health.healthScore}% {t.coverageView.calculatedHealth}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              {t.coverageView.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">
              {health.isPerfect
                ? t.coverageView.noIssuesDetected
                : `${health.sparseSourceIdentities} ${t.coverageView.sparseSourceIdentities}`}
            </span>
          </div>
        </div>
      </div>

      {/* 5-Dimension Health Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {(Object.values(health.dimensions) as HealthDimension[]).map(dim => (
          <div key={dim.name} className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">{dim.name}</span>
              <span className="text-2xs font-mono font-semibold text-slate-400">{dim.weight}% wt</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-slate-900 font-mono">{dim.score}%</span>
              <span className="text-3xs text-slate-400 font-mono">{dim.healthyCount.toLocaleString()} / {dim.total.toLocaleString()}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  dim.score >= 90 ? 'bg-emerald-500' : dim.score >= 70 ? 'bg-indigo-500' : 'bg-amber-500'
                }`}
                style={{ width: `${Math.max(dim.score, 2)}%` }}
              />
            </div>
            {/* Granular state breakdown */}
            <div className="flex flex-wrap gap-1 pt-0.5">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-3xs font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200" title={`${dim.healthyCount} ${t.coverageView.healthyLabel}`}>
                {dim.healthyCount.toLocaleString()} {t.coverageView.healthyLabel}
              </span>
              {dim.warningCount > 0 && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-3xs font-mono font-medium bg-amber-50 text-amber-700 border border-amber-200" title={`${dim.warningCount} ${t.coverageView.warningLabel}`}>
                  {dim.warningCount.toLocaleString()} {t.coverageView.warningLabel}
                </span>
              )}
              {dim.unknownCount > 0 && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-3xs font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200" title={`${dim.unknownCount} ${t.coverageView.unknownLabel}`}>
                  {dim.unknownCount.toLocaleString()} {t.coverageView.unknownLabel}
                </span>
              )}
              {dim.failedCount > 0 && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-3xs font-mono font-medium bg-rose-50 text-rose-700 border border-rose-200" title={`${dim.failedCount} ${t.coverageView.failedLabel}`}>
                  {dim.failedCount.toLocaleString()} {t.coverageView.failedLabel}
                </span>
              )}
            </div>
            <p className="text-3xs text-slate-400 leading-tight truncate" title={dim.description}>
              {dim.description}
            </p>
          </div>
        ))}
      </div>

      {/* Mathematical Formula & Explainability Card */}
      <div className="bg-gradient-to-r from-slate-50 to-indigo-50/40 rounded-xl p-4 border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-900 tracking-tight">
                {t.coverageView.healthFormulaTitle}
              </span>
              <span className="px-1.5 py-0.5 rounded text-3xs font-mono font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                {t.coverageView.mathematicalExplainability}
              </span>
            </div>
            <p className="text-2xs text-slate-600">
              {t.coverageView.healthFormulaSubtitle}
            </p>
          </div>
          <div className="font-mono text-2xs bg-white/90 px-3 py-2 rounded-lg border border-slate-200 shadow-2xs text-slate-700">
            <span className="font-bold text-slate-900">{health.healthScore}%</span> = (
            <span className="text-indigo-600 font-semibold">{health.dimensions.coverage.score}%</span> × 0.20) + (
            <span className="text-indigo-600 font-semibold">{health.dimensions.integrity.score}%</span> × 0.25) + (
            <span className="text-indigo-600 font-semibold">{health.dimensions.classification.score}%</span> × 0.20) + (
            <span className="text-indigo-600 font-semibold">{health.dimensions.provenance.score}%</span> × 0.15) + (
            <span className="text-indigo-600 font-semibold">{health.dimensions.resolution.score}%</span> × 0.20)
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="text-2xs font-medium text-slate-500 uppercase tracking-wider">
            {t.coverageView.identitiesStat}
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {stats.totalIdentities.toLocaleString()}
          </div>
          <div className="text-2xs text-slate-400 mt-1">
            {t.coverageView.identitiesDesc}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="text-2xs font-medium text-slate-500 uppercase tracking-wider">
            {t.coverageView.assetsStat}
          </div>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">
            {stats.totalAssets.toLocaleString()}
          </div>
          <div className="text-2xs text-slate-400 mt-1">
            {t.coverageView.assetsDesc}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="text-2xs font-medium text-slate-500 uppercase tracking-wider">
            {t.coverageView.multiColorStat}
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            {stats.multiColorCount.toLocaleString()}
          </div>
          <div className="text-2xs text-slate-400 mt-1">
            {t.coverageView.multiColorDesc}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="text-2xs font-medium text-slate-500 uppercase tracking-wider">
            {t.coverageView.conflictsStat}
          </div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">
            {stats.conflictsCount.toLocaleString()}
          </div>
          <div className="text-2xs text-slate-400 mt-1">
            {t.coverageView.conflictsDesc}
          </div>
        </div>

        <div
          onClick={() => onDrillDown?.({ category: 'uncategorized' })}
          className="bg-white rounded-xl p-4 border border-slate-200 cursor-pointer hover:border-indigo-300 hover:shadow-xs transition-all"
        >
          <div className="text-2xs font-medium text-slate-500 uppercase tracking-wider">
            {t.coverageView.uncategorizedStat}
          </div>
          <div className="text-2xl font-extrabold text-slate-700 mt-1">
            {stats.uncategorizedCount.toLocaleString()}
          </div>
          <div className="text-2xs text-slate-400 mt-1">
            {t.coverageView.identitiesWord}
          </div>
        </div>

        <div
          onClick={() => onDrillDown?.({ category: 'needs-review' })}
          className="bg-white rounded-xl p-4 border border-slate-200 cursor-pointer hover:border-indigo-300 hover:shadow-xs transition-all"
        >
          <div className="text-2xs font-medium text-slate-500 uppercase tracking-wider">
            {t.coverageView.needsReviewStat}
          </div>
          <div className="text-2xl font-extrabold text-violet-600 mt-1">
            {stats.needsReviewCount.toLocaleString()}
          </div>
          <div className="text-2xs text-slate-400 mt-1">
            {t.coverageView.identitiesWord}
          </div>
        </div>
      </div>

      {/* Source Coverage Matrix & Sparse Coverage Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Source Provider Coverage Matrix (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <Database className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              {t.coverageView.sourceMatrixTitle}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            {t.coverageView.sourceMatrixSubtitle}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-2xs uppercase tracking-wider">
                  <th className="pb-2 font-medium">{t.coverageView.providerCol}</th>
                  <th className="pb-2 font-medium text-right">{t.coverageView.identitiesFoundCol}</th>
                  <th className="pb-2 font-medium text-right">{t.coverageView.totalAssetsCol}</th>
                  <th className="pb-2 font-medium text-right pr-2">{t.coverageView.coverageRatioCol}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coverageSummary.providerMatrix.map(provider => (
                  <tr
                    key={provider.provider}
                    onClick={() => onDrillDown?.({ provider: provider.provider })}
                    className="hover:bg-indigo-50/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3 font-semibold text-slate-800">
                      {provider.label}
                    </td>
                    <td className="py-3 text-right font-mono text-slate-700">
                      {provider.identitiesFound.toLocaleString()} {t.coverageView.identitiesWord}
                    </td>
                    <td className="py-3 text-right font-mono text-slate-500">
                      {provider.totalAssets.toLocaleString()} {t.coverageView.assetsWord}
                    </td>
                    <td className="py-3 text-right pr-2">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 sm:w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                            style={{ width: `${Math.max(provider.percentage, 2)}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-medium text-slate-700 w-9 text-right">
                          {provider.percentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sparse Sources Distribution (1 Column) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GitFork className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                {t.coverageView.sparseSourcesTitle}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              {t.coverageView.sparseSourcesSubtitle}
            </p>

            <div className="space-y-3">
              <div
                onClick={() => onDrillDown?.({ sourcesCount: 1 })}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
              >
                <div>
                  <div className="text-xs font-medium text-slate-700">{t.coverageView.singleSourceLabel}</div>
                  <div className="text-2xs text-slate-400">1 {t.coverageView.providerCol}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-slate-900">
                    {coverageSummary.distribution.oneProvider.toLocaleString()}
                  </div>
                  <div className="text-2xs text-slate-500">{t.coverageView.identitiesWord}</div>
                </div>
              </div>

              <div
                onClick={() => onDrillDown?.({ sourcesCount: 2 })}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
              >
                <div>
                  <div className="text-xs font-medium text-slate-700">{t.coverageView.twoSourcesLabel}</div>
                  <div className="text-2xs text-slate-400">2 {t.coverageView.providerCol}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-slate-900">
                    {coverageSummary.distribution.twoProviders.toLocaleString()}
                  </div>
                  <div className="text-2xs text-slate-500">{t.coverageView.identitiesWord}</div>
                </div>
              </div>

              <div
                onClick={() => onDrillDown?.({ sourcesCount: 3 })}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
              >
                <div>
                  <div className="text-xs font-medium text-slate-700">{t.coverageView.threeSourcesLabel}</div>
                  <div className="text-2xs text-slate-400">3 {t.coverageView.providerCol}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-slate-900">
                    {coverageSummary.distribution.threeProviders.toLocaleString()}
                  </div>
                  <div className="text-2xs text-slate-500">{t.coverageView.identitiesWord}</div>
                </div>
              </div>

              <div
                onClick={() => onDrillDown?.({ sourcesCount: 4 })}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
              >
                <div>
                  <div className="text-xs font-medium text-slate-700">{t.coverageView.fourSourcesLabel || 'Four-Source Identities'}</div>
                  <div className="text-2xs text-slate-400">4 {t.coverageView.providerCol}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-slate-900">
                    {coverageSummary.distribution.fourProviders.toLocaleString()}
                  </div>
                  <div className="text-2xs text-slate-500">{t.coverageView.identitiesWord}</div>
                </div>
              </div>

              <div
                onClick={() => onDrillDown?.({ sourcesCount: 5 })}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
              >
                <div>
                  <div className="text-xs font-medium text-slate-700">{t.coverageView.fiveOrMoreSourcesLabel || 'Five+ Source Identities'}</div>
                  <div className="text-2xs text-slate-400">5+ {t.coverageView.providerCol}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-600">
                    {coverageSummary.distribution.fiveOrMoreProviders.toLocaleString()}
                  </div>
                  <div className="text-2xs text-emerald-700 font-medium">{t.coverageView.identitiesWord}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic Category Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            <span>{t.coverageView.categoriesBreakdown}</span>
          </h3>

          <div className="space-y-3">
            {CATEGORY_DEFINITIONS.filter(c => c.id !== 'all').map(cat => {
              const stat = categoryData[cat.id];
              const count = stat ? stat.identitiesCount : 0;
              const assetsCount = stat ? stat.assetsCount : 0;
              const percent = stats.totalIdentities > 0
                ? Math.round((count / stats.totalIdentities) * 100)
                : 0;
              const label = t.filters.categories[cat.id] || cat.id;

              return (
                <div
                  key={cat.id}
                  onClick={() => onDrillDown?.({ category: cat.id })}
                  className="space-y-1 cursor-pointer group p-1 -m-1 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">{label}</span>
                    <span className="font-mono text-slate-500">
                      {count.toLocaleString()} {t.coverageView.identitiesWord} · {assetsCount.toLocaleString()} {t.coverageView.assetsWord} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(percent, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Role & Variant Taxonomy Health */}
        <div className="space-y-6">
          {/* Asset Role Distribution */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>{t.coverageView.roleDistributionTitle}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(stats.roleCounts).map(([role, count]) => (
                <div key={role} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="text-2xs font-semibold text-slate-500 uppercase">{role}</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{count.toLocaleString()}</div>
                  <div className="text-2xs text-slate-400">{t.coverageView.assetsWord}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Graphic Variant Distribution */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-pink-600" />
              <span>{t.coverageView.variantDistributionTitle}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(stats.variantCounts).map(([variant, count]) => (
                <div key={variant} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="text-2xs font-semibold text-slate-500 uppercase">{variant}</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{count.toLocaleString()}</div>
                  <div className="text-2xs text-slate-400">{t.coverageView.filesWord}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Protocol Checkmark */}
          <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-200 flex items-start gap-3">
            <FileCheck2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 space-y-1">
              <span className="font-bold block">{t.coverageView.doctorTitle}</span>
              <p className="text-emerald-800 text-2xs leading-relaxed">
                {t.coverageView.doctorDesc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverageSection;
