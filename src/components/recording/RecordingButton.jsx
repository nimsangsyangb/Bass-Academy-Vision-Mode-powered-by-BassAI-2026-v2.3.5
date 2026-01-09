/**
 * RecordingButton - Floating Action Button for Recording
 * Mobile-First Design with state-aware styling and animations
 * 
 * @module RecordingButton
 */

import React from 'react';
import { RecordingState } from '../../config/recordingConfig';

// ============================================
// ICONS (inline SVG for bundle efficiency)
// ============================================

const MicIcon = ({ className = "w-7 h-7" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const PauseIcon = ({ className = "w-7 h-7" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
  </svg>
);

const PlayIcon = ({ className = "w-7 h-7" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const StopIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <rect x="6" y="6" width="12" height="12" rx="1" />
  </svg>
);

// ============================================
// COMPONENT: RecordingButton
// ============================================

/**
 * Floating action button for starting/controlling recordings
 * 
 * @param {Object} props
 * @param {string} props.recordingState - Current recording state
 * @param {number} props.countdown - Countdown value (when counting down)
 * @param {number} props.audioLevel - Current audio level (0-1)
 * @param {Function} props.onStart - Called when user wants to start recording
 * @param {Function} props.onStop - Called when user wants to stop
 * @param {Function} props.onPause - Called when user wants to pause
 * @param {Function} props.onResume - Called when user wants to resume
 * @param {boolean} props.disabled - Disable the button
 * @param {string} props.className - Additional CSS classes
 */
const RecordingButton = ({ 
  recordingState = RecordingState.IDLE,
  countdown = 0,
  audioLevel = 0,
  onStart = () => {},
  onStop = () => {},
  onPause = () => {},
  onResume = () => {},
  disabled = false,
  className = '',
}) => {
  // ============================================
  // STATE HELPERS
  // ============================================

  const isIdle = recordingState === RecordingState.IDLE;
  const isRecording = recordingState === RecordingState.RECORDING;
  const isPaused = recordingState === RecordingState.PAUSED;
  const isCountingDown = recordingState === RecordingState.COUNTDOWN;
  const isRequestingPermission = recordingState === RecordingState.REQUESTING_PERMISSION;
  const isStopped = recordingState === RecordingState.STOPPED;

  // ============================================
  // HANDLERS
  // ============================================

  const handleMainClick = () => {
    if (disabled) return;
    
    if (isIdle || isStopped) {
      onStart();
    } else if (isRecording) {
      onPause();
    } else if (isPaused) {
      onResume();
    } else if (isCountingDown) {
      onStop(); // Cancel countdown
    }
  };

  const handleStopClick = (e) => {
    e.stopPropagation();
    if (!disabled) {
      onStop();
    }
  };

  // ============================================
  // STYLING
  // ============================================

  const getButtonStyles = () => {
    if (isRecording) {
      return 'bg-gradient-to-br from-red-500 to-red-600 shadow-[0_0_30px_rgba(239,68,68,0.6)]';
    }
    if (isPaused) {
      return 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-[0_0_30px_rgba(245,158,11,0.6)]';
    }
    if (isCountingDown || isRequestingPermission) {
      return 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-[0_0_30px_rgba(59,130,246,0.6)]';
    }
    // Idle / Stopped - Gold theme
    return 'bg-gradient-to-br from-[#C9A554] to-[#E0C285] shadow-[0_0_30px_rgba(201,165,84,0.4)]';
  };

  const getIcon = () => {
    if (isRecording) return <PauseIcon />;
    if (isPaused) return <PlayIcon />;
    if (isCountingDown) return <span className="text-2xl font-bold">{countdown}</span>;
    if (isRequestingPermission) return <span className="text-xs">...</span>;
    return <MicIcon />;
  };

  const getAriaLabel = () => {
    if (isRecording) return 'Pause recording';
    if (isPaused) return 'Resume recording';
    if (isCountingDown) return `Starting in ${countdown}`;
    if (isRequestingPermission) return 'Requesting permission';
    if (isStopped) return 'Record again';
    return 'Start recording';
  };

  // Audio level ring scale (subtle pulsing based on audio input)
  const levelScale = isRecording ? 1 + (audioLevel * 0.15) : 1;

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className={`fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 ${className}`}>
      {/* Stop Button (appears above main button when recording/paused) */}
      {(isRecording || isPaused) && (
        <button
          onClick={handleStopClick}
          className="absolute -top-14 left-1/2 -translate-x-1/2
                     w-12 h-12 sm:w-14 sm:h-14 rounded-full
                     bg-gradient-to-br from-gray-700 to-gray-800
                     flex items-center justify-center
                     text-white shadow-lg
                     hover:scale-110 active:scale-95
                     transition-all duration-200
                     border-2 border-white/20
                     focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Stop recording"
        >
          <StopIcon />
        </button>
      )}

      {/* Main Recording Button */}
      <button
        onClick={handleMainClick}
        disabled={disabled}
        className={`
          w-16 h-16 sm:w-20 sm:h-20 rounded-full
          flex items-center justify-center
          text-white font-bold
          transition-all duration-300
          hover:scale-110 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          focus:outline-none focus:ring-4 focus:ring-white/30
          ${getButtonStyles()}
          ${isRecording ? 'animate-pulse' : ''}
        `}
        style={{
          transform: `scale(${levelScale})`,
        }}
        aria-label={getAriaLabel()}
      >
        {getIcon()}
      </button>

      {/* Recording Indicator Dot */}
      {isRecording && (
        <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5">
          <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
          <div className="absolute inset-0 bg-red-500 rounded-full" />
        </div>
      )}

      {/* Audio Level Ring (visual feedback while recording) */}
      {isRecording && audioLevel > 0.1 && (
        <div 
          className="absolute inset-0 rounded-full border-4 border-white/30 pointer-events-none"
          style={{
            transform: `scale(${1 + audioLevel * 0.3})`,
            opacity: 0.5 + audioLevel * 0.5,
            transition: 'transform 50ms ease-out, opacity 50ms ease-out',
          }}
        />
      )}
    </div>
  );
};

export default RecordingButton;
