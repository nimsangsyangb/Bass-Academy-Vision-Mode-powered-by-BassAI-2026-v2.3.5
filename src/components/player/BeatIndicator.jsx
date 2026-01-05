/**
 * BeatIndicator Component - Bass Trainer
 * Mobile-first responsive beat visualization
 */

import React from 'react';
import { RHYTHM_CONFIG } from '../../config/uiConfig.js';

function BeatIndicator({ currentBeat, currentTriplet }) {
  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      <span className="text-[var(--color-primary-light)] text-xs sm:text-sm uppercase tracking-wider font-medium">
        Beat
      </span>
      <div className="flex gap-2 sm:gap-3 md:gap-4">
        {Array.from({ length: RHYTHM_CONFIG.beatsPerMeasure }, (_, beat) => (
          <div key={beat} className="flex flex-col items-center gap-1 sm:gap-1.5 md:gap-2">
            {/* Beat Number Circle - Mobile Optimized */}
            <div
              className={`
                w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center
                font-mono font-bold text-base sm:text-lg md:text-xl transition-all duration-150
                ${
                  currentBeat === beat
                    ? "bg-[var(--color-gold)] text-[var(--color-primary-deep)] scale-105 sm:scale-110"
                    : "bg-[var(--color-primary-dark)] text-[var(--color-primary-light)] border border-[var(--color-primary-medium)]"
                }
              `}
              style={{
                boxShadow: currentBeat === beat 
                  ? "0 0 15px var(--color-gold), 0 0 30px rgba(201, 165, 84, 0.3)" 
                  : "none"
              }}
            >
              {beat + 1}
            </div>
            
            {/* Triplet Subdivision Dots - Mobile Optimized */}
            <div className="flex gap-1">
              {Array.from({ length: RHYTHM_CONFIG.tripletsPerBeat }, (_, triplet) => (
                <div
                  key={triplet}
                  className={`
                    w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-100
                    ${
                      currentBeat === beat && currentTriplet === triplet
                        ? "bg-[var(--color-active)] scale-125"
                        : currentBeat === beat
                          ? "bg-[var(--color-gold)]/40"
                          : "bg-[var(--color-primary-medium)]/50"
                    }
                  `}
                  style={{
                    boxShadow: currentBeat === beat && currentTriplet === triplet
                      ? "0 0 6px var(--color-active-glow)"
                      : "none"
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Triplet Count Label - Mobile Optimized */}
      <div className="font-mono text-xs sm:text-sm text-[var(--color-primary-light)] min-h-[20px] sm:min-h-[24px]">
        {currentTriplet >= 0 && currentBeat >= 0 ? (
          <span>
            <span className="text-[var(--color-gold)] font-bold">{currentBeat + 1}</span>
            <span className="text-[var(--color-active)] font-medium">
              {currentTriplet === 0 ? "" : currentTriplet === 1 ? " & " : " a "}
            </span>
          </span>
        ) : (
          <span className="opacity-50 text-[10px] sm:text-xs">triplets</span>
        )}
      </div>
    </div>
  );
}

export default BeatIndicator;