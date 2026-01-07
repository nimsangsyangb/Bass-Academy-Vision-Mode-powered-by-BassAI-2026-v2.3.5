/**
 * FullscreenTablature Component - Bass Academy
 * Fullscreen mode for tablature practice with integrated controls
 */

import React, { useRef, useEffect, useState } from 'react';
import { X, Play, Square, Volume2 } from 'lucide-react';
import { useFullscreen } from '../../hooks/useFullscreen';
import ProgressBar from './ProgressBar';
import TablatureDesktop from './TablatureDesktop';
import TablatureMobile from './TablatureMobile';
import FretboardView from '../FretboardView';
import { VIEW_MODES } from '../../config/uiConfig';
import './FullscreenTablature.css';

const FullscreenTablature = ({
  // Tablature data
  tabData,
  currentNoteIndex,
  selectedRoot,
  selectedPattern,
  secondRoot,
  secondPattern,
  
  // Playback state
  isPlaying,
  tempo,
  
  // Playback controls
  onPlayPause,
  onTempoChange,
  
  // Volume controls
  bassVolume,
  onBassVolumeChange,
  metronomeVolume,
  onMetronomeVolumeChange,
  
  // View mode
  viewMode = VIEW_MODES.TAB,
  
  // Close handler
  onClose,
}) => {
  const containerRef = useRef(null);
  const { enterFullscreen, exitFullscreen, isSupported } = useFullscreen();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detect mobile on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Enter fullscreen on mount
  useEffect(() => {
    if (containerRef.current && isSupported) {
      enterFullscreen(containerRef.current);
    }
  }, [enterFullscreen, isSupported]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC to exit (browser handles this for native fullscreen, but we also close our modal)
      if (e.key === 'Escape') {
        handleClose();
      }
      // Spacebar for Play/Pause
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        onPlayPause();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onPlayPause]);

  const handleClose = async () => {
    await exitFullscreen();
    onClose();
  };

  // Get pattern display names
  const getPatternShortName = (patternId) => {
    if (!patternId) return '';
    // Extract meaningful part from pattern ID
    return patternId.replace(/([A-Z])/g, ' $1').trim().substring(0, 15);
  };

  return (
    <div 
      ref={containerRef} 
      className="fullscreen-tablature-container"
      data-view-mode={viewMode}
    >
      {/* Header con información y botón de cerrar */}
      <div className="fullscreen-header">
        <div className="fullscreen-info">
          <span className="exercise-name">
            {selectedRoot} {getPatternShortName(selectedPattern)} → {secondRoot} {getPatternShortName(secondPattern)}
          </span>
          <span className="tempo-display">{tempo} BPM</span>
        </div>
        <button 
          onClick={handleClose}
          className="close-button"
          aria-label="Salir de pantalla completa"
        >
          <X size={28} />
        </button>
      </div>

      {/* Progress Bar - Fullscreen Variant */}
      <ProgressBar
        currentIndex={currentNoteIndex}
        totalNotes={tabData.length}
        tempo={tempo}
        isPlaying={isPlaying}
        variant="fullscreen"
      />

      {/* Área principal de tablatura */}
      <div className="fullscreen-tablature-content">
        {viewMode === VIEW_MODES.FRETBOARD ? (
          <FretboardView
            tabData={tabData}
            currentNoteIndex={currentNoteIndex}
          />
        ) : isMobile ? (
          <TablatureMobile
            tabData={tabData}
            currentNoteIndex={currentNoteIndex}
            selectedRoot={selectedRoot}
            selectedPattern={selectedPattern}
            secondRoot={secondRoot}
            secondPattern={secondPattern}
            tempo={tempo}
            isPlaying={isPlaying}
          />
        ) : (
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
        )}
      </div>

      {/* Controles de reproducción */}
      <div className="fullscreen-controls">
        {/* Play/Pause Button */}
        <button
          onClick={onPlayPause}
          className="control-button play-pause"
          aria-label={isPlaying ? 'Detener' : 'Reproducir'}
        >
          {isPlaying ? <Square size={32} /> : <Play size={32} />}
        </button>

        {/* Tempo Control */}
        <div className="tempo-control">
          <label htmlFor="fs-tempo-slider">Tempo</label>
          <input
            id="fs-tempo-slider"
            type="range"
            min="40"
            max="160"
            value={tempo}
            onChange={(e) => onTempoChange(parseInt(e.target.value))}
            className="tempo-slider"
          />
          <span className="tempo-value">{tempo}</span>
        </div>

        {/* Volume Controls */}
        <div className="volume-controls">
          <div className="volume-control-item">
            <Volume2 size={16} />
            <span>Bajo</span>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(bassVolume * 100)}
              onChange={(e) => onBassVolumeChange(Number(e.target.value) / 100)}
              className="volume-slider"
              aria-label="Volumen del bajo"
            />
          </div>
          <div className="volume-control-item">
            <Volume2 size={16} />
            <span>Metro</span>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(metronomeVolume * 100)}
              onChange={(e) => onMetronomeVolumeChange(Number(e.target.value) / 100)}
              className="volume-slider"
              aria-label="Volumen del metrónomo"
            />
          </div>
        </div>
      </div>

      {/* Keyboard Hints */}
      <div className="keyboard-hints">
        <span>Espacio: Play/Stop</span>
        <span>ESC: Salir</span>
      </div>
    </div>
  );
};

export default FullscreenTablature;
