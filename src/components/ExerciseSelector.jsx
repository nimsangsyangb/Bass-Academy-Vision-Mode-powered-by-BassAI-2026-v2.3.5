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
 * ExerciseSelector - Mobile-first responsive design
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
  isPlaying,
  selectedCategory = null 
}) => {
  const patternsByCategory = getPatternsByCategory();
  
  // Filter categories based on selectedCategory
  const filteredCategories = selectedCategory 
    ? CATEGORIES.filter(cat => cat.id === selectedCategory)
    : CATEGORIES;

  return (
    <div className="glass-strong rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-5 md:mb-6 animate-fadeInUp" style={{animationDelay: "0.15s"}}>
      {/* Section Header - Mobile Optimized */}
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-5">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl gradient-gold flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-primary-deep)]" />
        </div>
        <div>
          <h3 className="font-semibold text-[var(--color-cream)] text-sm sm:text-base">Exercise Library</h3>
          <p className="text-[10px] sm:text-xs text-[var(--color-primary-light)]">
            Select arpeggio type and root note
          </p>
        </div>
      </div>

      {/* Two-measure exercise selection - Mobile Optimized */}
      <div className="flex flex-col gap-3 sm:gap-4 md:grid md:grid-cols-2">
        {/* Measure 1 */}
        <div className="glass rounded-lg sm:rounded-xl p-3 sm:p-4 border-l-3 sm:border-l-4 border-[var(--color-gold)]">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[var(--color-primary-light)] font-medium">
              Measure 1
            </span>
            <span className="text-[var(--color-gold)] font-mono font-bold text-xs sm:text-sm truncate">
              {formatNoteName(selectedRoot)}{PATTERNS[selectedPattern]?.name}
            </span>
          </div>

          {/* Pattern Selector */}
          <div className="mb-2.5 sm:mb-3">
            <label className="text-[10px] sm:text-xs text-[var(--color-primary-light)] mb-1 sm:mb-1.5 block uppercase tracking-wider">
              Pattern
            </label>
            <div className="relative">
              <select
                value={selectedPattern}
                onChange={(e) => setSelectedPattern(e.target.value)}
                disabled={isPlaying}
                aria-label="Measure 1 pattern"
                className="w-full appearance-none bg-[var(--color-primary-dark)] text-[var(--color-cream)] 
                         rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 pr-9 sm:pr-10 text-xs sm:text-sm font-medium
                         border border-[var(--color-primary-medium)] 
                         focus:border-[var(--color-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/20
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 cursor-pointer"
              >
                {filteredCategories.map(category => (
                  patternsByCategory[category.id]?.length > 0 && (
                    <optgroup key={category.id} label={`${category.icon} ${category.name}`}>
                      {patternsByCategory[category.id]?.map(pattern => (
                        <option key={pattern.id} value={pattern.id}>
                          {pattern.name}
                        </option>
                      ))}
                    </optgroup>
                  )
                ))}
              </select>
              <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-primary-light)] pointer-events-none" />
            </div>
          </div>

          {/* Root Note Selector */}
          <div>
            <label className="text-[10px] sm:text-xs text-[var(--color-primary-light)] mb-1 sm:mb-1.5 block uppercase tracking-wider">
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
                    py-1.5 sm:py-2 rounded-md sm:rounded-lg font-mono text-[10px] sm:text-xs font-bold
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
        <div className="glass rounded-lg sm:rounded-xl p-3 sm:p-4 border-l-3 sm:border-l-4 border-[var(--color-info)]">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[var(--color-primary-light)] font-medium">
              Measure 2
            </span>
            <span className="text-[var(--color-info)] font-mono font-bold text-xs sm:text-sm truncate">
              {formatNoteName(secondRoot)}{PATTERNS[secondPattern]?.name}
            </span>
          </div>

          {/* Pattern Selector */}
          <div className="mb-2.5 sm:mb-3">
            <label className="text-[10px] sm:text-xs text-[var(--color-primary-light)] mb-1 sm:mb-1.5 block uppercase tracking-wider">
              Pattern
            </label>
            <div className="relative">
              <select
                value={secondPattern}
                onChange={(e) => setSecondPattern(e.target.value)}
                disabled={isPlaying}
                aria-label="Measure 2 pattern"
                className="w-full appearance-none bg-[var(--color-primary-dark)] text-[var(--color-cream)] 
                         rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 pr-9 sm:pr-10 text-xs sm:text-sm font-medium
                         border border-[var(--color-primary-medium)] 
                         focus:border-[var(--color-info)] focus:outline-none focus:ring-2 focus:ring-[var(--color-info)]/20
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 cursor-pointer"
              >
                {filteredCategories.map(category => (
                  patternsByCategory[category.id]?.length > 0 && (
                    <optgroup key={category.id} label={`${category.icon} ${category.name}`}>
                      {patternsByCategory[category.id]?.map(pattern => (
                        <option key={pattern.id} value={pattern.id}>
                          {pattern.name}
                        </option>
                      ))}
                    </optgroup>
                  )
                ))}
              </select>
              <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-primary-light)] pointer-events-none" />
            </div>
          </div>

          {/* Root Note Selector */}
          <div>
            <label className="text-[10px] sm:text-xs text-[var(--color-primary-light)] mb-1 sm:mb-1.5 block uppercase tracking-wider">
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
                    py-1.5 sm:py-2 rounded-md sm:rounded-lg font-mono text-[10px] sm:text-xs font-bold
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

      {/* Pattern Info - Mobile Optimized */}
      <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="glass rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 flex items-center gap-1.5 sm:gap-2">
          <Music className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--color-gold)] flex-shrink-0" />
          <span className="text-[10px] sm:text-xs text-[var(--color-primary-light)] line-clamp-1">
            {PATTERNS[selectedPattern]?.description}
          </span>
        </div>
        <div className="glass rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 flex items-center justify-center sm:justify-start">
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