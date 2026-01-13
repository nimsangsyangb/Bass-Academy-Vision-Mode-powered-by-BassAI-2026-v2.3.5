/**
 * useHandTracking - BassAI Vision
 * Core hook for MediaPipe hand tracking with Web Worker support
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { useVisionContext } from '../context/VisionContext.jsx';
import { VISION_CONFIG } from '../config/visionConfig.js';
import { FEATURES } from '../../../config/featureFlags.js';
import { LandmarkSmoother } from '../utils/smoothingFilters.js';

export function useHandTracking({ 
  enabled = false 
}) {
  const { state, actions } = useVisionContext();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const landmarkerRef = useRef(null);
  const workerRef = useRef(null);
  const rafIdRef = useRef(null);
  const smootherRef = useRef(new LandmarkSmoother());
  
  // Performance tracking
  const statsRef = useRef({
    frameCount: 0,
    startTime: performance.now(),
    lastFrameTime: 0
  });

  // Use worker if supported and enabled
  const useWorker = FEATURES.VISION_WORKERS;

  // Initialize camera
  const startCamera = useCallback(async () => {
    if (!videoRef.current) return null;
    
    try {
      setStatus('requesting_camera');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: VISION_CONFIG.CAMERA,
        audio: false
      });
      
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      
      actions.setCameraActive(true);
      setStatus('camera_ready');
      
      return stream;
      
    } catch (err) {
      setError(`Camera error: ${err.message}`);
      actions.setCameraError(err.message);
      return null;
    }
  }, [actions]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    actions.setCameraActive(false);
    actions.clearLandmarks();
  }, [actions]);

  // Initialize MediaPipe (main thread fallback)
  const initMainThread = useCallback(async () => {
    try {
      setStatus('loading_model');
      
      const vision = await FilesetResolver.forVisionTasks(
        VISION_CONFIG.MODEL.BASE_URL
      );
      
      landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: VISION_CONFIG.MODEL.ASSET_PATH,
          delegate: VISION_CONFIG.MODEL.DELEGATE
        },
        runningMode: VISION_CONFIG.MODEL.RUNNING_MODE,
        numHands: VISION_CONFIG.MODEL.NUM_HANDS,
        minHandDetectionConfidence: VISION_CONFIG.DETECTION.MIN_DETECTION_CONFIDENCE,
        minHandPresenceConfidence: VISION_CONFIG.DETECTION.MIN_PRESENCE_CONFIDENCE,
        minTrackingConfidence: VISION_CONFIG.DETECTION.MIN_TRACKING_CONFIDENCE
      });
      
      setIsReady(true);
      setStatus('ready');
      
    } catch (err) {
      setError(`Model error: ${err.message}`);
      setStatus('error');
    }
  }, []);

  // Initialize Worker
  const initWorker = useCallback(() => {
    try {
      setStatus('loading_worker');
      
      // Vite worker import syntax
      const worker = new Worker(
        new URL('../workers/vision.worker.js', import.meta.url),
        { type: 'module' }
      );
      
      workerRef.current = worker;
      
      worker.onmessage = (event) => {
        const { type, payload } = event.data;
        
        switch (type) {
          case 'STATUS':
            setStatus(payload);
            break;
            
          case 'READY':
            setIsReady(true);
            setStatus('ready');
            break;
            
          case 'LANDMARKS':
            handleLandmarks(payload);
            break;
            
          case 'ERROR':
            setError(payload.error);
            setStatus('error');
            break;
        }
      };
      
      worker.onerror = (err) => {
        setError(`Worker error: ${err.message}`);
        setStatus('error');
      };
      
      // Send init config
      worker.postMessage({
        type: 'INIT',
        config: {
          baseUrl: VISION_CONFIG.MODEL.BASE_URL,
          modelAssetPath: VISION_CONFIG.MODEL.ASSET_PATH,
          delegate: VISION_CONFIG.MODEL.DELEGATE,
          runningMode: VISION_CONFIG.MODEL.RUNNING_MODE,
          numHands: VISION_CONFIG.MODEL.NUM_HANDS,
          minDetectionConfidence: VISION_CONFIG.DETECTION.MIN_DETECTION_CONFIDENCE,
          minPresenceConfidence: VISION_CONFIG.DETECTION.MIN_PRESENCE_CONFIDENCE,
          minTrackingConfidence: VISION_CONFIG.DETECTION.MIN_TRACKING_CONFIDENCE
        }
      });
      
    } catch (err) {
      // Fallback to main thread
      console.warn('Worker init failed, falling back to main thread:', err);
      initMainThread();
    }
  }, [initMainThread]);

  // Handle landmark results
  const handleLandmarks = useCallback((payload) => {
    const { landmarks, handedness, detectionTime, timestamp } = payload;
    
    if (landmarks && landmarks.length > 0) {
      // Apply smoothing
      const smoothed = state.smoothing > 0 
        ? [smootherRef.current.smooth(landmarks[0])]
        : landmarks;
      
      actions.setLandmarks(smoothed, handedness);
    } else {
      actions.clearLandmarks();
    }
    
    // Update performance metrics
    updatePerformanceMetrics(detectionTime);
  }, [actions, state.smoothing]);

  // Main detection loop (main thread)
  const detectLoopMainThread = useCallback(() => {
    if (!isReady || !landmarkerRef.current || !videoRef.current) return;
    
    const video = videoRef.current;
    if (video.readyState < 2) {
      rafIdRef.current = requestAnimationFrame(detectLoopMainThread);
      return;
    }
    
    const startTime = performance.now();
    
    try {
      const results = landmarkerRef.current.detectForVideo(video, startTime);
      
      handleLandmarks({
        landmarks: results.landmarks,
        handedness: results.handedness,
        detectionTime: performance.now() - startTime,
        timestamp: startTime
      });
      
    } catch (err) {
      console.error('Detection error:', err);
    }
    
    rafIdRef.current = requestAnimationFrame(detectLoopMainThread);
  }, [isReady, handleLandmarks]);

  // Detection loop with worker
  const detectLoopWorker = useCallback(() => {
    if (!isReady || !workerRef.current || !videoRef.current) return;
    
    const video = videoRef.current;
    if (video.readyState < 2) {
      rafIdRef.current = requestAnimationFrame(detectLoopWorker);
      return;
    }
    
    // Create offscreen canvas for frame capture
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Send to worker with transferable
    workerRef.current.postMessage(
      {
        type: 'DETECT',
        frame: imageData,
        timestamp: performance.now()
      },
      [imageData.data.buffer]
    );
    
    rafIdRef.current = requestAnimationFrame(detectLoopWorker);
  }, [isReady]);

  // Update FPS and latency metrics
  const updatePerformanceMetrics = useCallback((detectionTime) => {
    const now = performance.now();
    const stats = statsRef.current;
    
    stats.frameCount++;
    const elapsed = now - stats.startTime;
    
    if (elapsed >= 1000) {
      const fps = Math.round((stats.frameCount * 1000) / elapsed);
      const latency = Math.round(now - stats.lastFrameTime);
      
      actions.updatePerformance({ 
        fps, 
        latency,
        detectionTime: Math.round(detectionTime || 0)
      });
      
      stats.frameCount = 0;
      stats.startTime = now;
    }
    
    stats.lastFrameTime = now;
  }, [actions]);

  // Start/stop detection based on enabled state
  useEffect(() => {
    if (enabled) {
      // Initialize
      if (useWorker) {
        initWorker();
      } else {
        initMainThread();
      }
      
      startCamera();
      
    } else {
      // Cleanup
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      
      if (workerRef.current) {
        workerRef.current.postMessage({ type: 'CLEANUP' });
        workerRef.current.terminate();
        workerRef.current = null;
      }
      
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
        landmarkerRef.current = null;
      }
      
      stopCamera();
      setIsReady(false);
      setStatus('idle');
    }
    
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [enabled, useWorker, initWorker, initMainThread, startCamera, stopCamera]);

  // Start detection loop when ready
  useEffect(() => {
    if (isReady && enabled) {
      const detectLoop = useWorker ? detectLoopWorker : detectLoopMainThread;
      rafIdRef.current = requestAnimationFrame(detectLoop);
    }
    
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isReady, enabled, useWorker, detectLoopWorker, detectLoopMainThread]);

  return {
    videoRef,
    canvasRef,
    isReady,
    error,
    status,
    fps: state.fps,
    latency: state.latency,
    startCamera,
    stopCamera
  };
}

export default useHandTracking;
