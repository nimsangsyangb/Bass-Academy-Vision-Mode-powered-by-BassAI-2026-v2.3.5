/**
 * Gesture Calculations - BassAI Vision
 * Geometry utilities for hand gesture detection
 */

// MediaPipe Hand Landmark indices
export const LANDMARKS = {
  WRIST: 0,
  THUMB_CMC: 1,
  THUMB_MCP: 2,
  THUMB_IP: 3,
  THUMB_TIP: 4,
  INDEX_MCP: 5,
  INDEX_PIP: 6,
  INDEX_DIP: 7,
  INDEX_TIP: 8,
  MIDDLE_MCP: 9,
  MIDDLE_PIP: 10,
  MIDDLE_DIP: 11,
  MIDDLE_TIP: 12,
  RING_MCP: 13,
  RING_PIP: 14,
  RING_DIP: 15,
  RING_TIP: 16,
  PINKY_MCP: 17,
  PINKY_PIP: 18,
  PINKY_DIP: 19,
  PINKY_TIP: 20
};

// Finger tip and MCP pairs for extension detection
const FINGER_PAIRS = [
  { tip: LANDMARKS.INDEX_TIP, mcp: LANDMARKS.INDEX_MCP },
  { tip: LANDMARKS.MIDDLE_TIP, mcp: LANDMARKS.MIDDLE_MCP },
  { tip: LANDMARKS.RING_TIP, mcp: LANDMARKS.RING_MCP },
  { tip: LANDMARKS.PINKY_TIP, mcp: LANDMARKS.PINKY_MCP }
];

/**
 * Euclidean distance between two 3D points
 */
