/**
 * Vision Logger - BassAI Vision
 * Minimal internal logging (no UI, no external analytics)
 * 
 * Logs only to console in development mode.
 * Silent in production unless explicitly enabled.
 */

const PREFIX = '[BassAI Vision]';

// Only log in development or if VISION_DEBUG is enabled
const shouldLog = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.DEV || import.meta.env.VITE_VISION_DEBUG === 'true';
  }
  return process.env.NODE_ENV === 'development';
};

/**
 * Log gesture recognized (confirmed after hold time)
 * @param {string} gesture - Gesture ID
 * @param {number} confidence - Confidence 0-1
 * @param {number} holdTimeMs - Actual hold duration in ms
 */
export function logGestureRecognized(gesture, confidence, holdTimeMs) {
  if (!shouldLog()) return;
  console.log(
    `${PREFIX} ✓ GESTURE_RECOGNIZED: ${gesture}`,
    `| confidence: ${(confidence * 100).toFixed(1)}%`,
    `| holdTime: ${holdTimeMs}ms`
  );
}

/**
 * Log actual hold time when gesture is confirmed
 * @param {string} gesture - Gesture ID
 * @param {number} holdTimeMs - Actual hold duration
 * @param {number} requiredMs - Required hold time
 */
export function logHoldTime(gesture, holdTimeMs, requiredMs) {
  if (!shouldLog()) return;
  console.log(
    `${PREFIX} ⏱ HOLD_TIME: ${gesture}`,
    `| actual: ${holdTimeMs}ms`,
    `| required: ${requiredMs}ms`,
    `| delta: +${holdTimeMs - requiredMs}ms`
  );
}

/**
 * Log UI state change (opened/closed)
 * @param {boolean} isOpen - True if UI opened, false if closed
 * @param {boolean} engineStillRunning - True if vision engine continues running
 */
export function logUIState(isOpen, engineStillRunning = null) {
  if (!shouldLog()) return;
  const state = isOpen ? 'OPENED' : 'CLOSED';
  const engineNote = engineStillRunning !== null 
    ? ` | engine: ${engineStillRunning ? 'running' : 'stopped'}`
    : '';
  console.log(`${PREFIX} 🎛 UI_${state}${engineNote}`);
}

/**
 * Log gesture aborted (started holding but released/changed before confirmation)
 * @param {string} gesture - Gesture that was being held
 * @param {number} holdTimeMs - How long it was held before abort
 * @param {string} reason - Abort reason: 'released' | 'changed' | 'lost_tracking'
 */
export function logGestureAborted(gesture, holdTimeMs, reason = 'released') {
  if (!shouldLog()) return;
  console.log(
    `${PREFIX} ✗ GESTURE_ABORTED: ${gesture}`,
    `| heldFor: ${holdTimeMs}ms`,
    `| reason: ${reason}`
  );
}

/**
 * Log vision engine state change
 * @param {boolean} enabled - True if engine started, false if stopped
 */
export function logEngineState(enabled) {
  if (!shouldLog()) return;
  const state = enabled ? 'ENABLED' : 'DISABLED';
  console.log(`${PREFIX} ⚡ ENGINE_${state}`);
}

export default {
  logGestureRecognized,
  logHoldTime,
  logUIState,
  logGestureAborted,
  logEngineState
};
