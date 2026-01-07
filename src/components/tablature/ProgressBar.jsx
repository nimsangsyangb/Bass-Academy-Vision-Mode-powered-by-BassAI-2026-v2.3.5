/**
 * ProgressBar Component - Bass Academy
 * Visual progress indicator for tablature playback
 * Shows: progress %, measure indicator, and tempo pulse
 */

import React, { useMemo } from 'react';

function ProgressBar({ 
  currentIndex = -1, 
  totalNotes = 24, 
  tempo = 60,
  isPlaying = false,
  variant = 'default' // 'default' | 'compact' | 'fullscreen'
}) {
  // Calculate progress percentage
  const progress = useMemo(() => {
    if (currentIndex < 0 || totalNotes === 0) return 0;
    return Math.min(((currentIndex + 1) / totalNotes) * 100, 100);
  }, [currentIndex, totalNotes]);

  // Determine current measure (1 or 2 based on 12 notes per measure)
  const currentMeasure = useMemo(() => {
    if (currentIndex < 0) return 0;
    return currentIndex < 12 ? 1 : 2;
  }, [currentIndex]);

  // Calculate pulse animation duration based on BPM
  const pulseDuration = useMemo(() => {
    return 60 / tempo; // Duration of one beat in seconds
  }, [tempo]);

  // Variant-specific classes
  const containerClasses = {
    default: 'px-4 py-2 sm:px-6 sm:py-3',
    compact: 'px-3 py-1.5',
    fullscreen: 'px-4 py-2',
  };

  const barHeightClasses = {
    default: 'h-2 sm:h-2.5',
    compact: 'h-1.5',
    fullscreen: 'h-2',
  };

  const textClasses = {
    default: 'text-[10px] sm:text-xs',
    compact: 'text-[9px]',
    fullscreen: 'text-xs',
  };

  return (
    <div 
      className={`
        glass backdrop-blur-md border-b border-[var(--color-primary-medium)]/30
        ${containerClasses[variant]}
      `}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progreso del ejercicio"
    >
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Progress Bar Container */}
        <div className="flex-1 relative">
          {/* Background Track */}
          <div className={`
            w-full ${barHeightClasses[variant]} 
            bg-[var(--color-primary-dark)] rounded-full 
            overflow-hidden
          `}>
            {/* Progress Fill */}
            <div 
              className={`
                ${barHeightClasses[variant]} rounded-full
                bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)]
                transition-all duration-150 ease-linear
              `}
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Progress Indicator Dot */}
          {isPlaying && progress > 0 && (
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 
                         rounded-full bg-[var(--color-active)] shadow-lg
                         transition-all duration-150 ease-linear"
              style={{ 
                left: `calc(${progress}% - 6px)`,
                boxShadow: '0 0 10px var(--color-active-glow), 0 0 20px var(--color-active-glow)'
              }}
            />
          )}
        </div>

        {/* Progress Info */}
        <div className={`flex items-center gap-2 sm:gap-3 ${textClasses[variant]} font-medium text-[var(--color-cream)] whitespace-nowrap`}>
          {/* Percentage */}
          <span className="text-[var(--color-gold)] min-w-[2.5rem] text-right font-mono">
            {Math.round(progress)}%
          </span>
          
          {/* Divider */}
          <span className="text-[var(--color-primary-medium)]">·</span>
          
          {/* Measure Indicator */}
          <span className="text-[var(--color-primary-light)]">
            {currentMeasure === 0 ? 'Ready' : `Measure ${currentMeasure}`}
          </span>

          {/* BPM Pulse Indicator */}
          {isPlaying && (
            <>
              <span className="text-[var(--color-primary-medium)]">·</span>
              <div 
                className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[var(--color-gold)]"
                style={{
                  animation: `pulse-tempo ${pulseDuration}s ease-in-out infinite`,
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