export function euclideanDistance(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = (p1.z || 0) - (p2.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Check if a finger is extended (tip farther from wrist than MCP)
 */
function isFingerExtended(hand, tipIndex, mcpIndex) {
  const wrist = hand[LANDMARKS.WRIST];
  const tip = hand[tipIndex];
  const mcp = hand[mcpIndex];
  
  return euclideanDistance(tip, wrist) > euclideanDistance(mcp, wrist) * 1.2;
}

/**
 * Count extended fingers (excluding thumb)
 */
function countExtendedFingers(hand) {
  return FINGER_PAIRS.reduce((count, { tip, mcp }) => 
    count + (isFingerExtended(hand, tip, mcp) ? 1 : 0), 0);
}

/**
 * Detect OPEN_HAND (✋) - all fingers extended
 */
export function detectOpenHand(landmarks) {
  if (!landmarks?.[0]) return 0;
  
  const hand = landmarks[0];
  const wrist = hand[LANDMARKS.WRIST];
  
  // Check all finger tips are far from wrist
  const fingerTips = [
    LANDMARKS.THUMB_TIP,
    LANDMARKS.INDEX_TIP,
    LANDMARKS.MIDDLE_TIP,
    LANDMARKS.RING_TIP,
    LANDMARKS.PINKY_TIP
  ];
  
  const distances = fingerTips.map(tip => euclideanDistance(hand[tip], wrist));
  const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
  
  // All fingers extended = high average distance
  return avgDistance > 0.22 ? Math.min(avgDistance / 0.28, 1) : 0;
}

/**
 * Detect CLOSED_FIST (✊) - all fingers curled
 */
export function detectClosedFist(landmarks) {
  if (!landmarks?.[0]) return 0;
  
  const hand = landmarks[0];
  const wrist = hand[LANDMARKS.WRIST];
  
  // Only check 4 fingers (thumb behaves differently in fist)
  const fingerTips = [
    LANDMARKS.INDEX_TIP,
    LANDMARKS.MIDDLE_TIP,
    LANDMARKS.RING_TIP,
    LANDMARKS.PINKY_TIP
  ];
  
  const distances = fingerTips.map(tip => euclideanDistance(hand[tip], wrist));
  const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
  
  // Fist = low average distance
  return avgDistance < 0.15 ? Math.min((0.15 - avgDistance) / 0.1, 1) : 0;
}

/**
 * Detect PEACE_SIGN (✌️) - index + middle extended, others folded
 */
export function detectPeaceSign(landmarks) {
  if (!landmarks?.[0]) return 0;
  
  const hand = landmarks[0];
  const wrist = hand[LANDMARKS.WRIST];
  
  const indexExtended = euclideanDistance(hand[LANDMARKS.INDEX_TIP], wrist) > 0.20;
  const middleExtended = euclideanDistance(hand[LANDMARKS.MIDDLE_TIP], wrist) > 0.20;
  const ringFolded = euclideanDistance(hand[LANDMARKS.RING_TIP], wrist) < 0.16;
  const pinkyFolded = euclideanDistance(hand[LANDMARKS.PINKY_TIP], wrist) < 0.16;
  
  if (indexExtended && middleExtended && ringFolded && pinkyFolded) {
    // Higher confidence if index and middle are separated
    const separation = euclideanDistance(
      hand[LANDMARKS.INDEX_TIP], 
      hand[LANDMARKS.MIDDLE_TIP]
    );
    return separation > 0.05 ? 1 : 0.8;
  }
  
  return 0;
}

/**
 * Detect THUMBS_UP (👍) - thumb up, other fingers folded
 */
export function detectThumbsUp(landmarks) {
  if (!landmarks?.[0]) return 0;
  
  const hand = landmarks[0];
  const thumbTip = hand[LANDMARKS.THUMB_TIP];
  const thumbIP = hand[LANDMARKS.THUMB_IP];
  const wrist = hand[LANDMARKS.WRIST];
  
  // Thumb pointing up (tip.y < ip.y < wrist.y)
  const thumbUp = thumbTip.y < thumbIP.y && thumbIP.y < wrist.y;
  
  // Other fingers folded
  const extendedCount = countExtendedFingers(hand);
  
  return (thumbUp && extendedCount === 0) ? 1 : 0;
}

/**
 * Detect THUMBS_DOWN (👎) - thumb down, other fingers folded
 */
export function detectThumbsDown(landmarks) {
  if (!landmarks?.[0]) return 0;
  
  const hand = landmarks[0];
  const thumbTip = hand[LANDMARKS.THUMB_TIP];
  const thumbIP = hand[LANDMARKS.THUMB_IP];
  const wrist = hand[LANDMARKS.WRIST];
  
  // Thumb pointing down (tip.y > ip.y > wrist.y)
  const thumbDown = thumbTip.y > thumbIP.y && thumbIP.y > wrist.y;
  
  // Other fingers folded
  const extendedCount = countExtendedFingers(hand);
  
  return (thumbDown && extendedCount === 0) ? 1 : 0;
}

/**
 * Detect PINCH (🤏) - thumb and index touching
 */
export function detectPinch(landmarks) {
  if (!landmarks?.[0]) return 0;
  
  const hand = landmarks[0];
  const thumbTip = hand[LANDMARKS.THUMB_TIP];
  const indexTip = hand[LANDMARKS.INDEX_TIP];
  
  const distance = euclideanDistance(thumbTip, indexTip);
  
  // Pinch = tips very close
  if (distance < 0.05) {
    return Math.min((0.05 - distance) / 0.03, 1);
  }
  
  return 0;
}

/**
 * Main gesture detector - returns strongest gesture
 */
export function detectGesture(landmarks) {
  if (!landmarks?.[0]) {
    return { gesture: 'IDLE', confidence: 0 };
  }
  
  const gestures = {
    OPEN_HAND: detectOpenHand(landmarks),
    CLOSED_FIST: detectClosedFist(landmarks),
    PEACE_SIGN: detectPeaceSign(landmarks),
    THUMBS_UP: detectThumbsUp(landmarks),
    THUMBS_DOWN: detectThumbsDown(landmarks),
    PINCH: detectPinch(landmarks)
  };
  
  // Find gesture with highest confidence
  let maxGesture = 'IDLE';
  let maxConfidence = 0;
  
  for (const [gesture, confidence] of Object.entries(gestures)) {
    if (confidence > maxConfidence) {
      maxConfidence = confidence;
      maxGesture = gesture;
    }
  }
  
  return { gesture: maxGesture, confidence: maxConfidence };
}

export default { detectGesture, LANDMARKS };
