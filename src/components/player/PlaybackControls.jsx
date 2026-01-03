/**
 * PlaybackControls Component - Bass Trainer
 * Play/Stop button and toggle buttons (Loop, Mute, Metronome, Countdown)
 */

import React from 'react';
import { 
  Play, 
  Square, 
  RefreshCw, 
  Music, 
  Volume2, 
  VolumeX, 
  Timer, 
  TimerOff 
} from 'lucide-react';

function PlaybackControls({
  isPlaying,
  handlePlay,
  handleStop,
  isLooping,
  toggleLoop,
  isNotesMuted,
  toggleNotesMuted,
  isMetronomeEnabled,
  toggleMetronome,
  isCountdownEnabled,
  toggleCountdown,
}) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Main Play/Stop Button */}
      <div className="flex justify-center">
        {!isPlaying ? (
          <button
            onClick={handlePlay}
            aria-label="Play exercise"
            className="group relative bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] 
                     text-[var(--color-primary-deep)] px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold 
                     flex items-center gap-3 transition-all duration-300 
                     hover:shadow-[0_0_30px_var(--color-gold)/40] hover:scale-105
                     active:scale-95 text-lg sm:text-xl min-w-[140px] justify-center
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:ring-offset-2 focus:ring-offset-[var(--color-primary-deep)]"
          >
            <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
            <span>PLAY</span>
          </button>
        ) : (
          <button
            onClick={handleStop}
            aria-label="Stop exercise"
            className="group relative bg-gradient-to-r from-[var(--color-error)] to-red-400 
                     text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold 
                     flex items-center gap-3 transition-all duration-300 
                     hover:shadow-[0_0_30px_var(--color-error)/40] hover:scale-105
                     active:scale-95 text-lg sm:text-xl min-w-[140px] justify-center
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-error)] focus:ring-offset-2 focus:ring-offset-[var(--color-primary-deep)]"
          >
            <Square className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
            <span>STOP</span>
          </button>
        )}
      </div>

      {/* Toggle Buttons - 4 Columns on Mobile */}
      <div className="grid grid-cols-4 gap-2 sm:flex sm:justify-center sm:gap-4">
        {/* Loop Toggle */}
        <ToggleButton
          isActive={isLooping}
          onClick={toggleLoop}
          icon={<RefreshCw className={`w-5 h-5 sm:w-5 sm:h-5 ${isLooping ? "animate-spin-slow" : ""}`} />}
          label={isLooping ? "ON" : "OFF"}
          activeColor="success"
          ariaLabel={`Loop mode ${isLooping ? 'enabled' : 'disabled'}`}
        />

        {/* Mute Notes Toggle */}
        <ToggleButton
          isActive={isNotesMuted}
          onClick={toggleNotesMuted}
          icon={<Music className="w-5 h-5 sm:w-5 sm:h-5" />}
          label={isNotesMuted ? "OFF" : "ON"}
          activeColor="warning"
          ariaLabel={`Bass notes ${isNotesMuted ? 'muted' : 'enabled'}`}
        />

        {/* Metronome Toggle */}
        <ToggleButton
          isActive={isMetronomeEnabled}
          onClick={toggleMetronome}
          icon={isMetronomeEnabled 
            ? <Volume2 className="w-5 h-5 sm:w-5 sm:h-5" /> 
            : <VolumeX className="w-5 h-5 sm:w-5 sm:h-5" />
          }
          label={isMetronomeEnabled ? "ON" : "OFF"}
          activeColor="info"
          ariaLabel={`Metronome ${isMetronomeEnabled ? 'enabled' : 'disabled'}`}
        />

        {/* Countdown Toggle */}
        <ToggleButton
          isActive={isCountdownEnabled}
          onClick={toggleCountdown}
          icon={isCountdownEnabled 
            ? <Timer className="w-5 h-5 sm:w-5 sm:h-5" /> 
            : <TimerOff className="w-5 h-5 sm:w-5 sm:h-5" />
          }
          label="3-2-1"
          activeColor="gold"
          ariaLabel={`Countdown ${isCountdownEnabled ? 'enabled' : 'disabled'}`}
          title={isCountdownEnabled ? "Countdown 3-2-1 activado" : "Sin countdown, inicio directo"}
        />
      </div>
    </div>
  );
}

// Reusable Toggle Button sub-component
function ToggleButton({ isActive, onClick, icon, label, activeColor, ariaLabel, title }) {
  const colorClasses = {
    success: {
      active: "bg-[var(--color-success)]/20 border-[var(--color-success)] text-[var(--color-success)]",
    },
    warning: {
      active: "bg-[var(--color-warning)]/20 border-[var(--color-warning)] text-[var(--color-warning)]",
    },
    info: {
      active: "bg-[var(--color-info)]/20 border-[var(--color-info)] text-[var(--color-info)]",
    },
    gold: {
      active: "bg-[var(--color-gold)]/20 border-[var(--color-gold)] text-[var(--color-gold)]",
    },
  };
  
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      aria-pressed={isActive}
      role="switch"
      className={`
        flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2
        px-3 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-medium
        transition-all duration-300 border-2 text-xs sm:text-base
        min-h-[60px] sm:min-h-0
        ${
          isActive
            ? colorClasses[activeColor].active
            : "bg-[var(--color-primary-dark)] border-[var(--color-primary-medium)] text-[var(--color-primary-light)] hover:border-[var(--color-primary-light)]"
        }
      `}
    >
      {icon}
      <span className="text-[10px] sm:text-sm font-semibold">{label}</span>
    </button>
  );
}

export default PlaybackControls;
