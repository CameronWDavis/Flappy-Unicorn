import React from 'react';

export default function Cloud({
  x, y, scale = 1, opacity = 0.7,
}: { x: number; y: number; scale?: number; opacity?: number }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
      <ellipse cx="18" cy="16" rx="18" ry="11" fill="#FFFFFF" />
      <ellipse cx="34" cy="10" rx="14" ry="9" fill="#FFFFFF" />
      <ellipse cx="48" cy="17" rx="17" ry="10" fill="#FFFFFF" />
      <ellipse cx="26" cy="22" rx="22" ry="9" fill="#FFFFFF" />
    </g>
  );
}
