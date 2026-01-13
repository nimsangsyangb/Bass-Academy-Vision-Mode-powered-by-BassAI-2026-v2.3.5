/**
 * useGestureRecognizer - BassAI Vision
 * Recognizes gestures from landmarks and triggers commands
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { useVisionContext } from '../context/VisionContext.jsx';
import { detectGesture } from '../utils/gestureCalculations.js';
import { movingAverageFilter } from '../utils/smoothingFilters.js';
import { VISION_CONFIG } from '../config/visionConfig.js';

export function useGestureRecognizer({ 
  enabled = true,
  onGesture = null,
  smoothingWindow = 5,
  holdTimeMs = VISION_CONFIG.DETECTION.GESTURE_HOLD_TIME_MS,
  pinchHoldTimeMs = VISION_CONFIG.DETECTION.PINCH_HOLD_TIME_MS || 700
}) {
  const { state, actions } = useVisionContext();
  
  // Hold progress for charging ring (0-1)
  const [holdProgress, setHoldProgress] = useState(0);
  
  // Gesture history for temporal smoothing
  const historyRef = useRef({
    gestures: [],
    confidences: [],
    holdStartTime: null,
    lastConfirmedGesture: 'IDLE',
    currentHoldGesture: null
  });
  
  // Metrics tracking (ready for future logging)
  const metricsRef = useRef({
    gestureAborts: 0,        // Started but not confirmed
    confirmedGestures: 0,    // Successfully executed
    holdTimes: [],           // Array of successful hold durations
    sessionStart: Date.now()
  });

  // Process landmarks and detect gesture
  const recognizeGesture = useCallback(() => {
    if (!enabled || !state.landmarks) {
      // Clear gesture if no landmarks
      if (state.currentGesture !== 'IDLE') {
        actions.setGesture('IDLE', 0);
        historyRef.current.holdStartTime = null;
        setHoldProgress(0);
      }
      return;
    }

    // Detect current frame gesture
    const { gesture, confidence } = detectGesture(state.landmarks);
    const history = historyRef.current;
    
    // Add to history
    history.gestures.push(gesture);
    history.confidences.push(confidence);
    
    // Keep history bounded
    if (history.gestures.length > smoothingWindow) {
      history.gestures.shift();
      history.confidences.shift();
    }
    
    // Find most common gesture in window
    const gestureCount = {};
    history.gestures.forEach(g => {
      gestureCount[g] = (gestureCount[g] || 0) + 1;
    });
    
    let dominantGesture = 'IDLE';
    let maxCount = 0;
    for (const [g, count] of Object.entries(gestureCount)) {
      if (count > maxCount) {
        maxCount = count;
        dominantGesture = g;
      }
    }
    
    // Calculate smoothed confidence
    const avgConfidence = movingAverageFilter(history.confidences);
    
    // Check if gesture should be confirmed (held long enough)
    const now = Date.now();
    
    if (dominantGesture !== 'IDLE' && avgConfidence >= VISION_CONFIG.DETECTION.GESTURE_CONFIDENCE_THRESHOLD) {
      // Check hold time
      if (dominantGesture !== history.lastConfirmedGesture) {
        // New gesture detected, start hold timer
        if (!history.holdStartTime || dominantGesture !== history.currentHoldGesture) {
          // Track abort if we were holding a different gesture
          if (history.holdStartTime && history.currentHoldGesture) {
            metricsRef.current.gestureAborts++;
          }
          history.holdStartTime = now;
          history.currentHoldGesture = dominantGesture;
        }
        
        const holdDuration = now - history.holdStartTime;
        
        // Pinch needs longer hold time (more prone to false positives)
        const requiredHoldTime = dominantGesture === 'PINCH' ? pinchHoldTimeMs : holdTimeMs;
        
        // Calculate progress for charging ring (0-1)
        const progress = Math.min(holdDuration / requiredHoldTime, 1);
        setHoldProgress(progress);
        
        if (holdDuration >= requiredHoldTime) {
          // Gesture held long enough - confirm it
          history.lastConfirmedGesture = dominantGesture;
          actions.setGesture(dominantGesture, avgConfidence);
          
          // Track metrics
          metricsRef.current.confirmedGestures++;
          metricsRef.current.holdTimes.push(holdDuration);
          
          // Trigger callback
          if (onGesture) {
            onGesture(dominantGesture, avgConfidence);
          }
          
          // Reset hold timer for next gesture
          history.holdStartTime = null;
          history.currentHoldGesture = null;
          setHoldProgress(0);
        } else {
          // Still holding - update state but don't confirm
          actions.setGesture(dominantGesture, avgConfidence);
        }
      }
    } else {
      // No confident gesture - reset
      // Track abort if we were in the middle of holding
      if (history.holdStartTime && history.currentHoldGesture) {
        metricsRef.current.gestureAborts++;
      }
      
      if (state.currentGesture !== 'IDLE') {
        actions.setGesture('IDLE', 0);
      }
      history.holdStartTime = null;
      history.currentHoldGesture = null;
      history.lastConfirmedGesture = 'IDLE';
      setHoldProgress(0);
    }

  }, [enabled, state.landmarks, state.currentGesture, smoothingWindow, holdTimeMs, pinchHoldTimeMs, actions, onGesture]);

  // Run recognition on each landmarks update
  useEffect(() => {
    recognizeGesture();
  }, [state.landmarks, recognizeGesture]);

  // Reset on disable
  useEffect(() => {
    if (!enabled) {
      historyRef.current = {
        gestures: [],
        confidences: [],
        holdStartTime: null,
        lastConfirmedGesture: 'IDLE',
        currentHoldGesture: null
      };
      actions.setGesture('IDLE', 0);
      setHoldProgress(0);
    }
  }, [enabled, actions]);

  // Get metrics (for future logging/analytics)
  const getMetrics = useCallback(() => {
    const m = metricsRef.current;
    const avgHoldTime = m.holdTimes.length > 0 
      ? m.holdTimes.reduce((a, b) => a + b, 0) / m.holdTimes.length 
      : 0;
    
    return {
      gestureAborts: m.gestureAborts,
      confirmedGestures: m.confirmedGestures,
      avgHoldTimeMs: Math.round(avgHoldTime),
      abortRate: m.confirmedGestures > 0 
        ? (m.gestureAborts / (m.gestureAborts + m.confirmedGestures) * 100).toFixed(1) + '%'
        : '0%',
      sessionDurationMs: Date.now() - m.sessionStart
    };
  }, []);

  return {
    currentGesture: state.currentGesture,
    confidence: state.gestureConfidence,
    isHolding: historyRef.current.holdStartTime !== null,
    holdProgress,  // 0-1 for charging ring
    getMetrics     // Function to get session metrics
  };
}

export default useGestureRecognizer;

