/**
 * PlaybackControls Component - Bass Trainer
 * Mobile-first optimized controls
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
      {/* Main Play/Stop Button - Mobile Optimized */}
      <div className="flex justify-center">
        {!isPlaying ? (
          <button
            onClick={handlePlay}
            aria-label="Play exercise"
            className="group relative bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] 
                     text-[var(--color-primary-deep)] px-8 sm:px-10 md:px-12 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold 
                     flex items-center gap-2 sm:gap-3 transition-all duration-300 
                     hover:shadow-[0_0_30px_var(--color-gold)/40] hover:scale-105
                     active:scale-95 text-base sm:text-lg md:text-xl min-w-[140px] sm:min-w-[160px] justify-center
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:ring-offset-2 focus:ring-offset-[var(--color-primary-deep)]"
          >
            <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 fill-current" />
            <span>PLAY</span>
          </button>
        ) : (
          <button
            onClick={handleStop}
            aria-label="Stop exercise"
            className="group relative bg-gradient-to-r from-[var(--color-error)] to-red-400 
                     text-white px-8 sm:px-10 md:px-12 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold 
                     flex items-center gap-2 sm:gap-3 transition-all duration-300 
                     hover:shadow-[0_0_30px_var(--color-error)/40] hover:scale-105
                     active:scale-95 text-base sm:text-lg md:text-xl min-w-[140px] sm:min-w-[160px] justify-center
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-error)] focus:ring-offset-2 focus:ring-offset-[var(--color-primary-deep)]"
          >
            <Square className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 fill-current" />
            <span>STOP</span>
          </button>
        )}
      </div>

      {/* Toggle Buttons - Mobile Optimized Grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 md:flex md:justify-center md:gap-4">
        {/* Loop Toggle */}
        <ToggleButton
          isActive={isLooping}
          onClick={toggleLoop}
          icon={<RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isLooping ? "animate-spin-slow" : ""}`} />}
          label="Loop"
          subLabel={isLooping ? "ON" : "OFF"}
          activeColor="success"
          ariaLabel={`Loop mode ${isLooping ? 'enabled' : 'disabled'}`}
        />

        {/* Mute Notes Toggle */}
        <ToggleButton
          isActive={isNotesMuted}
          onClick={toggleNotesMuted}
          icon={<Music className="w-4 h-4 sm:w-5 sm:h-5" />}
          label="Bass"
          subLabel={isNotesMuted ? "OFF" : "ON"}
          activeColor="warning"
          ariaLabel={`Bass notes ${isNotesMuted ? 'muted' : 'enabled'}`}
        />

        {/* Metronome Toggle */}
        <ToggleButton
          isActive={isMetronomeEnabled}
          onClick={toggleMetronome}
          icon={isMetronomeEnabled 
            ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> 
            : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
          }
          label="Metro"
          subLabel={isMetronomeEnabled ? "ON" : "OFF"}
          activeColor="info"
          ariaLabel={`Metronome ${isMetronomeEnabled ? 'enabled' : 'disabled'}`}
        />

        {/* Countdown Toggle */}
        <ToggleButton
          isActive={isCountdownEnabled}
          onClick={toggleCountdown}
          icon={isCountdownEnabled 
            ? <Timer className="w-4 h-4 sm:w-5 sm:h-5" /> 
            : <TimerOff className="w-4 h-4 sm:w-5 sm:h-5" />
          }
          label="3-2-1"
          subLabel={isCountdownEnabled ? "ON" : "OFF"}
          activeColor="gold"
          ariaLabel={`Countdown ${isCountdownEnabled ? 'enabled' : 'disabled'}`}
          title={isCountdownEnabled ? "Countdown 3-2-1 activado" : "Sin countdown, inicio directo"}
        />
      </div>
    </div>
  );
}

// Reusable Toggle Button sub-component - Mobile Optimized
function ToggleButton({ isActive, onClick, icon, label, subLabel, activeColor, ariaLabel, title }) {
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
        flex flex-col items-center justify-center gap-1 sm:gap-1.5
        px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl md:rounded-2xl font-medium
        transition-all duration-300 border-2 text-xs sm:text-sm
        min-h-[70px] sm:min-h-[75px] md:min-h-0
        ${
          isActive
            ? colorClasses[activeColor].active
            : "bg-[var(--color-primary-dark)] border-[var(--color-primary-medium)] text-[var(--color-primary-light)] hover:border-[var(--color-primary-light)]"
        }
      `}
    >
      {icon}
      <div className="flex flex-col items-center gap-0">
        <span className="text-[10px] sm:text-xs font-semibold leading-tight">{label}</span>
        <span className="text-[9px] sm:text-[10px] opacity-80 leading-tight">{subLabel}</span>
      </div>
    </button>
  );
}

export default PlaybackControls;