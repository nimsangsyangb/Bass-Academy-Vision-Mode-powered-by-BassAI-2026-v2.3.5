/**
 * LoopControls Component - Loop Mode
 * Controls for loop length, subdivision, and visual settings
 */

import React from 'react';
import { LOOP_MODE_CONFIG } from '../../config/uiConfig.js';

/**
 * @param {Object} props
 * @param {number} props.loopLength - Current loop length (1, 2, 4)
 * @param {Function} props.onLoopLengthChange - Callback when loop length changes
 * @param {string} props.subdivision - Current subdivision
 * @param {Function} props.onSubdivisionChange - Callback when subdivision changes
 * @param {boolean} props.disabled - Whether controls are disabled during playback
 */
export default function LoopControls({
  loopLength = 1,
  onLoopLengthChange,
  subdivision = 'eighth',
  onSubdivisionChange,
  disabled = false,
}) {
  const loopOptions = [1, 2, 4];
  
  const subdivisionLabels = {
    quarter: '♩',
    eighth: '♪',
    triplet: '♫³',
    sixteenth: '♬',
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 p-3 sm:p-4">
      {/* Loop Length Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs sm:text-sm text-[var(--color-primary-light)] font-medium">
          Compases:
        </span>
        <div className="flex gap-1">
          {loopOptions.map((len) => (
            <button
              key={len}
              onClick={() => onLoopLengthChange?.(len)}
              disabled={disabled}
              className={`
                px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium
                transition-all duration-150
                ${loopLength === len
                  ? 'bg-[var(--color-gold)] text-[var(--color-primary-deep)]'
                  : 'bg-[var(--color-primary-dark)] text-[var(--color-primary-light)] hover:bg-[var(--color-primary-medium)]'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              aria-label={`${len} ${len === 1 ? 'compás' : 'compases'}`}
            >
              {len}
            </button>
          ))}
        </div>
      </div>

      {/* Subdivision Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs sm:text-sm text-[var(--color-primary-light)] font-medium">
          División:
        </span>
        <div className="flex gap-1">
          {LOOP_MODE_CONFIG.subdivisions.map((sub) => (
            <button
              key={sub}
              onClick={() => onSubdivisionChange?.(sub)}
              disabled={disabled}
              className={`
                px-2.5 py-1.5 rounded-lg text-sm sm:text-base font-medium
                transition-all duration-150
                ${subdivision === sub
                  ? 'bg-[var(--color-gold)] text-[var(--color-primary-deep)]'
                  : 'bg-[var(--color-primary-dark)] text-[var(--color-primary-light)] hover:bg-[var(--color-primary-medium)]'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              aria-label={`Subdivisión: ${sub}`}
              title={sub}
            >
              {subdivisionLabels[sub]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
