/**
 * Smoothing Filters - BassAI Vision
 * Noise reduction for hand tracking data
 */

// Simple Moving Average
export function movingAverageFilter(values) {
  if (!values || values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

// Exponential Moving Average (more responsive to recent values)
export function exponentialMovingAverage(values, alpha = 0.3) {
  if (!values || values.length === 0) return 0;
  
  return values.reduce((ema, value, index) => {
    if (index === 0) return value;
    return alpha * value + (1 - alpha) * ema;
  }, values[0]);
}

// Median Filter (removes outliers)
export function medianFilter(values) {
  if (!values || values.length === 0) return 0;
  
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

/**
 * Kalman Filter for landmark smoothing
 * Reduces jitter while maintaining responsiveness
 */
export class KalmanFilter {
  constructor(processNoise = 0.001, measurementNoise = 0.01) {
    this.Q = processNoise;
    this.R = measurementNoise;
    this.P = 1; // Estimation error covariance
    this.X = 0; // State estimate
    this.K = 0; // Kalman gain
  }

  filter(measurement) {
    // Prediction
    this.P = this.P + this.Q;

    // Update
    this.K = this.P / (this.P + this.R);
    this.X = this.X + this.K * (measurement - this.X);
    this.P = (1 - this.K) * this.P;

    return this.X;
  }

  reset() {
    this.P = 1;
    this.X = 0;
    this.K = 0;
  }
}

/**
 * Landmark Smoother - applies Kalman to 3D coordinates
 */
export class LandmarkSmoother {
  constructor(config = {}) {
    const { processNoise = 0.001, measurementNoise = 0.01 } = config;
    
    // 21 landmarks × 3 coordinates
    this.filters = Array.from({ length: 21 }, () => ({
      x: new KalmanFilter(processNoise, measurementNoise),
      y: new KalmanFilter(processNoise, measurementNoise),
      z: new KalmanFilter(processNoise, measurementNoise)
    }));
  }

  smooth(landmarks) {
    if (!landmarks || landmarks.length === 0) return landmarks;
    
    return landmarks.map((landmark, i) => ({
      x: this.filters[i].x.filter(landmark.x),
      y: this.filters[i].y.filter(landmark.y),
      z: this.filters[i].z.filter(landmark.z || 0)
    }));
  }

  reset() {
    this.filters.forEach(f => {
      f.x.reset();
      f.y.reset();
      f.z.reset();
    });
  }
}

export default { movingAverageFilter, exponentialMovingAverage, medianFilter, KalmanFilter, LandmarkSmoother };
