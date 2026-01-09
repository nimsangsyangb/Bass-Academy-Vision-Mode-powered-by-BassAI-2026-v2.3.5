/**
 * RecordingPlayer - Audio player with controls
 * Full-featured playback component for recordings
 * 
 * @module RecordingPlayer
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { formatDuration } from '../../../config/recordingConfig';
import WaveformVisualizer from './WaveformVisualizer';

// ============================================
// ICONS
// ============================================

const PlayIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
  </svg>
);

const RewindIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
  </svg>
);

const ForwardIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
  </svg>
);

const VolumeIcon = ({ className = "w-5 h-5", muted = false }) => (
  muted ? (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
    </svg>
  ) : (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  )
);

const SpeedIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

// ============================================
// COMPONENT: RecordingPlayer
// ============================================

/**
 * Full-featured audio player for recordings
 * 
 * @param {Object} props
 * @param {string} props.audioUrl - URL of audio to play (object URL or file path)
 * @param {Object} props.recording - Recording metadata object
 * @param {boolean} props.showWaveform - Show waveform visualizer
 * @param {boolean} props.showSpeedControl - Show playback speed control
 * @param {Function} props.onPlayStateChange - Called when play state changes
 * @param {string} props.variant - 'full' | 'compact' | 'minimal'
 * @param {string} props.className - Additional CSS classes
 */
const RecordingPlayer = ({
  audioUrl,
  recording = null,
  showWaveform = true,
  showSpeedControl = true,
  onPlayStateChange = null,
  variant = 'full',
  className = '',
}) => {
  // ============================================
  // STATE
  // ============================================

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(recording?.duration || 0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Progress as 0-1
  const progress = duration > 0 ? currentTime / duration : 0;

  // ============================================
  // AUDIO EVENT HANDLERS
  // ============================================

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      // Use audio duration if valid, otherwise fall back to recording metadata
      const audioDuration = audio.duration;
      if (isFinite(audioDuration) && audioDuration > 0) {
        setDuration(audioDuration);
      } else if (recording?.duration && isFinite(recording.duration)) {
        setDuration(recording.duration);
      }
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onPlayStateChange?.(false);
    };

    const handleError = (e) => {
      console.error('Audio error:', e);
      setError('Failed to load audio');
      setIsLoading(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      onPlayStateChange?.(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPlayStateChange?.(false);
    };

    // Also try to get duration on canplay event (backup for some browsers)
    const handleCanPlay = () => {
      if (duration === 0 || !isFinite(duration)) {
        const audioDuration = audio.duration;
        if (isFinite(audioDuration) && audioDuration > 0) {
          setDuration(audioDuration);
        }
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [onPlayStateChange, recording, duration]);

  // ============================================
  // PLAYBACK CONTROLS
  // ============================================

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  }, [isPlaying]);

  const seek = useCallback((position) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    audio.currentTime = position * duration;
    setCurrentTime(position * duration);
  }, [duration]);

  const skipBack = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.max(0, audio.currentTime - 5);
  }, []);

  const skipForward = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.min(duration, audio.currentTime + 5);
  }, [duration]);

  const handleVolumeChange = useCallback((e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume > 0) setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      audioRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  }, [isMuted]);

  const handleSpeedChange = useCallback((speed) => {
    setPlaybackRate(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, []);

  // ============================================
  // SPEED OPTIONS
  // ============================================

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // ============================================
  // RENDER: ERROR STATE
  // ============================================

  if (error) {
    return (
      <div className={`flex items-center justify-center py-8 text-red-400 ${className}`}>
        <span>{error}</span>
      </div>
    );
  }

  // ============================================
  // RENDER: MINIMAL VARIANT
  // ============================================

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
        
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className="w-10 h-10 flex items-center justify-center bg-[#C9A554] hover:bg-[#d4b05f] text-[#0D1B2A] rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
        </button>

        <div className="flex-1 text-sm text-white/70">
          {formatDuration(currentTime)} / {formatDuration(duration)}
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: COMPACT VARIANT
  // ============================================

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 p-3 bg-white/5 rounded-xl ${className}`}>
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
        
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className="w-12 h-12 flex items-center justify-center bg-[#C9A554] hover:bg-[#d4b05f] text-[#0D1B2A] rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex-shrink-0"
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        <div className="flex-1 min-w-0">
          {/* Progress bar */}
          <div 
            className="h-1.5 bg-white/10 rounded-full cursor-pointer overflow-hidden"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              seek((e.clientX - rect.left) / rect.width);
            }}
          >
            <div 
              className="h-full bg-[#C9A554] rounded-full transition-all"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          {/* Time */}
          <div className="flex justify-between mt-1 text-xs text-white/50">
            <span>{formatDuration(currentTime)}</span>
            <span>{formatDuration(duration)}</span>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: FULL VARIANT
  // ============================================

  return (
    <div className={`flex flex-col gap-4 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl ${className}`}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Recording Info */}
      {recording && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white">{recording.name || 'Recording'}</h3>
            {recording.exercise?.patternId && (
              <p className="text-sm text-white/50">
                {recording.exercise.rootNote} - {recording.exercise.patternId}
              </p>
            )}
          </div>
          <div className="text-sm text-white/50">
            {new Date(recording.created).toLocaleDateString()}
          </div>
        </div>
      )}

      {/* Waveform */}
      {showWaveform && (
        <WaveformVisualizer
          audioSource={audioUrl}
          progress={progress}
          duration={duration}
          onSeek={seek}
          isPlaying={isPlaying}
          height={80}
        />
      )}

      {/* Time Display */}
      <div className="flex justify-between text-sm text-white/70 font-mono">
        <span>{formatDuration(currentTime)}</span>
        <span>{formatDuration(duration)}</span>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={skipBack}
          className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          title="Skip back 5s"
        >
          <RewindIcon />
        </button>

        <button
          onClick={togglePlay}
          disabled={isLoading}
          className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-[#C9A554] to-[#E0C285] hover:from-[#d4b05f] hover:to-[#e8cc93] text-[#0D1B2A] rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-lg shadow-[#C9A554]/20"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-[#0D1B2A]/30 border-t-[#0D1B2A] rounded-full animate-spin" />
          ) : isPlaying ? (
            <PauseIcon />
          ) : (
            <PlayIcon />
          )}
        </button>

        <button
          onClick={skipForward}
          className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          title="Skip forward 5s"
        >
          <ForwardIcon />
        </button>
      </div>

      {/* Secondary Controls */}
      <div className="flex items-center justify-between">
        {/* Volume */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="text-white/70 hover:text-white transition-colors"
          >
            <VolumeIcon muted={isMuted || volume === 0} />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 appearance-none bg-white/20 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
          />
        </div>

        {/* Speed Control */}
        {showSpeedControl && (
          <div className="flex items-center gap-1">
            <SpeedIcon className="w-4 h-4 text-white/50" />
            <div className="flex items-center gap-0.5">
              {speedOptions.map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={`px-2 py-0.5 text-xs rounded transition-colors ${
                    playbackRate === speed
                      ? 'bg-[#C9A554] text-[#0D1B2A] font-medium'
                      : 'text-white/50 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordingPlayer;
