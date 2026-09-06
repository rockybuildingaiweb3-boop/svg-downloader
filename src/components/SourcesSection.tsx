import React from 'react';
import {
  ShieldCheck,
  ExternalLink,
  Layers,
  CheckCircle2,
  FileCheck2,
  Database,
  Lock,
  GitBranch,
  BookOpen
} from 'lucide-react';
import { useTranslation } from '../i18n/context';
import { REGISTRY_ITEMS } from '../data/registry';
import { computeRegistryCoverageSummary } from '../utils/sourceCoverage';

interface SourceMeta {
  id: string;
  name: string;
  repoUrl: string;
  version: string;
  license: string;
}

const SOURCES: SourceMeta[] = [
  {
    id: 'simple-icons',
    name: 'Simple Icons',
    repoUrl: 'https://github.com/simple-icons/simple-icons',
    version: 'v16.30.0',
    license: 'CC0 1.0 Universal',
  },
  {
    id: 'devicon',
    name: 'Devicon',
    repoUrl: 'https://github.com/devicons/devicon',
    version: 'v2.17.0',
    license: 'MIT License',
  },
  {
    id: 'svg-logos',
    name: 'SVG Logos (Gilbarbara)',
    repoUrl: 'https://github.com/gilbarbara/logos',
    version: 'v1.2.13 (verified)',
    license: 'CC0 1.0 Universal / MIT',
  },
  {
    id: 'official',
    name: 'Official Vendor Brand Kits',
    repoUrl: 'https://github.com/rockybuildingaiweb3-boop/svg-downloader',
    version: 'Direct Vendor Guidelines',
    license: 'Corporate Trademark / Fair Use',
  },
  {
    id: 'wikimedia',
    name: 'Wikimedia Commons',
    repoUrl: 'https://commons.wikimedia.org',
    version: 'Historical Archive',
    license: 'Public Domain / CC BY-SA',
  },
];

export const SourcesSection: React.FC = () => {
  const { t } = useTranslation();

  // Compute live statistics dynamically from actual registry
  const coverageSummary = React.useMemo(() => {
    return computeRegistryCoverageSummary(REGISTRY_ITEMS);
  }, []);

  const providerCounts = React.useMemo(() => {
    const map: Record<string, { identities: number; assets: number }> = {};
    for (const p of coverageSummary.providerMatrix) {
      map[p.provider] = { identities: p.identitiesFound, assets: p.totalAssets };
    }
    return map;
  }, [coverageSummary]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {t.sourcesView.title}
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                {t.sourcesView.verifiedRepositoriesBadge}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              {t.sourcesView.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200/80">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="text-slate-600">
              <span className="font-semibold text-slate-800 block">
                {t.sourcesView.strictProvenanceTitle}
              </span>
              <span className="text-2xs text-slate-500">
                {t.sourcesView.strictProvenanceDesc}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SOURCES.map(source => {
          const count = providerCounts[source.id]?.assets || 0;
          const identitiesCount = providerCounts[source.id]?.identities || 0;
          const domainText = t.sourcesView.sourceDomains[source.id] || '';
          const ingestionText = t.sourcesView.sourceIngestions[source.id] || '';
          const policyText = t.sourcesView.sourcePolicies[source.id] || '';

          return (
            <div
              key={source.id}
              className="bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      {source.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-2xs font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {source.version}
                      </span>
                      <span className="text-2xs font-mono px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {source.license}
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex items-center px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    {count.toLocaleString()} {t.coverageView.assetsWord}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {domainText}
                </p>

                <div className="mt-4 space-y-2 pt-3 border-t border-slate-100 text-2xs">
                  <div className="flex items-start gap-1.5 text-slate-500">
                    <GitBranch className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                    <span><strong>{t.sourcesView.ingestionTitle}:</strong> {ingestionText}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>{t.sourcesView.trustPolicyTitle}:</strong> {policyText}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-2xs text-slate-400 font-mono">
                  {identitiesCount.toLocaleString()} {t.coverageView.identitiesWord}
                </span>
                <a
                  href={source.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <span>{t.sourcesView.visitRepo}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Verification Protocol Matrix */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-emerald-600" />
          <span>{t.sourcesView.invariantsTitle}</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <h4 className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              {t.sourcesView.precedenceTitle}
            </h4>
            <p className="text-slate-500 text-2xs leading-relaxed">
              {t.sourcesView.precedenceDesc}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <h4 className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              {t.sourcesView.immutabilityTitle}
            </h4>
            <p className="text-slate-500 text-2xs leading-relaxed">
              {t.sourcesView.immutabilityDesc}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <h4 className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              {t.sourcesView.classificationTitle}
            </h4>
            <p className="text-slate-500 text-2xs leading-relaxed">
              {t.sourcesView.classificationDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourcesSection;
