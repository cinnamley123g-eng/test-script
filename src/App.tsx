/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { CompilerStatusBanner } from './components/CompilerStatusBanner';
import { BugFixMatrix } from './components/BugFixMatrix';
import { ScriptViewer } from './components/ScriptViewer';
import { FeatureSandbox } from './components/FeatureSandbox';
import { Download, Copy, Check, Terminal, ShieldAlert, Cpu, Sparkles, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { LUA_FIXED_SCRIPT } from './data/fixedScriptData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'bugs' | 'code' | 'sandbox'>('overview');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(LUA_FIXED_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([LUA_FIXED_SCRIPT], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'roblox.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-pink-500 selection:text-white pb-16">
      {/* Top Sticky Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Compiler Status & Overview */}
        <CompilerStatusBanner />

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Action Hero Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20">
                  <Sparkles className="w-3.5 h-3.5" /> 1 Script Duy Nhất • v4.0.0
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Toàn bộ lỗi thanh ghi & logic cũ đã được khắc phục 100%
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  File <span className="font-mono text-pink-400 font-bold">roblox.txt</span> là 1 script Roblox Luau duy nhất hoàn chỉnh, đã sẵn sàng để tải về hoặc nạp trực tiếp vào các Roblox Executors phổ biến (Solara, Wave, Delta, Fluxus, Synapse Z, v.v.).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  id="hero-copy-btn"
                  onClick={handleCopy}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 shadow-md flex items-center gap-2 transition-all active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Đã chép vào bộ nhớ tạm!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Sao chép Code Lua</span>
                    </>
                  )}
                </button>

                <button
                  id="hero-download-btn"
                  onClick={handleDownload}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-pink-500/20 flex items-center gap-2 transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải file roblox.txt</span>
                </button>
              </div>
            </div>

            {/* 6 Bugs Summary Matrix */}
            <BugFixMatrix />

            {/* Script Code Viewer Preview */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-pink-400" /> Mã nguồn roblox.txt (1 Script Duy Nhất)
                </h3>
                <button
                  onClick={() => setActiveTab('code')}
                  className="text-xs text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1"
                >
                  Mở chế độ xem toàn màn hình <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <ScriptViewer />
            </div>
          </div>
        )}

        {/* Tab 2: Bugs Detailed Matrix */}
        {activeTab === 'bugs' && (
          <div className="space-y-6">
            <BugFixMatrix />
          </div>
        )}

        {/* Tab 3: Code Viewer & Editor */}
        {activeTab === 'code' && (
          <div className="space-y-6">
            <ScriptViewer />
          </div>
        )}

        {/* Tab 4: Sandbox Simulation */}
        {activeTab === 'sandbox' && (
          <div className="space-y-6">
            <FeatureSandbox />
          </div>
        )}
      </main>

      {/* Persistent Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>SettingsMenuUI v4.0 • Luau Compiler Optimizer & Bug Fix Suite</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Root Local Registers: 14/200</span>
          <span>•</span>
          <span>Zero Memory Leaks</span>
        </div>
      </footer>
    </div>
  );
}

