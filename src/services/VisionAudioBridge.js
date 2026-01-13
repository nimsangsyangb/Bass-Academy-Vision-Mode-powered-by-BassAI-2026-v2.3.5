/**
 * Vision Audio Bridge - BassAI Vision
 * Translates gestures into BassTrainer commands
 * 
 * Architecture: Vision → commands → BassTrainer → AudioService
 * This service does NOT call AudioService directly
 */

import { GESTURE_MAP } from '../features/vision/config/gesturePresets.js';
import { VISION_CONFIG } from '../features/vision/config/visionConfig.js';

export class VisionAudioBridge {
  constructor(commandHandlers = {}) {
    // Command handlers (injected by BassTrainer)
    this.handlers = commandHandlers;
    
    // Cooldown tracking per gesture
    this.lastCommandTime = {};
    this.COOLDOWN_MS = VISION_CONFIG.PERFORMANCE.COOLDOWN_BETWEEN_GESTURES_MS;
    
    // Event listeners
    this.listeners = new Map();
    
    // Debug mode
    this.debug = false;
  }

  /**
   * Register command handlers from BassTrainer
   */
  setHandlers(handlers) {
    this.handlers = { ...this.handlers, ...handlers };
  }

  /**
   * Execute gesture command with validation
   * @param {string} gesture - Gesture ID (OPEN_HAND, CLOSED_FIST, etc.)
   * @param {number} confidence - Detection confidence (0-1)
   * @returns {Object} Result with success status
   */
  executeGesture(gesture, confidence) {
    // Validate confidence threshold
    if (confidence < VISION_CONFIG.DETECTION.GESTURE_CONFIDENCE_THRESHOLD) {
      return { success: false, reason: 'low_confidence', confidence };
    }
    
    // Check cooldown
    const now = Date.now();
    const lastTime = this.lastCommandTime[gesture] || 0;
    
    if (now - lastTime < this.COOLDOWN_MS) {
      return { success: false, reason: 'cooldown', remainingMs: this.COOLDOWN_MS - (now - lastTime) };
    }
    
    // Get gesture info
    const gestureInfo = GESTURE_MAP[gesture];
    if (!gestureInfo) {
      return { success: false, reason: 'unknown_gesture', gesture };
    }
    
    // Get handler for this gesture's command
    const handler = this.handlers[gestureInfo.audioCommand];
    if (!handler) {
      if (this.debug) {
        console.warn(`[VisionBridge] No handler for command: ${gestureInfo.audioCommand}`);
      }
      return { success: false, reason: 'no_handler', command: gestureInfo.audioCommand };
    }
    
    // Execute command
    try {
      this.lastCommandTime[gesture] = now;
      const result = handler();
      
      // Notify listeners
      this._notifyListeners({
        gesture,
        command: gestureInfo.audioCommand,
        confidence,
        timestamp: now,
        success: true
      });
      
      if (this.debug) {
        console.log(`[VisionBridge] ${gesture} → ${gestureInfo.audioCommand}`, result);
      }
      
      return { 
        success: true, 
        gesture, 
        command: gestureInfo.audioCommand,
        icon: gestureInfo.icon 
      };
      
    } catch (error) {
      console.error('[VisionBridge] Command execution failed:', error);
      return { success: false, reason: 'execution_error', error: error.message };
    }
  }

  /**
   * Subscribe to gesture events
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribe from gesture events
   */
  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const callbacks = this.listeners.get(event);
    this.listeners.set(event, callbacks.filter(cb => cb !== callback));
  }

  /**
   * Notify all listeners
   */
  _notifyListeners(data) {
    const callbacks = this.listeners.get('gesture') || [];
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('[VisionBridge] Listener error:', error);
      }
    });
  }

  /**
   * Reset cooldowns (useful for testing)
   */
  resetCooldowns() {
    this.lastCommandTime = {};
  }

  /**
   * Enable/disable debug logging
   */
  setDebug(enabled) {
    this.debug = enabled;
  }
}

// Singleton instance
export const visionBridge = new VisionAudioBridge();

export default VisionAudioBridge;
