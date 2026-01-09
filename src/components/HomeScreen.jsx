import React from "react";
import { Sparkles, TrendingUp, Zap, Edit3 } from "lucide-react";

/**
 * Artist data for HomeScreen
 */
const ARTISTS = [
  {
    id: "Patitucci",
    name: "John Patitucci",
    icon: "🎸",
    subtitle: "Modern Jazz Bass",
    color: "gold",
    techniques: ["Linear 11ths (Maj)", "Linear 11ths (Min)"],
    description: "Arpegios en tresillos extendidos",
    gradient: "linear-gradient(135deg, #C9A554 0%, #E0C285 100%)",
    accentColor: "#C9A554",
  },
  {
    id: "Wooten",
    name: "Victor Wooten",
    icon: "🔥",
    subtitle: "Advanced Slap Tech",
    color: "red",
    techniques: ["Double Thumbing", "Open Hammer Pluck"],
    description: "Técnicas de slap avanzadas",
    gradient: "linear-gradient(135deg, #EF4444 0%, #F97316 100%)",
    accentColor: "#EF4444",
  },
  {
    id: "Flea",
    name: "Flea (RHCP)",
    icon: "🌶️",
    subtitle: "Funk-Punk Slap Bass",
    color: "orange",
    techniques: ["Slap & Pop Octaves", "Ghost Notes Groove"],
    description: "Higher Ground • Give It Away",
    gradient: "linear-gradient(135deg, #F97316 0%, #FACC15 100%)",
    accentColor: "#F97316",
  },
  {
    id: "Jaco",
    name: "Jaco Pastorius",
    icon: "🎹",
    subtitle: "Fretless Fingerstyle",
    color: "blue",
    techniques: ["Natural Harmonics", "Artificial Harmonics"],
    description: "Portrait of Tracy • The Chicken",
    gradient: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
    accentColor: "#3B82F6",
  },
];

/**
 * Modern Artist Card Component
 */
function ArtistCard({ artist, onClick, index }) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      className="landscape-compact-card group relative w-full overflow-hidden text-left transition-all duration-500 transform rounded-2xl lg:rounded-3xl
                 hover:scale-[1.03] active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/30"
      onClick={() => onClick(artist.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: artist.gradient,
        animationDelay: `${index * 0.15}s`,
        minHeight: "200px",
        boxShadow: isHovered
          ? `0 30px 60px -12px ${artist.accentColor}40, 0 18px 36px -18px ${artist.accentColor}60`
          : "0 10px 30px -5px rgba(0,0,0,0.3)",
      }}
      aria-label={`Select ${artist.name} exercises`}
    >
      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-transparent opacity-60
                   group-hover:opacity-40 transition-opacity duration-500"
      />

      {/* Shine effect on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background:
            "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
          backgroundSize: "200% 200%",
          animation: isHovered ? "shine 1.5s ease-in-out" : "none",
        }}
      />

      {/* Glow border effect */}
      <div
        className="absolute inset-0 rounded-2xl lg:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow: `inset 0 0 20px ${artist.accentColor}40`,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div className="relative p-5 sm:p-6 lg:p-8 z-10 flex flex-col h-full text-white min-h-[200px]">
        {/* Header */}
        <div className="flex justify-between items-start mb-4 sm:mb-5">
          <div className="flex items-center gap-3">
            <span
              className="landscape-compact-card-icon text-4xl sm:text-5xl lg:text-6xl filter drop-shadow-2xl
                         bg-white/15 p-2.5 sm:p-3 rounded-xl lg:rounded-2xl backdrop-blur-md
                         group-hover:scale-110 group-hover:rotate-6 transition-all duration-500
                         border border-white/20"
            >
              {artist.icon}
            </span>
            <div className="lg:hidden">
              <h3
                className="landscape-compact-card-title text-xl sm:text-2xl font-bold font-['Playfair_Display'] mb-1 
                           drop-shadow-lg leading-tight tracking-tight"
              >
                {artist.name}
              </h3>
              <p className="landscape-compact-card-subtitle text-white/90 font-semibold text-xs uppercase tracking-wider">
                {artist.subtitle}
              </p>
            </div>
          </div>

          <div
            className="bg-white/15 backdrop-blur-md p-2 sm:p-2.5 rounded-full opacity-0 
                       group-hover:opacity-100 transition-all duration-500 border border-white/20
                       group-hover:rotate-12 transform"
          >
            <Sparkles size={18} className="sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Title - Desktop only */}
        <div className="hidden lg:block mb-4">
          <h3
            className="text-3xl xl:text-4xl font-bold font-['Playfair_Display'] mb-2 
                       drop-shadow-lg leading-tight tracking-tight"
          >
            {artist.name}
          </h3>
          <p
            className="text-white/95 font-bold text-sm uppercase tracking-widest 
                      drop-shadow-md flex items-center gap-2"
          >
            {artist.subtitle}
            <TrendingUp
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </p>
        </div>

        {/* Description */}
        <p
          className="landscape-compact-card-desc text-white/85 text-sm sm:text-base mb-4 sm:mb-5 line-clamp-2
                    drop-shadow-md font-medium leading-relaxed"
        >
          {artist.description}
        </p>

        {/* Techniques */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {artist.techniques.slice(0, 2).map((tech, i) => (
            <span
              key={i}
              className="landscape-compact-tech text-xs sm:text-sm bg-black/30 backdrop-blur-md px-3 py-1.5 
                       rounded-full border border-white/20 font-medium
                       group-hover:bg-black/40 group-hover:border-white/30 
                       transition-all duration-300 drop-shadow-lg"
            >
              {tech}
            </span>
          ))}

          {/* Action indicator */}
          <div
            className="ml-auto flex items-center gap-2 text-xs sm:text-sm font-bold 
                       opacity-0 group-hover:opacity-100 transition-all duration-500
                       transform translate-x-2 group-hover:translate-x-0"
          >
            <span className="hidden sm:inline drop-shadow-lg">ENTRAR</span>
            <Zap size={16} className="drop-shadow-lg" />
          </div>
        </div>
      </div>
    </button>
  );
}

