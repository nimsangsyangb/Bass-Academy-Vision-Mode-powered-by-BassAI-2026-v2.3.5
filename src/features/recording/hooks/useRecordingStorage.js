/**
 * useRecordingStorage Hook - Bass Academy
 * Manages recording storage with IndexedDB integration
 * 
 * @module useRecordingStorage
 */

import { useState, useCallback, useEffect } from 'react';
import { recordingService } from '../services/RecordingService';
import { generateRecordingName } from '../../../config/recordingConfig';

// ============================================
// HOOK: useRecordingStorage
// ============================================

/**
 * React hook for managing recording storage operations
 * 
 * @returns {Object} Storage state and operations
 */
export function useRecordingStorage() {
  // ============================================
  // STATE
  // ============================================
  
  const [recordings, setRecordings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storageStats, setStorageStats] = useState(null);

  // ============================================
  // LOAD RECORDINGS
  // ============================================

  const loadRecordings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const allRecordings = await recordingService.getAll();
      setRecordings(allRecordings);
      
      const stats = await recordingService.getStorageStats();
      setStorageStats(stats);
    } catch (err) {
      console.error('Failed to load recordings:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load on mount
  useEffect(() => {
    loadRecordings();
  }, [loadRecordings]);

  // ============================================
  // SAVE RECORDING
  // ============================================

  /**
   * Save a new recording
   * @param {Object} recordingData - Recording data from useMediaRecorder
   * @param {Object} exerciseContext - Current exercise info
   * @returns {Promise<Object>} Saved recording
   */
  const saveRecording = useCallback(async (recordingData, exerciseContext = {}) => {
    setError(null);
    
    try {
      const recording = {
        name: generateRecordingName(exerciseContext),
        duration: recordingData.duration,
        size: recordingData.size || recordingData.blob?.size || 0,
        format: recordingData.mimeType,
        audioBlob: recordingData.blob,
        exercise: {
          patternId: exerciseContext.patternId || null,
          rootNote: exerciseContext.rootNote || null,
          tempo: exerciseContext.tempo || null,
          isCustom: exerciseContext.isCustom || false,
        },
        quality: recordingData.quality || 'MEDIUM',
      };

      const saved = await recordingService.create(recording);
      
      // Refresh recordings list
      await loadRecordings();
      
      return saved;
    } catch (err) {
      console.error('Failed to save recording:', err);
      setError(err.message);
      throw err;
    }
  }, [loadRecordings]);

  // ============================================
  // GET RECORDING
  // ============================================

  /**
   * Get a recording by ID
   * @param {string} id - Recording ID
   * @returns {Promise<Object|null>} Recording or null
   */
  const getRecording = useCallback(async (id) => {
    try {
      return await recordingService.getById(id);
    } catch (err) {
      console.error('Failed to get recording:', err);
      setError(err.message);
      return null;
    }
  }, []);

  // ============================================
  // UPDATE RECORDING
  // ============================================

  /**
   * Update recording metadata
   * @param {string} id - Recording ID
   * @param {Object} updates - Fields to update (name, rating, notes, tags)
   * @returns {Promise<Object>} Updated recording
   */
  const updateRecording = useCallback(async (id, updates) => {
    setError(null);
    
    try {
      const updated = await recordingService.update(id, updates);
      
      // Update local state
      setRecordings(prev => 
        prev.map(rec => rec.id === id ? updated : rec)
      );
      
      return updated;
    } catch (err) {
      console.error('Failed to update recording:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  // ============================================
  // DELETE RECORDING
  // ============================================

  /**
   * Delete a recording
   * @param {string} id - Recording ID
   * @returns {Promise<boolean>} Success status
   */
  const deleteRecording = useCallback(async (id) => {
    setError(null);
    
    try {
      await recordingService.delete(id);
      
      // Update local state
      setRecordings(prev => prev.filter(rec => rec.id !== id));
      
      // Refresh storage stats
      const stats = await recordingService.getStorageStats();
      setStorageStats(stats);
      
      return true;
    } catch (err) {
      console.error('Failed to delete recording:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  // ============================================
  // GET BY EXERCISE
  // ============================================

  /**
   * Get recordings for a specific exercise
   * @param {string} patternId - Exercise pattern ID
   * @returns {Promise<Array>} Matching recordings
   */
  const getRecordingsByExercise = useCallback(async (patternId) => {
    try {
      return await recordingService.getByExercise(patternId);
    } catch (err) {
      console.error('Failed to get recordings by exercise:', err);
      setError(err.message);
      return [];
    }
  }, []);

  // ============================================
  // EXPORT RECORDING
  // ============================================

  /**
   * Export recording as downloadable file
   * @param {string} id - Recording ID
   */
  const exportRecording = useCallback(async (id) => {
    try {
      const recording = await recordingService.getById(id);
      if (recording) {
        recordingService.exportRecording(recording);
      }
    } catch (err) {
      console.error('Failed to export recording:', err);
      setError(err.message);
    }
  }, []);

  // ============================================
  // CLEAR ALL
  // ============================================

  /**
   * Clear all recordings (use with caution!)
   * @returns {Promise<boolean>} Success status
   */
  const clearAllRecordings = useCallback(async () => {
    setError(null);
    
    try {
      await recordingService.clearAll();
      setRecordings([]);
      
      const stats = await recordingService.getStorageStats();
      setStorageStats(stats);
      
      return true;
    } catch (err) {
      console.error('Failed to clear recordings:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  // ============================================
  // PLAYBACK URL MANAGEMENT
  // ============================================

  /**
   * Create a playback URL for a recording
   * @param {Object} recording - Recording object
   * @returns {string} Object URL for audio element
   */
  const createPlaybackUrl = useCallback((recording) => {
    return recordingService.createPlaybackUrl(recording);
  }, []);

  /**
   * Revoke a playback URL to free memory
   * @param {string} url - Object URL to revoke
   */
  const revokePlaybackUrl = useCallback((url) => {
    recordingService.revokePlaybackUrl(url);
  }, []);

  // ============================================
  // RETURN API
  // ============================================

  return {
    // State
    recordings,
    isLoading,
    error,
    storageStats,
    
    // Computed
    recordingCount: recordings.length,
    isEmpty: recordings.length === 0,
    
    // Actions
    loadRecordings,
    saveRecording,
    getRecording,
    updateRecording,
    deleteRecording,
    getRecordingsByExercise,
    exportRecording,
    clearAllRecordings,
    createPlaybackUrl,
    revokePlaybackUrl,
  };
}

export default useRecordingStorage;
