
/**
 * VolumeControl Component - Bass Academy
 * Mobile-first responsive volume sliders
 */
export function VolumeControl({
  bassVolume,
  setBassVolume,
  metronomeVolume,
  setMetronomeVolume,
}) {
  return (
    <div className="bg-[var(--color-primary-dark)]/60 rounded-lg sm:rounded-xl p-3 sm:p-4">
      <h4 className="text-xs sm:text-sm font-semibold text-[var(--color-cream)] mb-3 flex items-center gap-2">
        <Volume2 className="w-4 h-4 text-[var(--color-gold)]" />
        Volumen
      </h4>
      
      <div className="space-y-3 sm:space-y-3.5">
        {/* Bass Volume */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 min-w-[70px] sm:min-w-[80px]">
            <Music className="w-3.5 h-3.5 text-[var(--color-gold)]" />
            <span className="text-xs sm:text-sm text-[var(--color-primary-light)]">Bajo</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(bassVolume * 100)}
            onChange={(e) => setBassVolume(Number(e.target.value) / 100)}
            aria-label="Volumen del bajo"
            className="flex-1 h-2 bg-[var(--color-primary-medium)] rounded-lg appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                       [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-gold)]
                       [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md
                       [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50"
          />
          <span className="text-xs sm:text-sm text-[var(--color-cream)] font-mono min-w-[36px] sm:min-w-[40px] text-right">
            {Math.round(bassVolume * 100)}%
          </span>
        </div>

        {/* Metronome Volume */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 min-w-[70px] sm:min-w-[80px]">
            <div className="w-3.5 h-3.5 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
              <span className="text-[8px] font-bold text-white">M</span>
            </div>
            <span className="text-xs sm:text-sm text-[var(--color-primary-light)]">Metrón.</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(metronomeVolume * 100)}
            onChange={(e) => setMetronomeVolume(Number(e.target.value) / 100)}
            aria-label="Volumen del metrónomo"
            className="flex-1 h-2 bg-[var(--color-primary-medium)] rounded-lg appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                       [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500
                       [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md
                       [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110
                       focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          />
          <span className="text-xs sm:text-sm text-[var(--color-cream)] font-mono min-w-[36px] sm:min-w-[40px] text-right">
            {Math.round(metronomeVolume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}