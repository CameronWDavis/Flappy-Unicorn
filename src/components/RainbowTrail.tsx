import React from 'react';
import type { TrailPoint } from '../types';

export default function RainbowTrail({ points }: { points: TrailPoint[] }) {
  if (points.length < 2) return null;
  const colors = ['#FF3B3B', '#FF8F3B', '#FFD93B', '#4BD14B', '#3B8FFF', '#9D4EDD'];
  const stripeWidth = 6;
  const stripeStep = 5; // 1px overlap between stripes = seamless band
  const bandHalf = ((colors.length - 1) * stripeStep) / 2;

  return (
    <g>
      {colors.map((color, i) => {
        const dy = i * stripeStep - bandHalf;
        const d = points
          .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y + dy}`)
          .join(' ');
        return (
          <path
            key={i}
            d={d}
            stroke={color}
            strokeWidth={stripeWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}
    </g>
  );
}
