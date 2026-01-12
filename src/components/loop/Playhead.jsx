/**
 * Playhead Component - Loop Mode
 * GPU-accelerated animated vertical bar synced to audio time
 */

import React from 'react';

/**
 * @param {Object} props
 * @param {number} props.progress - Current position 0..1
 * @param {string} props.containerWidth - CSS width of the playhead container (default: 100%)
 */
export default function Playhead({ progress = 0 }) {
  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-[var(--color-gold)] shadow-playhead"
        style={{
          left: `${progress * 100}%`,
          willChange: 'left',
          boxShadow: '0 0 12px var(--color-gold), 0 0 24px var(--color-gold)',
        }}
      >
        {/* Glow effect at top and bottom */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[var(--color-gold)] opacity-80" />
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[var(--color-gold)] opacity-80" />
      </div>
    </div>
  );
}
