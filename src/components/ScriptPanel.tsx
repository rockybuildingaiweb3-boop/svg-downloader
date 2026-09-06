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
import { useTranslation } from '../i18n/context';

interface ScriptPanelProps {
  selectedSlugs?: string[];
  onRunSimulation?: () => void;
}

export const ScriptPanel: React.FC<ScriptPanelProps> = ({
  selectedSlugs = [],
}) => {
  const { t, format } = useTranslation();
  const [activeCommand, setActiveCommand] = useState<string>('sync-mainstream');
  const [policy, setPolicy] = useState<SourcePolicy>('brand');
  const [scope, setScope] = useState<'mainstream' | 'selected' | 'all'>('mainstream');
  const [dryRun, setDryRun] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Generate runnable CLI command based on options
  const generatedCommand = React.useMemo(() => {
    let cmd = 'node scripts/icon-sync.mjs';
    if (activeCommand === 'sync-mainstream') {
      cmd += ' sync';
      if (scope === 'all') cmd += ' --all';
      if (scope === 'selected' && selectedSlugs.length > 0) {
        cmd += ` --selected "${selectedSlugs.join(',')}"`;
      }
      if (policy !== 'brand') {
        cmd += ` --policy ${policy}`;
      }
      if (dryRun) cmd += ' --dry-run';
    } else if (activeCommand === 'verify') {
      cmd += ' verify';
    } else if (activeCommand === 'doctor') {
      cmd += ' doctor';
    } else if (activeCommand === 'sources') {
      cmd += ' sources';
    } else if (activeCommand === 'variants') {
      cmd += ' variants';
    } else if (activeCommand === 'audit') {
      cmd += ' audit';
    }
    return cmd;
  }, [activeCommand, policy, scope, dryRun, selectedSlugs]);

  const handleCopy = async () => {
    const ok = await copyRawSvg(generatedCommand);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSimulate = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 1200);
  };

  // Simulated output log stream
  const simLogs = [
    '$ ' + generatedCommand,
    '=======================================================================',
    '⚙️ SVG REGISTRY SYNC PIPELINE - AUTONOMOUS MULTI-SOURCE INGESTION',
    '=======================================================================',
    `Timestamp:      ${new Date().toISOString()}`,
    `Command:        ${activeCommand.toUpperCase()}`,
    `Precedence:     ${policy.toUpperCase()} (Official > SVG Logos > Simple Icons > Devicon)`,
    `Scope:          ${scope.toUpperCase()} (${scope === 'selected' ? selectedSlugs.length : 135} identities targeted)`,
    `Mode:           ${dryRun ? 'DRY-RUN (zero disk mutations)' : 'LIVE SYNC (strict atomic writes)'}`,
    '-----------------------------------------------------------------------',
    'Source Adapters Loaded:',
    '  [x] simple-icons    v16.30.0 (3,400+ vectors)',
    '  [x] devicon         v2.17.0 (570+ tech stacks)',
    '  [x] svg-logos       v1.2.13 (2,100+ multi-color)',
    '  [x] official        Vendor Press Centers (Strict Provenance)',
    '  [x] wikimedia       Controlled Wikimedia Commons Archives',
    '-----------------------------------------------------------------------',
    'VALIDATED: react -> simple-icons (monochrome) + devicon (original/line)',
    'VALIDATED: github -> official (primary-dark) + simple-icons (symbol)',
    'VALIDATED: typescript -> devicon (original) + simple-icons (monochrome)',
    'VALIDATED: stripe -> official (wordmark-blurple) + svg-logos (logos)',
    'VALIDATED: apple -> official (primary-black) + simple-icons (monochrome)',
    'VALIDATED: vue -> devicon (original) + simple-icons (monochrome)',
    'VALIDATED: docker -> devicon (original-wordmark) + simple-icons',
    'VALIDATED: tailwindcss -> simple-icons + devicon (plain)',
    'VALIDATED: vercel -> official (primary-black) + simple-icons',
    'VALIDATED: openai -> official (primary-spark) + simple-icons',
    '-----------------------------------------------------------------------',
    dryRun
      ? 'DRY-RUN FINISHED: 0 files written to disk (safe simulation complete)'
      : 'SYNC SUCCESS: Catalog, manifest, and public artifacts refreshed.',
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
                  {t.scriptPanel.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t.scriptPanel.subtitle}
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
              <span>{copied ? t.scriptPanel.copiedCommand : t.scriptPanel.copyCommand}</span>
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
            {copied ? t.scriptPanel.copiedCommand : t.scriptPanel.copyCommand}
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
                Pipeline Action
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'sync-mainstream', label: 'sync' },
                  { id: 'verify', label: 'verify' },
                  { id: 'doctor', label: 'doctor' },
                  { id: 'sources', label: 'sources' },
                  { id: 'variants', label: 'variants' },
                  { id: 'audit', label: 'audit' }
                ].map(cmd => (
                  <button
                    key={cmd.id}
                    id={`btn-cmd-${cmd.id}`}
                    onClick={() => setActiveCommand(cmd.id)}
                    className={`p-2 rounded-lg text-left border text-xs font-mono transition-all cursor-pointer ${
                      activeCommand === cmd.id
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    npm run {cmd.label}
                  </button>
                ))}
              </div>
            </div>

            {activeCommand === 'sync-mainstream' && (
              <>
                {/* Source Policy */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.scriptPanel.policyLabel}
                  </label>
                  <select
                    id="select-policy"
                    value={policy}
                    onChange={e => setPolicy(e.target.value as any)}
                    className="w-full text-xs rounded-lg border-slate-300 bg-slate-50 p-2 font-medium text-slate-800"
                  >
                    <option value="brand">{t.scriptPanel.policyBrand}</option>
                    <option value="technology">{t.scriptPanel.policyDevTools}</option>
                    <option value="monochrome">{t.scriptPanel.policyMonochrome}</option>
                    <option value="official">{t.scriptPanel.policyOfficial}</option>
                  </select>
                </div>

                {/* Scope */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.scriptPanel.scopeLabel}
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
                      {t.scriptPanel.scopeMainstream}
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
                      {format(t.scriptPanel.scopeSelected, { count: selectedSlugs.length })}
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
                      {t.scriptPanel.scopeAll}
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
                    <span>{t.scriptPanel.dryRunLabel}</span>
                  </label>
                </div>
              </>
            )}

          </div>

          {/* Guarantee Checklist */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-600 space-y-2.5">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t.scriptPanel.guaranteesTitle}</span>
            </h4>
            <ul className="space-y-1.5 text-2xs text-slate-600">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>{t.scriptPanel.noAiBezier}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>{t.scriptPanel.noRegexColor}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>{t.scriptPanel.noNumericSuffix}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>{t.scriptPanel.manifestClean}</span>
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
                <span className="text-2xs font-mono text-slate-400 ml-2">{t.scriptPanel.pipelineBash}</span>
              </div>

              <span className="text-2xs font-mono text-indigo-400">{t.scriptPanel.nodeModule}</span>
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
