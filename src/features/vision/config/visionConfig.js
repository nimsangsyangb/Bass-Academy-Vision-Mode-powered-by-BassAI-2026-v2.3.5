/**
 * Vision Configuration - BassAI Vision
 * MediaPipe settings and performance budgets
 */

export const VISION_CONFIG = {
  // MediaPipe Hand Landmarker Settings
  MODEL: {
    BASE_URL: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm',
    ASSET_PATH: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
    DELEGATE: 'GPU', // 'GPU' | 'CPU'
    NUM_HANDS: 1,     // Single hand for v1
    RUNNING_MODE: 'VIDEO'
  },

  // Detection Thresholds
  DETECTION: {
    MIN_DETECTION_CONFIDENCE: 0.5,
    MIN_PRESENCE_CONFIDENCE: 0.5,
    MIN_TRACKING_CONFIDENCE: 0.5,
    GESTURE_CONFIDENCE_THRESHOLD: 0.7,
    GESTURE_HOLD_TIME_MS: 500, // 500ms hold to confirm gesture (prevents false positives)
    PINCH_HOLD_TIME_MS: 700   // Pinch needs longer hold - more prone to false positives
  },

  // Performance Budgets
  PERFORMANCE: {
    TARGET_FPS: 30,
    MIN_FPS: 20,
    MAX_DETECTION_TIME_MS: 33, // ~30fps budget
    MAX_FRAME_SKIP: 3,
    COOLDOWN_BETWEEN_GESTURES_MS: 800
  },

  // Camera Settings
  CAMERA: {
    FACING_MODE: 'user',
    WIDTH: { ideal: 640, max: 1280 },
    HEIGHT: { ideal: 480, max: 720 },
    FRAME_RATE: { ideal: 30, max: 30 }
  },

  // UI Settings
  UI: {
    SHOW_LANDMARKS: true,
    MIRROR_CAMERA: true,
    CANVAS_OPACITY: 0.9,
    LANDMARK_COLOR_RIGHT: '#00FFFF', // Cyan
    LANDMARK_COLOR_LEFT: '#FF00FF',  // Magenta
    JOINT_COLOR: '#FFFFFF'
  },

  // Smoothing (Kalman filter params)
  SMOOTHING: {
    ENABLED: true,
    WINDOW_SIZE: 5,
    KALMAN_Q: 0.001, // Process noise
    KALMAN_R: 0.01   // Measurement noise
  }
};

export default VISION_CONFIG;
