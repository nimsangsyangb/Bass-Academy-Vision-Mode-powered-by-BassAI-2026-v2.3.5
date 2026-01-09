/**
 * Recording Feature - Barrel Export
 * Central export for all recording components, hooks, and services
 */

// Components
export { default as RecordingControls } from './components/RecordingControls';
export { default as WaveformVisualizer } from './components/WaveformVisualizer';
export { default as RecordingPlayer } from './components/RecordingPlayer';
export { default as RecordingsList } from './components/RecordingsList';

// Hooks
export { default as useMediaRecorder, useMediaRecorder as useRecorder } from './hooks/useMediaRecorder';
export { default as useRecordingStorage } from './hooks/useRecordingStorage';

// Services
export { recordingService } from './services/RecordingService';
export { default as RecordingService } from './services/RecordingService';
