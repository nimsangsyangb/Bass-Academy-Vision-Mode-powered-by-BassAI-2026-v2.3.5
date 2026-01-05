/**
 * ControlPanel Component - Bass Trainer
 * Mobile-first responsive control wrapper
 */

import React from 'react';
import BeatIndicator from './BeatIndicator.jsx';
import PlaybackControls from './PlaybackControls.jsx';
import { TempoControl } from './TempoControl.jsx';
import { VolumeControl } from './VolumeControl.jsx';

function ControlPanel({
  // Beat state
  currentBeat,
  currentTriplet,
  // Playback
  isPlaying,
  handlePlay,
  handleStop,
  // Settings
  isLooping,
  toggleLoop,
  isNotesMuted,
  toggleNotesMuted,
  isMetronomeEnabled,
  toggleMetronome,
  isCountdownEnabled,
  toggleCountdown,
  tempo,
  setTempo,
  // Volume
  bassVolume,
  setBassVolume,
  metronomeVolume,
  setMetronomeVolume,
}) {
  return (
    <div 
      className="glass-strong rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 animate-fadeInUp" 
      style={{animationDelay: "0.3s"}}
    >
      <div className="flex flex-col gap-3 sm:gap-4 md:gap-6">
        {/* Beat Indicator */}
        <BeatIndicator 
          currentBeat={currentBeat} 
          currentTriplet={currentTriplet} 
        />

        {/* Playback Controls */}
        <PlaybackControls
          isPlaying={isPlaying}
          handlePlay={handlePlay}
          handleStop={handleStop}
          isLooping={isLooping}
          toggleLoop={toggleLoop}
          isNotesMuted={isNotesMuted}
          toggleNotesMuted={toggleNotesMuted}
          isMetronomeEnabled={isMetronomeEnabled}
          toggleMetronome={toggleMetronome}
          isCountdownEnabled={isCountdownEnabled}
          toggleCountdown={toggleCountdown}
        />

        {/* Tempo Control */}
        <TempoControl 
          tempo={tempo} 
          setTempo={setTempo} 
        />

        {/* Volume Control */}
        <VolumeControl
          bassVolume={bassVolume}
          setBassVolume={setBassVolume}
          metronomeVolume={metronomeVolume}
          setMetronomeVolume={setMetronomeVolume}
        />
      </div>
    </div>
  );
}

export default ControlPanel;