import React, { useState } from 'react';
import { Download, Copy, Check, Terminal, ShieldCheck, Cpu } from 'lucide-react';
import { LUA_FIXED_SCRIPT } from '../data/fixedScriptData';

interface HeaderProps {
  activeTab: 'overview' | 'bugs' | 'code' | 'sandbox';
  setActiveTab: (tab: 'overview' | 'bugs' | 'code' | 'sandbox') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(LUA_FIXED_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([LUA_FIXED_SCRIPT], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'roblox.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-4">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-pink-500/20 text-white font-bold text-lg">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-wide">
                  Settings & Utility UI <span className="text-pink-400">v4.0 Fixed</span>
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3 mr-1" /> 200 Registers OK
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Fixed Luau Register Overflow • TPWalk • Infinity Jump • Head Sit • Chế độ ma
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs font-medium">
            <button
              id="tab-btn-overview"
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tổng quan & Fixes
            </button>
            <button
              id="tab-btn-bugs"
              onClick={() => setActiveTab('bugs')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'bugs'
                  ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Chi tiết 6 Bugs
            </button>
            <button
              id="tab-btn-code"
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'code'
                  ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Xem & Chỉnh Code Lua (.txt)
            </button>
            <button
              id="tab-btn-sandbox"
              onClick={() => setActiveTab('sandbox')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'sandbox'
                  ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mô phỏng Logic (Sandbox)
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              id="copy-script-btn"
              onClick={handleCopy}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all hover:border-slate-600 shadow-sm"
              title="Sao chép toàn bộ mã nguồn script đã fix"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Đã copy!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-300" />
                  <span>Copy Script</span>
                </>
              )}
            </button>

            <button
              id="download-txt-btn"
              onClick={handleDownload}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-semibold transition-all shadow-md shadow-pink-500/20 active:scale-95"
              title="Tải về file script.txt hoàn chỉnh"
            >
              <Download className="w-4 h-4" />
              <span>Tải file .txt</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
