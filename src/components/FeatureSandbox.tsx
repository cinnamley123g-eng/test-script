import React, { useState, useEffect } from 'react';
import { Zap, Activity, Shield, Ghost, Crosshair, UserCheck, Play, RotateCcw, ArrowUp, Sparkles, CheckCircle2 } from 'lucide-react';

export const FeatureSandbox: React.FC = () => {
  // Sandbox State
  const [tpwalkEnabled, setTpwalkEnabled] = useState(false);
  const [tpwalkSpeed, setTpwalkSpeed] = useState(3);
  const [characterPosX, setCharacterPosX] = useState(50);
  const [isMovingRight, setIsMovingRight] = useState(true);

  const [infJumpCount, setInfJumpCount] = useState(0);
  const [characterPosY, setCharacterPosY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);

  const [ghostMode, setGhostMode] = useState(false);
  const [headSitTarget, setHeadSitTarget] = useState(false);

  const [aimbotActive, setAimbotActive] = useState(true);
  const [targetPosX, setTargetPosX] = useState(70);
  const [crosshairPos, setCrosshairPos] = useState({ x: 50, y: 50 });

  // TPWalk motion simulator
  useEffect(() => {
    if (!tpwalkEnabled) return;
    const interval = setInterval(() => {
      setCharacterPosX((prev) => {
        const step = tpwalkSpeed * 0.8;
        if (isMovingRight) {
          if (prev >= 85) {
            setIsMovingRight(false);
            return prev - step;
          }
          return prev + step;
        } else {
          if (prev <= 15) {
            setIsMovingRight(true);
            return prev + step;
          }
          return prev - step;
        }
      });
    }, 50);
    return () => clearInterval(interval);
  }, [tpwalkEnabled, tpwalkSpeed, isMovingRight]);

  // Jump Gravity Simulator
  useEffect(() => {
    if (characterPosY <= 0 && !isJumping) return;
    const interval = setInterval(() => {
      setCharacterPosY((prev) => {
        if (prev <= 0) return 0;
        return Math.max(0, prev - 4);
      });
    }, 40);
    return () => clearInterval(interval);
  }, [characterPosY, isJumping]);

  const triggerInfinityJump = () => {
    setInfJumpCount((c) => c + 1);
    setIsJumping(true);
    setCharacterPosY((prev) => Math.min(180, prev + 45));
    setTimeout(() => setIsJumping(false), 200);
  };

  // Aimbot target tracker
  useEffect(() => {
    if (!aimbotActive) return;
    const interval = setInterval(() => {
      // Smooth lerp crosshair towards target
      setCrosshairPos((prev) => {
        const targetCoord = { x: targetPosX, y: 40 };
        const dx = (targetCoord.x - prev.x) * 0.25;
        const dy = (targetCoord.y - prev.y) * 0.25;
        return { x: prev.x + dx, y: prev.y + dy };
      });
      // Move target subtly
      setTargetPosX((prev) => (prev > 75 ? 65 : prev + 0.3));
    }, 40);
    return () => clearInterval(interval);
  }, [aimbotActive, targetPosX]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-pink-400" />
          Bộ Thử Nghiệm & Mô Phỏng Logic Trực Quan (Interactive Sandbox)
        </h2>
        <p className="text-xs text-slate-400">
          Kiểm tra trực tiếp phản hồi của các cơ chế TPWalk, Infinity Jump, Head Sit, Ghost Mode và Aimbot sau khi fix
        </p>
      </div>

      {/* Visual Canvas Simulator */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="text-xs font-mono text-slate-400 flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ROBLOX CLIENT PHYSICS SIMULATION STAGE</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>TPWalk: <b className={tpwalkEnabled ? 'text-emerald-400' : 'text-slate-500'}>{tpwalkEnabled ? 'ON' : 'OFF'}</b></span>
            <span>Ghost: <b className={ghostMode ? 'text-pink-400' : 'text-slate-500'}>{ghostMode ? 'ACTIVE' : 'OFF'}</b></span>
            <span>Head Sit: <b className={headSitTarget ? 'text-cyan-400' : 'text-slate-500'}>{headSitTarget ? 'LOCKED' : 'FREE'}</b></span>
          </div>
        </div>

        {/* 2D 3D Stage Simulation Box */}
        <div className="h-64 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-xl border border-slate-800 relative overflow-hidden flex items-end justify-center p-4">
          {/* Grid Background */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#ec4899 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          {/* Target Player (Enemy / Target) */}
          <div
            className="absolute transition-all duration-75 flex flex-col items-center"
            style={{
              left: `${targetPosX}%`,
              bottom: '24px',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9px] font-bold mb-1 flex items-center gap-1">
              <span>💀 ENEMY</span>
              <span>[100HP]</span>
            </div>
            {/* Target Head & Body */}
            <div className="w-9 h-9 rounded-full bg-rose-500/80 border border-rose-300 shadow-md flex items-center justify-center text-xs">
              🤖
            </div>
            <div className="w-12 h-14 bg-rose-900/60 rounded-lg mt-1 border border-rose-700/50" />
          </div>

          {/* Local Player Character */}
          <div
            className="absolute transition-all duration-75 flex flex-col items-center select-none"
            style={{
              left: headSitTarget ? `${targetPosX}%` : `${characterPosX}%`,
              bottom: headSitTarget ? '105px' : `${24 + characterPosY}px`,
              transform: 'translateX(-50%)',
              opacity: ghostMode ? 0.35 : 1,
            }}
          >
            {/* Tag Badge */}
            <div className="px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-[9px] font-bold mb-1 flex items-center gap-1">
              <span>⚡ YOU (LocalPlayer)</span>
              {ghostMode && <span className="text-pink-300">[GHOST]</span>}
              {headSitTarget && <span className="text-cyan-300">[HEAD SIT]</span>}
            </div>

            {/* Avatar Head */}
            <div
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm shadow-xl transition-all ${
                ghostMode
                  ? 'bg-pink-500/30 border-pink-400 shadow-pink-500/40 animate-pulse'
                  : 'bg-gradient-to-tr from-pink-500 to-indigo-600 border-white text-white'
              }`}
            >
              🧙‍♂️
            </div>

            {/* Avatar Body / Sitting pose */}
            <div
              className={`w-12 rounded-lg mt-1 border transition-all ${
                headSitTarget
                  ? 'h-8 bg-indigo-700/80 border-indigo-400 rounded-b-xl'
                  : 'h-14 bg-indigo-800/80 border-indigo-600'
              }`}
            />
          </div>

          {/* Aimbot Crosshair Overlay */}
          {aimbotActive && (
            <div
              className="absolute pointer-events-none transition-all duration-75 -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${crosshairPos.x}%`,
                top: `${crosshairPos.y}%`,
              }}
            >
              <div className="w-12 h-12 rounded-full border border-emerald-400/80 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <div className="text-[9px] font-mono text-emerald-400 bg-slate-900/90 px-1 py-0.5 rounded border border-emerald-500/40 absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                STICKY LOCK: HEAD
              </div>
            </div>
          )}

          {/* Floor / Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-slate-800/80 border-t border-slate-700 flex items-center justify-between px-4 text-[10px] text-slate-400 font-mono">
            <span>Y: 0 (GROUND SURFACE)</span>
            <span>VELOCITY DAMPING: ACTIVE</span>
          </div>
        </div>

        {/* Live Controls Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* 1. TPWalk Control */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-pink-400" /> TPWalk CFrame
              </span>
              <button
                id="sandbox-toggle-tpwalk"
                onClick={() => setTpwalkEnabled(!tpwalkEnabled)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  tpwalkEnabled
                    ? 'bg-pink-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tpwalkEnabled ? 'Đang BẬT' : 'Đang TẮT'}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              Bypass anti-cheat vận tốc ngang với CFrame Delta Step
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">Tốc độ:</span>
              <input
                type="range"
                min="1"
                max="8"
                value={tpwalkSpeed}
                onChange={(e) => setTpwalkSpeed(Number(e.target.value))}
                className="w-full accent-pink-500"
              />
              <span className="text-[11px] font-mono text-pink-400 font-bold">{tpwalkSpeed}x</span>
            </div>
          </div>

          {/* 2. Infinity Jump Control */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <ArrowUp className="w-3.5 h-3.5 text-cyan-400" /> Infinity Jump
              </span>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded font-bold">
                {infJumpCount} Jumps
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              Bơm xung lực AssemblyLinearVelocity trực tiếp trên không
            </p>
            <button
              id="sandbox-trigger-jump"
              onClick={triggerInfinityJump}
              className="w-full py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-1"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Bấm Nhảy (Air Impulse)</span>
            </button>
          </div>

          {/* 3. Ghost Mode Control */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Ghost className="w-3.5 h-3.5 text-purple-400" /> Chế độ ma (Ghost)
              </span>
              <button
                id="sandbox-toggle-ghost"
                onClick={() => setGhostMode(!ghostMode)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  ghostMode
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {ghostMode ? 'PHANTOM ON' : 'TẮT'}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              Mờ 65% + Khôi phục 100% thuộc tính gốc khi tắt
            </p>
            <div className="text-[10px] text-purple-300/80 font-mono bg-purple-950/40 p-1.5 rounded border border-purple-900/40">
              CanCollide: {ghostMode ? 'FALSE (Xuyên tường)' : 'TRUE (Bình thường)'}
            </div>
          </div>

          {/* 4. Head Sit Control */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Head Sit (Ngồi đầu)
              </span>
              <button
                id="sandbox-toggle-headsit"
                onClick={() => setHeadSitTarget(!headSitTarget)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  headSitTarget
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {headSitTarget ? 'ĐANG KHÓA' : 'TỰ DO'}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              CFrame Overhead Lock không sinh Seat ảo desync
            </p>
            <div className="text-[10px] text-emerald-300/80 font-mono bg-emerald-950/40 p-1.5 rounded border border-emerald-900/40">
              Offset: +1.8 studs Y • Sit = TRUE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
