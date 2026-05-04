import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Trophy, Play, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export default function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [nextDirection, setNextDirection] = useState<Point>({ x: 0, y: -1 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snake-high-score');
    return saved ? parseInt(saved, 10) : 0;
  });

  const gameLoopRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);

  const spawnFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 0, y: -1 });
    setNextDirection({ x: 0, y: -1 });
    setScore(0);
    onScoreChange(0);
    setIsGameOver(false);
    setIsPaused(false);
    spawnFood([{ x: 10, y: 10 }]);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        if (direction.y === 0) setNextDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
        if (direction.y === 0) setNextDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
        if (direction.x === 0) setNextDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
        if (direction.x === 0) setNextDirection({ x: 1, y: 0 });
        break;
      case ' ':
        if (!isGameOver) setIsPaused(prev => !prev);
        break;
    }
  }, [direction, isGameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setDirection(nextDirection);
    
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + nextDirection.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + nextDirection.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('snake-high-score', score.toString());
        }
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check collision with food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          onScoreChange(newScore);
          return newScore;
        });
        spawnFood(newSnake);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [nextDirection, food, isPaused, isGameOver, score, highScore, onScoreChange, spawnFood]);

  useEffect(() => {
    const tick = (timestamp: number) => {
      const speed = Math.max(50, INITIAL_SPEED - (score / 10) * SPEED_INCREMENT);
      
      if (!lastUpdateRef.current) lastUpdateRef.current = timestamp;
      const elapsed = timestamp - lastUpdateRef.current;

      if (elapsed > speed) {
        moveSnake();
        lastUpdateRef.current = timestamp;
      }
      
      gameLoopRef.current = requestAnimationFrame(tick);
    };

    gameLoopRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [moveSnake, score]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (Subtle)
    ctx.strokeStyle = 'rgba(0, 242, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw Food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 2.5,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Snake
    snake.forEach((segment, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? '#ffffff' : '#00f3ff';
      ctx.shadowBlur = isHead ? 15 : 10;
      ctx.shadowColor = '#00f3ff';
      
      const padding = 2;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
    });
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative group">
        <div className="absolute -inset-1 bg-[#1a1a1a] rounded-lg"></div>
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="relative bg-[#0a0a0a] border-4 border-[#1a1a1a] rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)]"
          style={{ width: '500px', height: '500px' }}
        />

        {/* Interior Grid Simulation Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '25px 25px' }} />

        {/* Labels from Theme */}
        <div className="absolute bottom-4 left-4 flex gap-4 pointer-events-none">
          <span className="text-[9px] font-mono py-1 px-2 border border-[#00f3ff]/30 text-[#00f3ff] bg-black/40">SPD: {(150/Math.max(50, INITIAL_SPEED - (score / 10) * SPEED_INCREMENT)).toFixed(1)}x</span>
          <span className="text-[9px] font-mono py-1 px-2 border border-[#ff00ff]/30 text-[#ff00ff] bg-black/40">LVL: {Math.floor(score/50) + 1}</span>
        </div>

        <AnimatePresence>
          {(isPaused || isGameOver) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-lg backdrop-blur-sm"
            >
              <h2 className={`text-4xl font-display font-bold mb-6 ${isGameOver ? 'neon-text-pink text-neon-pink' : 'text-white'}`}>
                {isGameOver ? 'GAME OVER' : 'PAUSED'}
              </h2>
              
              {isGameOver ? (
                <button
                  onClick={resetGame}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-neon-pink hover:text-white transition-all transform hover:scale-105"
                >
                  <RotateCcw size={20} />
                  TRY AGAIN
                </button>
              ) : (
                <button
                  onClick={() => setIsPaused(false)}
                  className="flex items-center gap-2 px-8 py-4 bg-neon-blue text-black font-bold rounded-full hover:shadow-[0_0_20px_rgba(0,242,255,0.5)] transition-all transform hover:scale-105"
                >
                  <Play size={24} fill="currentColor" />
                  START GAME
                </button>
              )}

              <p className="mt-8 text-xs text-white/30 uppercase tracking-[0.3em]">
                Use Arrow Keys to Move • Space to Pause
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
