export type GameState = 'idle' | 'playing' | 'gameover';

export interface ObstacleData {
  id: number;
  x: number;
  gapY: number;
  passed: boolean;
}

export interface TrailPoint {
  x: number;
  y: number;
}

export interface Sparkle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface CloudData {
  x: number;
  y: number;
  scale: number;
  speed: number;
}
