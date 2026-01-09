import React, { useRef, useState, useEffect } from "react";
import { Sparkles, TrendingUp, Zap, Edit3, Music } from "lucide-react";

/**
 * Hook for Magnetic Effect
 */
function useMagnetic(ref, strength = 30) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const { left, top, width, height } = element.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      const x = (e.clientX - centerX) / width * strength;
      const y = (e.clientY - centerY) / height * strength;

      setPosition({ x, y });
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref, strength]);

  return position;
}

/**
 * Magnetic Wrapper Component
 */
function Magnetic({ children, className = "", strength = 20 }) {
  const ref = useRef(null);
  const transform = useMagnetic(ref, strength);

  return (
    <div 
      ref={ref}
      className={`${className}`}
      style={{ 
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        transition: "transform 0.2s cubic-bezier(0.33, 1, 0.68, 1)"
      }}
    >
      {children}
    </div>
  );
}

/**
 * Floating Music Particles Component
 */
function MusicParticles() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate static particles on mount to avoid hydration mismatch
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDuration: `${15 + Math.random() * 20}s`,
      animationDelay: `-${Math.random() * 20}s`,
      opacity: 0.1 + Math.random() * 0.2,
      size: 10 + Math.random() * 20,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute text-white/10"
          style={{
            left: p.left,
            top: p.top,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            animation: `float-particle ${p.animationDuration} linear infinite`,
            animationDelay: p.animationDelay,
          }}
        >
          <Music />
        </div>
      ))}
    </div>
  );
}

/**
 * Artist data for HomeScreen
 */
