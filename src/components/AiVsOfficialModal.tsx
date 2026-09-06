import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Layers,
  Columns,
  Eye,
  Hash,
  Box,
  Binary,
  ShieldCheck,
  Zap,
  Sliders,
  Sparkles,
  ArrowLeftRight
} from 'lucide-react';
import { COMPARISON_CASES, ComparisonCase } from '../data/comparisonCases';
import { fetchRawSvg, computeClientSha256 } from '../utils/svgHelpers';
import { useTranslation } from '../i18n/context';

interface SvgStats {
  viewBox: string;
  elementCount: number;
  pathCount: number;
  sha256: string;
}

// Multi-Source Comparison Presets
interface MultiSourcePreset {
  id: string;
  title: string;
  sourceA: { name: string; file: string; provider: string };
  sourceB: { name: string; file: string; provider: string };
  description: string;
}

const MULTI_SOURCE_PRESETS: MultiSourcePreset[] = [
  {
    id: 'python-color-vs-mono',
    title: 'Python: Devicon Multi-Color vs Simple Icons Mono',
    sourceA: { name: 'Simple Icons (Mono)', file: 'python.icon.general.monochrome.simpleicons.svg', provider: 'Simple Icons' },
    sourceB: { name: 'Devicon (Multi-Color Original)', file: 'python.icon.general.original.devicon.svg', provider: 'Devicon' },
    description: 'Compares the flat single-color silhouette with the official two-tone yellow & blue Python serpent curves.',
  },
  {
    id: 'typescript-color-vs-mono',
    title: 'TypeScript: Devicon Color vs Simple Icons Mono',
    sourceA: { name: 'Simple Icons (Mono)', file: 'typescript.icon.general.monochrome.simpleicons.svg', provider: 'Simple Icons' },
    sourceB: { name: 'Devicon (Color Plain)', file: 'typescript.icon.general.plain.devicon.svg', provider: 'Devicon' },
    description: 'Compares the inverted lettermark box with the official blue rounded badge representation.',
  },
  {
    id: 'docker-color-vs-mono',
    title: 'Docker: Devicon Color vs Simple Icons Mono',
    sourceA: { name: 'Simple Icons (Mono)', file: 'docker.icon.general.monochrome.simpleicons.svg', provider: 'Simple Icons' },
    sourceB: { name: 'Devicon (Color Plain)', file: 'docker.icon.general.plain.devicon.svg', provider: 'Devicon' },
    description: 'Compares single-color container whale with Devicon multi-tonal blue marine palette.',
  },
];

