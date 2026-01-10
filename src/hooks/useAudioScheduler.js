/**
 * useAudioScheduler Hook - Bass Trainer
 * Handles scheduling of notes with lookahead scheduling
 */

import { useRef, useCallback, useEffect } from 'react';
import { LOOK_AHEAD } from '../config/audioConfig.js';
import { RHYTHM_CONFIG } from '../config/uiConfig.js';

export function useAudioScheduler({
  audio,
  notes,
  playerState,
  actions,
  onLoopRestart,
}) {
  // Refs for mutable values (avoid stale closures)
  const nextNoteTimeRef = useRef(0);
  const timerIDRef = useRef(null);
  const playIndexRef = useRef(0);
  const schedulerRef = useRef(null);
  
  // Refs for current values
  const notesRef = useRef(notes);
  const stateRef = useRef(playerState);
  
  // Keep refs in sync
  useEffect(() => {
    notesRef.current = notes;
  }, [notes]);
  
  useEffect(() => {
    stateRef.current = playerState;
  }, [playerState]);
  
  /**
   * Schedule a single note
   */
  const scheduleNote = useCallback((index, time) => {
    const note = notesRef.current[index];
    const state = stateRef.current;
    
    // Play the note sound with current bass volume
    audio.playSound(note.string, note.fret, time, state.isNotesMuted, state.bassVolume);
    
    // Calculate beat info
    const tripletInBeat = index % RHYTHM_CONFIG.tripletsPerBeat;
    const beat = Math.floor(index / RHYTHM_CONFIG.tripletsPerBeat) % RHYTHM_CONFIG.beatsPerMeasure;
    const isFirstNoteOfBeat = tripletInBeat === 0;
    const isDownbeat = beat === 0;
    
    // Play metronome click with current metronome volume
    audio.playMetronomeClick(time, isDownbeat, isFirstNoteOfBeat, state.isMetronomeEnabled, state.metronomeVolume);
    
    // Schedule visual update
    const currentTime = audio.getCurrentTime();
    const delay = Math.max(0, (time - currentTime) * 1000);
    
    setTimeout(() => {
      if (stateRef.current.isPlaying) {
        actions.updateNote(index);
      }
    }, delay);
  }, [audio, actions]);
  
  /**
   * Advance to next note
   */
  const nextNote = useCallback(() => {
    const state = stateRef.current;
    const secondsPerBeat = 60.0 / state.tempo;
    const noteTime = secondsPerBeat / RHYTHM_CONFIG.tripletsPerBeat;
    nextNoteTimeRef.current += noteTime;
    
    playIndexRef.current++;
    
    if (playIndexRef.current >= notesRef.current.length) {
      if (state.isLooping) {
        playIndexRef.current = 0;
        // Trigger loop restart callback (for haptic feedback)
        if (onLoopRestart) {
          onLoopRestart();
        }
      } else {
        return false; // End playback
      }
    }
    return true; // Continue
  }, [onLoopRestart]);
  
  /**
   * Main scheduler loop
   */
  const scheduler = useCallback(() => {
    const currentTime = audio.getCurrentTime();
    
    // Schedule notes within lookahead window
    while (nextNoteTimeRef.current < currentTime + LOOK_AHEAD) {
      if (playIndexRef.current < notesRef.current.length) {
        scheduleNote(playIndexRef.current, nextNoteTimeRef.current);
      }
      
      const shouldContinue = nextNote();
      
      if (!shouldContinue) {
        actions.stop();
        return;
      }
    }
    
    timerIDRef.current = requestAnimationFrame(schedulerRef.current);
  }, [audio, scheduleNote, nextNote, actions]);
  
  // Keep scheduler ref updated
  useEffect(() => {
    schedulerRef.current = scheduler;
  }, [scheduler]);
  
  /**
   * Start the scheduler
   */
  const start = useCallback(() => {
    playIndexRef.current = 0;
    nextNoteTimeRef.current = audio.getCurrentTime() + 0.1;
    scheduler();
  }, [audio, scheduler]);
  
  /**
   * Stop the scheduler
   */
  const stop = useCallback(() => {
    if (timerIDRef.current) {
      cancelAnimationFrame(timerIDRef.current);
      timerIDRef.current = null;
    }
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIDRef.current) {
        cancelAnimationFrame(timerIDRef.current);
      }
    };
  }, []);
  
  return {
    start,
    stop,
    playIndexRef,
    nextNoteTimeRef,
  };
}

export default useAudioScheduler;
