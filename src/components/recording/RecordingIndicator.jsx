/**
 * RecordingIndicator - Visual "REC" indicator for header/toolbar
 * Shows recording status with pulsing animation
 * 
 * @module RecordingIndicator
 */

import React from 'react';
import { RecordingState, formatDuration } from '../../config/recordingConfig';

// ============================================
// COMPONENT: RecordingIndicator
// ============================================

/**
 * Visual indicator showing current recording status
 * Designed to be placed in header/toolbar area
 * 
 * @param {Object} props
 * @param {string} props.recordingState - Current recording state
 * @param {number} props.duration - Recording duration in seconds
 * @param {boolean} props.showDuration - Whether to show duration
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.size - Size variant: 'sm', 'md', 'lg'
 */
const RecordingIndicator = ({ 
  recordingState = RecordingState.IDLE,
  duration = 0,
  showDuration = true,
  className = '',
  size = 'md',
}) => {
  // ============================================
  // STATE HELPERS
  // ============================================

  const isRecording = recordingState === RecordingState.RECORDING;
  const isPaused = recordingState === RecordingState.PAUSED;
  const isCountingDown = recordingState === RecordingState.COUNTDOWN;
  const isActive = isRecording || isPaused || isCountingDown;

  // Don't render if not active
  if (!isActive) return null;

  // ============================================
  // SIZE VARIANTS
  // ============================================

  const sizeClasses = {
    sm: {
      container: 'px-2 py-0.5 gap-1.5',
      dot: 'w-2 h-2',
      text: 'text-xs',
      duration: 'text-xs',
    },
    md: {
      container: 'px-3 py-1 gap-2',
      dot: 'w-2.5 h-2.5',
      text: 'text-sm font-semibold',
      duration: 'text-sm font-mono',
    },
    lg: {
      container: 'px-4 py-1.5 gap-2.5',
      dot: 'w-3 h-3',
      text: 'text-base font-bold',
      duration: 'text-base font-mono',
    },
  };

  const sizes = sizeClasses[size] || sizeClasses.md;

  // ============================================
  // STYLING
  // ============================================

  const getIndicatorStyles = () => {
    if (isRecording) {
      return {
        container: 'bg-red-500/20 border-red-500/50',
        dot: 'bg-red-500',
        text: 'text-red-400',
      };
    }
    if (isPaused) {
      return {
        container: 'bg-amber-500/20 border-amber-500/50',
        dot: 'bg-amber-500',
        text: 'text-amber-400',
      };
    }
    if (isCountingDown) {
      return {
        container: 'bg-blue-500/20 border-blue-500/50',
        dot: 'bg-blue-500',
        text: 'text-blue-400',
      };
    }
    return {
      container: '',
      dot: '',
      text: '',
    };
  };

  const styles = getIndicatorStyles();

  const getStatusText = () => {
    if (isRecording) return 'REC';
    if (isPaused) return 'PAUSED';
    if (isCountingDown) return 'STARTING';
    return '';
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div 
      className={`
        inline-flex items-center rounded-full
        border backdrop-blur-sm
        ${sizes.container}
        ${styles.container}
        ${className}
      `}
      role="status"
      aria-live="polite"
      aria-label={`${getStatusText()}${showDuration ? `, duration: ${formatDuration(duration)}` : ''}`}
    >
      {/* Pulsing Dot */}
      <div className="relative">
        <div 
          className={`
            ${sizes.dot} rounded-full ${styles.dot}
            ${isRecording ? 'animate-pulse' : ''}
          `}
        />
        {isRecording && (
          <div 
            className={`
              absolute inset-0 ${sizes.dot} rounded-full ${styles.dot}
              animate-ping opacity-75
            `}
          />
        )}
      </div>

      {/* Status Text */}
      <span className={`${sizes.text} ${styles.text} uppercase tracking-wider`}>
        {getStatusText()}
      </span>

      {/* Duration */}
      {showDuration && duration > 0 && (
        <span className={`${sizes.duration} text-white/70`}>
          {formatDuration(duration)}
        </span>
      )}
    </div>
  );
};

// ============================================
// COMPACT VARIANT (for tight spaces)
// ============================================

/**
 * Minimal recording indicator - just the pulsing dot
 */
export const RecordingDot = ({ 
  recordingState = RecordingState.IDLE,
  className = '',
}) => {
  const isRecording = recordingState === RecordingState.RECORDING;
  const isPaused = recordingState === RecordingState.PAUSED;
  const isActive = isRecording || isPaused;

  if (!isActive) return null;

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`
          w-3 h-3 rounded-full
          ${isRecording ? 'bg-red-500' : 'bg-amber-500'}
          ${isRecording ? 'animate-pulse' : ''}
        `}
      />
      {isRecording && (
        <div className="absolute inset-0 w-3 h-3 rounded-full bg-red-500 animate-ping opacity-75" />
      )}
    </div>
  );
};

export default RecordingIndicator;
