/**
 * Vision Feature - Public Exports
 */

// Components
export { default as VisionStudio } from './components/VisionStudio.jsx';
export { default as GestureIndicator } from './components/GestureIndicator.jsx';

// Hooks
export { useHandTracking } from './hooks/useHandTracking.js';
export { useGestureRecognizer } from './hooks/useGestureRecognizer.js';

// Context
export { VisionProvider, useVisionContext } from './context/VisionContext.jsx';

// Config
export { VISION_CONFIG } from './config/visionConfig.js';
export { GESTURE_PRESETS, GESTURE_MAP, getGestureInfo } from './config/gesturePresets.js';

// Utils
export { detectGesture, LANDMARKS } from './utils/gestureCalculations.js';
export * from './utils/smoothingFilters.js';
export * from './utils/drawingUtils.js';
