import React from 'react';
import { UNICORN_X, UNICORN_SIZE } from '../constants';

export default function Unicorn({ y, rotation }: { y: number; rotation: number }) {
  return (
    <g
      transform={`translate(${UNICORN_X}, ${y}) rotate(${rotation}, ${UNICORN_SIZE / 2}, ${UNICORN_SIZE / 2})`}
      style={{ filter: 'drop-shadow(0 3px 5px rgba(80, 30, 100, 0.35))' }}
    >
      {/* Rainbow tail */}
      <path d="M 6 30 Q -6 22 -4 34 Q 2 40 10 34 Z" fill="#FF4D8B" />
      <path d="M 4 36 Q -8 32 -5 44 Q 2 46 6 38 Z" fill="#FFA14D" />
      <path d="M 8 40 Q -2 46 8 46 Z" fill="#FFD93D" />

      {/* Back legs */}
      <rect x="17" y="45" width="4.5" height="9" rx="1.5" fill="#F5B8E5" />
      <rect x="23" y="45" width="4.5" height="9" rx="1.5" fill="#FFFFFF" stroke="#E8C4E8" strokeWidth="1" />

      {/* Body */}
      <ellipse cx="28" cy="36" rx="21" ry="13" fill="#FFFFFF" stroke="#E8C4E8" strokeWidth="1.5" />

      {/* Front legs */}
      <rect x="33" y="45" width="4.5" height="9" rx="1.5" fill="#FFFFFF" stroke="#E8C4E8" strokeWidth="1" />
      <rect x="39" y="45" width="4.5" height="9" rx="1.5" fill="#F5B8E5" />

      {/* Head + snout */}
      <ellipse cx="46" cy="26" rx="11" ry="10" fill="#FFFFFF" stroke="#E8C4E8" strokeWidth="1.5" />
      <ellipse cx="54" cy="29" rx="5" ry="4" fill="#FFE0F0" />
      <ellipse cx="55" cy="29.5" rx="1.2" ry="0.8" fill="#D99CC2" />

      {/* Flowing mane */}
      <path d="M 36 16 Q 28 11 29 24 Q 30 30 36 27 Z" fill="#FF4D8B" />
      <path d="M 38 14 Q 30 8 33 22 Q 36 28 41 21 Z" fill="#9D4EDD" opacity="0.85" />
      <path d="M 41 12 Q 37 6 43 18 Z" fill="#4D9DE0" opacity="0.8" />
      <path d="M 42 20 Q 36 18 39 28 Z" fill="#4BD14B" opacity="0.7" />

      {/* Horn */}
      <polygon points="48 2 43 18 53 18" fill="url(#hornGrad)" stroke="#D4A017" strokeWidth="0.6" />
      <line x1="45.5" y1="9" x2="50.5" y2="9" stroke="#D4A017" strokeWidth="0.6" />
      <line x1="44.5" y1="14" x2="51.5" y2="14" stroke="#D4A017" strokeWidth="0.6" />

      {/* Ear */}
      <path d="M 42 17 L 40 13 L 44 15 Z" fill="#FFFFFF" stroke="#E8C4E8" strokeWidth="0.8" />

      {/* Eye */}
      <circle cx="50" cy="24" r="2.3" fill="#2D1B3D" />
      <circle cx="50.8" cy="23.3" r="0.9" fill="#FFFFFF" />

      {/* Cheek blush */}
      <circle cx="52" cy="30.5" r="1.8" fill="#FFB5D9" opacity="0.7" />
    </g>
  );
}