export const AiVsOfficialSection: React.FC = () => {
  const { t } = useTranslation();
  const [comparisonMode, setComparisonMode] = useState<'ai_vs_canonical' | 'source_vs_source'>('ai_vs_canonical');
  const [activeCaseIdx, setActiveCaseIdx] = useState<number>(0);
  const [activePresetIdx, setActivePresetIdx] = useState<number>(0);

  const [viewMode, setViewMode] = useState<'split' | 'overlay'>('split');
  const [overlayOpacity, setOverlayOpacity] = useState<number>(50);

  const [officialSvg, setOfficialSvg] = useState<string>('');
  const [secondarySvg, setSecondarySvg] = useState<string>('');

  const [officialStats, setOfficialStats] = useState<SvgStats | null>(null);
  const [secondaryStats, setSecondaryStats] = useState<SvgStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const currentAiCase: ComparisonCase = COMPARISON_CASES[activeCaseIdx] || COMPARISON_CASES[0];
  const currentSourcePreset = MULTI_SOURCE_PRESETS[activePresetIdx] || MULTI_SOURCE_PRESETS[0];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function loadAssets() {
      try {
        if (comparisonMode === 'ai_vs_canonical') {
          const offContent = await fetchRawSvg(currentAiCase.officialFile);
          let synContent = '';
          try {
            const res = await fetch(currentAiCase.aiFixture);
            if (res.ok) {
              synContent = await res.text();
            }
          } catch (err) {
            console.warn('Could not load comparison fixture:', err);
          }

          if (!isMounted) return;
          setOfficialSvg(offContent || '');
          setSecondarySvg(synContent || '');

          if (offContent) {
            const stats = parseSvgStats(offContent);
            stats.sha256 = await computeClientSha256(offContent);
            if (isMounted) setOfficialStats(stats);
          } else {
            setOfficialStats(null);
          }

          if (synContent) {
            const stats = parseSvgStats(synContent);
            stats.sha256 = await computeClientSha256(synContent);
            if (isMounted) setSecondaryStats(stats);
          } else {
            setSecondaryStats(null);
          }
        } else {
          // Source vs Source
          const [svgA, svgB] = await Promise.all([
            fetchRawSvg(currentSourcePreset.sourceA.file),
            fetchRawSvg(currentSourcePreset.sourceB.file),
          ]);

          if (!isMounted) return;
          setOfficialSvg(svgA || '');
          setSecondarySvg(svgB || '');

          if (svgA) {
            const statsA = parseSvgStats(svgA);
            statsA.sha256 = await computeClientSha256(svgA);
            if (isMounted) setOfficialStats(statsA);
          }
          if (svgB) {
            const statsB = parseSvgStats(svgB);
            statsB.sha256 = await computeClientSha256(svgB);
            if (isMounted) setSecondaryStats(statsB);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAssets();
    return () => {
      isMounted = false;
    };
  }, [comparisonMode, currentAiCase, currentSourcePreset]);

  function parseSvgStats(svgText: string): SvgStats {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgText, 'image/svg+xml');
      const svgEl = doc.querySelector('svg');
      const viewBox = svgEl?.getAttribute('viewBox') || svgEl?.getAttribute('viewbox') || 'None';
      const allElements = doc.querySelectorAll('*');
      const pathElements = doc.querySelectorAll('path');

      return {
        viewBox,
        elementCount: Math.max(0, allElements.length - 1),
        pathCount: pathElements.length,
        sha256: ''
      };
    } catch {
      return {
        viewBox: 'N/A',
        elementCount: 0,
        pathCount: 0,
        sha256: ''
      };
    }
  }

  return (
    <section id="comparison-lab-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  {t.comparison.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t.comparison.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setComparisonMode('ai_vs_canonical')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                comparisonMode === 'ai_vs_canonical'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.comparison.modeCanonicalVsAi}
            </button>
            <button
              onClick={() => setComparisonMode('source_vs_source')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                comparisonMode === 'source_vs_source'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.comparison.modeSourceVsSource}
            </button>
          </div>
        </div>

        {/* Case selector buttons */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100 overflow-x-auto pb-1">
          {comparisonMode === 'ai_vs_canonical' ? (
            COMPARISON_CASES.map((c, idx) => (
              <button
                key={c.id}
                id={`btn-case-${c.id}`}
                onClick={() => setActiveCaseIdx(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  activeCaseIdx === idx
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {c.title}
              </button>
            ))
          ) : (
            MULTI_SOURCE_PRESETS.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setActivePresetIdx(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  activePresetIdx === idx
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {p.title}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Comparison Area */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
        
        {/* Controls Toolbar: Mode Toggle (Split / Overlay) & Opacity */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>{comparisonMode === 'ai_vs_canonical' ? currentAiCase.title : currentSourcePreset.title}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {comparisonMode === 'ai_vs_canonical' ? currentAiCase.description : currentSourcePreset.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Split / Overlay Toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
              <button
                id="btn-comparison-tab-split"
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>{t.comparison.splitView}</span>
              </button>

              <button
                id="btn-comparison-tab-overlay"
                onClick={() => setViewMode('overlay')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'overlay'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{t.comparison.overlayView}</span>
              </button>
            </div>

            {/* Opacity slider for overlay mode */}
            {viewMode === 'overlay' && (
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-200">
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-2xs text-slate-600">{t.comparison.opacity}:</span>
                <input
                  id="slider-overlay-opacity"
                  type="range"
                  min={0}
                  max={100}
                  value={overlayOpacity}
                  onChange={e => setOverlayOpacity(Number(e.target.value))}
                  className="w-24 h-1.5 accent-indigo-600 rounded-lg cursor-pointer"
                />
                <span className="text-2xs font-mono text-slate-700 w-8">{overlayOpacity}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Visual Inspection Container */}
        <div>
          {loading ? (
            <div className="py-20 text-center text-slate-400 text-xs animate-pulse">
              Loading vector geometry comparisons...
            </div>
          ) : viewMode === 'split' ? (
            /* Split Side-by-Side View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Secondary Asset (AI Fixture or Source B) */}
              <div className={`p-5 rounded-2xl border-2 flex flex-col ${
                comparisonMode === 'ai_vs_canonical'
                  ? 'border-dashed border-rose-200 bg-rose-50/20'
                  : 'border-indigo-200 bg-indigo-50/20'
              }`}>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    comparisonMode === 'ai_vs_canonical'
                      ? 'text-rose-700 bg-rose-100/80'
                      : 'text-indigo-700 bg-indigo-100/80'
                  }`}>
                    {comparisonMode === 'ai_vs_canonical' ? (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{t.comparison.syntheticBadge}</span>
                      </>
                    ) : (
                      <>
                        <ArrowLeftRight className="w-3.5 h-3.5" />
                        <span>{currentSourcePreset.sourceB.name}</span>
                      </>
                    )}
                  </div>
                  <span className="text-2xs font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                    {comparisonMode === 'ai_vs_canonical' ? 'Approximation' : currentSourcePreset.sourceB.provider}
                  </span>
                </div>

                <div className="w-full h-44 bg-white border border-slate-200 rounded-xl shadow-2xs flex items-center justify-center p-4">
                  <div
                    className="w-24 h-24 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                    dangerouslySetInnerHTML={{ __html: secondarySvg }}
                  />
                </div>

                {/* Metrics */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <Box className="w-3.5 h-3.5 text-slate-400" />
                    <span>ViewBox: </span>
                    <span className="font-mono font-medium text-slate-800">{secondaryStats?.viewBox || '24 24'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Binary className="w-3.5 h-3.5 text-slate-400" />
                    <span>Nodes: </span>
                    <span className="font-mono font-medium text-slate-800">{secondaryStats?.elementCount || 0}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1 text-2xs text-slate-500 font-mono truncate">
                    <Hash className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">SHA: {secondaryStats?.sha256 ? secondaryStats.sha256.substring(0, 16) + '...' : 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Primary / Canonical Official Vector */}
              <div className="p-5 rounded-2xl border-2 border-emerald-300 bg-emerald-50/20 flex flex-col">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>
                      {comparisonMode === 'ai_vs_canonical'
                        ? t.comparison.canonicalBadge
                        : currentSourcePreset.sourceA.name}
                    </span>
                  </div>
                  <span className="text-2xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {comparisonMode === 'ai_vs_canonical' ? 'Verified Canonical' : currentSourcePreset.sourceA.provider}
                  </span>
                </div>

                <div className="w-full h-44 bg-white border border-emerald-100 rounded-xl shadow-2xs flex items-center justify-center p-4">
                  <div
                    className="w-24 h-24 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                    dangerouslySetInnerHTML={{ __html: officialSvg }}
                  />
                </div>

                {/* Metrics */}
                <div className="mt-4 pt-3 border-t border-emerald-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <Box className="w-3.5 h-3.5 text-slate-400" />
                    <span>ViewBox: </span>
                    <span className="font-mono font-medium text-slate-800">{officialStats?.viewBox || '24 24'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Binary className="w-3.5 h-3.5 text-slate-400" />
                    <span>Nodes: </span>
                    <span className="font-mono font-medium text-slate-800">{officialStats?.elementCount || 0}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1 text-2xs text-slate-500 font-mono truncate">
                    <Hash className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">SHA: {officialStats?.sha256 ? officialStats.sha256.substring(0, 16) + '...' : 'N/A'}</span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* Interactive Overlay View */
            <div className="flex flex-col items-center py-6">
              <div className="relative w-64 h-64 bg-slate-900 rounded-2xl p-6 shadow-inner flex items-center justify-center border border-slate-800">
                <div
                  className="absolute inset-0 flex items-center justify-center transition-opacity duration-150 p-8 [&>svg]:w-full [&>svg]:h-full"
                  style={{ opacity: (100 - overlayOpacity) / 100 }}
                  dangerouslySetInnerHTML={{ __html: officialSvg }}
                />
                <div
                  className="absolute inset-0 flex items-center justify-center transition-opacity duration-150 pointer-events-none p-8 [&>svg]:w-full [&>svg]:h-full"
                  style={{ opacity: overlayOpacity / 100 }}
                  dangerouslySetInnerHTML={{ __html: secondarySvg }}
                />
              </div>

              <div className="flex items-center gap-4 mt-4 text-xs">
                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Primary Vector ({(100 - overlayOpacity)}%)
                </span>
                <span className="inline-flex items-center gap-1.5 text-indigo-600 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  Secondary Vector ({overlayOpacity}%)
                </span>
              </div>
            </div>
          )}

          {/* Factual Geometric Discrepancies Table for AI mode */}
          {comparisonMode === 'ai_vs_canonical' && (
            <div className="mt-8 border border-slate-200/90 rounded-xl overflow-hidden">
              <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-200 flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Eye className="w-4 h-4 text-indigo-600" />
                <span>{t.comparison.metricsTitle}</span>
              </div>

              <div className="divide-y divide-slate-100">
                {currentAiCase.geometricClaims.map((claim, idx) => (
                  <div key={idx} className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-2xs font-bold">
                        {idx + 1}
                      </span>
                      <span>{claim.feature}</span>
                    </div>
                    <div className="text-rose-700 bg-rose-50/40 p-2.5 rounded-lg border border-rose-100">
                      <span className="font-semibold block mb-0.5">Synthetic Observation:</span>
                      <span>{claim.syntheticObservation}</span>
                    </div>
                    <div className="text-emerald-800 bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100">
                      <span className="font-semibold block mb-0.5">Canonical Official Specification:</span>
                      <span>{claim.canonicalOfficialSpec}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </section>
  );
};

export default AiVsOfficialSection;