/**
 * Main HomeScreen Component
 */
function HomeScreen({ onSelectArtist, onSelectCustomBuilder }) {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0D1B2A 0%, #1B263B 50%, #0a1628 100%)",
      }}
    >


      {/* Radial gradient overlays for depth */}
      <div
        className="fixed top-0 right-0 w-[800px] h-[800px] rounded-full opacity-10 pointer-events-none blur-3xl"
        style={{
          background: "radial-gradient(circle, #C9A554 0%, transparent 70%)",
        }}
      />
      <div
        className="fixed bottom-0 left-0 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none blur-3xl"
        style={{
          background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)",
        }}
      />

      {/* Main Content */}
      <div
        className="landscape-compact-container relative z-10 min-h-screen flex flex-col items-center justify-center 
                    p-4 sm:p-6 lg:p-8 animate-[fadeIn_0.8s_ease-out]"
      >
        {/* Header */}
        <header className="landscape-compact-header text-center mb-8 sm:mb-12 lg:mb-16 relative px-4 max-w-5xl mx-auto">
          {/* Logo */}
          <div
            className="landscape-compact-logo inline-flex items-center justify-center rounded-3xl 
                        mb-5 sm:mb-7 lg:mb-8 shadow-2xl animate-[float_3s_ease-in-out_infinite] overflow-hidden"
            style={{
              boxShadow: "0 20px 60px rgba(201, 165, 84, 0.3)",
            }}
          >
            <img
              src="/logo.png"
              alt="Bass Academy Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-cover"
            />
          </div>

          {/* Main Title */}
          <h1
            className="landscape-compact-title font-['Playfair_Display'] text-5xl sm:text-6xl md:text-7xl lg:text-8xl 
                       font-bold text-white mb-3 sm:mb-4 tracking-tight leading-none
                       drop-shadow-2xl animate-[fadeIn_1s_ease-out]"
          >
            Bass
            <span
              style={{
                background:
                  "linear-gradient(135deg, #C9A554 0%, #E0C285 50%, #C9A554 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Academy
            </span>
          </h1>

          {/* Subtitle */}
          <div
            className="landscape-compact-subtitle flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 
                        text-base sm:text-lg lg:text-xl text-white/80 font-light tracking-[0.2em] 
                        uppercase mb-2 drop-shadow-lg"
          >
            <span className="font-semibold text-white/90">
              Master the Legends
            </span>
            <span className="hidden sm:inline text-white/40">•</span>
            <span className="font-bold" style={{ color: "#C9A554" }}>
              2026
            </span>
          </div>

          {/* Description */}
          <p
            className="landscape-compact-description text-white/60 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed
                      font-['Inter'] drop-shadow-md"
          >
            Aprende técnicas de los mejores bajistas del mundo con ejercicios
            interactivos
          </p>
        </header>

        {/* Custom Builder Highlight Card */}
        <div className="max-w-5xl w-full mb-8 sm:mb-10 px-4 sm:px-6 relative z-10">
          <button
            onClick={onSelectCustomBuilder}
            className="group w-full relative overflow-hidden rounded-2xl lg:rounded-3xl p-5 sm:p-6 lg:p-8
                     text-left transition-all duration-500 transform hover:scale-[1.02] active:scale-95
                     focus:outline-none focus:ring-4 focus:ring-[#C9A554]/30"
            style={{
              background: 'linear-gradient(135deg, rgba(201, 165, 84, 0.15) 0%, rgba(201, 165, 84, 0.05) 100%)',
              border: '2px solid rgba(201, 165, 84, 0.3)',
              boxShadow: '0 10px 40px -10px rgba(201, 165, 84, 0.2)',
            }}
          >
            {/* Shine effect */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(201, 165, 84, 0.1) 50%, transparent 70%)',
                backgroundSize: '200% 200%',
              }}
            />

            <div className="relative flex items-center gap-4 sm:gap-6">
              {/* Icon */}
              <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl
                            bg-gradient-to-br from-[#C9A554] to-[#E0C285] flex items-center justify-center
                            shadow-lg shadow-[#C9A554]/30 group-hover:scale-110 transition-transform duration-500">
                <Edit3 className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-[#0D1B2A]" />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white font-['Playfair_Display']
                               group-hover:text-[#C9A554] transition-colors">
                    Custom Builder
                  </h3>
                  <span className="px-2 py-0.5 bg-[#C9A554] text-[#0D1B2A] text-xs font-bold rounded-full
                                 uppercase tracking-wide">
                    New
                  </span>
                </div>
                <p className="text-[#778DA9] text-sm sm:text-base">
                  Crea tus propios ejercicios de bajo nota por nota
                </p>
              </div>
              
              {/* Arrow */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center
                            group-hover:bg-[#C9A554] group-hover:translate-x-1 transition-all duration-300">
                <Zap className="w-5 h-5 text-[#C9A554] group-hover:text-[#0D1B2A]" />
              </div>
            </div>
          </button>
        </div>

        {/* Artist Grid */}
        <div
          className="landscape-compact-grid max-w-7xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 
                      gap-4 sm:gap-5 lg:gap-6 px-4 sm:px-6 relative z-10 mb-8"
        >
          {ARTISTS.map((artist, index) => (
            <div
              key={artist.id}
              className="opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards]"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <ArtistCard
                artist={artist}
                onClick={onSelectArtist}
                index={index}
              />
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <footer
          className="landscape-compact-footer mt-8 sm:mt-10 text-white/40 text-xs sm:text-sm px-4 text-center 
                         relative z-10 font-['Inter'] animate-[fadeIn_1.5s_ease-out]"
        >
          Selecciona un artista para comenzar tu entrenamiento profesional
        </footer>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes shine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        /* Mobile Landscape Optimizations */
        @media (max-height: 500px) and (orientation: landscape) {
          .landscape-compact-container {
            padding: 0.5rem 1rem !important;
            min-height: 100vh;
            justify-content: flex-start !important;
          }
          
          .landscape-compact-header {
            margin-bottom: 0.5rem !important;
            padding-top: 0.25rem !important;
          }
          
          .landscape-compact-logo {
            padding: 0.5rem !important;
            margin-bottom: 0.5rem !important;
          }
          
          .landscape-compact-logo svg {
            width: 24px !important;
            height: 24px !important;
          }
          
          .landscape-compact-title {
            font-size: 1.75rem !important;
            margin-bottom: 0.25rem !important;
          }
          
          .landscape-compact-subtitle {
            font-size: 0.65rem !important;
            letter-spacing: 0.1em !important;
            margin-bottom: 0.125rem !important;
          }
          
          .landscape-compact-description {
            display: none !important;
          }
          
          .landscape-compact-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.5rem !important;
            padding: 0 0.5rem !important;
            margin-bottom: 0.5rem !important;
          }
          
          .landscape-compact-card {
            min-height: 100px !important;
          }
          
          .landscape-compact-card > div:last-child {
            padding: 0.75rem !important;
            min-height: 100px !important;
          }
          
          .landscape-compact-card-icon {
            font-size: 1.5rem !important;
            padding: 0.375rem !important;
          }
          
          .landscape-compact-card-title {
            font-size: 0.875rem !important;
          }
          
          .landscape-compact-card-subtitle {
            font-size: 0.6rem !important;
          }
          
          .landscape-compact-card-desc {
            display: none !important;
          }
          
          .landscape-compact-tech {
            font-size: 0.55rem !important;
            padding: 0.25rem 0.5rem !important;
          }
          
          .landscape-compact-footer {
            display: none !important;
          }
          
          /* Hide radial gradient overlays in landscape */
          .fixed.top-0.right-0.w-\\[800px\\],
          .fixed.bottom-0.left-0.w-\\[600px\\] {
            opacity: 0.05 !important;
          }
        }
        
        /* Very small landscape screens */
        @media (max-height: 400px) and (orientation: landscape) {
          .landscape-compact-container {
            padding: 0.25rem 0.75rem !important;
          }
          
          .landscape-compact-header {
            margin-bottom: 0.25rem !important;
          }
          
          .landscape-compact-logo {
            padding: 0.375rem !important;
            margin-bottom: 0.25rem !important;
          }
          
          .landscape-compact-title {
            font-size: 1.5rem !important;
          }
          
          .landscape-compact-grid {
            gap: 0.375rem !important;
          }
          
          .landscape-compact-card {
            min-height: 85px !important;
          }
          
          .landscape-compact-card-icon {
            font-size: 1.25rem !important;
            padding: 0.25rem !important;
          }
        }
      `}</style>
    </div>
  );
}

export default HomeScreen;
