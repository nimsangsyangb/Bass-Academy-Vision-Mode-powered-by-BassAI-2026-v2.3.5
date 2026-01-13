/**
 * Vision Context - BassAI Vision
 * Global state management for vision feature
 * 
 * KEY ARCHITECTURE:
 * - visionEnabled: Engine state (camera + tracking running)
 * - visionUIOpen: UI state (panel visible)
 * These are SEPARATE. Closing UI ≠ stopping engine.
 */

import { createContext, useContext, useReducer, useMemo } from 'react';
import { logUIState, logEngineState } from '../utils/visionLogger.js';

const VisionContext = createContext(null);

const initialState = {
  // Engine State (motor)
  visionEnabled: false,    // Is MediaPipe/camera running?
  visionUIOpen: false,     // Is the panel visible?
  drawingEnabled: true,    // Should we draw landmarks? (can reduce when UI closed)
  
  // Camera
  isCameraActive: false,
  cameraError: null,
  
  // Hand Tracking
  landmarks: null,
  handedness: null, // 'Left' | 'Right'
  
  // Gestures
  currentGesture: 'IDLE',
  gestureConfidence: 0,
  gestureHistory: [], // Last 10 gestures for smoothing
  
  // Performance
  fps: 0,
  latency: 0,
  detectionTime: 0,
  
  // Settings
  sensitivity: 0.7,
  smoothing: 0.3,
  showLandmarks: true,
  debugMode: false
};

function visionReducer(state, action) {
  switch (action.type) {
    // Engine control (motor)
    case 'ENABLE_VISION':
      logEngineState(true);
      logUIState(true, true);
      return { ...state, visionEnabled: true, visionUIOpen: true };
    
    case 'DISABLE_VISION':
      logEngineState(false);
      logUIState(false, false);
      return { 
        ...state, 
        visionEnabled: false, 
        visionUIOpen: false,
        isCameraActive: false,
        landmarks: null,
        handedness: null,
        currentGesture: 'IDLE'
      };
    
    // UI control (panel)
    case 'OPEN_VISION_UI':
      logUIState(true, state.visionEnabled);
      return { ...state, visionUIOpen: true, drawingEnabled: true };
    
    case 'CLOSE_VISION_UI':
      // IMPORTANT: Only closes UI, does NOT stop engine
      logUIState(false, state.visionEnabled);
      return { ...state, visionUIOpen: false, drawingEnabled: false };
    
    case 'SET_DRAWING_ENABLED':
      return { ...state, drawingEnabled: action.payload };
    
    // Camera
    case 'SET_CAMERA_ACTIVE':
      return { ...state, isCameraActive: action.payload, cameraError: null };
    
    case 'SET_CAMERA_ERROR':
      return { ...state, cameraError: action.payload, isCameraActive: false };
    
    // Landmarks
    case 'SET_LANDMARKS':
      return {
        ...state,
        landmarks: action.payload.landmarks,
        handedness: action.payload.handedness,
        lastUpdate: Date.now()
      };
    
    case 'CLEAR_LANDMARKS':
      return { ...state, landmarks: null, handedness: null };
    
    // Gestures
    case 'SET_GESTURE':
      return {
        ...state,
        currentGesture: action.payload.gesture,
        gestureConfidence: action.payload.confidence,
        gestureHistory: [
          ...state.gestureHistory.slice(-9),
          { gesture: action.payload.gesture, time: Date.now() }
        ]
      };
    
    // Performance
    case 'UPDATE_PERFORMANCE':
      return {
        ...state,
        fps: action.payload.fps ?? state.fps,
        latency: action.payload.latency ?? state.latency,
        detectionTime: action.payload.detectionTime ?? state.detectionTime
      };
    
    // Settings
    case 'UPDATE_SETTINGS':
      return { ...state, ...action.payload };
    
    case 'RESET':
      return { ...initialState };
    
    default:
      return state;
  }
}

export function VisionProvider({ children }) {
  const [state, dispatch] = useReducer(visionReducer, initialState);
  
  // Memoized actions
  const actions = useMemo(() => ({
    // Engine control
    enableVision: () => 
      dispatch({ type: 'ENABLE_VISION' }),
    
    disableVision: () => 
      dispatch({ type: 'DISABLE_VISION' }),
    
    // UI control (separate from engine!)
    openVisionUI: () => 
      dispatch({ type: 'OPEN_VISION_UI' }),
    
    closeVisionUI: () => 
      dispatch({ type: 'CLOSE_VISION_UI' }),
    
    setDrawingEnabled: (enabled) => 
      dispatch({ type: 'SET_DRAWING_ENABLED', payload: enabled }),
    
    // Camera
    setCameraActive: (active) => 
      dispatch({ type: 'SET_CAMERA_ACTIVE', payload: active }),
    
    setCameraError: (error) => 
      dispatch({ type: 'SET_CAMERA_ERROR', payload: error }),
    
    // Landmarks
    setLandmarks: (landmarks, handedness) => 
      dispatch({ type: 'SET_LANDMARKS', payload: { landmarks, handedness } }),
    
    clearLandmarks: () => 
      dispatch({ type: 'CLEAR_LANDMARKS' }),
    
    // Gestures
    setGesture: (gesture, confidence) => 
      dispatch({ type: 'SET_GESTURE', payload: { gesture, confidence } }),
    
    // Performance
    updatePerformance: (metrics) => 
      dispatch({ type: 'UPDATE_PERFORMANCE', payload: metrics }),
    
    // Settings
    updateSettings: (settings) => 
      dispatch({ type: 'UPDATE_SETTINGS', payload: settings }),
    
    reset: () => 
      dispatch({ type: 'RESET' })
  }), []);
  
  const value = useMemo(() => ({ state, actions }), [state, actions]);
  
  return (
    <VisionContext.Provider value={value}>
      {children}
    </VisionContext.Provider>
  );
}

export function useVisionContext() {
  const context = useContext(VisionContext);
  if (!context) {
    throw new Error('useVisionContext must be used within VisionProvider');
  }
  return context;
}

export default VisionContext;

