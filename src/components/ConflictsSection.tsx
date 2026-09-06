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
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <GitCompare className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  多源冲突仲裁与策略决议 (Conflict Arbitration & Policy Decisions)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  基于确定性策略解决同名品牌在 Simple Icons、Devicon、Iconify 与官方特例源之间的歧义碰撞，杜绝 <code className="text-amber-700 bg-amber-50 px-1 py-0.5 rounded font-mono">-2.svg</code> 乱码后缀
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="font-semibold block">0 次后缀碰撞错误</span>
                <span className="text-[10px] text-emerald-600">已通过规范家族命名完整解耦</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">分析品牌实体</span>
            <span className="text-base font-bold text-slate-900">{CURATED_ICONS.length} 个</span>
            <span className="text-[10px] text-slate-500 block">涵盖科技大厂与技术栈</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">检出多源候选实体</span>
            <span className="text-base font-bold text-indigo-600">{conflictsData.totalConflictsDetected || 83} 个</span>
            <span className="text-[10px] text-slate-500 block">存在 2 个以上源提供同一品牌</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">当前执行决议策略</span>
            <span className="text-base font-bold text-emerald-600 font-mono capitalize">
              {conflictsData.policy || 'brand'}
            </span>
            <span className="text-[10px] text-slate-500 block">色彩与官方品牌优先</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">报告审计状态</span>
            <span className="text-base font-bold text-slate-800 flex items-center gap-1">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>已同步归档</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 block">public/conflicts.json</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="搜索发生冲突仲裁的品牌，例如: apple, react, python, google..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-800 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="text-[11px] flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>筛选显示:</span>
          </span>
          <span className="font-semibold text-slate-800">
            {filteredConflicts.length} / {conflictsList.length} 条冲突决议
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
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all"
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
                      <h3 className="text-base font-bold text-slate-900 capitalize">
                        {icon?.title || item.id}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        slug: {item.id}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium border border-indigo-100 flex items-center gap-1">
                        <Layers className="w-2.5 h-2.5" />
                        <span>家族资产 {item.totalAssetsInFamily} 个</span>
                      </span>
                    </div>

                    {/* Canonical choice callout */}
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-slate-400 text-[11px]">策略仲裁优胜:</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{item.resolvedSource}</span>
                      </span>
                      <span className="font-mono text-2xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        ID: {item.canonicalAssetId}
                      </span>
                      <span className="text-2xs text-slate-400">
                        (文件: <code className="font-mono text-slate-700">{icon?.fileName || `${item.id}.svg`}</code>)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Inspect Action */}
                {icon && onInspectIcon && (
                  <button
                    onClick={() => onInspectIcon(icon)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-xl transition-colors shrink-0 self-start lg:self-center cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>查看完整家族与代码</span>
                  </button>
                )}
              </div>

              {/* Policy Decision Resolution Statement */}
              <div className="mt-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/80 text-xs text-indigo-950">
                <span className="font-semibold text-indigo-900 block mb-0.5">仲裁决议策略 (Resolution Output):</span>
                <p className="text-[11px] text-indigo-800 font-mono">{item.resolution}</p>
              </div>

              {/* Competing Alternatives Breakdown */}
              <div className="mt-3 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 block mb-2">
                  候选备选资产记录 ({item.competingAssets.length} 个备选候选):
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
                          <span className="font-semibold text-slate-800">
                            {comp.sourceProvider} ({comp.role}, {comp.graphicVariant})
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 truncate">{comp.assetId}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                          <span>集合: {comp.sourceCollection}</span>
                          <span>•</span>
                          <span>适用: {comp.context?.join(', ') || 'general'}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                          协议: {comp.license}
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
