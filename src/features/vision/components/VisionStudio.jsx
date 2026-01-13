/**
 * VisionStudio - BassAI Vision
 * Main container component for vision control feature
 */

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Camera, CameraOff, Bug, Eye, X } from 'lucide-react';
import { VisionProvider, useVisionContext } from '../context/VisionContext.jsx';
import { useHandTracking } from '../hooks/useHandTracking.js';
import { useGestureRecognizer } from '../hooks/useGestureRecognizer.js';
import { drawHandLandmarks, drawGestureIndicator, drawPerformanceStats, clearCanvas } from '../utils/drawingUtils.js';
import { GESTURE_MAP } from '../config/gesturePresets.js';
import GestureIndicator from './GestureIndicator.jsx';

function VisionStudioContent({ onGestureCommand, onClose }) {
  const { state, actions } = useVisionContext();
  const [isEnabled, setIsEnabled] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const canvasRef = useRef(null);
  
  // Hand tracking
  const { videoRef, isReady, error, status, fps, latency } = useHandTracking({
    enabled: isEnabled
  });
  
  // Gesture recognizer with command callback
  const { currentGesture, confidence, isHolding, holdProgress } = useGestureRecognizer({
    enabled: isEnabled && isReady,
    onGesture: useCallback((gesture, conf) => {
      if (onGestureCommand) {
        onGestureCommand(gesture, conf);
      }
    }, [onGestureCommand])
  });

  // Draw canvas overlay
  useEffect(() => {
    if (!canvasRef.current || !state.landmarks) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Sync canvas size with video
    if (videoRef.current) {
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
    }
    
    // Clear previous frame
    clearCanvas(ctx);
    
    // Draw landmarks if enabled
    if (state.showLandmarks) {
      drawHandLandmarks(ctx, state.landmarks, state.handedness);
    }
    
    // Draw gesture indicator
    if (currentGesture !== 'IDLE') {
      drawGestureIndicator(ctx, currentGesture, confidence, GESTURE_MAP[currentGesture]);
    }
    
    // Draw debug stats
    if (showDebug) {
      drawPerformanceStats(ctx, { 
        fps: state.fps, 
        latency: state.latency, 
        detectionTime: state.detectionTime 
      });
    }
    
  }, [state.landmarks, state.handedness, currentGesture, confidence, showDebug, state.showLandmarks, state.fps, state.latency, state.detectionTime, videoRef]);

  // Toggle vision
  const toggleVision = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[300px] bg-gray-900 rounded-lg overflow-hidden">
      {/* Hidden video element */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        playsInline
        muted
        style={{ 
          transform: 'scaleX(-1)', // Mirror
          opacity: isEnabled ? 0.3 : 0
        }}
      />
      
      {/* Canvas overlay for landmarks */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          transform: 'scaleX(-1)', // Mirror
          zIndex: 10 
        }}
      />
      
      {/* Gesture indicator overlay */}
      {isEnabled && (
        <GestureIndicator 
          gesture={currentGesture}
          confidence={confidence}
          isConfirmed={!isHolding && currentGesture !== 'IDLE'}
          holdProgress={holdProgress}
        />
      )}
      
      {/* Top controls */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 bg-gray-800/90 hover:bg-red-600/80 rounded-lg transition-all"
            title="Cerrar Vision"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        )}
        
        {/* Debug toggle */}
        <button
          onClick={() => setShowDebug(prev => !prev)}
          className={`p-2 rounded-lg transition-all ${
            showDebug ? 'bg-cyan-500' : 'bg-gray-800/90 hover:bg-gray-700'
          }`}
          title="Toggle Debug"
        >
          <Bug className="w-5 h-5 text-white" />
        </button>
        
        {/* Landmarks toggle */}
        <button
          onClick={() => actions.updateSettings({ showLandmarks: !state.showLandmarks })}
          className={`p-2 rounded-lg transition-all ${
            state.showLandmarks ? 'bg-cyan-500' : 'bg-gray-800/90 hover:bg-gray-700'
          }`}
          title="Toggle Landmarks"
        >
          <Eye className="w-5 h-5 text-white" />
        </button>
      </div>
      
      {/* Main toggle button - center */}
      {!isEnabled && (
        <div className="absolute inset-0 flex items-center justify-center z-15">
          <button
            onClick={toggleVision}
            className="flex flex-col items-center gap-3 p-8 bg-gray-800/80 hover:bg-cyan-600/80 rounded-2xl transition-all backdrop-blur-sm"
          >
            <Camera className="w-12 h-12 text-white" />
            <span className="text-white font-medium">Activar Vision Control</span>
            <span className="text-gray-400 text-sm">Controla con gestos de mano</span>
          </button>
        </div>
      )}
      
      {/* Status indicator */}
      {isEnabled && (
        <div className="absolute bottom-4 left-4 z-20">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-sm ${
            isReady ? 'bg-green-500/30' : 'bg-yellow-500/30'
          }`}>
            {isReady ? (
              <Camera className="w-4 h-4 text-green-400" />
            ) : (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span className="text-white text-sm">
              {status === 'ready' ? `${fps} FPS` : status}
            </span>
          </div>
        </div>
      )}
      
      {/* Deactivate button when active */}
      {isEnabled && (
        <div className="absolute bottom-4 right-4 z-20">
          <button
            onClick={toggleVision}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/80 hover:bg-red-600 rounded-lg transition-all"
          >
            <CameraOff className="w-4 h-4 text-white" />
            <span className="text-white text-sm">Desactivar</span>
          </button>
        </div>
      )}
      
      {/* Error display */}
      {error && (
        <div className="absolute top-16 left-4 right-4 z-30">
          <div className="bg-red-500/90 text-white px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        </div>
      )}
      
      {/* Gesture guide */}
      {isEnabled && isReady && !showDebug && (
        <div className="absolute top-16 left-4 z-20">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-300">
            <div className="font-medium text-white mb-2">Gestos disponibles:</div>
            <div className="space-y-1">
              <div>✋ Mano abierta = Play</div>
              <div>✊ Puño = Stop</div>
              <div>✌️ Paz = Pausa</div>
              <div>👍/👎 = Tempo ±5</div>
              <div>🤏 Pinza = Loop</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Wrapped with provider
export default function VisionStudio(props) {
  return (
    <VisionProvider>
      <VisionStudioContent {...props} />
    </VisionProvider>
  );
}
