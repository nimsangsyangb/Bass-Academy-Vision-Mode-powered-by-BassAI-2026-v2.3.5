/**
 * Drawing Utilities - BassAI Vision
 * Canvas rendering for hand landmarks and gestures
 */

import { LANDMARKS } from './gestureCalculations.js';
import { VISION_CONFIG } from '../config/visionConfig.js';

// Hand connections for drawing skeleton
const HAND_CONNECTIONS = [
  // Thumb
  [LANDMARKS.WRIST, LANDMARKS.THUMB_CMC],
  [LANDMARKS.THUMB_CMC, LANDMARKS.THUMB_MCP],
  [LANDMARKS.THUMB_MCP, LANDMARKS.THUMB_IP],
  [LANDMARKS.THUMB_IP, LANDMARKS.THUMB_TIP],
  // Index
  [LANDMARKS.WRIST, LANDMARKS.INDEX_MCP],
  [LANDMARKS.INDEX_MCP, LANDMARKS.INDEX_PIP],
  [LANDMARKS.INDEX_PIP, LANDMARKS.INDEX_DIP],
  [LANDMARKS.INDEX_DIP, LANDMARKS.INDEX_TIP],
  // Middle
  [LANDMARKS.WRIST, LANDMARKS.MIDDLE_MCP],
  [LANDMARKS.MIDDLE_MCP, LANDMARKS.MIDDLE_PIP],
  [LANDMARKS.MIDDLE_PIP, LANDMARKS.MIDDLE_DIP],
  [LANDMARKS.MIDDLE_DIP, LANDMARKS.MIDDLE_TIP],
  // Ring
  [LANDMARKS.WRIST, LANDMARKS.RING_MCP],
  [LANDMARKS.RING_MCP, LANDMARKS.RING_PIP],
  [LANDMARKS.RING_PIP, LANDMARKS.RING_DIP],
  [LANDMARKS.RING_DIP, LANDMARKS.RING_TIP],
  // Pinky
  [LANDMARKS.WRIST, LANDMARKS.PINKY_MCP],
  [LANDMARKS.PINKY_MCP, LANDMARKS.PINKY_PIP],
  [LANDMARKS.PINKY_PIP, LANDMARKS.PINKY_DIP],
  [LANDMARKS.PINKY_DIP, LANDMARKS.PINKY_TIP],
  // Palm
  [LANDMARKS.INDEX_MCP, LANDMARKS.MIDDLE_MCP],
  [LANDMARKS.MIDDLE_MCP, LANDMARKS.RING_MCP],
  [LANDMARKS.RING_MCP, LANDMARKS.PINKY_MCP]
];

/**
 * Draw hand landmarks and skeleton on canvas
 */
export function drawHandLandmarks(ctx, landmarks, handedness, options = {}) {
  if (!landmarks || landmarks.length === 0) return;
  
  const {
    showSkeleton = true,
    showJoints = true,
    jointRadius = 5,
    lineWidth = 3
  } = options;
  
  const hand = landmarks[0];
  const isRightHand = handedness?.[0]?.[0]?.categoryName === 'Right';
  
  // Colors based on hand
  const primaryColor = isRightHand 
    ? VISION_CONFIG.UI.LANDMARK_COLOR_RIGHT 
    : VISION_CONFIG.UI.LANDMARK_COLOR_LEFT;
  const jointColor = VISION_CONFIG.UI.JOINT_COLOR;
  
  ctx.save();
  
  // Draw skeleton lines
  if (showSkeleton) {
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Add glow effect
    ctx.shadowColor = primaryColor;
    ctx.shadowBlur = 10;
    
    HAND_CONNECTIONS.forEach(([start, end]) => {
      const startPoint = hand[start];
      const endPoint = hand[end];
      
      ctx.beginPath();
      ctx.moveTo(
        startPoint.x * ctx.canvas.width, 
        startPoint.y * ctx.canvas.height
      );
      ctx.lineTo(
        endPoint.x * ctx.canvas.width, 
        endPoint.y * ctx.canvas.height
      );
      ctx.stroke();
    });
  }
  
  // Draw joint points
  if (showJoints) {
    ctx.shadowBlur = 5;
    ctx.fillStyle = jointColor;
    
    hand.forEach((landmark, i) => {
      const x = landmark.x * ctx.canvas.width;
      const y = landmark.y * ctx.canvas.height;
      
      // Fingertips slightly larger
      const isTip = [4, 8, 12, 16, 20].includes(i);
      const radius = isTip ? jointRadius * 1.3 : jointRadius;
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
    });
  }
  
  ctx.restore();
}

/**
 * Draw gesture indicator with confidence bar
 */
export function drawGestureIndicator(ctx, gesture, confidence, gestureInfo) {
  if (gesture === 'IDLE') return;
  
  const padding = 10;
  const boxWidth = 150;
  const boxHeight = 50;
  const x = ctx.canvas.width - boxWidth - padding;
  const y = padding;
  
  ctx.save();
  
  // Background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.beginPath();
  ctx.roundRect(x, y, boxWidth, boxHeight, 8);
  ctx.fill();
  
  // Border with gesture color
  ctx.strokeStyle = gestureInfo?.color || '#00FFFF';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Icon and name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
  ctx.fillText(
    `${gestureInfo?.icon || '👋'} ${gestureInfo?.name || gesture}`, 
    x + 10, 
    y + 22
  );
  
  // Confidence bar background
  const barY = y + 32;
  const barWidth = boxWidth - 20;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.beginPath();
  ctx.roundRect(x + 10, barY, barWidth, 8, 4);
  ctx.fill();
  
  // Confidence bar fill
  const fillWidth = barWidth * Math.min(confidence, 1);
  const barColor = confidence > 0.8 ? '#00FF00' : '#FFFF00';
  ctx.fillStyle = barColor;
  ctx.beginPath();
  ctx.roundRect(x + 10, barY, fillWidth, 8, 4);
  ctx.fill();
  
  // Percentage
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '10px monospace';
  ctx.fillText(`${Math.round(confidence * 100)}%`, x + barWidth - 20, barY + 7);
  
  ctx.restore();
}

/**
 * Draw debug performance stats
 */
export function drawPerformanceStats(ctx, stats) {
  const { fps, latency, detectionTime } = stats;
  
  const padding = 10;
  const x = padding;
  const y = ctx.canvas.height - 60;
  
  ctx.save();
  
  // Background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.beginPath();
  ctx.roundRect(x, y, 120, 50, 8);
  ctx.fill();
  
  // Stats text
  ctx.font = '11px monospace';
  
  // FPS with color coding
  ctx.fillStyle = fps >= 25 ? '#00FF00' : fps >= 20 ? '#FFFF00' : '#FF0000';
  ctx.fillText(`FPS: ${fps}`, x + 8, y + 16);
  
  // Latency
  ctx.fillStyle = latency <= 100 ? '#00FF00' : latency <= 150 ? '#FFFF00' : '#FF0000';
  ctx.fillText(`Latency: ${latency}ms`, x + 8, y + 30);
  
  // Detection time
  ctx.fillStyle = '#00FFFF';
  ctx.fillText(`Detect: ${detectionTime}ms`, x + 8, y + 44);
  
  ctx.restore();
}

/**
 * Clear canvas
 */
export function clearCanvas(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

export default { 
  drawHandLandmarks, 
  drawGestureIndicator, 
  drawPerformanceStats, 
  clearCanvas 
};
