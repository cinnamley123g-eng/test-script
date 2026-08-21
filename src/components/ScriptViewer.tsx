import React, { useState } from 'react';
import { LUA_FIXED_SCRIPT, SCRIPT_SECTIONS } from '../data/fixedScriptData';
import { Search, Download, Copy, Check, FileText, CheckCircle2, Terminal, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

export const ScriptViewer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<'text-xs' | 'text-sm' | 'text-[11px]'>('text-xs');
  const [editableScript, setEditableScript] = useState(LUA_FIXED_SCRIPT);
  const [isEditing, setIsEditing] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(editableScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([editableScript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'roblox.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleResetToDefault = () => {
    setEditableScript(LUA_FIXED_SCRIPT);
    setIsEditing(false);
  };

  // Filter lines if search query is present
  const lines = editableScript.split('\n');
  const filteredIndices = searchQuery.trim()
    ? lines
        .map((line, idx) => (line.toLowerCase().includes(searchQuery.toLowerCase()) ? idx : -1))
        .filter((idx) => idx !== -1)
    : null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Top Toolbar */}
      <div className="bg-slate-850 p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-mono">roblox.txt (1 Script Duy Nhất)</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Roblox Luau v4.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Tổng cộng {lines.length} dòng • Đã tối ưu hóa thanh ghi local (14/200 registers)
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="search-code-input"
              type="text"
              placeholder="Tìm kiếm hàm, biến, logic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 w-48 sm:w-60 transition-all font-mono"
            />
          </div>

          {/* Zoom buttons */}
          <div className="flex items-center bg-slate-950 border border-slate-700/80 rounded-xl p-0.5">
            <button
              onClick={() => setFontSize('text-[11px]')}
              className={`p-1.5 rounded-lg text-xs ${fontSize === 'text-[11px]' ? 'bg-slate-800 text-pink-400 font-bold' : 'text-slate-400 hover:text-white'}`}
              title="Cỡ chữ nhỏ"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setFontSize('text-xs')}
              className={`p-1.5 rounded-lg text-xs ${fontSize === 'text-xs' ? 'bg-slate-800 text-pink-400 font-bold' : 'text-slate-400 hover:text-white'}`}
              title="Cỡ chữ chuẩn"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('text-sm')}
              className={`p-1.5 rounded-lg text-xs ${fontSize === 'text-sm' ? 'bg-slate-800 text-pink-400 font-bold' : 'text-slate-400 hover:text-white'}`}
              title="Cỡ chữ lớn"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Copy Button */}
          <button
            id="copy-viewer-btn"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Đã chép!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            id="download-viewer-btn"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải .txt</span>
          </button>
        </div>
      </div>

      {/* Quick Section Jump Navigator */}
      <div className="bg-slate-950/60 px-4 py-2 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px]">
        <span className="text-slate-400 shrink-0 font-medium flex items-center gap-1">
          <Terminal className="w-3 h-3 text-pink-400" /> Nhảy nhanh:
        </span>
        {SCRIPT_SECTIONS.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setSearchQuery(sec.name.split(' ')[0])}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/50 shrink-0 transition-all"
          >
            {sec.name} <span className="text-slate-400 font-mono text-[9px]">({sec.lineRange})</span>
          </button>
        ))}
      </div>

      {/* Code Textarea / Viewer Area */}
      <div className="relative bg-slate-950 p-4 font-mono overflow-auto max-h-[600px]">
        {searchQuery.trim() && filteredIndices && (
          <div className="mb-3 px-3 py-1.5 bg-pink-500/10 border border-pink-500/20 rounded-lg text-xs text-pink-300 flex items-center justify-between">
            <span>Tìm thấy {filteredIndices.length} dòng chứa từ khóa &quot;{searchQuery}&quot;</span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-pink-400 hover:underline font-semibold"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}

        <div className="flex">
          {/* Line Numbers */}
          <div className="select-none pr-4 text-right text-slate-400 border-r border-slate-800 font-mono text-[11px] leading-6 shrink-0">
            {lines.map((_, i) => (
              <div
                key={i}
                className={
                  filteredIndices && filteredIndices.includes(i)
                    ? 'text-pink-400 font-bold bg-pink-500/10 px-1 rounded'
                    : ''
                }
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code Body */}
          <div className={`pl-4 flex-1 overflow-x-auto ${fontSize} leading-6 text-slate-200`}>
            <pre className="whitespace-pre">
              {lines.map((line, idx) => {
                const isMatch = filteredIndices && filteredIndices.includes(idx);
                let lineClass = 'text-slate-300';
                if (line.startsWith('--')) lineClass = 'text-slate-400 italic';
                else if (line.includes('function') || line.startsWith('local')) lineClass = 'text-pink-300';
                else if (line.includes('true') || line.includes('false') || line.includes('nil')) lineClass = 'text-amber-300';
                else if (line.includes('game:GetService') || line.includes('Instance.new')) lineClass = 'text-cyan-300';

                return (
                  <div
                    key={idx}
                    className={`${lineClass} ${isMatch ? 'bg-pink-500/20 text-white font-bold px-1 rounded' : ''}`}
                  >
                    {line || ' '}
                  </div>
                );
              })}
            </pre>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-slate-900 px-4 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Script đã sẵn sàng thực thi trực tiếp vào Roblox Executor</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/roblox.txt"
            target="_blank"
            rel="noreferrer"
            className="text-pink-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
          >
            Mở raw /public/roblox.txt ↗
          </a>
        </div>
      </div>
    </div>
  );
};
