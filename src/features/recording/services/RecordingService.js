/**
 * Recording Service - Bass Academy
 * CRUD operations for audio recordings using IndexedDB
 * 
 * @module RecordingService
 */

import { RECORDING_CONFIG, formatFileSize } from '../../../config/recordingConfig';

// ============================================
// DATABASE CONFIGURATION
// ============================================

const DB_NAME = 'bass-academy-recordings';
const DB_VERSION = 1;
const STORE_NAME = 'recordings';

// ============================================
// RECORDING SERVICE CLASS
// ============================================

class RecordingService {
  constructor() {
    this.db = null;
    this.initPromise = null;
  }

  /**
   * Initialize IndexedDB connection
   * @returns {Promise<IDBDatabase>} Database instance
   */
  async init() {
    // Return existing connection if available
    if (this.db) return this.db;
    
    // Return pending initialization if in progress
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('❌ IndexedDB error:', request.error);
        this.initPromise = null;
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ Recording database initialized');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create recordings object store
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          
          // Create indexes for querying
          store.createIndex('created', 'created', { unique: false });
          store.createIndex('exerciseId', 'exercise.patternId', { unique: false });
          store.createIndex('rating', 'rating', { unique: false });
          store.createIndex('name', 'name', { unique: false });
          
          console.log('📦 Recording store created with indexes');
        }
      };
    });

    return this.initPromise;
  }

  /**
   * Create and save a new recording
   * @param {Object} recordingData - Recording data to save
   * @returns {Promise<Object>} Saved recording with generated ID
   */
  async create(recordingData) {
    await this.init();

    // Check storage limits before saving
    const storageCheck = await this.checkStorageLimits(recordingData.size || 0);
    if (!storageCheck.canSave) {
      throw new Error(storageCheck.message);
    }

    const recording = {
      id: crypto.randomUUID(),
      created: Date.now(),
      modified: Date.now(),
      rating: 0,
      tags: [],
      notes: '',
      ...recordingData,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(recording);

      request.onsuccess = () => {
        console.log('✅ Recording saved:', recording.id);
        resolve(recording);
      };

      request.onerror = () => {
        console.error('❌ Save failed:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Get a recording by its ID
   * @param {string} id - Recording ID
   * @returns {Promise<Object|null>} Recording object or null
   */
  async getById(id) {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Get all recordings sorted by creation date (newest first)
   * @returns {Promise<Array>} Array of recordings
   */
  async getAll() {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('created');
      const request = index.openCursor(null, 'prev'); // Descending order

      const recordings = [];

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          recordings.push(cursor.value);
          cursor.continue();
        } else {
          resolve(recordings);
        }
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Get recordings for a specific exercise pattern
   * @param {string} patternId - Exercise pattern identifier
   * @returns {Promise<Array>} Matching recordings
   */
  async getByExercise(patternId) {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('exerciseId');
      const request = index.openCursor(IDBKeyRange.only(patternId));

      const recordings = [];

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          recordings.push(cursor.value);
          cursor.continue();
        } else {
          // Sort by date descending
          recordings.sort((a, b) => b.created - a.created);
          resolve(recordings);
        }
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Update an existing recording
   * @param {string} id - Recording ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated recording
   */
  async update(id, updates) {
    await this.init();

    const existing = await this.getById(id);
    if (!existing) {
      throw new Error(`Recording ${id} not found`);
    }

    const updated = {
      ...existing,
      ...updates,
      id, // Ensure ID is preserved
      modified: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(updated);

      request.onsuccess = () => {
        console.log('✅ Recording updated:', id);
        resolve(updated);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Delete a recording by ID
   * @param {string} id - Recording ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        console.log('✅ Recording deleted:', id);
        resolve(true);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Get total storage size used by recordings
   * @returns {Promise<number>} Total size in bytes
   */
  async getTotalSize() {
    const recordings = await this.getAll();
    return recordings.reduce((total, rec) => total + (rec.size || 0), 0);
  }

  /**
   * Get count of stored recordings
   * @returns {Promise<number>} Recording count
   */
  async getCount() {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.count();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Check storage limits before saving
   * @param {number} newRecordingSize - Size of new recording in bytes
   * @returns {Promise<Object>} { canSave, message, currentSize, maxSize }
   */
  async checkStorageLimits(newRecordingSize) {
    const { storage } = RECORDING_CONFIG;
    const count = await this.getCount();
    const totalSize = await this.getTotalSize();

    // Check recording count limit
    if (count >= storage.maxRecordings) {
      return {
        canSave: false,
        message: `Maximum recordings limit reached (${storage.maxRecordings}). Please delete some recordings.`,
        currentSize: totalSize,
        maxSize: storage.maxTotalSize,
      };
    }

    // Check individual recording size
    if (newRecordingSize > storage.maxRecordingSize) {
      return {
        canSave: false,
        message: `Recording too large (${formatFileSize(newRecordingSize)}). Maximum is ${formatFileSize(storage.maxRecordingSize)}.`,
        currentSize: totalSize,
        maxSize: storage.maxTotalSize,
      };
    }

    // Check total storage
    if (totalSize + newRecordingSize > storage.maxTotalSize) {
      return {
        canSave: false,
        message: `Storage limit reached. Current: ${formatFileSize(totalSize)}, Max: ${formatFileSize(storage.maxTotalSize)}. Please delete some recordings.`,
        currentSize: totalSize,
        maxSize: storage.maxTotalSize,
      };
    }

    // Check warning threshold
    const usagePercent = (totalSize + newRecordingSize) / storage.maxTotalSize;
    const isNearLimit = usagePercent >= storage.warningThreshold;

    return {
      canSave: true,
      message: isNearLimit ? `Storage ${Math.round(usagePercent * 100)}% full` : null,
      currentSize: totalSize,
      maxSize: storage.maxTotalSize,
      isNearLimit,
    };
  }

  /**
   * Get storage usage statistics
   * @returns {Promise<Object>} Storage stats
   */
  async getStorageStats() {
    const count = await this.getCount();
    const totalSize = await this.getTotalSize();
    const { storage } = RECORDING_CONFIG;

    return {
      count,
      maxCount: storage.maxRecordings,
      totalSize,
      maxSize: storage.maxTotalSize,
      usagePercent: Math.round((totalSize / storage.maxTotalSize) * 100),
      formattedSize: formatFileSize(totalSize),
      formattedMax: formatFileSize(storage.maxTotalSize),
    };
  }

  /**
   * Delete oldest recordings to free up space
   * @param {number} targetFreeSpace - Bytes to free up
   * @returns {Promise<number>} Number of recordings deleted
   */
  async cleanupOldest(targetFreeSpace) {
    const recordings = await this.getAll();
    
    // Sort by created date ascending (oldest first)
    recordings.sort((a, b) => a.created - b.created);

    let freedSpace = 0;
    let deletedCount = 0;

    for (const recording of recordings) {
      if (freedSpace >= targetFreeSpace) break;
      
      await this.delete(recording.id);
      freedSpace += recording.size || 0;
      deletedCount++;
    }

    console.log(`🧹 Cleaned up ${deletedCount} recordings, freed ${formatFileSize(freedSpace)}`);
    return deletedCount;
  }

  /**
   * Clear all recordings (with confirmation in mind)
   * @returns {Promise<boolean>} Success status
   */
  async clearAll() {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        console.log('✅ All recordings cleared');
        resolve(true);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Export a recording as a downloadable file
   * @param {Object} recording - Recording object with audioBlob
   * @param {string} filename - Optional custom filename
   */
  exportRecording(recording, filename = null) {
    if (!recording.audioBlob) {
      throw new Error('Recording has no audio data');
    }

    const blob = recording.audioBlob;
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `${recording.name || 'recording'}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Clean up object URL
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  /**
   * Create an audio URL for playback
   * @param {Object} recording - Recording with audioBlob
   * @returns {string} Object URL for audio element
   */
  createPlaybackUrl(recording) {
    if (!recording.audioBlob) {
      throw new Error('Recording has no audio data');
    }
    return URL.createObjectURL(recording.audioBlob);
  }

  /**
   * Revoke a playback URL to free memory
   * @param {string} url - Object URL to revoke
   */
  revokePlaybackUrl(url) {
    URL.revokeObjectURL(url);
  }
}

// Singleton instance
export const recordingService = new RecordingService();

export default RecordingService;
