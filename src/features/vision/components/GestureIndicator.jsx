/**
 * GestureIndicator - BassAI Vision
 * Full-screen feedback when gesture is confirmed
 * Shows charging ring during hold time
 */

import React, { useEffect, useState } from 'react';
import { GESTURE_MAP } from '../config/gesturePresets.js';
import { VISION_CONFIG } from '../config/visionConfig.js';

export default function GestureIndicator({ 
  gesture, 
  confidence, 
  isConfirmed,
  holdProgress = 0  // 0-1, charging ring progress
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const gestureInfo = GESTURE_MAP[gesture];
  
  // Animate on confirmed gesture
  useEffect(() => {
    if (isConfirmed && gesture !== 'IDLE') {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [gesture, isConfirmed]);

  if (gesture === 'IDLE' || confidence < VISION_CONFIG.DETECTION.GESTURE_CONFIDENCE_THRESHOLD) {
    return null;
  }

  // Use holdProgress for the ring (shows charging state)
  const ringProgress = isConfirmed ? 1 : holdProgress;
  const isCharging = !isConfirmed && holdProgress > 0 && holdProgress < 1;

  return (
    <div
      className={`
        fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
        z-50 pointer-events-none
        transition-all duration-300 ease-out
        ${isAnimating ? 'scale-125 opacity-100' : 'scale-100 opacity-80'}
      `}
    >
      {/* Circular progress (charging ring) */}
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          {/* Progress/charging circle */}
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke={isCharging ? '#FFFFFF' : (gestureInfo?.color || '#00FFFF')}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 56}`}
            strokeDashoffset={`${2 * Math.PI * 56 * (1 - ringProgress)}`}
            className={isCharging ? '' : 'transition-all duration-200'}
            style={{ 
              filter: `drop-shadow(0 0 ${isCharging ? '5' : '10'}px ${isCharging ? '#FFFFFF' : (gestureInfo?.color || '#00FFFF')})`,
              opacity: isCharging ? 0.8 : 1
            }}
          />
        </svg>

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div 
              className={`text-6xl mb-1 drop-shadow-lg transition-transform ${isCharging ? 'scale-90' : 'scale-100'}`}
              style={{ filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.5))' }}
            >
              {gestureInfo?.icon || '👋'}
            </div>
            <div className={`text-xs font-bold rounded px-2 ${isCharging ? 'bg-white/30 text-white' : 'bg-black/50 text-white'}`}>
              {isCharging ? `${Math.round(holdProgress * 100)}%` : `${Math.round(confidence * 100)}%`}
            </div>
          </div>
        </div>
      </div>

      {/* Gesture name - only on confirm */}
      {isConfirmed && (
        <div 
          className="mt-4 text-center backdrop-blur-sm rounded-lg px-4 py-2 animate-fadeInUp"
          style={{ 
            backgroundColor: `${gestureInfo?.color}20`,
            borderColor: gestureInfo?.color,
            borderWidth: 2,
            borderStyle: 'solid'
          }}
        >
          <p className="text-white font-bold">{gestureInfo?.name}</p>
          <p className="text-gray-300 text-xs mt-1">{gestureInfo?.description}</p>
        </div>
      )}

      {/* Charging hint - subtle text while charging */}
      {isCharging && (
        <div className="mt-2 text-center">
          <p className="text-white/60 text-xs">Mantén el gesto...</p>
        </div>
      )}
    </div>
  );
}

