/**
 * WaveformVisualizer - Canvas-based audio waveform display
 * Shows audio waveform with playback progress indicator
 * 
 * @module WaveformVisualizer
 */

import React, { useRef, useEffect, useCallback, useState } from 'react';

// ============================================
// COMPONENT: WaveformVisualizer
// ============================================

/**
 * Canvas-based waveform visualization with progress
 * 
 * @param {Object} props
 * @param {Float32Array|Array} props.waveformData - Pre-computed waveform data
 * @param {Blob|string} props.audioSource - Audio blob or URL for analysis
 * @param {number} props.progress - Playback progress (0-1)
 * @param {number} props.duration - Total duration in seconds
 * @param {Function} props.onSeek - Called when user clicks to seek (receives 0-1 position)
 * @param {number} props.height - Component height in pixels
 * @param {boolean} props.isPlaying - Whether audio is currently playing
 * @param {boolean} props.interactive - Enable click-to-seek
 * @param {number} props.audioOffset - Offset in seconds to compensate for recording latency
 * @param {string} props.colorPlayed - Color for played portion
 * @param {string} props.colorUnplayed - Color for unplayed portion
 * @param {string} props.className - Additional CSS classes
 */
const WaveformVisualizer = ({
  waveformData = null,
  audioSource = null,
  progress = 0,
  duration = 0,
  onSeek = null,
  height = 120,
  isPlaying = false,
  interactive = true,
  audioOffset = 0.5, // Default 0.5s offset to compensate for recording latency
  colorPlayed = 'var(--color-gold)',
  colorUnplayed = 'var(--color-primary-light)',
  className = '',
}) => {
  // ============================================
  // REFS & STATE
  // ============================================

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [computedWaveform, setComputedWaveform] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverPosition, setHoverPosition] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Use provided data or computed data
  const displayData = waveformData || computedWaveform;

  // ============================================
  // COMPUTE WAVEFORM FROM AUDIO
  // ============================================

  useEffect(() => {
    // Skip if we already have waveform data
    if (waveformData) return;
    
    // Skip if no audio source provided
    if (!audioSource) return;
    
    // Skip if dimensions not ready
    if (!dimensions.width || dimensions.width === 0) return;

    const computeWaveform = async () => {
      try {
        let arrayBuffer;
        
        // Handle Blob directly
        if (audioSource instanceof Blob) {
          arrayBuffer = await audioSource.arrayBuffer();
        } 
        // Handle blob URLs (blob:http://...) - these CANNOT be fetched again
        // So we generate a placeholder waveform instead
        else if (typeof audioSource === 'string' && audioSource.startsWith('blob:')) {
          // Generate a simple placeholder waveform for blob URLs
          // since we can't re-fetch them
          const numBars = Math.min(dimensions.width || 200, 100);
          const waveform = new Float32Array(numBars);
          
          // Generate a natural-looking waveform pattern
          for (let i = 0; i < numBars; i++) {
            // Create a semi-random but aesthetically pleasing pattern
            const baseAmplitude = 0.3 + Math.sin(i * 0.2) * 0.2;
            const variation = Math.sin(i * 0.5) * 0.15 + Math.sin(i * 0.8) * 0.1;
            const noise = (Math.sin(i * 2.1) * 0.1 + Math.sin(i * 3.7) * 0.05);
            waveform[i] = Math.max(0.1, Math.min(1, baseAmplitude + variation + noise));
          }
          
          setComputedWaveform(waveform);
          return;
        }
        // Handle regular URLs (http://, https://, relative paths)
        else if (typeof audioSource === 'string') {
          try {
            const response = await fetch(audioSource);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            arrayBuffer = await response.arrayBuffer();
          } catch (fetchErr) {
            console.warn('Failed to fetch audio for waveform, using placeholder:', fetchErr);
            // Generate placeholder on fetch error
            const numBars = Math.min(dimensions.width || 200, 100);
            const waveform = new Float32Array(numBars);
            for (let i = 0; i < numBars; i++) {
              waveform[i] = 0.3 + Math.sin(i * 0.3) * 0.2 + Math.sin(i * 0.7) * 0.15;
            }
            setComputedWaveform(waveform);
            return;
          }
        } else {
          return;
        }

        // Decode the audio data if we have an arrayBuffer
        if (arrayBuffer) {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          
          // Get audio data from first channel
          const channelData = audioBuffer.getChannelData(0);
          
          // Compute number of bars based on canvas width
          const numBars = Math.min(dimensions.width || 200, 100);
          const samplesPerBar = Math.floor(channelData.length / numBars);
          
          if (samplesPerBar === 0) {
            audioContext.close();
            return;
          }
          
          const waveform = new Float32Array(numBars);
          
          for (let i = 0; i < numBars; i++) {
            let sum = 0;
            const start = i * samplesPerBar;
            const end = Math.min(start + samplesPerBar, channelData.length);
            
            for (let j = start; j < end; j++) {
              sum += Math.abs(channelData[j]);
            }
            
            waveform[i] = sum / (end - start);
          }

          // Normalize
          const max = Math.max(...waveform);
          if (max > 0) {
            for (let i = 0; i < waveform.length; i++) {
              waveform[i] = waveform[i] / max;
            }
          }

          setComputedWaveform(waveform);
          audioContext.close();
        }
      } catch (err) {
        console.error('Failed to compute waveform:', err);
        // Generate fallback waveform on any error
        const numBars = Math.min(dimensions.width || 200, 100);
        const waveform = new Float32Array(numBars);
        for (let i = 0; i < numBars; i++) {
          waveform[i] = 0.3 + Math.sin(i * 0.3) * 0.2;
        }
        setComputedWaveform(waveform);
      }
    };

    computeWaveform();
  }, [audioSource, waveformData, dimensions.width]);

  // ============================================
  // RESIZE OBSERVER
  // ============================================

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(container);
    
    // Initial size
    setDimensions({ 
      width: container.clientWidth, 
      height 
    });

    return () => resizeObserver.disconnect();
  }, [height]);

  // ============================================
  // DRAW WAVEFORM
  // ============================================

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !displayData || displayData.length === 0) return;

    const ctx = canvas.getContext('2d');
    const { width: canvasWidth, height: canvasHeight } = dimensions;

    if (canvasWidth === 0 || canvasHeight === 0) return;

    // Set canvas resolution (retina support)
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Calculate bar dimensions
    const numBars = displayData.length;
    const barWidth = (canvasWidth / numBars) * 0.8;
    const barGap = (canvasWidth / numBars) * 0.2;
    const centerY = canvasHeight / 2;
    const maxBarHeight = canvasHeight * 0.8;

    // Progress point with offset compensation
    // The offset accounts for recording latency (time between MediaRecorder start and first audio)
    const offsetProgress = duration > 0 
      ? Math.max(0, Math.min(1, progress - (audioOffset / duration)))
      : progress;
    const progressX = canvasWidth * offsetProgress;

    // Draw bars
    for (let i = 0; i < numBars; i++) {
      const x = i * (barWidth + barGap);
      const barHeight = Math.max(displayData[i] * maxBarHeight, 2);

      // Determine if bar is played
      const isPlayed = x < progressX;
      
      // Set color
      ctx.fillStyle = isPlayed ? colorPlayed : colorUnplayed;

      // Draw bar (centered)
      ctx.beginPath();
      ctx.roundRect(
        x, 
        centerY - barHeight / 2, 
        barWidth, 
        barHeight, 
        barWidth / 2
      );
      ctx.fill();
    }

    // Draw playhead
    if (progress > 0 && progress < 1) {
      ctx.fillStyle = colorPlayed;
      ctx.fillRect(progressX - 1.5, 0, 3, canvasHeight);
    }

    // Draw hover indicator
    if (isHovering && interactive) {
      const hoverX = hoverPosition * canvasWidth;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(hoverX, 0);
      ctx.lineTo(hoverX, canvasHeight);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [displayData, dimensions, progress, duration, audioOffset, isHovering, hoverPosition, interactive, colorPlayed, colorUnplayed]);

  // Redraw on changes
  useEffect(() => {
    draw();
  }, [draw]);

  // ============================================
  // INTERACTION HANDLERS
  // ============================================

  const handleClick = useCallback((e) => {
    if (!interactive || !onSeek) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = x / rect.width;
    
    onSeek(Math.max(0, Math.min(1, position)));
  }, [interactive, onSeek]);

  const handleMouseMove = useCallback((e) => {
    if (!interactive) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = x / rect.width;
    
    setHoverPosition(Math.max(0, Math.min(1, position)));
  }, [interactive]);

  const handleMouseEnter = useCallback(() => {
    if (interactive) setIsHovering(true);
  }, [interactive]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  // ============================================
  // RENDER
  // ============================================

  // Placeholder when no data
  if (!displayData && !audioSource) {
    return (
      <div 
        ref={containerRef}
        className={`relative w-full bg-white/5 rounded-lg overflow-hidden ${className}`}
        style={{ height }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-white/30 text-sm">
          No waveform data
        </div>
      </div>
    );
  }

  // Loading state
  if (!displayData && audioSource) {
    return (
      <div 
        ref={containerRef}
        className={`relative w-full bg-white/5 rounded-lg overflow-hidden ${className}`}
        style={{ height }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative w-full bg-white/5 rounded-lg overflow-hidden ${className}`}
      style={{ height }}
    >
      <canvas
        ref={canvasRef}
        style={{ 
          width: '100%', 
          height: '100%',
          cursor: interactive && onSeek ? 'pointer' : 'default',
        }}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      {/* Time indicator on hover */}
      {isHovering && interactive && duration > 0 && (
        <div 
          className="absolute top-1 px-2 py-0.5 bg-black/80 text-white text-xs rounded pointer-events-none"
          style={{ left: `${hoverPosition * 100}%`, transform: 'translateX(-50%)' }}
        >
          {formatTime(hoverPosition * duration)}
        </div>
      )}

      {/* Playing indicator */}
      {isPlaying && (
        <div className="absolute bottom-1 right-1 flex items-center gap-1 px-2 py-0.5 bg-red-500/80 text-white text-xs rounded">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          Playing
        </div>
      )}
    </div>
  );
};

// Helper function
function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default WaveformVisualizer;
