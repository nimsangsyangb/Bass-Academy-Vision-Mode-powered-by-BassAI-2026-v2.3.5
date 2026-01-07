/**
 * Header Component - Bass Trainer
 * Mobile-first responsive header with 3-way theme selector
 */

import React from 'react';
import { GraduationCap, Music, Sun, Moon, Eye } from 'lucide-react';

function Header({ headerInfo, isPlaying, isCountingDown, theme, onThemeChange }) {
  // Theme options with labels and icons
  const themeOptions = [
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'practice', label: '🌙', ariaLabel: 'High contrast practice mode' },
  ];

  return (
    <header className="mb-4 sm:mb-8 md:mb-10 animate-fadeInUp text-center">
      {/* Institution Badge - Mobile Optimized */}
      <div className="flex flex-col items-center justify-center mb-3 sm:mb-5 md:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl gradient-gold flex items-center justify-center shadow-lg shadow-[var(--color-gold)]/20 flex-shrink-0">
            <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 text-[var(--color-primary-deep)]" />
          </div>
          <div className="text-left">
            <p className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.25em] text-[var(--color-gold)] font-medium mb-0.5">
              Bass Academy · 2026
            </p>
            <h1 className="font-[var(--font-display)] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-[var(--color-cream)] leading-tight">
              {headerInfo.type === 'artist' ? headerInfo.displayName : (
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <span className="truncate">{headerInfo.displayName}</span>
                  <span className="text-xs sm:text-sm md:text-base text-[var(--color-gold)] flex-shrink-0">
                    {'★'.repeat(headerInfo.difficulty || 3)}
                  </span>
                </span>
              )}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Title - Mobile Optimized */}
      <div className="mb-4 sm:mb-6 md:mb-8 px-2">
        <h2 className="font-[var(--font-display)] text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold text-gradient-gold mb-1 sm:mb-2 leading-tight">
          {headerInfo.subtitle}
        </h2>
        <p className="text-[var(--color-primary-light)] text-[10px] sm:text-xs md:text-sm lg:text-base">
          Interactive Arpeggio Study
        </p>
      </div>

      {/* Status Indicator & Theme Selector - Mobile Optimized */}
      <div className="flex justify-center items-center gap-2 sm:gap-3 md:gap-4 flex-wrap px-2">
        <div 
          className={`
            glass px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-full flex items-center gap-1.5 sm:gap-2 md:gap-3
            border transition-colors duration-300
            ${isCountingDown ? "border-[var(--color-warning)]" : isPlaying ? "border-[var(--color-success)]" : "border-[var(--color-primary-medium)]"}
          `}
        >
          <span
            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${
              isCountingDown ? "bg-[var(--color-warning)] animate-pulse" : isPlaying ? "bg-[var(--color-success)] animate-pulse" : "bg-[var(--color-error)]"
            }`}
          />
          <span className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider font-medium text-[var(--color-cream)]">
            {isCountingDown ? "Get Ready" : isPlaying ? "Playing" : "Ready"}
          </span>
          <Music className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 ${isCountingDown ? "text-[var(--color-warning)]" : isPlaying ? "text-[var(--color-success)]" : "text-[var(--color-primary-light)]"}`} />
        </div>

        {/* 3-Way Theme Selector - Segmented Control */}
        <div 
          className="glass rounded-full p-0.5 sm:p-1 flex items-center border border-[var(--color-primary-medium)]"
          role="radiogroup"
          aria-label="Theme selector"
        >
          {themeOptions.map(option => {
            const isActive = theme === option.id;
            const Icon = option.icon;
            
            return (
              <button
                key={option.id}
                onClick={() => onThemeChange(option.id)}
                className={`
                  px-2 py-1 sm:px-3 sm:py-1.5 rounded-full flex items-center gap-1 sm:gap-1.5
                  transition-all duration-300 text-[9px] sm:text-[10px] md:text-xs font-medium
                  ${isActive 
                    ? 'bg-[var(--color-gold)] text-[var(--color-primary-deep)] shadow-md' 
                    : 'text-[var(--color-primary-light)] hover:text-[var(--color-cream)] hover:bg-[var(--color-primary-dark)]'
                  }
                `}
                role="radio"
                aria-checked={isActive}
                aria-label={option.ariaLabel || `${option.label} theme`}
                title={option.id === 'practice' ? 'Practice Mode - High Contrast for Night' : `${option.label} Theme`}
              >
                {Icon ? (
                  <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isActive ? '' : 'opacity-70'}`} />
                ) : null}
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

export default Header;