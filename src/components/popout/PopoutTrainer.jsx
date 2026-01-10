/**
 * PopoutTrainer - Bass Trainer
 * Simplified trainer component for the pop-out window
 * Shows tablature and essential controls only
 */

import React from 'react';
import { 
  Play, 
  Square, 
  ExternalLink, 
  X, 
  Repeat, 
  Volume2,
  Wifi,
  WifiOff,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

// Import tablature component
import TablatureDesktop from '../tablature/TablatureDesktop.jsx';

const PopoutTrainer = ({
  isConnected,
  isPlaying,
  tempo,
  currentNoteIndex,
  tabData,
  headerInfo,
  selectedRoot,
  selectedPattern,
  secondRoot,
  secondPattern,
  isMetronomeEnabled,
  isLooping,
  onPlayPause,
  onTempoChange,
  onToggleMetronome,
  onToggleLoop,
  onClose,
  onReturnToMain,
}) => {
  // Connection status indicator
  const ConnectionBadge = () => (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
      isConnected 
        ? 'bg-green-500/20 text-green-400' 
        : 'bg-red-500/20 text-red-400'
    }`}>
      {isConnected ? (
        <>
          <Wifi size={12} />
          <span>Synced</span>
        </>
      ) : (
        <>
          <WifiOff size={12} />
          <span>Disconnected</span>
        </>
      )}
    </div>
  );

  return (
    <div className="popout-trainer min-h-screen flex flex-col bg-[var(--color-primary-deep)]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-primary-medium)]/30 bg-[var(--color-primary-dark)]/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center text-[var(--color-primary-deep)] font-bold text-sm">
            🎸
          </div>
          <div>
            <h1 className="font-semibold text-[var(--color-cream)] text-sm leading-tight">
              {headerInfo?.displayName || 'Bass Trainer'}
            </h1>
            {headerInfo?.subtitle && (
              <p className="text-[var(--color-primary-light)] text-xs">
                {headerInfo.subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ConnectionBadge />
          
          <button
            onClick={onReturnToMain}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-primary-medium)] text-[var(--color-primary-light)] hover:text-[var(--color-gold)] transition-colors"
            title="Return to main window"
          >
            <ExternalLink size={12} />
            <span className="hidden sm:inline">Main Window</span>
          </button>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--color-primary-light)] hover:text-red-400 hover:bg-red-400/10 transition-colors"
            title="Close popout"
          >
            <X size={16} />
          </button>
        </div>
      </header>

      {/* Tablature Area */}
      <div className="flex-1 overflow-hidden">
        {tabData && tabData.length > 0 ? (
          <div className="h-full">
            <TablatureDesktop
              tabData={tabData}
              currentNoteIndex={currentNoteIndex}
              selectedRoot={selectedRoot}
              selectedPattern={selectedPattern}
              secondRoot={secondRoot}
              secondPattern={secondPattern}
              tempo={tempo}
              isPlaying={isPlaying}
            />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-[var(--color-primary-light)]">
            <div className="text-center">
              <div className="text-4xl mb-4">🎸</div>
              <p className="text-sm">
                {isConnected 
                  ? 'Waiting for exercise data...' 
                  : 'Connecting to main window...'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="px-4 py-3 border-t border-[var(--color-primary-medium)]/30 bg-[var(--color-primary-dark)]/80 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Play/Stop */}
          <button
            onClick={onPlayPause}
            disabled={!isConnected}
            className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
              isPlaying
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'gradient-gold text-[var(--color-primary-deep)] hover:opacity-90'
            } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isPlaying ? <Square size={20} /> : <Play size={20} className="ml-0.5" />}
          </button>

          {/* Center: Tempo Control */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onTempoChange(Math.max(40, tempo - 5))}
              disabled={!isConnected}
              className="p-2 rounded-lg bg-[var(--color-primary-medium)] text-[var(--color-primary-light)] hover:text-[var(--color-gold)] transition-colors disabled:opacity-50"
            >
              <ChevronDown size={16} />
            </button>
            
            <div className="px-4 py-2 rounded-lg bg-[var(--color-primary-dark)] border border-[var(--color-primary-medium)] min-w-[80px] text-center">
              <span className="text-[var(--color-gold)] font-mono font-bold">{tempo}</span>
              <span className="text-[var(--color-primary-light)] text-xs ml-1">BPM</span>
            </div>
            
            <button
              onClick={() => onTempoChange(Math.min(200, tempo + 5))}
              disabled={!isConnected}
              className="p-2 rounded-lg bg-[var(--color-primary-medium)] text-[var(--color-primary-light)] hover:text-[var(--color-gold)] transition-colors disabled:opacity-50"
            >
              <ChevronUp size={16} />
            </button>
          </div>

          {/* Right: Toggle buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleLoop}
              disabled={!isConnected}
              className={`p-2.5 rounded-lg transition-colors ${
                isLooping
                  ? 'bg-[var(--color-gold)]/20 text-[var(--color-gold)]'
                  : 'bg-[var(--color-primary-medium)] text-[var(--color-primary-light)]'
              } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Toggle loop"
            >
              <Repeat size={16} />
            </button>
            
            <button
              onClick={onToggleMetronome}
              disabled={!isConnected}
              className={`p-2.5 rounded-lg transition-colors ${
                isMetronomeEnabled
                  ? 'bg-[var(--color-gold)]/20 text-[var(--color-gold)]'
                  : 'bg-[var(--color-primary-medium)] text-[var(--color-primary-light)]'
              } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Toggle metronome"
            >
              <Volume2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopoutTrainer;
