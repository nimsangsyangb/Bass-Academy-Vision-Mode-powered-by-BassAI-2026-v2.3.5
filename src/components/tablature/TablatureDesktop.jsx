/**
 * TablatureDesktop Component - Bass Trainer
 * Desktop horizontal tablature view with auto-scroll and progress bar
 */

import React, { useRef, useEffect } from 'react';
import TabString from './TabString.jsx';
import MeasureGuide from './MeasureGuide.jsx';
import ProgressBar from './ProgressBar.jsx';
import { STRING_ORDER } from '../../config/audioConfig.js';

function TablatureDesktop({ 
  tabData = [], 
  currentNoteIndex = -1, 
  selectedRoot = 'E', 
  selectedPattern = 'linear11thsMaj', 
  secondRoot = 'A', 
  secondPattern = 'linear11thsMin',
  tempo = 60,
  isPlaying = false
}) {
  const scrollContainerRef = useRef(null);
  const noteRefs = useRef([]);

  // Auto-scroll to active note
  useEffect(() => {
    if (currentNoteIndex >= 0 && noteRefs.current[currentNoteIndex]) {
      noteRefs.current[currentNoteIndex].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [currentNoteIndex]);

  return (
    <div className="hidden md:block">
      {/* Progress Bar */}
      <ProgressBar 
        currentIndex={currentNoteIndex}
        totalNotes={tabData.length}
        tempo={tempo}
        isPlaying={isPlaying}
        variant="default"
      />

      {/* Scrollable Tablature Container */}
      <div 
        ref={scrollContainerRef}
        className="p-8 overflow-x-auto scroll-smooth snap-x snap-mandatory"
      >
        <div className="min-w-[800px]">
          {STRING_ORDER.map(stringName => (
            <TabString
              key={stringName}
              stringName={stringName}
              notes={tabData}
              currentNoteIndex={currentNoteIndex}
              variant="desktop"
              noteRefs={noteRefs}
            />
          ))}
        </div>

        {/* Measure Guide */}
        <MeasureGuide
          selectedRoot={selectedRoot}
          selectedPattern={selectedPattern}
          secondRoot={secondRoot}
          secondPattern={secondPattern}
          variant="desktop"
        />
      </div>
    </div>
  );
}

export default TablatureDesktop;
