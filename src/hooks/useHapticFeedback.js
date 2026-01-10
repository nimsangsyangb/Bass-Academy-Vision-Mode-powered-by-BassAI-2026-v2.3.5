/**
 * useHapticFeedback Hook - Bass Academy
 * Provides haptic feedback (vibration) for key events
 * 
 * Respects prefers-reduced-motion and gracefully degrades on unsupported devices
 * 
 * @module useHapticFeedback
 */

import { useCallback, useMemo } from 'react';

// Vibration patterns (in milliseconds)
const VIBRATION_PATTERNS = {
  // Short pulse for play action
  play: [30],
  // Double pulse for stop action
  stop: [20, 40, 20],
  // Quick tap for loop restart
  loopRestart: [15],
  // Triple pulse pattern for countdown ticks
  countdown: [25, 50, 25],
  // Final countdown beat (stronger)
  countdownFinal: [50],
  // Long-short-long for errors
  error: [100, 50, 100],
  // Subtle tap for button press
  buttonTap: [10],
};

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/**
 * Check if vibration API is supported
 * @returns {boolean}
 */
function isVibrationSupported() {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator;
}

/**
 * useHapticFeedback Hook
 * Provides methods for different haptic feedback patterns
 * 
 * @returns {Object} Haptic feedback methods
 */
export function useHapticFeedback() {
  // Memoize support check
  const isSupported = useMemo(() => isVibrationSupported(), []);
  
  /**
   * Core vibrate function with safety checks
   * @param {number|number[]} pattern - Vibration pattern
   */
  const vibrate = useCallback((pattern) => {
    // Skip if reduced motion preferred or not supported
    if (prefersReducedMotion() || !isSupported) return;
    
    try {
      navigator.vibrate(pattern);
    } catch (error) {
      // Silently fail - vibration is enhancement only
      console.debug('[Haptic] Vibration failed:', error);
    }
  }, [isSupported]);
  
  // Exposed haptic methods
  const vibratePlay = useCallback(() => {
    vibrate(VIBRATION_PATTERNS.play);
  }, [vibrate]);
  
  const vibrateStop = useCallback(() => {
    vibrate(VIBRATION_PATTERNS.stop);
  }, [vibrate]);
  
  const vibrateLoopRestart = useCallback(() => {
    vibrate(VIBRATION_PATTERNS.loopRestart);
  }, [vibrate]);
  
  const vibrateCountdown = useCallback((isFinal = false) => {
    vibrate(isFinal ? VIBRATION_PATTERNS.countdownFinal : VIBRATION_PATTERNS.countdown);
  }, [vibrate]);
  
  const vibrateError = useCallback(() => {
    vibrate(VIBRATION_PATTERNS.error);
  }, [vibrate]);
  
  const vibrateButtonTap = useCallback(() => {
    vibrate(VIBRATION_PATTERNS.buttonTap);
  }, [vibrate]);
  
  return {
    isSupported,
    vibratePlay,
    vibrateStop,
    vibrateLoopRestart,
    vibrateCountdown,
    vibrateError,
    vibrateButtonTap,
  };
}

export default useHapticFeedback;
