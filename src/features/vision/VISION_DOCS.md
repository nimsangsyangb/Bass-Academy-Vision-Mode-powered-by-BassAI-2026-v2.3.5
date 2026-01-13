# BassAI Vision - Developer Documentation

> Internal documentation for maintaining and extending the Vision Mode feature.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Camera Feed                              │
│                     (WebRTC getUserMedia)                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     vision.worker.js                             │
│            (Off-thread MediaPipe processing)                     │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  HandLandmarker.detectForVideo() → 21 landmarks × 3D    │   │
│   └─────────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────────┘
                            │ postMessage
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   useHandTracking.js                             │
│              (Main thread coordination)                          │
│   • Receives landmarks from worker                               │
│   • Applies Kalman smoothing                                     │
│   • Updates VisionContext                                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                 useGestureRecognizer.js                          │
│              (Gesture interpretation)                            │
│   • Temporal smoothing (5-frame window)                          │
│   • Hold time validation                                         │
│   • Gesture → command mapping                                    │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                 VisionAudioBridge.js                             │
│              (Command execution)                                 │
│   • Cooldown enforcement (800ms)                                 │
│   • Handler dispatch                                             │
│   • Event notification                                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BassTrainer.jsx                               │
│               (Command handlers)                                 │
│   play(), stop(), toggleLoop(), setTempo(), etc.                 │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AudioService.js                               │
│              (Audio playback)                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Gesture Reference

| ID | Gesture | Icon | Command | Hold Time | Notes |
|----|---------|------|---------|-----------|-------|
| `OPEN_HAND` | Open palm | ✋ | `play` | 500ms | All 5 fingers extended |
| `CLOSED_FIST` | Fist | ✊ | `stop` | 500ms | All fingers curled |
| `PEACE_SIGN` | Peace/V | ✌️ | `togglePause` | 500ms | Index + middle extended |
| `THUMBS_UP` | Thumb up | 👍 | `tempoUp` | 500ms | Thumb pointing up |
| `THUMBS_DOWN` | Thumb down | 👎 | `tempoDown` | 500ms | Thumb pointing down |
| `PINCH` | Pinch | 🤏 | `toggleLoop` | **700ms** | Thumb + index touching |

---

## Adding a New Gesture

### Step 1: Define Detection Logic
Add to `gestureCalculations.js`:

```javascript
export function detectNewGesture(landmarks) {
  if (!landmarks?.[0]) return 0;
  
  const hand = landmarks[0];
  // Your detection logic here
  // Return confidence 0-1
  
  return confidence;
}
```

### Step 2: Register in detectGesture()
```javascript
const gestures = {
  // ... existing gestures
  NEW_GESTURE: detectNewGesture(landmarks),
};
```

### Step 3: Add Preset
In `gesturePresets.js`:
```javascript
NEW_GESTURE: {
  id: 'NEW_GESTURE',
  name: 'Nombre del Gesto',
  description: 'Qué hace',
  icon: '🆕',
  color: '#HEX',
  audioCommand: 'commandName'
}
```

### Step 4: Add Handler
In `BassTrainer.jsx` vision bridge setup:
```javascript
visionBridge.setHandlers({
  // ... existing
  commandName: () => { /* implementation */ }
});
```

---

## Performance Tuning

### Thresholds (visionConfig.js)
| Setting | Default | Description |
|---------|---------|-------------|
| `GESTURE_CONFIDENCE_THRESHOLD` | 0.7 | Minimum confidence to recognize |
| `GESTURE_HOLD_TIME_MS` | 500 | Hold time for most gestures |
| `PINCH_HOLD_TIME_MS` | 700 | Longer hold for pinch (prone to false positives) |
| `COOLDOWN_BETWEEN_GESTURES_MS` | 800 | Prevents rapid-fire commands |
| `TARGET_FPS` | 30 | Detection frame rate target |

### If FPS drops below 20:
1. Reduce camera resolution in `CAMERA.WIDTH/HEIGHT`
2. Increase `MAX_FRAME_SKIP`
3. Disable worker (`FEATURES.VISION_WORKERS = false`)

---

## Mobile Considerations

### iOS Safari
- **Status**: Experimental supported
- Worker support: iOS 16+
- Fallback: Main thread processing
- Detection in `featureFlags.js`

### Android Chrome
- Full support
- GPU acceleration works
- No special handling needed

---

## Feature Flags

| Flag | Default | Description |
|------|---------|-------------|
| `VITE_VISION_ENABLED` | `false` | Master toggle for vision feature |
| `VITE_VISION_WORKERS` | `true` | Use Web Workers (auto-disabled on old iOS) |
| `VITE_VISION_DEBUG` | `false` | Show FPS/latency overlay |

---

## Design Principles

> **Golden Rule**: "Los gestos no controlan valores continuos críticos sin confirmación."

This protects against:
- Volume jumps (jarring audio changes)
- Gain spikes (potentially damaging)
- Fine-grained adjustments (gestures are coarse)

**Allowed**: Discrete actions (play/stop), stepped changes (tempo ±5)
**Not allowed**: Smooth sliders, continuous volume

---

## Metrics Tracking

The `useGestureRecognizer` hook tracks session metrics (ready for future analytics):

```javascript
const { getMetrics } = useGestureRecognizer({ ... });

// Returns:
{
  gestureAborts: 5,        // Started but not confirmed
  confirmedGestures: 12,   // Successfully executed
  avgHoldTimeMs: 620,      // Average hold duration
  abortRate: '29.4%',      // Abort percentage
  sessionDurationMs: 180000
}
```

These metrics help tune:
- Hold times (if abortRate > 40%, hold time may be too long)
- Confidence thresholds (if false positives occur)
- Gesture ergonomics

---

## Future Roadmap (Phase 2)

### Planned
- [ ] Swipe gestures (left/right for navigation)
- [ ] Two-hand pinch for UI scale (not audio)
- [ ] Posture detection hints
- [ ] Session metrics dashboard

### Not Planned
- ❌ Volume by gesture (too fine for coarse input)
- ❌ Note playing by gesture (latency too high)
- ❌ Continuous value control without confirmation

---

## Design Philosophy

> The core principles that shape Vision's architecture and future evolution.

### 1. Vision es un sensor, no un modo

Vision operates as a **passive sensing layer**, not an interactive mode. It continuously reads hand data when enabled, independent of any UI state. The engine runs silently in the background, interpreting intent without demanding attention.

### 2. UI es opcional

The Vision panel is a **convenience, not a requirement**. Users can close the visual feedback while gestures continue working. This respects the musician's focus—they shouldn't need to look at a screen to control their practice.

### 3. Gestos son intención sostenida

A gesture is not a tap—it's a **deliberate hold**. The hold time (500-700ms) filters out accidental movements and ensures every triggered command reflects conscious intent. This trades speed for reliability.

### 4. Menos es más

Fewer gestures, fewer states, fewer edge cases. We support **6 gestures**—enough to control practice flow, not enough to overwhelm. Every addition must justify its cognitive cost.

---

*These principles guide all Vision development. When in doubt, choose the simpler, more reliable path.*

