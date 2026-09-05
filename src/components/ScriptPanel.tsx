import React, { useState } from 'react';
import {
  Terminal,
  Copy,
  Check,
  Play,
  Layers,
  ShieldCheck,
  Cpu,
  Settings,
  HelpCircle
} from 'lucide-react';
import { copyRawSvg } from '../utils/svgHelpers';

interface ScriptPanelProps {
  selectedSlugs: string[];
}

export const ScriptPanel: React.FC<ScriptPanelProps> = ({ selectedSlugs }) => {
  const [activeCommand, setActiveCommand] = useState<string>('sync-mainstream');
  const [policy, setPolicy] = useState<'brand' | 'technology' | 'monochrome' | 'official'>('brand');
  const [scope, setScope] = useState<'mainstream' | 'selected' | 'all'>('mainstream');
  const [dryRun, setDryRun] = useState<boolean>(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Terminal Runner Simulation state
  const [isRunningSim, setIsRunningSim] = useState(false);
  const [simLogs, setSimLogs] = useState<string[]>([
    '💡 权威资产引擎就绪: node scripts/icon-sync.mjs',
    '支持多适配器拓扑: Simple Icons (CC0) + Devicon (MIT) + SVG Logos + 官方档案',
    '点击下方【执行管道模拟】可直观查看解析策略、XML 严格校验与无损生成过程。'
  ]);

  const getCommandLine = () => {
    switch (activeCommand) {
      case 'verify':
        return 'npm run sync -- verify';
      case 'doctor':
        return 'npm run sync -- doctor';
      case 'sources':
        return 'npm run sync -- sources';
      case 'variants':
        return 'npm run sync -- variants';
      case 'audit':
        return 'npm run sync -- audit';
      default: {
        let cmd = 'npm run sync --';
        if (policy !== 'brand') cmd += ` --policy ${policy}`;
        if (dryRun) cmd += ' --dry-run';
        if (scope === 'all') {
          cmd += ' --all';
        } else if (scope === 'selected' && selectedSlugs.length > 0) {
          cmd += ` ${selectedSlugs.slice(0, 5).join(' ')}${selectedSlugs.length > 5 ? ' ...' : ''}`;
        }
        return cmd;
      }
    }
  };

  const handleCopyCmd = async () => {
    const ok = await copyRawSvg(getCommandLine());
    if (ok) {
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 2000);
    }
  };

  const runSimulation = () => {
    setIsRunningSim(true);
    setSimLogs([
      '🚀 Starting Canonical SVG Icon Sync Pipeline (Authoritative Single Engine)...',
      `- Active Source Policy: "${policy}"`,
      '- Simple Icons:  v14.16.0 (3450+ icons)',
      '- Devicon:       v2.16.0 (570+ icons)',
      '- SVG Logos:     v1.2.0 (1200+ multi-color brand icons)',
      '- Official:      Vendor Verified Public Archive',
      'STATUS   CANONICAL ID      SOURCE         FILE           INFO',
      '-----------------------------------------------------------------------'
    ]);

    const sampleItems = [
      { id: 'amazon', source: 'official', file: 'amazon.svg', info: 'Amazon (Smile Brandmark, Official dark mark preserved)' },
      { id: 'openai', source: 'official', file: 'openai.svg', info: 'OpenAI (6-fold rotational symmetry topology verified)' },
      { id: 'react', source: 'devicon', file: 'react.svg', info: 'React (original variant, 3 60-degree precision orbits)' },
      { id: 'typescript', source: 'devicon', file: 'typescript.svg', info: 'TypeScript (plain variant, verified)' },
      { id: 'github', source: 'simple-icons', file: 'github.svg', info: 'GitHub (CC0 monochrome vector verified)' },
      { id: 'microsoft', source: 'official', file: 'microsoft.svg', info: 'Microsoft (4-color corporate mark verified)' }
    ];

    sampleItems.forEach((item, index) => {
      setTimeout(() => {
        setSimLogs(prev => [
          ...prev,
          `VALID    ${item.id.padEnd(17)} ${item.source.padEnd(14)} ${item.file.padEnd(14)} ${item.info}`
        ]);
        if (index === sampleItems.length - 1) {
          setTimeout(() => {
            setSimLogs(prev => [
              ...prev,
              '-----------------------------------------------------------------------',
              '✨ PIPELINE SYNCHRONIZATION SUMMARY',
              'Discovered:     128',
              'Resolved:       128',
              'Downloaded:     128',
              'Validated:      128',
              'Warnings:       0',
              'Conflicts:      14 (Resolved deterministically via policy without -2.svg suffixes)',
              'Unresolved:     0',
              'Stale Removed:  0',
              '-----------------------------------------------------------------------',
              'Artifacts Generated: /public/icons/, catalog.json, manifest.json, index.ts, react.tsx, vue.ts'
            ]);
            setIsRunningSim(false);
          }, 300);
        }
      }, (index + 1) * 200);
    });
  };

  return (
    <div id="script-panel-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Overview Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
              <Terminal className="w-3.5 h-3.5" />
              <span>CI/CD 自动化集成命令行 (CLI)</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              单一权威同步引擎 (Canonical Asset Pipeline)
            </h2>
            <p className="text-sm text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
              彻底告别碎片化下载脚本与硬编码资产。通过一套可配置策略引擎，
              从 Simple Icons、Devicon、SVG Logos 与官方特例档案中按需解析无损矢量，
              并通过 DOM XML 验证与 SHA-256 哈希保障字节级完整性。
            </p>
          </div>

          <button
            onClick={runSimulation}
            disabled={isRunningSim}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
          >
            <Play className={`w-4 h-4 ${isRunningSim ? 'animate-spin' : ''}`} />
            <span>{isRunningSim ? '正在模拟同步...' : '执行管道模拟'}</span>
          </button>
        </div>

        {/* Quick Command Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-xs text-slate-400 font-mono">命令行调用:</span>
            <code className="px-3 py-1.5 rounded-lg bg-black/50 border border-slate-700 text-xs font-mono text-emerald-400 select-all">
              {getCommandLine()}
            </code>
          </div>

          <button
            id="btn-copy-cli-command"
            onClick={handleCopyCmd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer shrink-0"
          >
            {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCmd ? '已复制命令' : '复制命令'}</span>
          </button>
        </div>
      </div>

      {/* Configuration & Options Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Command & Policy Tuning */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Settings className="w-4 h-4 text-indigo-600" />
              <span>管道模式与策略选择</span>
            </h3>

            {/* Mode selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">指令模式</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'sync-mainstream', label: '同步同步库 (sync)' },
                  { id: 'verify', label: '哈希与XML校验 (verify)' },
                  { id: 'doctor', label: '环境自检 (doctor)' },
                  { id: 'sources', label: '查看数据源 (sources)' },
                  { id: 'variants', label: '变体分布 (variants)' },
                  { id: 'audit', label: '完整性审计 (audit)' }
                ].map(cmd => (
                  <button
                    key={cmd.id}
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
                    value={policy}
                    onChange={e => setPolicy(e.target.value as any)}
                    className="w-full text-xs rounded-lg border-slate-300 bg-slate-50 p-2 font-medium text-slate-800"
                  >
                    <option value="brand">品牌多色优先 (SVG Logos &gt; Devicon &gt; Simple Icons)</option>
                    <option value="technology">开发者工具优先 (Devicon &gt; Simple Icons &gt; SVG Logos)</option>
                    <option value="monochrome">单色矢量优先 (Simple Icons &gt; Devicon &gt; Official)</option>
                    <option value="official">官方厂商档案优先 (Official &gt; Devicon &gt; Simple Icons)</option>
                  </select>
                </div>

                {/* Scope */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    同步范围 (Scope)
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
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
