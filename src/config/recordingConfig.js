/**
 * Recording Configuration - Bass Academy
 * Audio recording settings, quality presets, and constraints
 * 
 * @module recordingConfig
 */

// ============================================
// RECORDING CONFIGURATION
// ============================================

export const RECORDING_CONFIG = {
  // Audio quality presets
  quality: {
    LOW: {
      mimeType: 'audio/webm;codecs=opus',
      audioBitsPerSecond: 64000, // 64 kbps
      sampleRate: 24000,
      label: 'Low Quality (64 kbps)',
      description: 'Smaller files, acceptable quality',
    },
    MEDIUM: {
      mimeType: 'audio/webm;codecs=opus',
      audioBitsPerSecond: 128000, // 128 kbps
      sampleRate: 48000,
      label: 'Standard (128 kbps)',
      description: 'Balanced quality and size',
    },
    HIGH: {
      mimeType: 'audio/webm;codecs=opus',
      audioBitsPerSecond: 192000, // 192 kbps
      sampleRate: 48000,
      label: 'High Quality (192 kbps)',
      description: 'Best quality, larger files',
    },
  },

  // Default quality preset
  defaultQuality: 'MEDIUM',

  // Storage limits
  storage: {
    maxRecordingSize: 50 * 1024 * 1024, // 50 MB per recording
    maxTotalSize: 500 * 1024 * 1024, // 500 MB total storage
    maxRecordings: 100, // Maximum number of stored recordings
    warningThreshold: 0.8, // Warn at 80% capacity
  },

  // Microphone constraints
  constraints: {
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      channelCount: 1, // Mono recording
    },
  },

  // UI settings
  ui: {
    countdownDuration: 3, // Seconds before recording starts
    showWaveformDuringRecording: true,
    autoSaveOnStop: false, // Prompt user to save
    waveformResolution: 1000, // Number of bars in waveform visualization
    maxRecordingDuration: 600, // 10 minutes max per recording
  },

  // Export formats (for future export feature)
  exportFormats: [
    { id: 'webm', label: 'WebM (Opus)', extension: 'webm', mimeType: 'audio/webm' },
    { id: 'wav', label: 'WAV (Uncompressed)', extension: 'wav', mimeType: 'audio/wav' },
  ],

  // Analysis settings
  analysis: {
    enabled: true,
    detectTiming: true,
    detectPitch: false, // Future feature
    minNoteConfidence: 0.7,
    fftSize: 2048,
  },
};

// ============================================
// SUPPORTED MIME TYPES
// ============================================

/**
 * Supported MIME types in order of preference
 * MediaRecorder will use the first supported type
 */
export const SUPPORTED_MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/ogg;codecs=opus',
  'audio/ogg',
  'audio/mp4',
];

// ============================================
// RECORDING STATES
// ============================================

export const RecordingState = {
  IDLE: 'idle',
  REQUESTING_PERMISSION: 'requesting_permission',
  COUNTDOWN: 'countdown',
  RECORDING: 'recording',
  PAUSED: 'paused',
  STOPPED: 'stopped',
  ERROR: 'error',
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get the best supported MIME type for current browser
 * @returns {string} Best supported MIME type
 */
export function getBestMimeType() {
  if (typeof MediaRecorder === 'undefined') {
    return 'audio/webm';
  }
  
  for (const mimeType of SUPPORTED_MIME_TYPES) {
    if (MediaRecorder.isTypeSupported(mimeType)) {
      return mimeType;
    }
  }
  return 'audio/webm'; // Fallback
}

/**
 * Check if recording is supported in current browser
 * @returns {boolean} True if MediaRecorder API is available
 */
export function isRecordingSupported() {
  return !!(
    typeof navigator !== 'undefined' &&
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia &&
    typeof MediaRecorder !== 'undefined'
  );
}

/**
 * Format file size to human-readable string
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size (e.g., "1.5 MB")
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

/**
 * Format duration to MM:SS or HH:MM:SS
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
export function formatDuration(seconds) {
  // Handle invalid values
  if (seconds === undefined || seconds === null || isNaN(seconds) || !isFinite(seconds) || seconds < 0) {
    return '0:00';
  }
  
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Generate a default name for a recording
 * @param {Object} exercise - Current exercise context
 * @returns {string} Generated name
 */
export function generateRecordingName(exercise = {}) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  
  if (exercise.patternId) {
    return `${exercise.rootNote || ''} ${exercise.patternId} - ${dateStr}`.trim();
  }
  
  return `Recording - ${dateStr}`;
}

/**
 * Get quality settings by name
 * @param {string} qualityName - Quality preset name
 * @returns {Object} Quality configuration
 */
export function getQualitySettings(qualityName = 'MEDIUM') {
  return RECORDING_CONFIG.quality[qualityName] || RECORDING_CONFIG.quality.MEDIUM;
}

export default RECORDING_CONFIG;
