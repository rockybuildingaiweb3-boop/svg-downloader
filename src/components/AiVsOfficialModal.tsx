import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Layers,
  Columns,
  Eye,
  Hash,
  Box,
  Binary,
  ShieldCheck,
  Zap,
  Sliders
} from 'lucide-react';
import { COMPARISON_CASES, ComparisonCase } from '../data/comparisonCases';
import { fetchRawSvg, computeClientSha256 } from '../utils/svgHelpers';

interface SvgStats {
  viewBox: string;
  elementCount: number;
  pathCount: number;
  sha256: string;
}

export const AiVsOfficialSection: React.FC = () => {
  const [activeCaseIdx, setActiveCaseIdx] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'split' | 'overlay'>('split');
  const [overlayOpacity, setOverlayOpacity] = useState<number>(50); // 0 (pure official) to 100 (pure synthetic)

  const [officialSvg, setOfficialSvg] = useState<string>('');
  const [syntheticSvg, setSyntheticSvg] = useState<string>('');

  const [officialStats, setOfficialStats] = useState<SvgStats | null>(null);
  const [syntheticStats, setSyntheticStats] = useState<SvgStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const currentCase: ComparisonCase = COMPARISON_CASES[activeCaseIdx] || COMPARISON_CASES[0];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function loadAssets() {
      try {
        // 1. Fetch authentic canonical SVG from catalog
        const offContent = await fetchRawSvg(currentCase.officialFile);

        // 2. Fetch synthetic approximation fixture
        let synContent = '';
        try {
          const res = await fetch(currentCase.aiFixture);
          if (res.ok) {
            synContent = await res.text();
          }
        } catch (err) {
          console.warn('Could not load comparison fixture:', err);
        }

        if (!isMounted) return;

        setOfficialSvg(offContent || '');
        setSyntheticSvg(synContent || '');

        // 3. Compute live DOM geometry and SHA-256
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
          if (isMounted) setSyntheticStats(stats);
        } else {
          setSyntheticStats(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAssets();
    return () => {
      isMounted = false;
    };
  }, [currentCase]);

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
        elementCount: Math.max(0, allElements.length - 1), // exclude <svg>
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
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <Zap className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  真实官方原生矢量 VS 大模型/扩散模型失真逼近实测实验室
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  严谨的几何拓扑实测，揭示 AI 生成矢量在贝塞尔曲线连续性、旋转对称性及微尺寸失真问题。
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
              权威来源驱动 · 拒绝 AI 猜测
            </span>
          </div>
        </div>

        {/* Case selector tabs */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100 overflow-x-auto pb-1">
          {COMPARISON_CASES.map((c, idx) => (
            <button
              key={c.id}
              id={`btn-case-${c.id}`}
              onClick={() => setActiveCaseIdx(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                activeCaseIdx === idx
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Comparison Area */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
        
        {/* Controls Toolbar: Mode Toggle (Split / Overlay) & Opacity */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>{currentCase.title}</span>
              <span className="text-xs font-normal text-slate-400">·</span>
              <span className="text-xs font-normal text-slate-500">{currentCase.officialSource}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{currentCase.description}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Split / Overlay Toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
              <button
                id="btn-comparison-tab-split"
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>分屏对照 (Split)</span>
              </button>

              <button
                id="btn-comparison-tab-overlay"
                onClick={() => setViewMode('overlay')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'overlay'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>叠层穿透 (Overlay)</span>
              </button>
            </div>

            {/* Opacity slider for overlay mode */}
            {viewMode === 'overlay' && (
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-200">
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-2xs text-slate-600">混合度:</span>
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
              正在加载原生矢量与对比样本...
            </div>
          ) : viewMode === 'split' ? (
            /* Split Side-by-Side View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Synthetic Approximation */}
              <div className="p-5 rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/20 flex flex-col">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-100/80 px-2.5 py-1 rounded-full">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>合成 LLM 逼近样本 (Fixture)</span>
                  </div>
                  <span className="text-2xs font-mono text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    非官方基线
                  </span>
                </div>

                <div className="w-full h-44 bg-white border border-rose-100 rounded-xl shadow-2xs flex items-center justify-center p-4">
                  <div
                    className="w-24 h-24 flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: syntheticSvg }}
                  />
                </div>

                {/* Metrics */}
                <div className="mt-4 pt-3 border-t border-rose-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <Box className="w-3.5 h-3.5 text-slate-400" />
                    <span>ViewBox: </span>
                    <span className="font-mono font-medium text-slate-800">{syntheticStats?.viewBox || '24 24'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Binary className="w-3.5 h-3.5 text-slate-400" />
                    <span>矢量节点数: </span>
                    <span className="font-mono font-medium text-slate-800">{syntheticStats?.elementCount || 0} 个</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1 text-2xs text-slate-500 font-mono truncate">
                    <Hash className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">SHA: {syntheticStats?.sha256 || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Official Verified Canonical Vector */}
              <div className="p-5 rounded-2xl border-2 border-emerald-300 bg-emerald-50/20 flex flex-col">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>权威原生矢量 (Canonical SVG)</span>
                  </div>
                  <span className="text-2xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    官方像素标准
                  </span>
                </div>

                <div className="w-full h-44 bg-white border border-emerald-100 rounded-xl shadow-2xs flex items-center justify-center p-4">
                  <div
                    className="w-24 h-24 flex items-center justify-center"
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
                    <span>矢量节点数: </span>
                    <span className="font-mono font-medium text-slate-800">{officialStats?.elementCount || 0} 个</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1 text-2xs text-slate-500 font-mono truncate">
                    <Hash className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">SHA: {officialStats?.sha256 || 'N/A'}</span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* Interactive Overlay View */
            <div className="flex flex-col items-center py-6">
              <div className="relative w-64 h-64 bg-slate-900 rounded-2xl p-6 shadow-inner flex items-center justify-center border border-slate-800">
                
                {/* Background Official Vector */}
                <div
                  className="absolute inset-0 flex items-center justify-center transition-opacity duration-150"
                  style={{ opacity: (100 - overlayOpacity) / 100 }}
                  dangerouslySetInnerHTML={{ __html: officialSvg }}
                />

                {/* Foreground Synthetic Vector */}
                <div
                  className="absolute inset-0 flex items-center justify-center transition-opacity duration-150 pointer-events-none"
                  style={{ opacity: overlayOpacity / 100 }}
                  dangerouslySetInnerHTML={{ __html: syntheticSvg }}
                />
              </div>

              <div className="flex items-center gap-4 mt-4 text-xs">
                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  权威原生层 ({(100 - overlayOpacity)}%)
                </span>
                <span className="inline-flex items-center gap-1.5 text-rose-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  合成逼近层 ({overlayOpacity}%)
                </span>
              </div>
            </div>
          )}

          {/* Measurable Geometric Divergences Table */}
          <div className="mt-8 border border-slate-200/90 rounded-xl overflow-hidden">
            <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-200 flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Eye className="w-4 h-4 text-indigo-600" />
              <span>可量化几何规格与特征偏差实测 (Factual Geometric Discrepancies)</span>
            </div>

            <div className="divide-y divide-slate-100">
              {currentCase.geometricClaims.map((claim, idx) => (
                <div key={idx} className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-2xs">
                      {idx + 1}
                    </span>
                    <span>{claim.feature}</span>
                  </div>
                  <div className="text-rose-700 bg-rose-50/40 p-2.5 rounded-lg border border-rose-100">
                    <span className="font-semibold block mb-0.5">⚠️ 合成推测表现:</span>
                    <span>{claim.syntheticObservation}</span>
                  </div>
                  <div className="text-emerald-800 bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100">
                    <span className="font-semibold block mb-0.5">官方标准规格:</span>
                    <span>{claim.canonicalOfficialSpec}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};

export default AiVsOfficialSection;
