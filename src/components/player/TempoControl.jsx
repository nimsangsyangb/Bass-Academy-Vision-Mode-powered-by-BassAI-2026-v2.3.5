/**
 * TempoControl Component - Bass Trainer
 * Mobile-first responsive tempo slider
 */

import React from 'react';
import { Volume2, Music } from 'lucide-react';
import { TEMPO_CONFIG } from '../config/audioConfig.js';

export function TempoControl({ tempo, setTempo }) {
  return (
    <div className="w-full">
      <div className="glass rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 border border-[var(--color-primary-medium)]">
        <div className="flex justify-between items-center mb-2 sm:mb-3">
          <span className="text-[var(--color-primary-light)] text-xs sm:text-sm font-medium uppercase tracking-wider">
            Tempo
          </span>
          <span className="text-xl sm:text-2xl md:text-3xl font-mono font-bold text-[var(--color-gold)]">
            {tempo}<span className="text-[10px] sm:text-xs md:text-sm ml-1 text-[var(--color-primary-light)]">BPM</span>
          </span>
        </div>
        <input
          type="range"
          min={TEMPO_CONFIG.min}
          max={TEMPO_CONFIG.max}
          step={TEMPO_CONFIG.step}
          value={tempo}
          onChange={(e) => setTempo(Number(e.target.value))}
          aria-label="Tempo control"
          aria-valuetext={`${tempo} beats per minute`}
          className="w-full h-2 sm:h-2.5 md:h-3 bg-[var(--color-primary-dark)] rounded-full appearance-none cursor-pointer
                   focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:ring-offset-2 focus:ring-offset-[var(--color-primary-deep)]
                   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                   sm:[&::-webkit-slider-thumb]:w-6 sm:[&::-webkit-slider-thumb]:h-6 
                   [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-gold)] 
                   [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 
                   sm:[&::-webkit-slider-thumb]:border-3 md:[&::-webkit-slider-thumb]:border-4 
                   [&::-webkit-slider-thumb]:border-[var(--color-gold-light)] 
                   [&::-webkit-slider-thumb]:shadow-[0_0_10px_var(--color-gold)]
                   [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
        />
        <div className="flex justify-between mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-[var(--color-primary-medium)] font-medium">
          <span>{TEMPO_CONFIG.min}</span>
          <span>{TEMPO_CONFIG.default}</span>
          <span>{TEMPO_CONFIG.max}</span>
        </div>
      </div>
    </div>
  );
}
