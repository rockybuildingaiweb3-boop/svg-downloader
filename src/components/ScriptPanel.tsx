import React, { useState } from 'react';
import {
  Terminal,
  Play,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Layers,
  Cpu,
  RefreshCw,
  Sliders,
  FileCheck
} from 'lucide-react';
import { SourcePolicy } from '../types';
import { copyRawSvg } from '../utils/svgHelpers';

interface ScriptPanelProps {
  selectedSlugs?: string[];
  onRunSimulation?: () => void;
}

export const ScriptPanel: React.FC<ScriptPanelProps> = ({
  selectedSlugs = [],
}) => {
  const [activeCommand, setActiveCommand] = useState<string>('sync-mainstream');
  const [policy, setPolicy] = useState<SourcePolicy>('brand');
  const [scope, setScope] = useState<'mainstream' | 'selected' | 'all'>('mainstream');
  const [dryRun, setDryRun] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Build real CLI command based on options
  const generatedCommand = React.useMemo(() => {
    let cmd = 'npm run sync';
    const flags: string[] = [];

    if (activeCommand === 'verify') {
      return 'npm run verify';
    }
    if (activeCommand === 'doctor') {
      return 'npm run doctor';
    }
    if (activeCommand === 'audit') {
      return 'npm run audit';
    }
    if (activeCommand === 'sources') {
      return 'npm run sync -- sources';
    }
    if (activeCommand === 'variants') {
      return 'npm run sync -- variants';
    }

    // Sync sub-options
    if (policy && policy !== 'brand') {
      flags.push(`--policy ${policy}`);
    }

    if (scope === 'all') {
      flags.push('--all');
    } else if (scope === 'selected' && selectedSlugs.length > 0) {
      flags.push(selectedSlugs.join(','));
    } else if (scope === 'mainstream') {
      flags.push('--scope mainstream');
    }

    if (dryRun) {
      flags.push('--dry-run');
    }

    if (flags.length > 0) {
      cmd += ` -- ${flags.join(' ')}`;
    }

    return cmd;
  }, [activeCommand, policy, scope, selectedSlugs, dryRun]);

  const handleCopy = async () => {
    const ok = await copyRawSvg(generatedCommand);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const simLogs = [
    '$ ' + generatedCommand,
    '🚀 Starting Canonical SVG Sync Pipeline...',
    `- Active Source Policy: "${policy}"`,
    '- Simple Icons:  16.30.0 (3459 icons)',
    '- Devicon:       2.17.0 (578 icons)',
    '- SVG Logos:     1.2.13 (2110 icons)',
    '- Official:      6 verified vendor assets',
    dryRun ? '- Mode:          --dry-run (no disk modifications will be performed)\n' : '',
    'STATUS   CANONICAL ID      SOURCE         FILE           INFO',
    '-----------------------------------------------------------------------',
    'VALID    apple             svg-logos      apple.svg      Apple (4 family assets)',
    'VALID    react             devicon        react.svg      React (6 family assets)',
    'VALID    github            devicon        github.svg     GitHub (6 family assets)',
    'VALID    instagram         svg-logos      instagram.svg  Instagram (3 family assets)',
    'VALID    microsoft         wikimedia      microsoft.svg  Microsoft (3 family assets)',
    'VALID    google            svg-logos      google.svg     Google (7 family assets)',
    'VALID    openai            wikimedia      openai.svg     OpenAI (3 family assets)',
    'VALID    amazon            wikimedia      amazon.svg     Amazon (1 family assets)',
    'VALID    docker            devicon        docker.svg     Docker (7 family assets)',
    'VALID    cloudflare        svg-logos      cloudflare.svg Cloudflare (7 family assets)',
    '-----------------------------------------------------------------------',
    '✨ PIPELINE SYNCHRONIZATION SUMMARY',
    '-----------------------------------------------------------------------',
    'Discovered:     10 | Resolved: 10 | Validated: 10 | Conflicts: 10 | Unresolved: 0',
    '======================================================================='
  ].filter(Boolean);

  return (
    <div id="script-panel-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Terminal className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  CLI 自动化流水线 & 开发者命令工作台
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  所有前端呈现资产均由 <code className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded font-mono">scripts/icon-sync.mjs</code> 单权威引擎驱动，保证构建的一致性与可复现性。
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="btn-copy-cli-command"
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '已复制命令' : '复制命令'}</span>
            </button>
          </div>
        </div>

        {/* Command Display Terminal Bar */}
        <div className="bg-slate-900 text-slate-100 rounded-xl p-3 px-4 font-mono text-xs flex items-center justify-between border border-slate-800">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-emerald-400 select-none">$</span>
            <span className="text-indigo-300 select-all font-semibold">{generatedCommand}</span>
          </div>
          <button
            onClick={handleCopy}
            className="text-2xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 transition-colors shrink-0 ml-2"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Grid: Command Controls & Terminal Emulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Command & Scope Configurator */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
            
            {/* Command selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                执行动作 (Pipeline Action)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'sync-mainstream', label: '同步图库 (sync)' },
                  { id: 'verify', label: '哈希与XML校验 (verify)' },
                  { id: 'doctor', label: '环境自检 (doctor)' },
                  { id: 'sources', label: '查看数据源 (sources)' },
                  { id: 'variants', label: '变体分布 (variants)' },
                  { id: 'audit', label: '完整性审计 (audit)' }
                ].map(cmd => (
                  <button
                    key={cmd.id}
                    id={`btn-cmd-${cmd.id}`}
                    onClick={() => setActiveCommand(cmd.id)}
                    className={`p-2 rounded-lg text-left border text-xs transition-all cursor-pointer ${
                      activeCommand === cmd.id
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {cmd.label}
                  </button>
                ))}
              </div>
            </div>

            {activeCommand === 'sync-mainstream' && (
              <>
                {/* Source Policy */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    解析优先策略 (--policy)
                  </label>
                  <select
                    id="select-policy"
                    value={policy}
                    onChange={e => setPolicy(e.target.value as any)}
                    className="w-full text-xs rounded-lg border-slate-300 bg-slate-50 p-2 font-medium text-slate-800"
                  >
                    <option value="brand">品牌多色优先 (Official &gt; SVG Logos &gt; Simple Icons &gt; Devicon)</option>
                    <option value="technology">开发者工具优先 (Devicon &gt; SVG Logos &gt; Simple Icons)</option>
                    <option value="monochrome">单色矢量优先 (Simple Icons &gt; Devicon &gt; Official)</option>
                    <option value="official">官方厂商档案优先 (Official &gt; Wikimedia)</option>
                  </select>
                </div>

                {/* Scope */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    同步范围 (Scope)
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      id="btn-scope-mainstream"
                      onClick={() => setScope('mainstream')}
                      className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                        scope === 'mainstream'
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-semibold'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      主流集合
                    </button>
                    <button
                      id="btn-scope-selected"
                      onClick={() => setScope('selected')}
                      className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                        scope === 'selected'
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-semibold'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      已选 ({selectedSlugs.length})
                    </button>
                    <button
                      id="btn-scope-all"
                      onClick={() => setScope('all')}
                      className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                        scope === 'all'
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-semibold'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      全量 (--all)
                    </button>
                  </div>
                </div>

                {/* Dry Run Checkbox */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-700">
                    <input
                      id="checkbox-dry-run"
                      type="checkbox"
                      checked={dryRun}
                      onChange={e => setDryRun(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 border-slate-300"
                    />
                    <span>模拟运行 (--dry-run: 不修改磁盘)</span>
                  </label>
                </div>
              </>
            )}

          </div>

          {/* Guarantee Checklist */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-600 space-y-2.5">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>架构保证 (Pipeline Guarantees)</span>
            </h4>
            <ul className="space-y-1.5 text-2xs text-slate-600">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>杜绝 AI 贝塞尔控制点生成的失真图形</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>禁止正则颜色替换，保留官方多色/单色原生字节</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>无数值后缀冲突（如 -2.svg），基于策略精确归一</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>清单驱动安全清理，避免陈旧或多余残余文件</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Live Simulated Terminal Console */}
        <div className="lg:col-span-2">
          <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-full min-h-[460px]">
            {/* Terminal Top Window Bar */}
            <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="text-2xs font-mono text-slate-400 ml-2">bash - icon-sync-pipeline</span>
              </div>

              <span className="text-2xs font-mono text-indigo-400">Node.js ES Module</span>
            </div>

            {/* Terminal Screen Logs */}
            <div className="p-5 font-mono text-xs text-slate-200 overflow-y-auto space-y-1 flex-1 leading-relaxed">
              {simLogs.map((log, index) => (
                <div
                  key={index}
                  className={`${
                    log.startsWith('VALID')
                      ? 'text-emerald-400'
                      : log.startsWith('FAILED')
                      ? 'text-rose-400 font-bold'
                      : log.startsWith('STATUS') || log.startsWith('---')
                      ? 'text-slate-500'
                      : log.startsWith('✨')
                      ? 'text-indigo-300 font-bold'
                      : 'text-slate-300'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ScriptPanel;
