/**
 * RecordingsList - Grid/List view of saved recordings
 * Displays all recordings with preview and management options
 * 
 * @module RecordingsList
 */

import React, { useState, useCallback } from 'react';
import { formatDuration, formatFileSize } from '../../../config/recordingConfig';
import RecordingPlayer from './RecordingPlayer';

// ============================================
// ICONS
// ============================================

const PlayIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const TrashIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const DownloadIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const StarIcon = ({ className = "w-4 h-4", filled = false }) => (
  filled ? (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ) : (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
);

const ChevronDownIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const GridIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const ListIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

// ============================================
// COMPONENT: RecordingCard
// ============================================

const RecordingCard = ({
  recording,
  onPlay,
  onDelete,
  onExport,
  onRatingChange,
  isExpanded,
  onToggleExpand,
  createPlaybackUrl,
  revokePlaybackUrl,
}) => {
  const [playbackUrl, setPlaybackUrl] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePlay = useCallback(() => {
    if (playbackUrl) {
      // Already have URL, toggle expand
      onToggleExpand();
    } else {
      // Create new URL and expand
      const url = createPlaybackUrl(recording);
      setPlaybackUrl(url);
      onToggleExpand();
    }
  }, [recording, playbackUrl, createPlaybackUrl, onToggleExpand]);

  const handleClose = useCallback(() => {
    if (playbackUrl) {
      revokePlaybackUrl(playbackUrl);
      setPlaybackUrl(null);
    }
    onToggleExpand();
  }, [playbackUrl, revokePlaybackUrl, onToggleExpand]);

  const handleDelete = useCallback(async () => {
    if (!confirm('Are you sure you want to delete this recording?')) return;
    
    setIsDeleting(true);
    try {
      await onDelete(recording.id);
    } finally {
      setIsDeleting(false);
    }
  }, [recording.id, onDelete]);

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        onClick={() => onRatingChange?.(recording.id, star)}
        className="text-[#C9A554] hover:scale-110 transition-transform"
      >
        <StarIcon filled={star <= (recording.rating || 0)} />
      </button>
    ));
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden transition-all duration-200 hover:border-white/20">
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-white truncate">
              {recording.name || 'Recording'}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-white/50">
              <span>{formatDuration(recording.duration)}</span>
              <span>•</span>
              <span>{formatFileSize(recording.size)}</span>
            </div>
            <div className="text-xs text-white/40 mt-1">
              {new Date(recording.created).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>

          {/* Play Button */}
          <button
            onClick={handlePlay}
            className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-[#C9A554] to-[#E0C285] hover:from-[#d4b05f] hover:to-[#e8cc93] text-[#0D1B2A] rounded-full transition-all hover:scale-105 active:scale-95 flex-shrink-0"
          >
            <PlayIcon />
          </button>
        </div>

        {/* Exercise Info */}
        {recording.exercise?.patternId && (
          <div className="mt-3 px-2 py-1 bg-white/5 rounded-lg inline-flex items-center gap-1 text-xs text-white/60">
            <span className="font-medium text-[#C9A554]">{recording.exercise.rootNote}</span>
            <span>-</span>
            <span>{recording.exercise.patternId}</span>
            {recording.exercise.tempo && (
              <>
                <span>•</span>
                <span>{recording.exercise.tempo} BPM</span>
              </>
            )}
          </div>
        )}

        {/* Rating & Actions */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-0.5">
            {renderStars()}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onExport?.(recording.id)}
              className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Download"
            >
              <DownloadIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
              title="Delete"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Player */}
      {isExpanded && playbackUrl && (
        <div className="border-t border-white/10 p-4">
          <RecordingPlayer
            audioUrl={playbackUrl}
            recording={recording}
            showWaveform={true}
            showSpeedControl={true}
            variant="full"
          />
          <button
            onClick={handleClose}
            className="w-full mt-3 py-2 text-sm text-white/50 hover:text-white/70 transition-colors"
          >
            Close Player
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================
// COMPONENT: RecordingsList
// ============================================

/**
 * Grid/List view of saved recordings
 * 
 * @param {Object} props
 * @param {Array} props.recordings - Array of recording objects
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message
 * @param {Object} props.storageStats - Storage statistics
 * @param {Function} props.onDelete - Delete handler
 * @param {Function} props.onExport - Export handler
 * @param {Function} props.onRatingChange - Rating change handler
 * @param {Function} props.createPlaybackUrl - Create playback URL
 * @param {Function} props.revokePlaybackUrl - Revoke playback URL
 * @param {string} props.className - Additional CSS classes
 */
const RecordingsList = ({
  recordings = [],
  isLoading = false,
  error = null,
  storageStats = null,
  onDelete = async () => {},
  onExport = () => {},
  onRatingChange = () => {},
  createPlaybackUrl = () => '',
  revokePlaybackUrl = () => {},
  className = '',
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'name' | 'duration' | 'rating'
  const [expandedId, setExpandedId] = useState(null);

  // Sort recordings
  const sortedRecordings = [...recordings].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      case 'duration':
        return (b.duration || 0) - (a.duration || 0);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'date':
      default:
        return (b.created || 0) - (a.created || 0);
    }
  });

  const handleToggleExpand = useCallback((id) => {
    setExpandedId(prev => prev === id ? null : id);
  }, []);

  // ============================================
  // RENDER: LOADING
  // ============================================

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
      </div>
    );
  }

  // ============================================
  // RENDER: ERROR
  // ============================================

  if (error) {
    return (
      <div className={`flex items-center justify-center py-12 text-red-400 ${className}`}>
        <span>{error}</span>
      </div>
    );
  }

  // ============================================
  // RENDER: EMPTY
  // ============================================

  if (recordings.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
        <div className="w-16 h-16 mb-4 text-white/20">
          <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white/60">No Recordings Yet</h3>
        <p className="mt-1 text-sm text-white/40">
          Start recording your practice sessions to see them here
        </p>
      </div>
    );
  }

  // ============================================
  // RENDER: LIST
  // ============================================

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/50">
            {recordings.length} recording{recordings.length !== 1 ? 's' : ''}
          </span>
          {storageStats && (
            <span className="text-xs text-white/30">
              ({storageStats.formattedSize} / {storageStats.formattedMax})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none px-3 py-1.5 pr-8 bg-white/5 border border-white/10 rounded-lg text-sm text-white/70 cursor-pointer focus:outline-none focus:border-white/30"
            >
              <option value="date">Newest</option>
              <option value="name">Name</option>
              <option value="duration">Duration</option>
              <option value="rating">Rating</option>
            </select>
            <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/70'}`}
            >
              <GridIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/70'}`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Recordings Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'flex flex-col gap-3'
      }>
        {sortedRecordings.map((recording) => (
          <RecordingCard
            key={recording.id}
            recording={recording}
            onDelete={onDelete}
            onExport={onExport}
            onRatingChange={onRatingChange}
            isExpanded={expandedId === recording.id}
            onToggleExpand={() => handleToggleExpand(recording.id)}
            createPlaybackUrl={createPlaybackUrl}
            revokePlaybackUrl={revokePlaybackUrl}
          />
        ))}
      </div>

      {/* Storage Warning */}
      {storageStats && storageStats.usagePercent >= 80 && (
        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-sm text-amber-200">
            Storage {storageStats.usagePercent}% full. Consider deleting old recordings.
          </span>
        </div>
      )}
    </div>
  );
};

export default RecordingsList;
