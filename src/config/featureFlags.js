/**
 * Feature Flags - Bass Academy
 * Runtime toggles for experimental features
 */

export const FEATURES = {
  // BassAI Vision - Gesture control via MediaPipe
  // OFF by default - opt-in feature
  VISION_ENABLED: import.meta.env.VITE_VISION_ENABLED === 'true',
  
  // Web Worker processing for vision (better performance)
  // Automatically disabled on iOS Safari < 16
  VISION_WORKERS: (() => {
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const iosVersion = isIOS 
      ? parseFloat(navigator.userAgent.match(/OS (\d+)_/)?.[1] || '0') 
      : null;
    
    // Disable workers on old iOS or if explicitly disabled
    if (isIOS && iosVersion && iosVersion < 16) return false;
    if (import.meta.env.VITE_VISION_WORKERS === 'false') return false;
    
    return typeof Worker !== 'undefined';
  })(),
  
  // Debug mode for vision - shows FPS, latency, landmarks
  VISION_DEBUG: import.meta.env.VITE_VISION_DEBUG === 'true'
};

// Feature check helper
export function isFeatureEnabled(featureName) {
  return FEATURES[featureName] ?? false;
}

export default FEATURES;
