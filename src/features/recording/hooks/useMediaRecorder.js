/**
 * useMediaRecorder Hook - Bass Academy
 * Manages audio recording with MediaRecorder API
 * 
 * @module useMediaRecorder
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { 
  RECORDING_CONFIG, 
  RecordingState, 
  getBestMimeType, 
  isRecordingSupported,
  getQualitySettings,
} from '../../../config/recordingConfig';

// ============================================
// HOOK: useMediaRecorder
// ============================================

/**
 * React hook for managing audio recording with MediaRecorder API
 * 
 * @param {Object} options - Hook options
 * @param {string} options.quality - Quality preset ('LOW', 'MEDIUM', 'HIGH')
 * @param {Function} options.onRecordingComplete - Callback when recording stops
 * @param {Function} options.onError - Callback on error
 * @returns {Object} Recording state and controls
 */
export function useMediaRecorder({ 
  quality = 'MEDIUM', 
  onRecordingComplete = null,
  onError = null,
} = {}) {
  // ============================================
  // STATE
  // ============================================
  
  const [recordingState, setRecordingState] = useState(RecordingState.IDLE);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);

  // ============================================
  // REFS
  // ============================================
  
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const chunksRef = useRef([]);
  const durationIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const levelIntervalRef = useRef(null);
  const startTimeRef = useRef(null);

  // ============================================
  // COMPUTED VALUES
  // ============================================
  
  const isSupported = isRecordingSupported();

  const isIdle = recordingState === RecordingState.IDLE;
  const isRecording = recordingState === RecordingState.RECORDING;
  const isPaused = recordingState === RecordingState.PAUSED;
  const isStopped = recordingState === RecordingState.STOPPED;
  const isCountingDown = recordingState === RecordingState.COUNTDOWN;
  const isRequestingPermission = recordingState === RecordingState.REQUESTING_PERMISSION;
  const hasError = recordingState === RecordingState.ERROR;

  // ============================================
  // CLEANUP FUNCTIONS
  // ============================================

  const cleanupIntervals = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
    if (levelIntervalRef.current) {
      clearInterval(levelIntervalRef.current);
      levelIntervalRef.current = null;
    }
  }, []);

  const cleanupMediaStream = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  }, []);

  const cleanupAudioUrl = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  }, [audioUrl]);

  // ============================================
  // AUDIO LEVEL MONITORING
  // ============================================

  const startLevelMonitoring = useCallback(() => {
    if (!analyserRef.current) return;

    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    levelIntervalRef.current = setInterval(() => {
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate average level
      const sum = dataArray.reduce((a, b) => a + b, 0);
      const average = sum / dataArray.length;
      const normalizedLevel = Math.min(average / 128, 1); // Normalize to 0-1
      
      setAudioLevel(normalizedLevel);
    }, 50); // Update every 50ms
  }, []);

  // ============================================
  // PERMISSION & INITIALIZATION
  // ============================================

  /**
   * Request microphone permission and initialize recorder
   */
  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      const err = new Error('Recording not supported in this browser');
      setError(err.message);
      setRecordingState(RecordingState.ERROR);
      onError?.(err);
      return false;
    }

    try {
      setRecordingState(RecordingState.REQUESTING_PERMISSION);
      setError(null);

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia(RECORDING_CONFIG.constraints);
      mediaStreamRef.current = stream;

      // Set up audio context for level monitoring
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Get quality settings
      const qualitySettings = getQualitySettings(quality);
      const mimeType = getBestMimeType();

      // Create MediaRecorder with optimal settings
      const options = {
        mimeType,
        audioBitsPerSecond: qualitySettings.audioBitsPerSecond,
      };

      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      // Handle data chunks
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        setAudioBlob(blob);
        setAudioUrl(url);
        setRecordingState(RecordingState.STOPPED);
        setAudioLevel(0);

        // Stop duration tracking
        cleanupIntervals();
        cleanupMediaStream();

        // Calculate final duration
        const finalDuration = startTimeRef.current 
          ? (Date.now() - startTimeRef.current) / 1000 
          : recordingDuration;

        // Callback with recording data
        onRecordingComplete?.({
          blob,
          url,
          duration: finalDuration,
          mimeType,
          size: blob.size,
          quality,
        });
      };

      // Handle errors
      recorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        const errorMessage = event.error?.message || 'Recording error occurred';
        setError(errorMessage);
        setRecordingState(RecordingState.ERROR);
        cleanupIntervals();
        cleanupMediaStream();
        onError?.(event.error);
      };

      return true;
    } catch (err) {
      console.error('Permission error:', err);
      const errorMessage = err.name === 'NotAllowedError' 
        ? 'Microphone permission denied. Please allow access to record.'
        : err.message || 'Failed to access microphone';
      
      setError(errorMessage);
      setRecordingState(RecordingState.ERROR);
      cleanupMediaStream();
      onError?.(err);
      return false;
    }
  }, [quality, isSupported, onRecordingComplete, onError, recordingDuration, cleanupIntervals, cleanupMediaStream]);

  // ============================================
  // RECORDING CONTROLS
  // ============================================

  /**
   * Start recording immediately (after countdown)
   */
  const startRecordingNow = useCallback(() => {
    if (!mediaRecorderRef.current) {
      setError('Recorder not initialized');
      return;
    }

    try {
      chunksRef.current = [];
      setRecordingDuration(0);
      startTimeRef.current = Date.now();
      
      mediaRecorderRef.current.start(100); // Collect data every 100ms
      setRecordingState(RecordingState.RECORDING);

      // Start duration tracking
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => {
          const newDuration = prev + 0.1;
          // Check max duration
          if (newDuration >= RECORDING_CONFIG.ui.maxRecordingDuration) {
            stopRecording();
          }
          return newDuration;
        });
      }, 100);

      // Start audio level monitoring
      startLevelMonitoring();
    } catch (err) {
      console.error('Start recording error:', err);
      setError(err.message);
      setRecordingState(RecordingState.ERROR);
      onError?.(err);
    }
  }, [startLevelMonitoring, onError]);

  /**
   * Start countdown before recording
   */
  const startCountdown = useCallback(() => {
    setRecordingState(RecordingState.COUNTDOWN);
    setCountdown(RECORDING_CONFIG.ui.countdownDuration);

    let count = RECORDING_CONFIG.ui.countdownDuration;
    
    countdownIntervalRef.current = setInterval(() => {
      count--;
      setCountdown(count);

      if (count <= 0) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
        startRecordingNow();
      }
    }, 1000);
  }, [startRecordingNow]);

  /**
   * Start recording (requests permission if needed, then countdown)
   */
  const startRecording = useCallback(async () => {
    cleanupAudioUrl();
    setAudioBlob(null);

    // Request permission if not already granted
    if (!mediaRecorderRef.current) {
      const granted = await requestPermission();
      if (!granted) return;
    }

    startCountdown();
  }, [requestPermission, startCountdown, cleanupAudioUrl]);

  /**
   * Start recording without countdown (immediate start)
   */
  const startRecordingImmediate = useCallback(async () => {
    cleanupAudioUrl();
    setAudioBlob(null);

    if (!mediaRecorderRef.current) {
      const granted = await requestPermission();
      if (!granted) return;
    }

    startRecordingNow();
  }, [requestPermission, startRecordingNow, cleanupAudioUrl]);

  /**
   * Pause recording
   */
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === RecordingState.RECORDING) {
      mediaRecorderRef.current.pause();
      setRecordingState(RecordingState.PAUSED);

      // Pause duration tracking
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
      // Pause level monitoring
      if (levelIntervalRef.current) {
        clearInterval(levelIntervalRef.current);
        levelIntervalRef.current = null;
      }
    }
  }, [recordingState]);

  /**
   * Resume recording
   */
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === RecordingState.PAUSED) {
      mediaRecorderRef.current.resume();
      setRecordingState(RecordingState.RECORDING);

      // Resume duration tracking
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 0.1);
      }, 100);

      // Resume level monitoring
      startLevelMonitoring();
    }
  }, [recordingState, startLevelMonitoring]);

  /**
   * Stop recording
   */
  const stopRecording = useCallback(() => {
    // Cancel countdown if active
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
      cleanupMediaStream();
      setRecordingState(RecordingState.IDLE);
      return;
    }

    if (mediaRecorderRef.current && 
        (recordingState === RecordingState.RECORDING || recordingState === RecordingState.PAUSED)) {
      mediaRecorderRef.current.stop();
    }
  }, [recordingState, cleanupMediaStream]);

  /**
   * Cancel and discard recording
   */
  const cancelRecording = useCallback(() => {
    cleanupIntervals();
    cleanupMediaStream();
    cleanupAudioUrl();

    if (mediaRecorderRef.current) {
      if (recordingState === RecordingState.RECORDING || recordingState === RecordingState.PAUSED) {
        try {
          mediaRecorderRef.current.stop();
        } catch (e) {
          // Ignore errors when stopping
        }
      }
      mediaRecorderRef.current = null;
    }

    chunksRef.current = [];
    setAudioBlob(null);
    setRecordingDuration(0);
    setCountdown(0);
    setRecordingState(RecordingState.IDLE);
    setError(null);
    setAudioLevel(0);
  }, [recordingState, cleanupIntervals, cleanupMediaStream, cleanupAudioUrl]);

  /**
   * Reset state after save/discard (for new recording)
   */
  const reset = useCallback(() => {
    cleanupAudioUrl();
    setAudioBlob(null);
    setRecordingDuration(0);
    setCountdown(0);
    setRecordingState(RecordingState.IDLE);
    setError(null);
    setAudioLevel(0);
    chunksRef.current = [];
    mediaRecorderRef.current = null;
  }, [cleanupAudioUrl]);

  // ============================================
  // CLEANUP ON UNMOUNT
  // ============================================

  useEffect(() => {
    return () => {
      cleanupIntervals();
      cleanupMediaStream();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [cleanupIntervals, cleanupMediaStream, audioUrl]);

  // ============================================
  // RETURN API
  // ============================================

  return {
    // State
    recordingState,
    recordingDuration,
    audioBlob,
    audioUrl,
    error,
    countdown,
    audioLevel,
    isSupported,

    // Computed state
    isIdle,
    isRecording,
    isPaused,
    isStopped,
    isCountingDown,
    isRequestingPermission,
    hasError,

    // Actions
    startRecording,
    startRecordingImmediate,
    pauseRecording,
    resumeRecording,
    stopRecording,
    cancelRecording,
    reset,
    requestPermission,
  };
}

export default useMediaRecorder;
