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
        // 1. Fetch authentic canonical SVG
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
      const viewBox = svgEl?.getAttribute('viewBox') || 'None';
      const allElements = doc.querySelectorAll('*');
      const pathElements = doc.querySelectorAll('path');

      return {
        viewBox,
        elementCount: Math.max(0, allElements.length - 1), // exclude root svg
        pathCount: pathElements.length,
        sha256: ''
      };
    } catch {
      return { viewBox: 'None', elementCount: 0, pathCount: 0, sha256: '' };
    }
  }

  return (
    <section id="ai-vs-official-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Educational Banner */}
      <div id="ai-comparison-header" className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>矢量几何精度对比与实测分析</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            真实官方矢量与合成 AI 逼近样本的数据对比
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            大语言模型在生成 SVG 时依赖字符概率推测贝塞尔控制点，缺乏物理几何约束。
            本工具通过直接加载管道同步的<strong>权威原生 SVG 资产</strong>与<strong>合成逼近夹具</strong>，
            展示两者在贝塞尔拓扑、视图坐标、元素节点数及 SHA-256 校验和层面的可量化差异。
          </p>
        </div>

        {/* 3 Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-white rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2 text-rose-700 font-semibold text-xs mb-1.5">
              <span className="w-5 h-5 rounded-full bg-rose-50 flex items-center justify-center text-xs">1</span>
              <span>曲线连续性 (G2 Continuity)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              官方矢量由品牌设计团队通过连续切线贝塞尔构建，AI 预测的控制点往往产生可见棱角与曲率畸变。
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2 text-amber-700 font-semibold text-xs mb-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center text-xs">2</span>
              <span>商标合规与辨识度</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              主流品牌指南对留白间距、旋转夹角与笔画粗细有严格标准，微小偏差即可导致专业质感丧失。
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs mb-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-xs">3</span>
              <span>管道原生校验保证</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              系统通过 Simple Icons、Devicon 及官方档案同步原始字节，全流程绝不重绘或擅自覆盖着色。
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Tool Stage */}
      <div id="ai-comparison-stage" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Case Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50/70 px-4 py-2.5 gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {COMPARISON_CASES.map((c, idx) => (
              <button
                key={c.id}
                id={`comparison-tab-${c.id}`}
                onClick={() => setActiveCaseIdx(idx)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCaseIdx === idx
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-lg">
            <button
              id="view-mode-split-btn"
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                viewMode === 'split' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>并排对比</span>
            </button>
            <button
              id="view-mode-overlay-btn"
              onClick={() => setViewMode('overlay')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                viewMode === 'overlay' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>叠层透视 (Overlay)</span>
            </button>
          </div>
        </div>

        {/* Active Case Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">{currentCase.title}</h3>
              <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                /icons/{currentCase.officialFile}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">{currentCase.description}</p>
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-lg shrink-0">
            <span className="text-slate-400">官方来源: </span>
            <span className="font-medium text-slate-700">{currentCase.officialSource}</span>
          </div>
        </div>

        {/* View Mode: Overlay Slider Controls */}
        {viewMode === 'overlay' && (
          <div className="bg-slate-50 border-b border-slate-200/80 px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <span>透视透明度调节:</span>
              <span className="text-slate-500 font-normal">
                {overlayOpacity === 0 ? '100% 官方矢量' : overlayOpacity === 100 ? '100% 合成逼近' : `混合比例 ${100 - overlayOpacity}% 官方 : ${overlayOpacity}% 合成`}
              </span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-72">
              <span className="text-xs text-emerald-700 font-medium whitespace-nowrap">官方</span>
              <input
                id="comparison-overlay-slider"
                type="range"
                min="0"
                max="100"
                value={overlayOpacity}
                onChange={e => setOverlayOpacity(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-xs text-rose-700 font-medium whitespace-nowrap">AI 逼近</span>
            </div>
          </div>
        )}

        {/* Render Stage Area */}
        <div className="p-6">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400">
              正在加载并验证高精度矢量资产...
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

                {/* Foreground Synthetic Vector with Red Stroke */}
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
                    <span className="font-semibold block mb-0.5"> 官方标准规格:</span>
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