const ARTISTS = [
  {
    id: "Patitucci",
    name: "John Patitucci",
    image: "/images/artists/patitucci.png",
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
    image: "/images/artists/wooten.png",
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
    image: "/images/artists/flea.png",
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
    image: "/images/artists/jaco.png",
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
  const cardRef = React.useRef(null);
  const [rotation, setRotation] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (max 10 degrees)
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div className="perspective-1000 w-full h-full"> 
      <button
        ref={cardRef}
        className="landscape-compact-card group relative w-full h-full overflow-hidden text-left transition-all duration-300 transform rounded-2xl lg:rounded-3xl
                   focus:outline-none focus:ring-4 focus:ring-white/30 cursor-rock"
        onClick={() => onClick(artist.id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovered ? 1.05 : 1})`,
          boxShadow: isHovered
            ? `0 30px 60px -12px ${artist.accentColor}60, 0 18px 36px -18px ${artist.accentColor}80`
            : "0 10px 30px -5px rgba(0,0,0,0.5)",
          minHeight: "380px",
        }}
        aria-label={`Select ${artist.name} exercises`}
      >
        {/* Artist Image Background */}
        <div className="absolute inset-0">
          <img 
            src={artist.image} 
            alt={artist.name}
            className="w-full h-full object-cover transition-transform duration-700 scale-110 group-hover:scale-100 filter brightness-75 group-hover:brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />
        </div>

        {/* Animated gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0
                     group-hover:opacity-30 transition-opacity duration-500 mix-blend-overlay"
        />

        {/* Shine effect on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background:
              "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)",
            backgroundSize: "200% 200%",
            animation: isHovered ? "shine 1.5s ease-in-out" : "none",
          }}
        />

        {/* Content */}
        <div className="relative p-5 sm:p-6 lg:p-8 z-10 flex flex-col h-full text-white">
          {/* Header */}
          <div className="flex justify-between items-start mb-auto">
             <div className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-bold tracking-widest uppercase">
                {artist.subtitle}
             </div>
            <div
              className="bg-white/15 backdrop-blur-md p-2 rounded-full opacity-0 
                         group-hover:opacity-100 transition-all duration-500 border border-white/20
                         group-hover:rotate-12 transform"
            >
              <Sparkles size={18} className="text-white" />
            </div>
          </div>

          {/* Title - Desktop only */}
          <div className="mt-8">
            <h3
              className="text-3xl xl:text-5xl font-bold font-['Playfair_Display'] mb-3 
                         drop-shadow-lg leading-none tracking-tight transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
            >
              {artist.name}
            </h3>
            
            <div className="w-12 h-1 bg-white/50 rounded-full mb-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

            <p
              className="text-white/80 text-sm sm:text-base line-clamp-2
                        drop-shadow-md font-medium leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"
            >
              {artist.description}
            </p>
          </div>

          {/* Techniques */}
          <div className="flex flex-wrap gap-2 mt-6 transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
            {artist.techniques.map((tech, i) => (
              <span
                key={i}
                className="text-xs bg-white/10 backdrop-blur-sm px-3 py-1 
                         rounded-full border border-white/10 font-medium"
              >
                {tech}
              </span>
            ))}
          </div>

             {/* Action indicator */}
            <div
            className="absolute bottom-6 right-6 flex items-center gap-2 text-sm font-bold 
                        opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300
                        translate-x-4 group-hover:translate-x-0 text-[#C9A554]"
            >
            <span className="uppercase tracking-widest text-xs">Explore</span>
            <Zap size={18} className="fill-current" />
            </div>
        </div>
      </button>
    </div>
  );
}

/**
 * Main HomeScreen Component
 */
function HomeScreen({ onSelectArtist, onSelectCustomBuilder }) {
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePos = (ev) => {
      setMousePos({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('mousemove', updateMousePos);
    return () => {
      window.removeEventListener('mousemove', updateMousePos);
    };
  }, []);



  return (
    <div
      className="home-screen-bg min-h-screen relative overflow-hidden"
      style={{
        "--mouse-x": `${mousePos.x}px`,
        "--mouse-y": `${mousePos.y}px`,
      }}
    >
      <div className="spotlight-overlay" />
      <div className="grain-overlay" />
      <MusicParticles />

      {/* Radial gradient overlays for depth */}
      <div
        className="fixed top-0 right-0 w-[800px] h-[800px] rounded-full opacity-10 pointer-events-none blur-3xl animate-[pulse-glow_8s_ease-in-out_infinite]"
        style={{
          background: "radial-gradient(circle, #C9A554 0%, transparent 70%)",
        }}
      />
      <div
        className="fixed bottom-0 left-0 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none blur-3xl animate-[pulse-glow_10s_ease-in-out_infinite_reverse]"
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
          <Magnetic strength={30}>
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
          </Magnetic>

          {/* Main Title */}
          <h1
            className="landscape-compact-title home-title font-['Playfair_Display'] text-5xl sm:text-6xl md:text-7xl lg:text-8xl 
                       font-bold mb-3 sm:mb-4 tracking-tight leading-none
                       drop-shadow-2xl animate-[fadeIn_1s_ease-out]"
          >
            <span className="home-title-bass">Bass</span>
            <span className="home-title-academy">Academy</span>
          </h1>

          {/* Subtitle */}
          <div
            className="landscape-compact-subtitle home-subtitle flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 
                        text-base sm:text-lg lg:text-xl font-light tracking-[0.2em] 
                        uppercase mb-2 drop-shadow-lg"
          >
            <span className="font-semibold home-subtitle-text">
              Master the Legends
            </span>
            <span className="hidden sm:inline home-subtitle-dot">•</span>
            <span className="font-bold home-subtitle-year">
              2026
            </span>
          </div>

          {/* Description */}
          <p
            className="landscape-compact-description home-description text-sm sm:text-base max-w-2xl mx-auto leading-relaxed
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
            className="custom-builder-card group w-full relative overflow-hidden rounded-2xl lg:rounded-3xl p-5 sm:p-6 lg:p-8
                     text-left transition-all duration-500 transform hover:scale-[1.02] active:scale-95
                     focus:outline-none focus:ring-4 focus:ring-[#C9A554]/30 cursor-rock"
          >
            {/* Shine effect */}
            <div
              className="custom-builder-shine absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            />
            
            {/* Holographic Wireframe Grid */}
            <div className="holo-wireframe" />

            <div className="relative flex items-center gap-4 sm:gap-6">
              {/* Icon */}
              <div className="custom-builder-icon flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl
                            flex items-center justify-center
                            group-hover:scale-110 transition-transform duration-500">
                <Edit3 className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 custom-builder-icon-color" />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="custom-builder-title text-xl sm:text-2xl lg:text-3xl font-bold font-['Playfair_Display']
                               group-hover:text-[#C9A554] transition-colors">
                    Custom Builder
                  </h3>
                  <span className="custom-builder-badge px-2 py-0.5 text-xs font-bold rounded-full
                                 uppercase tracking-wide">
                    New
                  </span>
                </div>
                <p className="custom-builder-desc text-sm sm:text-base">
                  Crea tus propios ejercicios de bajo nota por nota
                </p>
              </div>
              
              {/* Arrow */}
              <div className="custom-builder-arrow flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                            group-hover:translate-x-1 transition-all duration-300">
                <Zap className="w-5 h-5 custom-builder-zap" />
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
        
        @keyframes float-particle {
          0% {
            transform: translateY(100vh) rotate(0deg);
          }
          100% {
            transform: translateY(-20vh) rotate(360deg);
          }
        }
        
        /* Global Spotlight */
        .spotlight-overlay {
          background: radial-gradient(
            600px circle at var(--mouse-x) var(--mouse-y),
            rgba(255, 255, 255, 0.06),
            transparent 40%
          );
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2; /* Content is at z-10, this should be below content but above bg */
        }
        
        /* Holographic Wireframe */
        .holo-wireframe {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) perspective(1000px) rotateX(60deg) scale(0.8);
          width: 200%;
          height: 200%;
          background-image: 
            linear-gradient(rgba(201, 165, 84, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201, 165, 84, 0.3) 1px, transparent 1px);
          background-size: 40px 40px;
          border-radius: 50%;
          opacity: 0;
          transition: all 0.5s ease;
          pointer-events: none;
          z-index: 0;
          mask-image: radial-gradient(circle, black 30%, transparent 70%);
          -webkit-mask-image: radial-gradient(circle, black 30%, transparent 70%);
        }
        
        .custom-builder-card:hover .holo-wireframe {
          opacity: 1;
          transform: translate(-50%, -40%) perspective(1000px) rotateX(45deg) scale(1.2);
          animation: holo-grid-scroll 20s linear infinite;
        }
        
        @keyframes holo-grid-scroll {
          0% { background-position: 0 0; }
          100% { background-position: 0 1000px; }
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
