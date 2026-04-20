import React from 'react';
import { OBSTACLE_GAP, OBSTACLE_W, GAME_HEIGHT } from '../constants';

export default function Obstacle({ x, gapY }: { x: number; gapY: number }) {
  const topH = gapY - OBSTACLE_GAP / 2;
  const bottomY = gapY + OBSTACLE_GAP / 2;
  const bottomH = GAME_HEIGHT - bottomY - 10;

  return (
    <g>
      {/* Top */}
      <rect x={x} y={-4} width={OBSTACLE_W} height={topH + 4}
        fill="url(#pipeGrad)" stroke="#FFFFFF" strokeWidth="2.5" rx="3" />
      <rect x={x - 6} y={topH - 22} width={OBSTACLE_W + 12} height={22}
        fill="url(#pipeGrad)" stroke="#FFFFFF" strokeWidth="2.5" rx="4" />

      {/* Bottom */}
      <rect x={x} y={bottomY} width={OBSTACLE_W} height={bottomH}
        fill="url(#pipeGrad)" stroke="#FFFFFF" strokeWidth="2.5" rx="3" />
      <rect x={x - 6} y={bottomY} width={OBSTACLE_W + 12} height={22}
        fill="url(#pipeGrad)" stroke="#FFFFFF" strokeWidth="2.5" rx="4" />
    </g>
  );
}
