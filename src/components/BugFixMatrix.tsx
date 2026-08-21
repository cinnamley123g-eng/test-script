import React, { useState } from 'react';
import { BUGS_FIX_LIST } from '../data/fixedScriptData';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Code2, Sparkles, Copy, Check } from 'lucide-react';

export const BugFixMatrix: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string>(BUGS_FIX_LIST[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            Danh Sách Chi Tiết 6 Lỗi & Giải Pháp Khắc Phục Logic
          </h2>
          <p className="text-xs text-slate-400">
            Xem sự khác biệt giữa code cũ bị lỗi và code mới đã được tối ưu hóa chuẩn xác
          </p>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Hiển thị: <span className="text-pink-400 font-bold">6/6 Bugs</span> đã giải quyết
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {BUGS_FIX_LIST.map((bug, index) => {
          const isExpanded = expandedId === bug.id;

          return (
            <div
              key={bug.id}
              className={`border rounded-2xl transition-all overflow-hidden ${
                isExpanded
                  ? 'bg-slate-900 border-pink-500/40 shadow-lg shadow-pink-500/5'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header Toggle */}
              <button
                id={`bug-toggle-${bug.id}`}
                onClick={() => setExpandedId(isExpanded ? '' : bug.id)}
                className="w-full text-left p-4.5 flex items-center justify-between gap-3 select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                    0{index + 1}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-white tracking-wide">
                        {bug.title}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {bug.badge}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          bug.severity === 'Critical'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {bug.severity}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:inline text-xs text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Đã Fix
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-pink-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Collapsible Content */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-800/80 space-y-4">
                  {/* Problem & Solution Explanation */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
                    <div className="bg-rose-950/20 border border-rose-900/30 rounded-xl p-3.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 mb-1.5">
                        <AlertCircle className="w-3.5 h-3.5" /> Nguyên nhân gây lỗi (Old Bug)
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {bug.oldIssue}
                      </p>
                    </div>

                    <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-3.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Giải pháp tối ưu hóa (Fixed Solution)
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {bug.fixedSolution}
                      </p>
                    </div>
                  </div>

                  {/* Code Diff Box */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-pink-400" /> So sánh Code Cũ vs Code Mới
                      </span>
                      <button
                        onClick={() => handleCopyCode(bug.codeDiffNew, bug.id)}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 bg-slate-800 rounded border border-slate-700 transition-all"
                      >
                        {copiedId === bug.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy đoạn code fix</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[11px]">
                      {/* Old Code */}
                      <div className="bg-slate-950 rounded-xl border border-rose-900/40 p-3 overflow-x-auto">
                        <div className="text-[10px] text-rose-400 font-bold mb-1.5 pb-1 border-b border-rose-900/30 flex items-center justify-between">
                          <span>❌ CODE CŨ (BỊ LỖI)</span>
                          <span className="text-[9px] text-rose-500">Deprecated</span>
                        </div>
                        <pre className="text-rose-300/80 leading-relaxed whitespace-pre-wrap">
                          {bug.codeDiffOld}
                        </pre>
                      </div>

                      {/* New Code */}
                      <div className="bg-slate-950 rounded-xl border border-emerald-900/40 p-3 overflow-x-auto">
                        <div className="text-[10px] text-emerald-400 font-bold mb-1.5 pb-1 border-b border-emerald-900/30 flex items-center justify-between">
                          <span>✅ CODE MỚI (ĐÃ FIX & CHUẨN)</span>
                          <span className="text-[9px] text-emerald-500">Optimized</span>
                        </div>
                        <pre className="text-emerald-300/90 leading-relaxed whitespace-pre-wrap">
                          {bug.codeDiffNew}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
