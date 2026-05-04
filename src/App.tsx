/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame.tsx';
import MusicPlayer from './components/MusicPlayer.tsx';
import { motion } from 'motion/react';
import { Gamepad2, Radio } from 'lucide-react';

export default function App() {
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snake-high-score');
    return saved ? parseInt(saved, 10) : 0;
  });

  const handleScoreChange = (newScore: number) => {
    setCurrentScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('snake-high-score', newScore.toString());
    }
  };

  return (
    <div className="w-full h-screen bg-[#050505] text-white font-sans flex flex-col overflow-hidden select-none">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#1a1a1a_0%,_transparent_50%)]" />
      </div>

      {/* Header Section */}
      <header className="h-16 border-b border-[#1a1a1a] px-8 flex items-center justify-between bg-black/40 backdrop-blur-md relative z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-[#00f3ff] shadow-[0_0_10px_#00f3ff]"></div>
          <h1 className="text-xl font-bold tracking-[0.2em] uppercase italic text-[#00f3ff]">
            NEON RHYTHM <span className="text-white opacity-50 font-light">// SYSTEM.SNAKE</span>
          </h1>
        </div>
        <div className="flex items-center gap-12">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-neon-pink opacity-80">Session Score</span>
            <span className="text-2xl font-black font-mono leading-none">{currentScore.toLocaleString().padStart(6, '0')}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-white/40">High Score</span>
            <span className="text-2xl font-black font-mono leading-none opacity-40">{highScore.toLocaleString().padStart(6, '0')}</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex p-6 gap-6 items-center justify-between relative z-10 overflow-hidden">
        
        {/* Left Sidebar: Playlist View (Simulated) */}
        <aside className="w-64 h-[550px] bg-black/60 border border-white/10 rounded-2xl p-5 flex flex-col hidden lg:flex">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-6">Active Stream</h2>
          <div className="space-y-4">
            <div className="p-3 bg-white/5 border-l-2 border-[#00f3ff] rounded-r-lg">
              <p className="text-xs text-[#00f3ff] font-bold">01. Synth Pulse</p>
              <p className="text-[10px] text-white/40">AI-Neural-A</p>
            </div>
            <div className="p-3 hover:bg-white/5 rounded-lg opacity-60 transition-all cursor-pointer">
              <p className="text-xs text-white font-bold">02. Cyber Neon Beat</p>
              <p className="text-[10px] text-white/40">AI-Neural-B</p>
            </div>
            <div className="p-3 hover:bg-white/5 rounded-lg opacity-60 transition-all cursor-pointer">
              <p className="text-xs text-white font-bold">03. Midnight Drift</p>
              <p className="text-[10px] text-white/40">AI-Neural-C</p>
            </div>
          </div>
          
          <div className="mt-auto">
            <div className="w-full h-32 border border-white/5 rounded-xl bg-[radial-gradient(circle_at_center,_#222_0%,_transparent_70%)] flex items-center justify-center overflow-hidden relative">
              <div className="flex gap-1 h-12 items-end">
                {[...Array(8)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: [10, 40, 20, 35, 10] }}
                    transition={{ repeat: Infinity, duration: 1 + Math.random(), ease: "easeInOut" }}
                    className="w-1 bg-[#00f3ff]" 
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Center: Snake Game Window */}
        <section className="relative flex-1 flex justify-center items-center">
          <div className="relative">
            <SnakeGame onScoreChange={handleScoreChange} />
            
            {/* Game Visual Decorations */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-[#00f3ff] opacity-30 pointer-events-none"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-[#ff00ff] opacity-30 pointer-events-none"></div>
          </div>
        </section>

        {/* Right Sidebar: Stats/Visualizer */}
        <aside className="w-64 h-[550px] flex flex-col gap-6 hidden lg:flex">
          <div className="flex-1 bg-black/60 border border-white/10 rounded-2xl p-5">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-6">Neural Stats</h2>
            <div className="space-y-6">
              <StatProgress label="Focus Accuracy" value={88} color="#00f3ff" />
              <StatProgress label="Rhythm Sync" value={64} color="#ff00ff" />
              <StatProgress label="Snake Velocity" value={42} color="#39ff14" />
            </div>
          </div>
          <div className="h-40 bg-black/60 border border-white/10 rounded-2xl p-5 flex flex-col justify-center items-center">
             <div className="w-full h-2 bg-white/5 rounded-full relative overflow-hidden">
               <motion.div 
                 animate={{ x: ['-100%', '200%'] }}
                 transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                 className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent w-1/2" 
               />
             </div>
             <p className="text-[10px] uppercase tracking-widest mt-4 text-white/20">System Stable</p>
          </div>
        </aside>
      </main>

      {/* Persistent Footer Player */}
      <footer className="relative z-20 shrink-0">
        <MusicPlayer />
      </footer>
    </div>
  );
}

function StatProgress({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="relative pt-1">
      <div className="flex mb-2 items-center justify-between">
        <div className="text-[10px] font-semibold uppercase opacity-60" style={{ color }}>{label}</div>
        <div className="text-[10px] font-semibold" style={{ color }}>{value}%</div>
      </div>
      <div className="overflow-hidden h-1 text-xs flex rounded bg-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1 }}
          style={{ backgroundColor: color }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center" 
        />
      </div>
    </div>
  );
}
