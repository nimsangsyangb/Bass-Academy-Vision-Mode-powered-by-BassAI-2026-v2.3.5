/**
 * RecordingControls - Extended control panel for recording
 * Provides full control over recording with visual feedback
 * 
 * @module RecordingControls
 */

import React from 'react';
import { RecordingState, formatDuration, formatFileSize } from '../../../config/recordingConfig';

// ============================================
// ICONS
// ============================================

const MicIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const PauseIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
  </svg>
);

const PlayIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const StopIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <rect x="6" y="6" width="12" height="12" rx="1" />
  </svg>
);

const TrashIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const SaveIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
);

// ============================================
// COMPONENT: RecordingControls
// ============================================

/**
 * Full control panel for recording functionality
 * 
 * @param {Object} props
 * @param {string} props.recordingState - Current state
 * @param {number} props.duration - Duration in seconds
 * @param {number} props.countdown - Countdown value
 * @param {number} props.audioLevel - Audio level 0-1
 * @param {Object} props.audioBlob - Recorded audio blob
 * @param {string} props.error - Error message if any
 * @param {Function} props.onStart - Start recording
 * @param {Function} props.onStop - Stop recording
 * @param {Function} props.onPause - Pause recording
 * @param {Function} props.onResume - Resume recording
 * @param {Function} props.onCancel - Cancel/discard
 * @param {Function} props.onSave - Save recording
 * @param {boolean} props.isSupported - Is recording supported
 * @param {string} props.variant - 'compact' | 'full'
 */
