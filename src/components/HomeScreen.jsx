import React from 'react';
import { Music } from 'lucide-react';

/**
 * Artist data for HomeScreen
 * ⚠️ IMPORTANTE: Los IDs deben coincidir exactamente con CATEGORIES en exerciseLibrary.js
 */
const ARTISTS = [
  {
    id: 'Patitucci',
    name: 'John Patitucci',
    icon: '🎸',
    subtitle: 'Modern Jazz Bass',
    color: 'gold',
    techniques: ['Linear 11ths (Maj)', 'Linear 11ths (Min)'],
    description: 'Arpegios extendidos en tresillos',
    gradient: 'linear-gradient(135deg, #C9A554 0%, #E0C285 100%)'
  },
  {
    id: 'Wooten',
    name: 'Victor Wooten',
    icon: '🔥',
    subtitle: 'Advanced Slap Techniques',
    color: 'red',
    techniques: ['Double Thumbing', 'Open Hammer Pluck'],
    description: 'Técnicas de slap avanzadas',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)'
  },
  {
    id: 'Flea',
    name: 'Flea',
    icon: '🌶️',
    subtitle: 'Funk-Punk Slap Bass',
    color: 'orange',
    techniques: ['Slap & Pop Octaves', 'Ghost Notes Groove'],
    description: 'Higher Ground • Give It Away',
    gradient: 'linear-gradient(135deg, #F97316 0%, #FACC15 100%)'
  },
  {
    id: 'Jaco',
    name: 'Jaco Pastorius',
    icon: '🎹',
    subtitle: 'Fretless Fingerstyle Mastery',
    color: 'blue',
    techniques: ['Natural Harmonics', 'Artificial Harmonics', '16th Note Funk', 'Melodic Lines'],
    description: 'Portrait of Tracy • The Chicken',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)'
  }
];

/**
 * ArtistCard Component - Mobile Optimized
 */
function ArtistCard({ artist, onClick, index }) {
  return (
    <button
      className="relative w-full overflow-hidden text-left transition-all duration-300 transform rounded-xl sm:rounded-2xl group hover:scale-[1.02] hover:shadow-xl active:scale-95"
      onClick={() => onClick(artist.id)}
      style={{
        background: artist.gradient,
        animationDelay: `${index * 0.1}s`,
        minHeight: '160px' // Altura mínima en móvil
      }}
      aria-label={`Select ${artist.name} exercises`}
    >
      {/* Overlay oscuro para legibilidad */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
      
      {/* Contenido */}
      <div className="relative p-4 sm:p-6 z-10 flex flex-col h-full text-white">
        <div className="flex justify-between items-start mb-3 sm:mb-4">
          <span className="text-3xl sm:text-4xl filter drop-shadow-md bg-white/20 p-2 rounded-lg sm:rounded-xl backdrop-blur-sm">
            {artist.icon}
          </span>
          <div className="bg-white/20 backdrop-blur-md p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
             <Music size={16} className="sm:w-5 sm:h-5" />
          </div>
        </div>
        
        <div className="mt-auto">
          <h3 className="text-xl sm:text-2xl font-bold font-[var(--font-display)] mb-0.5 sm:mb-1 shadow-black/50 drop-shadow-sm leading-tight">
            {artist.name}
          </h3>
          <p className="text-white/90 font-medium text-xs sm:text-sm tracking-wide uppercase mb-2">
            {artist.subtitle}
          </p>
          <p className="text-white/80 text-[11px] sm:text-xs mb-3 sm:mb-4 line-clamp-2">
            {artist.description}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1 sm:mt-2">
          {artist.techniques.slice(0, 2).map((tech, i) => (
            <span key={i} className="text-[9px] sm:text-[10px] bg-black/30 backdrop-blur-sm px-2 py-1 rounded-md border border-white/10">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

/**
 * HomeScreen Component - Mobile Optimized
 */
function HomeScreen({ onSelectArtist }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-6 md:p-8 animate-fadeIn bg-[var(--color-bg-dark)]">
      
      {/* Header - Mobile Optimized */}
      <header className="text-center mb-6 sm:mb-10 md:mb-14 relative z-10 px-2">
        <div className="inline-flex items-center justify-center p-3 sm:p-4 rounded-2xl sm:rounded-3xl gradient-gold mb-4 sm:mb-6 shadow-2xl shadow-[var(--color-gold)]/20">
          <Music className="text-[var(--color-primary-deep)] w-8 h-8 sm:w-10 sm:h-10" />
        </div>
        <h1 className="font-[var(--font-display)] text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--color-cream)] mb-2 tracking-tight leading-tight">
          Bass<span className="text-[var(--color-gold)]">Academy</span>
        </h1>
        <p className="text-[var(--color-primary-light)] text-sm sm:text-lg md:text-xl font-light tracking-widest uppercase opacity-80">
          Master the Legends · 2026
        </p>
      </header>
      
      {/* Artist Grid - Mobile Optimized */}
      <div className="max-w-6xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-4">
        {ARTISTS.map((artist, index) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            onClick={onSelectArtist}
            index={index}
          />
        ))}
      </div>
      
      {/* Footer hint - Mobile Optimized */}
      <footer className="mt-8 sm:mt-12 md:mt-16 text-[var(--color-primary-light)] text-xs sm:text-sm opacity-50 px-4 text-center">
        Select an artist card to enter the practice room
      </footer>
    </div>
  );
}

export default HomeScreen;
export { ARTISTS };