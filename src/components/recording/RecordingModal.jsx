/**
 * RecordingModal - Modal for managing recordings
 * Full-screen on mobile, centered modal on desktop
 * 
 * @module RecordingModal
 */

import React, { useEffect, useCallback } from 'react';
import RecordingsList from '../../features/recording/components/RecordingsList';
import RecordingControls from '../../features/recording/components/RecordingControls';
import { formatDuration, formatFileSize } from '../../config/recordingConfig';

// ============================================
// ICONS
// ============================================

const CloseIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const MicIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const ListIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

// ============================================
// COMPONENT: RecordingModal
// ============================================

/**
 * Modal for recording and managing recordings
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close handler
 * @param {Object} props.recordingHook - Result of useMediaRecorder hook
 * @param {Object} props.storageHook - Result of useRecordingStorage hook
 * @param {Object} props.exerciseContext - Current exercise info
 * @param {string} props.initialTab - Initial tab: 'record' | 'library'
 */
const RecordingModal = ({
  isOpen = false,
  onClose = () => {},
  recordingHook = {},
  storageHook = {},
  exerciseContext = {},
  initialTab = 'record',
}) => {
  const [activeTab, setActiveTab] = React.useState(initialTab);

  // Extract from hooks
  const {
    recordingState,
    recordingDuration,
    audioBlob,
    audioUrl,
    error,
    countdown,
    audioLevel,
    isSupported,
    isRecording,
    isPaused,
    isStopped,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    cancelRecording,
    reset,
  } = recordingHook;

  const {
    recordings,
    isLoading,
    error: storageError,
    storageStats,
    saveRecording,
    deleteRecording,
    exportRecording,
    updateRecording,
    createPlaybackUrl,
    revokePlaybackUrl,
  } = storageHook;

  // ============================================
  // KEYBOARD HANDLING
  // ============================================

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        // Don't close if recording
        if (isRecording || isPaused) {
          e.preventDefault();
          return;
        }
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isRecording, isPaused, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ============================================
  // SAVE HANDLER
  // ============================================

  const handleSave = useCallback(async () => {
    if (!audioBlob) return;

    try {
      await saveRecording({
        blob: audioBlob,
        duration: recordingDuration,
        size: audioBlob.size,
        mimeType: audioBlob.type,
      }, exerciseContext);

      reset();
      setActiveTab('library');
    } catch (err) {
      console.error('Failed to save recording:', err);
    }
  }, [audioBlob, recordingDuration, exerciseContext, saveRecording, reset]);

  // ============================================
  // RATING HANDLER
  // ============================================

  const handleRatingChange = useCallback(async (id, rating) => {
    await updateRecording(id, { rating });
  }, [updateRecording]);

  // ============================================
  // RENDER
  // ============================================

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => {
          if (!isRecording && !isPaused) onClose();
        }}
      />

      {/* Modal */}
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:w-[90vw] sm:max-w-4xl bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0a1628] border-0 sm:border sm:border-white/10 sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <MicIcon />
            Recordings
          </h2>

          <button
            onClick={onClose}
            disabled={isRecording || isPaused}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('record')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'record'
                ? 'text-[#C9A554] border-b-2 border-[#C9A554] bg-white/5'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            <MicIcon className="w-4 h-4" />
            Record
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'library'
                ? 'text-[#C9A554] border-b-2 border-[#C9A554] bg-white/5'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            <ListIcon className="w-4 h-4" />
            Library ({recordings.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'record' && (
            <div className="max-w-xl mx-auto">
              {/* Recording Controls */}
              <RecordingControls
                recordingState={recordingState}
                duration={recordingDuration}
                countdown={countdown}
                audioLevel={audioLevel}
                audioBlob={audioBlob}
                error={error}
                onStart={startRecording}
                onStop={stopRecording}
                onPause={pauseRecording}
                onResume={resumeRecording}
                onCancel={cancelRecording}
                onSave={handleSave}
                isSupported={isSupported}
                variant="full"
              />

              {/* Preview Player (when stopped with recording) */}
              {isStopped && audioUrl && (
                <div className="mt-6 p-4 bg-white/5 rounded-xl">
                  <h3 className="text-sm font-medium text-white/70 mb-3">Preview</h3>
                  <audio 
                    src={audioUrl} 
                    controls 
                    className="w-full h-10"
                  />
                  <div className="flex items-center justify-between mt-3 text-sm text-white/50">
                    <span>{formatDuration(recordingDuration)}</span>
                    <span>{formatFileSize(audioBlob?.size || 0)}</span>
                  </div>
                </div>
              )}

              {/* Exercise Context Info */}
              {exerciseContext.patternId && (
                <div className="mt-6 p-4 bg-white/5 rounded-xl">
                  <h3 className="text-sm font-medium text-white/70 mb-2">Recording Context</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-[#C9A554]/20 text-[#C9A554] text-xs rounded">
                      {exerciseContext.rootNote} - {exerciseContext.patternId}
                    </span>
                    {exerciseContext.tempo && (
                      <span className="px-2 py-1 bg-white/10 text-white/60 text-xs rounded">
                        {exerciseContext.tempo} BPM
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'library' && (
            <RecordingsList
              recordings={recordings}
              isLoading={isLoading}
              error={storageError}
              storageStats={storageStats}
              onDelete={deleteRecording}
              onExport={exportRecording}
              onRatingChange={handleRatingChange}
              createPlaybackUrl={createPlaybackUrl}
              revokePlaybackUrl={revokePlaybackUrl}
            />
          )}
        </div>

        {/* Footer with Storage Stats */}
        {storageStats && (
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center justify-between text-xs text-white/40">
              <span>
                {storageStats.count} / {storageStats.maxCount} recordings
              </span>
              <span>
                {storageStats.formattedSize} / {storageStats.formattedMax} storage used
              </span>
            </div>
            <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${
                  storageStats.usagePercent >= 90 ? 'bg-red-500' :
                  storageStats.usagePercent >= 70 ? 'bg-amber-500' :
                  'bg-[#C9A554]'
                }`}
                style={{ width: `${storageStats.usagePercent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordingModal;
