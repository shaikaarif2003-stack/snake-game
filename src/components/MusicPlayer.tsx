import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, ListMusic, Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  cover: string;
  color: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "Synth Pulse",
    artist: "AI Synth Voyager",
    duration: "3:45",
    cover: "https://picsum.photos/seed/synth1/400/400",
    color: "var(--color-neon-pink)"
  },
  {
    id: 2,
    title: "Cyber Neon Beat",
    artist: "Digital Echo",
    duration: "4:12",
    cover: "https://picsum.photos/seed/cyber2/400/400",
    color: "var(--color-neon-blue)"
  },
  {
    id: 3,
    title: "Midnight Drift",
    artist: "Vector Rider",
    duration: "2:58",
    cover: "https://picsum.photos/seed/drift3/400/400",
    color: "var(--color-neon-purple)"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);
  const [volume, setVolume] = useState(80);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);

  const currentTrack = TRACKS[currentTrackIndex];

  // Simulated progress
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setProgress(p => (p + 0.1) % 100);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  return (
    <div className="w-full h-24 bg-black border-t border-white/10 px-10 flex items-center justify-between shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
      {/* Track Info */}
      <div className="flex items-center gap-4 w-1/4">
        <div className="w-12 h-12 bg-[#111] border border-white/10 flex items-center justify-center overflow-hidden rounded relative">
           <div className={`w-8 h-8 rounded-full border-2 border-dashed border-[#00f3ff] ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}`}></div>
           <img 
              src={currentTrack.cover} 
              className="absolute inset-0 w-full h-full object-cover opacity-40" 
              referrerPolicy="no-referrer" 
           />
        </div>
        <div>
          <p className="text-sm font-bold tracking-wide text-white">{currentTrack.title}</p>
          <p className="text-[11px] text-white/40 uppercase tracking-tighter">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-3 w-2/4 max-w-2xl px-8">
        <div className="flex items-center gap-10">
          <button 
            onClick={handlePrev}
            className="text-white/40 hover:text-white transition-opacity active:scale-90"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full border border-[#00f3ff] flex items-center justify-center bg-[#00f3ff]/10 text-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:bg-[#00f3ff]/20 transition-all active:scale-95"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>

          <button 
            onClick={handleNext}
            className="text-white/40 hover:text-white transition-opacity active:scale-90"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>

        <div className="w-full flex items-center gap-3">
          <span className="text-[10px] font-mono text-white/40 tabular-nums">01:12</span>
          <div className="flex-1 h-1 bg-white/10 rounded-full relative group cursor-pointer">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-[#00f3ff] shadow-[0_0_8px_#00f3ff]"
              animate={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-white/40 tabular-nums">{currentTrack.duration}</span>
        </div>
      </div>

      {/* Volume & Details */}
      <div className="flex items-center justify-end gap-6 w-1/4">
        <div className="flex items-center gap-3 text-white/40">
           <Volume2 size={16} />
           <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-white/60" style={{ width: `${volume}%` }}></div>
           </div>
        </div>
        
        <button 
          onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
          className={`p-2 rounded transition-colors ${isPlaylistOpen ? 'bg-[#00f3ff]/20 text-[#00f3ff]' : 'text-white/20 hover:text-white/60'}`}
        >
          <ListMusic size={20} />
        </button>
      </div>

      {/* Playlist Sidebar Popover */}
      <AnimatePresence>
        {isPlaylistOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-28 right-10 w-72 bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50"
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Neural Stream</h3>
              <Music2 size={14} className="text-white/20" />
            </div>
            <div className="max-h-64 overflow-y-auto scrollbar-hide">
              {TRACKS.map((track, idx) => (
                <button
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(idx);
                    setProgress(0);
                    setIsPlaying(true);
                  }}
                  className={`w-full p-4 flex items-center gap-4 hover:bg-white/[0.03] transition-colors group ${currentTrackIndex === idx ? 'bg-white/[0.05]' : ''}`}
                >
                  <img src={track.cover} className="w-10 h-10 rounded border border-white/5 object-cover" referrerPolicy="no-referrer" />
                  <div className="text-left flex-1">
                    <p className={`text-xs font-bold truncate ${currentTrackIndex === idx ? 'text-[#00f3ff]' : 'text-white/80'}`}>{track.title}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-tighter">{track.artist}</p>
                  </div>
                  {currentTrackIndex === idx && isPlaying && (
                    <div className="flex gap-0.5 items-end h-3">
                      <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-0.5 bg-[#00f3ff]" />
                      <motion.div animate={{ height: [12, 4, 12] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-0.5 bg-[#00f3ff]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
