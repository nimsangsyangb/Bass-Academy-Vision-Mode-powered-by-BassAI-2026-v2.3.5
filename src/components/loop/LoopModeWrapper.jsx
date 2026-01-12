/**
 * LoopModeWrapper Component - Loop Mode
 * Main container for the loop practice view
 */

import React, { useState, useCallback } from 'react';
import { RepeatIcon, Music } from 'lucide-react';

import LoopMeasure from './LoopMeasure.jsx';
import LoopGrid from './LoopGrid.jsx';
import Playhead from './Playhead.jsx';
import LoopControls from './LoopControls.jsx';
import { useLoopMode } from '../../hooks/useLoopMode.js';
import { LOOP_MODE_CONFIG, RHYTHM_CONFIG } from '../../config/uiConfig.js';
import { useHapticFeedback } from '../../hooks/useHapticFeedback.js';

/**
 * @param {Object} props
 * @param {Array} props.tabData - Note data from exercise
 * @param {number} props.currentNoteIndex - Current note from scheduler (for sync)
 * @param {Object} props.scheduler - Audio scheduler instance
 * @param {number} props.tempo - Current tempo in BPM
 * @param {boolean} props.isPlaying - Playback state
 * @param {Function} props.onPlay - Start playback callback
 * @param {Function} props.onStop - Stop playback callback
 */
export default function LoopModeWrapper({
  tabData = [],
  currentNoteIndex = -1,
  scheduler,
  tempo = 100,
  isPlaying = false,
  onPlay,
  onStop,
}) {
  // Local state for loop settings
  const [loopLength, setLoopLength] = useState(LOOP_MODE_CONFIG.defaultLoopLength);
  const [subdivision, setSubdivision] = useState(LOOP_MODE_CONFIG.defaultSubdivision);
  
  const { vibrateLoopRestart } = useHapticFeedback();
  
  // Loop mode hook for playhead animation
  const {
    playhead,
    highlightNoteIndex,
    loopDuration,
  } = useLoopMode({
    scheduler,
    tempo,
    loopLength,
    isPlaying,
    onLoopRestart: vibrateLoopRestart,
  });

  // Calculate current beat for grid highlighting
  const currentBeat = Math.floor(
    playhead * RHYTHM_CONFIG.beatsPerMeasure * loopLength
  );

  // Handle loop length change (only when not playing)
  const handleLoopLengthChange = useCallback((newLength) => {
    if (!isPlaying) {
      setLoopLength(newLength);
    }
  }, [isPlaying]);

  // Handle subdivision change
  const handleSubdivisionChange = useCallback((newSub) => {
    setSubdivision(newSub);
  }, []);

  return (
    <div className="w-full animate-fadeInUp">
      {/* Header */}
      <div className="bg-[var(--color-primary-dark)]/50 px-4 sm:px-6 py-3 border-b border-[var(--color-primary-medium)]/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg gradient-gold flex items-center justify-center">
            <RepeatIcon className="w-5 h-5 text-[var(--color-primary-deep)]" />
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-cream)] text-sm">
              Modo Loop
            </h3>
            <p className="text-xs text-[var(--color-primary-light)]">
              {loopLength} {loopLength === 1 ? 'compás' : 'compases'} • {tempo} BPM
            </p>
          </div>
        </div>
        
        {/* Loop duration indicator */}
        <div className="text-xs text-[var(--color-primary-light)] font-mono">
          {loopDuration.toFixed(1)}s loop
        </div>
      </div>
      
      {/* Main loop visualization */}
      <div className="relative p-4 sm:p-6 md:p-8">
        {/* Staff with notes */}
        <div className="relative">
          <LoopMeasure
            notes={tabData}
            loopLength={loopLength}
            highlightNoteIndex={highlightNoteIndex}
            playhead={playhead}
          />
          
          {/* Playhead overlay */}
          <div className="absolute left-20 sm:left-24 right-4 top-0 bottom-0">
            <Playhead progress={playhead} />
          </div>
        </div>
        
        {/* Subdivision grid */}
        <div className="mt-4 px-20 sm:px-24">
          <LoopGrid
            subdivision={subdivision}
            loopLength={loopLength}
            currentBeat={isPlaying ? currentBeat : -1}
          />
        </div>
      </div>
      
      {/* Controls */}
      <div className="border-t border-[var(--color-primary-medium)]/30">
        <LoopControls
          loopLength={loopLength}
          onLoopLengthChange={handleLoopLengthChange}
          subdivision={subdivision}
          onSubdivisionChange={handleSubdivisionChange}
          disabled={isPlaying}
        />
      </div>
      
      {/* Visual cue for practice mode */}
      {!isPlaying && (
        <div className="text-center py-4 text-sm text-[var(--color-primary-light)]">
          <span className="opacity-60">Presiona</span>
          <span className="mx-2 px-2 py-1 bg-[var(--color-gold)]/20 text-[var(--color-gold)] rounded font-medium">
            PLAY
          </span>
          <span className="opacity-60">para iniciar el loop</span>
        </div>
      )}
    </div>
  );
}
