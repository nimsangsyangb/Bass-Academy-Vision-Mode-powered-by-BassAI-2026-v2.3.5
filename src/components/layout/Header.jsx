/**
 * Header Component - Bass Trainer
 * Mobile-first responsive header
 */

import React from 'react';
import { GraduationCap, Music, Sun, Moon } from 'lucide-react';

function Header({ headerInfo, isPlaying, isCountingDown, theme, toggleTheme }) {
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

      {/* Status Indicator & Theme Toggle - Mobile Optimized */}
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

        {/* Theme Toggle Button - Mobile Optimized */}
        <button
          onClick={toggleTheme}
          className="glass px-3 sm:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-full flex items-center gap-1.5 sm:gap-2 
                   border border-[var(--color-primary-medium)] hover:border-[var(--color-gold)]
                   transition-all duration-300 hover:scale-105 active:scale-95 group"
          aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-[var(--color-gold)] group-hover:rotate-45 transition-transform duration-300" />
          ) : (
            <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-[var(--color-gold)] group-hover:-rotate-12 transition-transform duration-300" />
          )}
          <span className="text-[9px] sm:text-[10px] md:text-xs font-medium text-[var(--color-cream)]">
            {theme === 'dark' ? 'Claro' : 'Oscuro'}
          </span>
        </button>
      </div>
    </header>
  );
}

export default Header;