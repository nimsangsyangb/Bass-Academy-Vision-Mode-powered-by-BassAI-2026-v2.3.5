/**
 * LoopGrid Component - Loop Mode
 * Subdivision markers (quarters, eighths, triplets) below the staff
 */

import React, { useMemo } from 'react';
import { RHYTHM_CONFIG } from '../../config/uiConfig.js';

/**
 * @param {Object} props
 * @param {string} props.subdivision - 'quarter' | 'eighth' | 'triplet' | 'sixteenth'
 * @param {number} props.loopLength - Number of measures (1, 2, 4)
 * @param {number} props.currentBeat - Current beat for highlighting
 */
export default function LoopGrid({ 
  subdivision = 'quarter', 
  loopLength = 1,
  currentBeat = -1,
}) {
  // Calculate grid lines based on subdivision
  const gridLines = useMemo(() => {
    const beatsPerLoop = RHYTHM_CONFIG.beatsPerMeasure * loopLength;
    const lines = [];
    
    let divisionsPerBeat;
    switch (subdivision) {
      case 'sixteenth': divisionsPerBeat = 4; break;
      case 'triplet': divisionsPerBeat = 3; break;
      case 'eighth': divisionsPerBeat = 2; break;
      case 'quarter':
      default: divisionsPerBeat = 1; break;
    }
    
    const totalDivisions = beatsPerLoop * divisionsPerBeat;
    
    for (let i = 0; i <= totalDivisions; i++) {
      const position = (i / totalDivisions) * 100;
      const beatIndex = Math.floor(i / divisionsPerBeat);
      const isDownbeat = i % (divisionsPerBeat * RHYTHM_CONFIG.beatsPerMeasure) === 0;
      const isBeat = i % divisionsPerBeat === 0;
      const isActive = beatIndex === currentBeat;
      
      lines.push({
        id: i,
        position,
        isDownbeat,
        isBeat,
        isActive,
        beatNumber: isBeat ? (beatIndex % RHYTHM_CONFIG.beatsPerMeasure) + 1 : null,
      });
    }
    
    return lines;
  }, [subdivision, loopLength, currentBeat]);

  return (
    <div className="relative h-8 w-full">
      {/* Grid lines */}
      {gridLines.map((line) => (
        <div
          key={line.id}
          className="absolute bottom-0"
          style={{ left: `${line.position}%` }}
        >
          {/* Tick mark */}
          <div
            className={`
              w-px transition-all duration-100
              ${line.isDownbeat 
                ? 'h-6 bg-[var(--color-gold)]' 
                : line.isBeat 
                  ? 'h-4 bg-[var(--color-primary-light)]'
                  : 'h-2 bg-[var(--color-primary-medium)] opacity-50'
              }
              ${line.isActive ? 'bg-[var(--color-gold)] shadow-sm' : ''}
            `}
          />
          
          {/* Beat number label */}
          {line.beatNumber && (
            <span
              className={`
                absolute -bottom-5 left-1/2 -translate-x-1/2
                text-xs font-mono transition-all duration-100
                ${line.isActive 
                  ? 'text-[var(--color-gold)] font-bold' 
                  : 'text-[var(--color-primary-light)] opacity-60'
                }
              `}
            >
              {line.beatNumber}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