const RecordingControls = ({
  recordingState = RecordingState.IDLE,
  duration = 0,
  countdown = 0,
  audioLevel = 0,
  audioBlob = null,
  error = null,
  onStart = () => {},
  onStop = () => {},
  onPause = () => {},
  onResume = () => {},
  onCancel = () => {},
  onSave = () => {},
  isSupported = true,
  variant = 'full',
}) => {
  // ============================================
  // STATE HELPERS
  // ============================================

  const isIdle = recordingState === RecordingState.IDLE;
  const isRecording = recordingState === RecordingState.RECORDING;
  const isPaused = recordingState === RecordingState.PAUSED;
  const isStopped = recordingState === RecordingState.STOPPED;
  const isCountingDown = recordingState === RecordingState.COUNTDOWN;
  const hasError = recordingState === RecordingState.ERROR;
  const isActive = isRecording || isPaused;

  // ============================================
  // RENDER: NOT SUPPORTED
  // ============================================

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span className="text-sm">Recording not supported in this browser</span>
      </div>
    );
  }

  // ============================================
  // RENDER: ERROR STATE
  // ============================================

  if (hasError && error) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl">
        <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm text-red-400 flex-1">{error}</span>
        <button
          onClick={onCancel}
          className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
        >
          Dismiss
        </button>
      </div>
    );
  }

  // ============================================
  // RENDER: COMPACT VARIANT
  // ============================================

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        {/* Main Action Button */}
        {(isIdle || isStopped) && (
          <button
            onClick={onStart}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#C9A554] to-[#E0C285] hover:from-[#d4b05f] hover:to-[#e8cc93] text-[#0D1B2A] font-semibold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <MicIcon className="w-4 h-4" />
            <span className="text-sm">Record</span>
          </button>
        )}

        {isCountingDown && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-lg">
            <span className="text-2xl font-bold text-blue-400 animate-pulse">{countdown}</span>
          </div>
        )}

        {isActive && (
          <>
            <button
              onClick={isRecording ? onPause : onResume}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
                isRecording 
                  ? 'bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30' 
                  : 'bg-amber-500/20 border border-amber-500/50 text-amber-400 hover:bg-amber-500/30'
              }`}
            >
              {isRecording ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
            </button>

            <button
              onClick={onStop}
              className="flex items-center gap-2 px-3 py-2 bg-gray-500/20 border border-gray-500/50 rounded-lg text-gray-300 hover:bg-gray-500/30 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <StopIcon className="w-4 h-4" />
            </button>

            <span className="text-sm font-mono text-white/70 min-w-[60px]">
              {formatDuration(duration)}
            </span>
          </>
        )}

        {isStopped && audioBlob && (
          <>
            <button
              onClick={onSave}
              className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 hover:bg-green-500/30 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <SaveIcon className="w-4 h-4" />
            </button>
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    );
  }

  // ============================================
  // RENDER: FULL VARIANT
  // ============================================

  return (
    <div className="flex flex-col gap-4 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${
            isRecording ? 'bg-red-500 animate-pulse' : 
            isPaused ? 'bg-amber-500' : 
            isCountingDown ? 'bg-blue-500 animate-pulse' :
            'bg-gray-500'
          }`} />
          <span className="text-sm font-medium text-white/80">
            {isRecording ? 'Recording' : 
             isPaused ? 'Paused' : 
             isCountingDown ? 'Starting...' :
             isStopped ? 'Recorded' :
             'Ready to Record'}
          </span>
        </div>

        {/* Duration Display */}
        <div className="flex items-center gap-2">
          {(isActive || isStopped) && (
            <span className="text-lg font-mono text-white/90">
              {formatDuration(duration)}
            </span>
          )}
          {audioBlob && (
            <span className="text-xs text-white/50">
              ({formatFileSize(audioBlob.size)})
            </span>
          )}
        </div>
      </div>

      {/* Audio Level Meter (visible during recording) */}
      {isRecording && (
        <div className="flex flex-col gap-3 py-3 px-4 bg-white/5 rounded-xl border border-white/10">
          {/* Microphone Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-400 font-medium">🎙️ Mic Active</span>
            </div>
            <span className={`text-xs font-medium ${
              audioLevel > 0.5 ? 'text-green-400' : 
              audioLevel > 0.1 ? 'text-amber-400' : 
              'text-red-400'
            }`}>
              {audioLevel > 0.5 ? '● Strong Signal' : 
               audioLevel > 0.1 ? '● Weak Signal' : 
               '● No Signal - Speak louder!'}
            </span>
          </div>
          
          {/* Visual Audio Bars */}
          <div className="flex items-end justify-center gap-1 h-12">
            {[...Array(20)].map((_, i) => {
              const barHeight = Math.max(
                4,
                audioLevel * 48 * (0.3 + Math.sin(i * 0.5 + Date.now() * 0.003) * 0.7)
              );
              const isActive = (i / 20) < audioLevel;
              return (
                <div
                  key={i}
                  className={`w-2 rounded-full transition-all duration-75 ${
                    isActive 
                      ? 'bg-gradient-to-t from-green-500 via-yellow-400 to-red-500' 
                      : 'bg-white/10'
                  }`}
                  style={{ 
                    height: isActive ? `${barHeight}px` : '4px',
                  }}
                />
              );
            })}
          </div>

          {/* Level Bar */}
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-75 ${
                audioLevel > 0.7 ? 'bg-red-500' :
                audioLevel > 0.3 ? 'bg-gradient-to-r from-green-500 to-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(audioLevel * 100, 100)}%` }}
            />
          </div>
          
          {/* Tip */}
          {audioLevel < 0.1 && (
            <p className="text-xs text-center text-amber-400/80">
              💡 Tip: Habla o toca tu instrumento cerca del micrófono
            </p>
          )}
        </div>
      )}

      {/* Countdown Display */}
      {isCountingDown && (
        <div className="flex items-center justify-center py-4">
          <span className="text-6xl font-bold text-blue-400 animate-pulse">
            {countdown}
          </span>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-3">
        {/* Start Button (Idle/Stopped) */}
        {(isIdle || isStopped) && (
          <button
            onClick={onStart}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C9A554] to-[#E0C285] hover:from-[#d4b05f] hover:to-[#e8cc93] text-[#0D1B2A] font-bold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-[#C9A554]/20"
          >
            <MicIcon />
            <span>{isStopped ? 'Record Again' : 'Start Recording'}</span>
          </button>
        )}

        {/* Active Recording Controls */}
        {isActive && (
          <>
            <button
              onClick={isRecording ? onPause : onResume}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
                isRecording 
                  ? 'bg-amber-500 hover:bg-amber-400 text-black' 
                  : 'bg-green-500 hover:bg-green-400 text-black'
              }`}
            >
              {isRecording ? <PauseIcon /> : <PlayIcon />}
              <span>{isRecording ? 'Pause' : 'Resume'}</span>
            </button>

            <button
              onClick={onStop}
              className="flex items-center gap-2 px-5 py-3 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <StopIcon />
              <span>Stop</span>
            </button>
          </>
        )}

        {/* Post-Recording Controls */}
        {isStopped && audioBlob && (
          <>
            <button
              onClick={onSave}
              className="flex items-center gap-2 px-5 py-3 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <SaveIcon />
              <span>Save</span>
            </button>

            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-5 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <TrashIcon />
              <span>Discard</span>
            </button>
          </>
        )}
      </div>

      {/* Cancel Button during countdown */}
      {isCountingDown && (
        <button
          onClick={onCancel}
          className="w-full py-2 text-sm text-white/50 hover:text-white/70 transition-colors"
        >
          Cancel
        </button>
      )}
    </div>
  );
};

export default RecordingControls;
