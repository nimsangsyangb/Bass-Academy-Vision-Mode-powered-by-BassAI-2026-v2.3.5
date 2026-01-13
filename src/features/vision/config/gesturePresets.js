/**
 * Gesture Presets - BassAI Vision
 * Gesture definitions for v1 (single hand, no volume)
 */

export const GESTURE_PRESETS = {
  PLAY: {
    id: 'OPEN_HAND',
    name: 'Mano Abierta',
    description: 'Reproduce el ejercicio',
    icon: '✋',
    color: '#00FF00',
    audioCommand: 'play'
  },
  STOP: {
    id: 'CLOSED_FIST',
    name: 'Puño Cerrado',
    description: 'Detiene la reproducción',
    icon: '✊',
    color: '#FF0000',
    audioCommand: 'stop'
  },
  PAUSE: {
    id: 'PEACE_SIGN',
    name: 'Señal de Paz',
    description: 'Pausa/Resume',
    icon: '✌️',
    color: '#FFFF00',
    audioCommand: 'togglePause'
  },
  TEMPO_UP: {
    id: 'THUMBS_UP',
    name: 'Pulgar Arriba',
    description: 'Aumenta tempo +5 BPM',
    icon: '👍',
    color: '#00FFFF',
    audioCommand: 'tempoUp'
  },
  TEMPO_DOWN: {
    id: 'THUMBS_DOWN',
    name: 'Pulgar Abajo',
    description: 'Reduce tempo -5 BPM',
    icon: '👎',
    color: '#FF00FF',
    audioCommand: 'tempoDown'
  },
  LOOP: {
    id: 'PINCH',
    name: 'Pinza',
    description: 'Activa/Desactiva Loop',
    icon: '🤏',
    color: '#FFA500',
    audioCommand: 'toggleLoop'
  }
};

// Map gesture ID to preset
export const GESTURE_MAP = Object.fromEntries(
  Object.values(GESTURE_PRESETS).map(preset => [preset.id, preset])
);

// Get gesture info by ID
export function getGestureInfo(gestureId) {
  return GESTURE_MAP[gestureId] || null;
}

export default GESTURE_PRESETS;
