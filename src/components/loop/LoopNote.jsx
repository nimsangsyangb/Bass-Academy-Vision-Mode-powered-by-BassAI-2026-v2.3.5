/**
 * LoopNote Component - Loop Mode
 * Individual note with micro-animations for attack, sustain, fade
 */

import React from 'react';
import { LOOP_MODE_CONFIG } from '../../config/uiConfig.js';

/**
 * @param {Object} props
 * @param {Object} props.note - Note data { beat, pitch, technique, velocity }
 * @param {boolean} props.isActive - Whether this note is currently being played
 * @param {boolean} props.isPast - Whether playhead has passed this note
 * @param {number} props.positionX - X position as percentage (0-100)
 * @param {number} props.positionY - Y position (staff line index)
 */
export default function LoopNote({ 
  note, 
  isActive = false, 
  isPast = false,
  positionX = 0,
  positionY = 2,
}) {
  const isGhost = note?.technique === 'ghost';
  const isAccent = note?.velocity > 0.8;
  
  // Base size and styles
  const baseSize = 'w-4 h-4';
  const ghostOpacity = isGhost ? LOOP_MODE_CONFIG.ghostNoteOpacity : 1;
  
  // Dynamic classes based on state
  const stateClasses = isActive 
    ? 'bg-[var(--color-gold)] scale-110 shadow-lg animate-loop-attack'
    : isPast 
      ? 'bg-[var(--color-primary-light)] opacity-40'
      : 'bg-[var(--color-cream)]';
  
  const accentScale = isAccent && !isGhost ? 'scale-105' : '';

  return (
    <div
      className={`
        absolute ${baseSize} rounded-full 
        transition-all duration-100 ease-out
        ${stateClasses} ${accentScale}
      `}
      style={{
        left: `${positionX}%`,
        top: `${positionY * 20}%`,
        opacity: ghostOpacity,
        transform: isActive ? `scale(${LOOP_MODE_CONFIG.accentScale})` : 'scale(1)',
        boxShadow: isActive 
          ? '0 0 16px var(--color-gold), 0 0 32px var(--color-gold)'
          : 'none',
      }}
      aria-label={`Note ${note?.pitch || ''} ${isActive ? 'playing' : ''}`}
    >
      {/* Inner dot for visual depth */}
      <div 
        className={`
          absolute inset-1 rounded-full 
          ${isActive ? 'bg-[var(--color-gold-light)]' : 'bg-[var(--color-primary-medium)]'}
        `}
        style={{ opacity: isGhost ? 0.5 : 0.3 }}
      />
    </div>
  );
}
