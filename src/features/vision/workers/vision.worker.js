/**
 * Vision Worker - BassAI Vision
 * Off-thread MediaPipe processing for better performance
 */

import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

let handLandmarker = null;
let isInitialized = false;

self.onmessage = async (event) => {
  const { type, config, frame, timestamp } = event.data;

  switch (type) {
    case 'INIT':
      await initializeModel(config);
      break;

    case 'DETECT':
      if (isInitialized && handLandmarker) {
        await detectHands(frame, timestamp);
      }
      break;

    case 'CLEANUP':
      cleanup();
      break;

    default:
      console.warn('[VisionWorker] Unknown message type:', type);
  }
};

async function initializeModel(config) {
  try {
    self.postMessage({ type: 'STATUS', payload: 'Loading MediaPipe...' });
    
    const vision = await FilesetResolver.forVisionTasks(config.baseUrl);
    
    self.postMessage({ type: 'STATUS', payload: 'Creating hand landmarker...' });
    
    handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: config.modelAssetPath,
        delegate: config.delegate || 'GPU'
      },
      runningMode: config.runningMode || 'VIDEO',
      numHands: config.numHands || 1,
      minHandDetectionConfidence: config.minDetectionConfidence || 0.5,
      minHandPresenceConfidence: config.minPresenceConfidence || 0.5,
      minTrackingConfidence: config.minTrackingConfidence || 0.5
    });
    
    isInitialized = true;
    self.postMessage({ type: 'READY' });
    
  } catch (error) {
    self.postMessage({ 
      type: 'ERROR', 
      payload: { 
        error: error.message,
        stack: error.stack 
      } 
    });
  }
}

async function detectHands(imageData, timestamp) {
  const startTime = performance.now();
  
  try {
    // Create ImageBitmap from ImageData
    const bitmap = await createImageBitmap(imageData);
    
    // Run detection
    const results = handLandmarker.detectForVideo(bitmap, timestamp);
    
    const detectionTime = performance.now() - startTime;
    
    // Send results back
    self.postMessage({
      type: 'LANDMARKS',
      payload: {
        landmarks: results.landmarks,
        handedness: results.handedness,
        worldLandmarks: results.worldLandmarks,
        detectionTime,
        timestamp
      }
    });
    
    // Cleanup bitmap
    bitmap.close();
    
  } catch (error) {
    self.postMessage({ 
      type: 'ERROR', 
      payload: { 
        error: error.message,
        context: 'detection' 
      } 
    });
  }
}

function cleanup() {
  if (handLandmarker) {
    handLandmarker.close();
    handLandmarker = null;
  }
  isInitialized = false;
  self.postMessage({ type: 'CLEANUP_COMPLETE' });
}
