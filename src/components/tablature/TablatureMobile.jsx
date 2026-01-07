/**
 * TablatureMobile Component - Bass Trainer
 * Mobile compact grid tablature view with progress bar
 */

import React, { useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import TabString from './TabString.jsx';
import MeasureGuide from './MeasureGuide.jsx';
import ProgressBar from './ProgressBar.jsx';
import { STRING_ORDER } from '../../config/audioConfig.js';

function TablatureMobile({ 
  tabData = [], 
  currentNoteIndex = -1, 
  selectedRoot = 'E', 
  selectedPattern = 'linear11thsMaj', 
  secondRoot = 'A', 
  secondPattern = 'linear11thsMin',
  tempo = 60,
  isPlaying = false
}) {
  const measure1Ref = useRef(null);
  const measure2Ref = useRef(null);

  // Split notes into two measures (0-11 and 12-23)
  const measure1Notes = tabData.slice(0, 12);
  const measure2Notes = tabData.slice(12, 24);

  // Auto-scroll to active measure
  useEffect(() => {
    if (currentNoteIndex >= 0 && currentNoteIndex < 12 && measure1Ref.current) {
      measure1Ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (currentNoteIndex >= 12 && measure2Ref.current) {
      measure2Ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentNoteIndex]);

  // Determine which measure is currently active
  const activeMeasure = currentNoteIndex < 12 ? 1 : 2;
  
  return (
    <div className="md:hidden">
      {/* Compact Progress Bar */}
      <ProgressBar 
        currentIndex={currentNoteIndex}
        totalNotes={tabData.length}
        tempo={tempo}
        isPlaying={isPlaying}
        variant="compact"
      />

      <div className="p-2 sm:p-4">
        {/* Measure 1 Section */}
        <div 
          ref={measure1Ref}
          className={`mb-4 transition-opacity duration-300 ${
            isPlaying && activeMeasure === 2 ? 'opacity-50' : 'opacity-100'
          }`}
        >
          <MeasureGuide
            selectedRoot={selectedRoot}
            selectedPattern={selectedPattern}
            secondRoot={secondRoot}
            secondPattern={secondPattern}
            variant="measure1"
          />
          
          {/* 4 Strings - Compact Tab */}
          <div className={`glass rounded-lg sm:rounded-xl p-2 sm:p-3 transition-all duration-300 ${
            activeMeasure === 1 && isPlaying ? 'ring-2 ring-[var(--color-gold)]/50' : ''
          }`}>
            {STRING_ORDER.map(stringName => (
              <TabString
                key={stringName}
                stringName={stringName}
                notes={measure1Notes}
                currentNoteIndex={currentNoteIndex}
                variant="mobile"
                colorClass="text-[var(--color-gold)]"
                lineColorClass="bg-[var(--color-gold)]"
              />
            ))}
          </div>
        </div>

        {/* Arrow Divider */}
        <div className="flex justify-center my-2">
          <ChevronRight className={`w-5 h-5 rotate-90 transition-colors duration-300 ${
            activeMeasure === 2 ? 'text-[var(--color-info)]' : 'text-[var(--color-primary-medium)]'
          }`} />
        </div>

        {/* Measure 2 Section */}
        <div 
          ref={measure2Ref}
          className={`transition-opacity duration-300 ${
            isPlaying && activeMeasure === 1 ? 'opacity-50' : 'opacity-100'
          }`}
        >
          <MeasureGuide
            selectedRoot={selectedRoot}
            selectedPattern={selectedPattern}
            secondRoot={secondRoot}
            secondPattern={secondPattern}
            variant="measure2"
          />
          
          {/* 4 Strings - Compact Tab */}
          <div className={`glass rounded-lg sm:rounded-xl p-2 sm:p-3 transition-all duration-300 ${
            activeMeasure === 2 && isPlaying ? 'ring-2 ring-[var(--color-info)]/50' : ''
          }`}>
            {STRING_ORDER.map(stringName => (
              <TabString
                key={stringName}
                stringName={stringName}
                notes={measure2Notes.map((note, idx) => ({ ...note, id: idx + 12 }))}
                currentNoteIndex={currentNoteIndex}
                variant="mobile"
                colorClass="text-[var(--color-info)]"
                lineColorClass="bg-[var(--color-info)]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TablatureMobile;
