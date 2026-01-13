/**
 * Vision Context - BassAI Vision
 * Global state management for vision feature
 */

import { createContext, useContext, useReducer, useMemo, useCallback } from 'react';

const VisionContext = createContext(null);

const initialState = {
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
    case 'SET_CAMERA_ACTIVE':
      return { ...state, isCameraActive: action.payload, cameraError: null };
    
    case 'SET_CAMERA_ERROR':
      return { ...state, cameraError: action.payload, isCameraActive: false };
    
    case 'SET_LANDMARKS':
      return {
        ...state,
        landmarks: action.payload.landmarks,
        handedness: action.payload.handedness,
        lastUpdate: Date.now()
      };
    
    case 'CLEAR_LANDMARKS':
      return { ...state, landmarks: null, handedness: null };
    
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
    
    case 'UPDATE_PERFORMANCE':
      return {
        ...state,
        fps: action.payload.fps ?? state.fps,
        latency: action.payload.latency ?? state.latency,
        detectionTime: action.payload.detectionTime ?? state.detectionTime
      };
    
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
    setCameraActive: (active) => 
      dispatch({ type: 'SET_CAMERA_ACTIVE', payload: active }),
    
    setCameraError: (error) => 
      dispatch({ type: 'SET_CAMERA_ERROR', payload: error }),
    
    setLandmarks: (landmarks, handedness) => 
      dispatch({ type: 'SET_LANDMARKS', payload: { landmarks, handedness } }),
    
    clearLandmarks: () => 
      dispatch({ type: 'CLEAR_LANDMARKS' }),
    
    setGesture: (gesture, confidence) => 
      dispatch({ type: 'SET_GESTURE', payload: { gesture, confidence } }),
    
    updatePerformance: (metrics) => 
      dispatch({ type: 'UPDATE_PERFORMANCE', payload: metrics }),
    
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
