/**
 * LoopMeasure Component - Loop Mode
 * SVG-based staff rendering with bass clef, barlines, and notes
 */

import React, { useMemo } from 'react';
import LoopNote from './LoopNote.jsx';
import { RHYTHM_CONFIG } from '../../config/uiConfig.js';

// SVG paths for music notation
const BASS_CLEF_PATH = "M8.5,4.5 C8.5,2.5 10,1 12,1 C14,1 15.5,2.5 15.5,4.5 C15.5,6.5 14,8 12,8 C10,8 8.5,6.5 8.5,4.5 M16,2 L16,10 M18,3 A1,1 0 1,1 18,3.01 M18,7 A1,1 0 1,1 18,7.01";

// Map pitch to staff line position (0 = top line, 4 = bottom line for bass clef)
const PITCH_TO_LINE = {
  'G2': 0, 'F2': 0.5, 'E2': 1, 'D2': 1.5, 'C2': 2, 'B1': 2.5, 'A1': 3, 'G1': 3.5, 'F1': 4, 'E1': 4.5,
};

/**
 * @param {Object} props
 * @param {Array} props.notes - Array of note objects from tabData
 * @param {number} props.loopLength - Number of measures (1, 2, 4)
 * @param {number} props.highlightNoteIndex - Index of currently playing note
 * @param {number} props.playhead - Current playhead position 0..1
 */
export default function LoopMeasure({ 
  notes = [], 
  loopLength = 1,
  highlightNoteIndex = -1,
  playhead = 0,
}) {
  // Calculate note positions and filter to loop length
  const visibleNotes = useMemo(() => {
    const notesPerLoop = RHYTHM_CONFIG.notesPerMeasure * loopLength;
    const loopNotes = notes.slice(0, notesPerLoop);
    
    return loopNotes.map((note, index) => {
      // Calculate X position based on beat
      const beatPosition = index / RHYTHM_CONFIG.tripletsPerBeat;
      const totalBeats = RHYTHM_CONFIG.beatsPerMeasure * loopLength;
      const xPercent = (beatPosition / totalBeats) * 100;
      
      // Calculate Y position based on pitch (simplified)
      const pitch = note.pitch || `${note.string}${note.fret}`;
      const yLine = PITCH_TO_LINE[pitch] ?? 2; // Default to middle line
      
      return {
        ...note,
        index,
        xPercent: xPercent + 5, // Offset for clef space
        yPercent: 15 + (yLine * 15), // Map to percentage
        isActive: index === highlightNoteIndex,
        isPast: index < highlightNoteIndex,
      };
    });
  }, [notes, loopLength, highlightNoteIndex]);

  // Calculate measure width percentages for barlines
  const barlinePositions = useMemo(() => {
    const positions = [0]; // Start barline
    for (let i = 1; i <= loopLength; i++) {
      positions.push((i / loopLength) * 100);
    }
    return positions;
  }, [loopLength]);

  return (
    <div className="relative w-full h-48 sm:h-56 md:h-64 bg-[var(--color-primary-dark)]/30 rounded-xl overflow-hidden">
      {/* Staff lines */}
      <svg 
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* 5 horizontal staff lines */}
        {[0, 1, 2, 3, 4].map((line) => (
          <line
            key={line}
            x1="0"
            y1={20 + line * 15}
            x2="100"
            y2={20 + line * 15}
            stroke="var(--color-primary-light)"
            strokeWidth="0.3"
            opacity="0.6"
          />
        ))}
        
        {/* Barlines */}
        {barlinePositions.map((pos, idx) => (
          <line
            key={`bar-${idx}`}
            x1={pos}
            y1="15"
            x2={pos}
            y2="80"
            stroke="var(--color-primary-light)"
            strokeWidth={idx === 0 || idx === barlinePositions.length - 1 ? "0.8" : "0.4"}
            opacity="0.8"
          />
        ))}
      </svg>
      
      {/* Bass Clef */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-4xl sm:text-5xl text-[var(--color-cream)] opacity-70 select-none">
        𝄢
      </div>
      
      {/* Time Signature */}
      <div className="absolute left-12 sm:left-16 top-1/2 -translate-y-1/2 flex flex-col items-center text-xl sm:text-2xl font-bold text-[var(--color-cream)] opacity-70 select-none">
        <span>4</span>
        <span>4</span>
      </div>
      
      {/* Notes container - positioned to the right of clef/time sig */}
      <div className="absolute left-20 sm:left-24 right-4 top-0 bottom-0">
        {visibleNotes.map((note) => (
          <LoopNote
            key={note.id ?? note.index}
            note={note}
            isActive={note.isActive}
            isPast={note.isPast}
            positionX={(note.xPercent - 5) * (100 / 95)} // Adjust for container offset
            positionY={note.yPercent / 20}
          />
        ))}
      </div>
      
      {/* Loop indicator icon */}
      <div className="absolute top-2 right-3 text-[var(--color-gold)] opacity-60">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 2l4 4-4 4" />
          <path d="M3 11v-1a4 4 0 014-4h14" />
          <path d="M7 22l-4-4 4-4" />
          <path d="M21 13v1a4 4 0 01-4 4H3" />
        </svg>
      </div>
    </div>
  );
}
