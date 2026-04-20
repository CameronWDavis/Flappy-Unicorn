import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { GameState, ObstacleData, TrailPoint, Sparkle, CloudData } from './types';
import {
  GAME_WIDTH, GAME_HEIGHT, UNICORN_X, UNICORN_SIZE,
  GRAVITY, JUMP_VELOCITY, MAX_FALL, OBSTACLE_W,
  OBSTACLE_GAP, OBSTACLE_SPEED, OBSTACLE_SPACING,
  TRAIL_LEN, TRAIL_SPAWN_X,
} from './constants';

import Unicorn from './components/Unicorn';
import Obstacle from './components/Obstacle';
import RainbowTrail from './components/RainbowTrail';
import Cloud from './components/Cloud';
import { Overlay, ScoreCard } from './components/UI';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [, setTick] = useState<number>(0);

  const unicornY = useRef<number>(GAME_HEIGHT / 2 - UNICORN_SIZE / 2);
  const unicornVy = useRef<number>(0);
  const obstacles = useRef<ObstacleData[]>([]);
  const trail = useRef<TrailPoint[]>([]);
  const sparkles = useRef<Sparkle[]>([]);
  const clouds = useRef<CloudData[]>([
    { x: 50, y: 80, scale: 0.85, speed: 0.3 },
    { x: 260, y: 150, scale: 1.0, speed: 0.45 },
    { x: 140, y: 340, scale: 0.75, speed: 0.35 },
    { x: 320, y: 450, scale: 0.9, speed: 0.4 },
    { x: 30, y: 500, scale: 0.7, speed: 0.3 },
  ]);
  const scoreRef = useRef<number>(0);
  const nextId = useRef<number>(1);
  const lastFrame = useRef<number>(performance.now());

  const reset = useCallback(() => {
    unicornY.current = GAME_HEIGHT / 2 - UNICORN_SIZE / 2;
    unicornVy.current = 0;
    obstacles.current = [];
    trail.current = [];
    sparkles.current = [];
    scoreRef.current = 0;
    setScore(0);
    lastFrame.current = performance.now();
  }, []);

  const spawnSparkles = useCallback(() => {
    for (let i = 0; i < 8; i++) {
      sparkles.current.push({
        id: nextId.current++,
        x: UNICORN_X + 10 + (Math.random() - 0.5) * 10,
        y: unicornY.current + UNICORN_SIZE / 2 + (Math.random() - 0.5) * 15,
        vx: -1.5 - Math.random() * 2,
        vy: -1 + Math.random() * 2,
        life: 35 + Math.random() * 20,
        maxLife: 55,
        color: ['#FF4D8B', '#FFD93D', '#4D9DE0', '#9D4EDD', '#4BD14B'][Math.floor(Math.random() * 5)],
        size: 2 + Math.random() * 1.5,
      });
    }
  }, []);

  const flap = useCallback(() => {
    if (gameState === 'idle' || gameState === 'gameover') {
      reset();
      setGameState('playing');
      unicornVy.current = JUMP_VELOCITY;
      spawnSparkles();
    } else if (gameState === 'playing') {
      unicornVy.current = JUMP_VELOCITY;
      spawnSparkles();
    }
  }, [gameState, reset, spawnSparkles]);

  // Keyboard: space / arrow-up to flap.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        flap();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flap]);

  // The game loop — only runs while playing. Framerate-normalized via dt.
  useEffect(() => {
    if (gameState !== 'playing') return;
    let raf: number;

    const loop = (now: number) => {
      const dt = Math.min(2, (now - lastFrame.current) / 16.67); // 60fps steps
      lastFrame.current = now;

      // Physics
      unicornVy.current = Math.min(unicornVy.current + GRAVITY * dt, MAX_FALL);
      unicornY.current += unicornVy.current * dt;

      trail.current.forEach((p) => { p.x -= OBSTACLE_SPEED * dt; });
      trail.current.push({
        x: TRAIL_SPAWN_X,
        y: unicornY.current + UNICORN_SIZE / 2 + 6, // near the tail
      });
      trail.current = trail.current.filter((p) => p.x > -10);
      if (trail.current.length > TRAIL_LEN) trail.current.shift();

      // Scroll + cleanup obstacles
      obstacles.current.forEach((o) => { o.x -= OBSTACLE_SPEED * dt; });
      obstacles.current = obstacles.current.filter((o) => o.x > -OBSTACLE_W - 20);

      // Spawn new obstacles
      const last = obstacles.current[obstacles.current.length - 1];
      if (!last || last.x < GAME_WIDTH - OBSTACLE_SPACING) {
        const margin = 90;
        obstacles.current.push({
          id: nextId.current++,
          x: GAME_WIDTH + 20,
          gapY: margin + OBSTACLE_GAP / 2 + Math.random() * (GAME_HEIGHT - margin * 2 - OBSTACLE_GAP),
          passed: false,
        });
      }

      // Score
      obstacles.current.forEach((o) => {
        if (!o.passed && o.x + OBSTACLE_W < UNICORN_X) {
          o.passed = true;
          scoreRef.current += 1;
          setScore(scoreRef.current);
        }
      });

      // Clouds drift
      clouds.current.forEach((c) => {
        c.x -= c.speed * dt;
        if (c.x < -100) {
          c.x = GAME_WIDTH + 30;
          c.y = 60 + Math.random() * (GAME_HEIGHT - 150);
        }
      });

      // Sparkles update
      sparkles.current.forEach((s) => {
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vy += 0.15 * dt;
        s.life -= dt;
      });
      sparkles.current = sparkles.current.filter((s) => s.life > 0);

      // Collision: boundaries
      if (unicornY.current < -UNICORN_SIZE / 4 || unicornY.current + UNICORN_SIZE > GAME_HEIGHT - 10) {
        setGameState('gameover');
        setHighScore((h) => Math.max(h, scoreRef.current));
        return;
      }
      const hl = UNICORN_X + 10;
      const hr = UNICORN_X + UNICORN_SIZE - 12;
      const ht = unicornY.current + 10;
      const hb = unicornY.current + UNICORN_SIZE - 8;
      for (const o of obstacles.current) {
        if (hr > o.x && hl < o.x + OBSTACLE_W) {
          if (ht < o.gapY - OBSTACLE_GAP / 2 || hb > o.gapY + OBSTACLE_GAP / 2) {
            setGameState('gameover');
            setHighScore((h) => Math.max(h, scoreRef.current));
            return;
          }
        }
      }

      setTick((t) => (t + 1) % 1_000_000);
      raf = requestAnimationFrame(loop);
    };

    lastFrame.current = performance.now();
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [gameState]);

  // Tilt the unicorn based on vertical velocity for flappy-bird feel.
  const rotation = Math.max(-28, Math.min(75, unicornVy.current * 5.5));

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #FFE5F1 0%, #E8E0FF 50%, #D4E8FF 100%)',
      fontFamily: 'ui-rounded, "SF Pro Rounded", system-ui, -apple-system, sans-serif',
      padding: '1rem',
    }}>
      <div style={{ position: 'relative', width: GAME_WIDTH, maxWidth: '100%' }}>
        <h1 style={{
          textAlign: 'center',
          fontSize: '1.9rem',
          background: 'linear-gradient(90deg, #FF4D8B, #9D4EDD, #4D9DE0, #4BD14B, #FFD93D, #FFA14D)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: 900,
          letterSpacing: '-0.01em',
          margin: '0 0 0.75rem 0',
        }}>
          Flappy Unicorn 🦄
        </h1>

        <div
          onPointerDown={flap}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: `${GAME_WIDTH} / ${GAME_HEIGHT}`,
            borderRadius: 18,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(100, 50, 150, 0.3), 0 0 0 2px rgba(255,255,255,0.6)',
            cursor: 'pointer',
            userSelect: 'none',
            touchAction: 'manipulation',
          }}
        >
          <svg width="100%" height="100%" viewBox={`0 0 ${GAME_WIDTH} ${GAME_HEIGHT}`}>
            <defs>
              <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFCCE5" />
                <stop offset="50%" stopColor="#D8C7F7" />
                <stop offset="100%" stopColor="#B0DEFF" />
              </linearGradient>
              <linearGradient id="pipeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF4D8B" />
                <stop offset="20%" stopColor="#FFA14D" />
                <stop offset="40%" stopColor="#FFD93D" />
                <stop offset="60%" stopColor="#4BD14B" />
                <stop offset="80%" stopColor="#4D9DE0" />
                <stop offset="100%" stopColor="#9D4EDD" />
              </linearGradient>
              <linearGradient id="hornGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFF9D4" />
                <stop offset="50%" stopColor="#FFD93D" />
                <stop offset="100%" stopColor="#FFA14D" />
              </linearGradient>
              <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9D4EDD" />
                <stop offset="100%" stopColor="#6B2CB8" />
              </linearGradient>
            </defs>

            <rect width={GAME_WIDTH} height={GAME_HEIGHT} fill="url(#skyGrad)" />

            {/* Distant stars */}
            {Array.from({ length: 18 }).map((_, i) => {
              const sx = (i * 137.5) % GAME_WIDTH;
              const sy = (i * 73.3) % (GAME_HEIGHT - 30);
              return (
                <circle key={`s-${i}`} cx={sx} cy={sy}
                  r={0.8 + (i % 3) * 0.5} fill="#FFFFFF" opacity="0.5" />
              );
            })}

            {/* Clouds */}
            {clouds.current.map((c, i) => (
              <Cloud key={`c-${i}`} x={c.x} y={c.y} scale={c.scale} opacity={0.7} />
            ))}

            {/* Obstacles */}
            {obstacles.current.map((o) => <Obstacle key={o.id} x={o.x} gapY={o.gapY} />)}

            {/* Ground */}
            <rect x="0" y={GAME_HEIGHT - 10} width={GAME_WIDTH} height="10" fill="url(#groundGrad)" />

            {/* Rainbow trail behind the unicorn */}
            <RainbowTrail points={trail.current} />

            {/* Sparkles */}
            {sparkles.current.map((s) => (
              <g key={s.id} opacity={s.life / s.maxLife}>
                <circle cx={s.x} cy={s.y} r={s.size} fill={s.color} />
                <circle cx={s.x} cy={s.y} r={s.size * 0.35} fill="#FFFFFF" />
              </g>
            ))}

            {/* Unicorn */}
            <Unicorn y={unicornY.current} rotation={rotation} />

            {/* Score while playing */}
            {gameState === 'playing' && (
              <text x={GAME_WIDTH / 2} y="70" textAnchor="middle"
                fontSize="52" fontWeight="900" fill="#FFFFFF"
                stroke="#9D4EDD" strokeWidth="4" paintOrder="stroke"
                style={{ fontFamily: 'ui-rounded, system-ui, sans-serif' }}>
                {score}
              </text>
            )}
          </svg>

          {gameState === 'idle' && (
            <Overlay>
              <div style={{ fontSize: '3.5rem', marginBottom: '0.25rem' }}>🦄</div>
              <h2 style={titleStyle}>Flappy Unicorn</h2>
              <p style={descStyle}>
                Tap or press <kbd style={kbdStyle}>Space</kbd><br />
                to flap and paint the sky ✨
              </p>
              <button
                style={buttonStyle}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={flap}
              >
                Start Flying
              </button>
            </Overlay>
          )}

          {gameState === 'gameover' && (
            <Overlay>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>💫</div>
              <h2 style={titleStyle}>Game Over!</h2>
              <div style={{ display: 'flex', gap: '1.25rem', margin: '1rem 0 0.25rem', justifyContent: 'center' }}>
                <ScoreCard label="Score" value={score} />
                <ScoreCard label="Best" value={Math.max(highScore, score)} />
              </div>
              <button
                style={{ ...buttonStyle, marginTop: '1.25rem' }}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={flap}
              >
                Fly Again 🌈
              </button>
            </Overlay>
          )}
        </div>

        <p style={{
          textAlign: 'center', color: '#6B4E8F', fontSize: '0.85rem',
          marginTop: '0.75rem', opacity: 0.8,
        }}>
          Tap, click, or press Space to flap
        </p>
      </div>
    </div>
  );
}

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1.35rem',
  color: '#5B2A86',
  fontWeight: 800,
};

const descStyle: React.CSSProperties = {
  color: '#6B4E8F',
  margin: '0.7rem 0 1.3rem',
  fontSize: '0.9rem',
  lineHeight: 1.5,
};

const kbdStyle: React.CSSProperties = {
  background: '#F0E6FF',
  color: '#5B2A86',
  padding: '0.1rem 0.4rem',
  borderRadius: 4,
  fontSize: '0.8rem',
  fontFamily: 'ui-monospace, monospace',
  border: '1px solid #D9C7F5',
};

const buttonStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, #FF4D8B, #9D4EDD)',
  color: 'white',
  border: 'none',
  padding: '0.7rem 1.6rem',
  borderRadius: 999,
  fontSize: '0.95rem',
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0 6px 16px rgba(157, 78, 221, 0.35)',
};

