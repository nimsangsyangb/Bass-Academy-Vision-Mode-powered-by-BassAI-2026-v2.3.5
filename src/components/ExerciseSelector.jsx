import React from 'react';
import { Music, ChevronDown, Sparkles } from 'lucide-react';
import { 
  PATTERNS, 
  NOTES, 
  CATEGORIES, 
  formatNoteName, 
  getPatternsByCategory 
} from '../data/exerciseLibrary';

/**
 * ExerciseSelector - Premium UI for selecting arpeggio patterns and root notes
 */
const ExerciseSelector = ({ 
  selectedPattern, 
  setSelectedPattern, 
  selectedRoot, 
  setSelectedRoot,
  secondPattern,
  setSecondPattern,
  secondRoot,
  setSecondRoot,
  isPlaying 
}) => {
  const patternsByCategory = getPatternsByCategory();

  return (
    <div className="glass-strong rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 animate-fadeInUp" style={{animationDelay: "0.15s"}}>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4 sm:mb-5">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-gold flex items-center justify-center">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-primary-deep)]" />
        </div>
        <div>
          <h3 className="font-semibold text-[var(--color-cream)] text-sm sm:text-base">Exercise Library</h3>
          <p className="text-[10px] sm:text-xs text-[var(--color-primary-light)]">
            Select arpeggio type and root note
          </p>
        </div>
      </div>

      {/* Two-measure exercise selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Measure 1 */}
        <div className="glass rounded-xl p-3 sm:p-4 border-l-4 border-[var(--color-gold)]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs uppercase tracking-wider text-[var(--color-primary-light)] font-medium">
              Measure 1
            </span>
            <span className="text-[var(--color-gold)] font-mono font-bold">
              {formatNoteName(selectedRoot)}{PATTERNS[selectedPattern]?.name}
            </span>
          </div>

          {/* Pattern Selector */}
          <div className="mb-3">
            <label className="text-[10px] sm:text-xs text-[var(--color-primary-light)] mb-1.5 block uppercase tracking-wider">
              Pattern
            </label>
            <div className="relative">
              <select
                value={selectedPattern}
                onChange={(e) => setSelectedPattern(e.target.value)}
                disabled={isPlaying}
                aria-label="Measure 1 pattern"
                className="w-full appearance-none bg-[var(--color-primary-dark)] text-[var(--color-cream)] 
                         rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 pr-10 text-xs sm:text-sm font-medium
                         border border-[var(--color-primary-medium)] 
                         focus:border-[var(--color-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/20
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 cursor-pointer"
              >
                {CATEGORIES.map(category => (
                  <optgroup key={category.id} label={`${category.icon} ${category.name}`}>
                    {patternsByCategory[category.id]?.map(pattern => (
                      <option key={pattern.id} value={pattern.id}>
                        {pattern.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-primary-light)] pointer-events-none" />
            </div>
          </div>

          {/* Root Note Selector */}
          <div>
            <label className="text-[10px] sm:text-xs text-[var(--color-primary-light)] mb-1.5 block uppercase tracking-wider">
              Root Note
            </label>
            <div className="grid grid-cols-6 gap-1 sm:gap-1.5" role="radiogroup" aria-label="Measure 1 root note">
              {NOTES.map(note => (
                <button
                  key={note}
                  onClick={() => setSelectedRoot(note)}
                  disabled={isPlaying}
                  role="radio"
                  aria-checked={selectedRoot === note}
                  aria-label={formatNoteName(note)}
                  className={`
                    py-1.5 sm:py-2 rounded-lg font-mono text-[10px] sm:text-xs font-bold
                    transition-all duration-200 border
                    focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:ring-offset-1 focus:ring-offset-[var(--color-primary-deep)]
                    ${selectedRoot === note
                      ? 'bg-[var(--color-gold)] text-[var(--color-primary-deep)] border-[var(--color-gold-light)] scale-105'
                      : 'bg-[var(--color-primary-dark)] text-[var(--color-cream)] border-[var(--color-primary-medium)] hover:border-[var(--color-gold)]/50'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {formatNoteName(note)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Measure 2 */}
        <div className="glass rounded-xl p-3 sm:p-4 border-l-4 border-[var(--color-info)]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs uppercase tracking-wider text-[var(--color-primary-light)] font-medium">
              Measure 2
            </span>
            <span className="text-[var(--color-info)] font-mono font-bold">
              {formatNoteName(secondRoot)}{PATTERNS[secondPattern]?.name}
            </span>
          </div>

          {/* Pattern Selector */}
          <div className="mb-3">
            <label className="text-[10px] sm:text-xs text-[var(--color-primary-light)] mb-1.5 block uppercase tracking-wider">
              Pattern
            </label>
            <div className="relative">
              <select
                value={secondPattern}
                onChange={(e) => setSecondPattern(e.target.value)}
                disabled={isPlaying}
                aria-label="Measure 2 pattern"
                className="w-full appearance-none bg-[var(--color-primary-dark)] text-[var(--color-cream)] 
                         rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 pr-10 text-xs sm:text-sm font-medium
                         border border-[var(--color-primary-medium)] 
                         focus:border-[var(--color-info)] focus:outline-none focus:ring-2 focus:ring-[var(--color-info)]/20
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 cursor-pointer"
              >
                {CATEGORIES.map(category => (
                  <optgroup key={category.id} label={`${category.icon} ${category.name}`}>
                    {patternsByCategory[category.id]?.map(pattern => (
                      <option key={pattern.id} value={pattern.id}>
                        {pattern.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-primary-light)] pointer-events-none" />
            </div>
          </div>

          {/* Root Note Selector */}
          <div>
            <label className="text-[10px] sm:text-xs text-[var(--color-primary-light)] mb-1.5 block uppercase tracking-wider">
              Root Note
            </label>
            <div className="grid grid-cols-6 gap-1 sm:gap-1.5" role="radiogroup" aria-label="Measure 2 root note">
              {NOTES.map(note => (
                <button
                  key={note}
                  onClick={() => setSecondRoot(note)}
                  disabled={isPlaying}
                  role="radio"
                  aria-checked={secondRoot === note}
                  aria-label={formatNoteName(note)}
                  className={`
                    py-1.5 sm:py-2 rounded-lg font-mono text-[10px] sm:text-xs font-bold
                    transition-all duration-200 border
                    focus:outline-none focus:ring-2 focus:ring-[var(--color-info)] focus:ring-offset-1 focus:ring-offset-[var(--color-primary-deep)]
                    ${secondRoot === note
                      ? 'bg-[var(--color-info)] text-[var(--color-primary-deep)] border-[var(--color-info)] scale-105'
                      : 'bg-[var(--color-primary-dark)] text-[var(--color-cream)] border-[var(--color-primary-medium)] hover:border-[var(--color-info)]/50'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {formatNoteName(note)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pattern Info */}
      <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
        <div className="glass rounded-lg px-3 py-1.5 flex items-center gap-2">
          <Music className="w-3.5 h-3.5 text-[var(--color-gold)]" />
          <span className="text-[10px] sm:text-xs text-[var(--color-primary-light)]">
            {PATTERNS[selectedPattern]?.description}
          </span>
        </div>
        <div className="glass rounded-lg px-3 py-1.5">
          <span className="text-[10px] sm:text-xs text-[var(--color-primary-light)]">
            Difficulty: 
            <span className="ml-1 text-[var(--color-gold)]">
              {'★'.repeat(PATTERNS[selectedPattern]?.difficulty || 0)}
              {'☆'.repeat(5 - (PATTERNS[selectedPattern]?.difficulty || 0))}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExerciseSelector;
