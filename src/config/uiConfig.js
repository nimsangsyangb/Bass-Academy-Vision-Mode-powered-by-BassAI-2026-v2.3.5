/**
 * UI Configuration - Bass Trainer
 * Centralized UI constants
 */

// Countdown settings
export const COUNTDOWN_CONFIG = {
  duration: 3, // seconds
  interval: 1000, // ms between ticks
};

// Beat & rhythm settings
export const RHYTHM_CONFIG = {
  beatsPerMeasure: 4,
  tripletsPerBeat: 3,
  notesPerMeasure: 12, // 4 beats × 3 triplets
};

// View modes
export const VIEW_MODES = {
  TAB: 'tab',
  FRETBOARD: 'fretboard',
};

// Theme settings
export const THEME_CONFIG = {
  storageKey: 'bass-trainer-theme',
  default: 'dark',
  options: ['dark', 'light', 'practice'],
};
