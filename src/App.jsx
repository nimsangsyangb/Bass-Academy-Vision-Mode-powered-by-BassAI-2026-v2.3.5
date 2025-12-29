import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Square,
  RefreshCw,
  Music,
  AlertCircle,
  GraduationCap,
  BookOpen,
  Zap,
  Target,
  ChevronRight,
} from "lucide-react";
import Footer from "./components/Footer";

const BassTrainer = () => {
  // Estados para la UI
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(100);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(-1);
  const [isLooping, setIsLooping] = useState(true);
  const [isAudioReady, setIsAudioReady] = useState(false);

  // Referencias para el motor de audio (evitan stale closures)
  const audioContextRef = useRef(null);
  const nextNoteTimeRef = useRef(0);
  const timerIDRef = useRef(null);
  const notesRef = useRef([]); // Almacena la data de las notas
  const playIndexRef = useRef(0); // Índice actual en el motor de audio
  const schedulerRef = useRef(null); // Ref para la función scheduler

  // Refs para valores mutables accedidos por el scheduler
  const tempoRef = useRef(tempo);
  const isLoopingRef = useRef(isLooping);
  const isPlayingRef = useRef(isPlaying);

  // Sincronizar refs con estado
  useEffect(() => {
    tempoRef.current = tempo;
  }, [tempo]);
  useEffect(() => {
    isLoopingRef.current = isLooping;
  }, [isLooping]);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Frecuencias base
  const STRING_FREQUENCIES = {
    G: 98.0,
    D: 73.42,
    A: 55.0,
    E: 41.2,
  };

  // Datos de la tablatura (Arpegios Emaj11 y Fm11 en tresillos)
  const tabData = [
    // Emaj11
    { string: "E", fret: 0, id: 0 },
    { string: "E", fret: 4, id: 1 },
    { string: "A", fret: 2, id: 2 },
    { string: "D", fret: 1, id: 3 },
    { string: "D", fret: 4, id: 4 },
    { string: "G", fret: 2, id: 5 },
    { string: "G", fret: 2, id: 6 },
    { string: "D", fret: 4, id: 7 },
    { string: "D", fret: 1, id: 8 },
    { string: "A", fret: 2, id: 9 },
    { string: "E", fret: 4, id: 10 },
    { string: "E", fret: 0, id: 11 },
    // Fm11
    { string: "E", fret: 1, id: 12 },
    { string: "E", fret: 4, id: 13 },
    { string: "A", fret: 3, id: 14 },
    { string: "D", fret: 1, id: 15 },
    { string: "D", fret: 5, id: 16 },
    { string: "G", fret: 3, id: 17 },
    { string: "G", fret: 3, id: 18 },
    { string: "D", fret: 5, id: 19 },
    { string: "D", fret: 1, id: 20 },
    { string: "A", fret: 3, id: 21 },
    { string: "E", fret: 4, id: 22 },
    { string: "E", fret: 1, id: 23 },
  ];

  // Inicialización del AudioContext (solo una vez)
  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContextRef.current = new AudioContext();
    notesRef.current = tabData;
    return () => {
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const playSound = (string, fret, time) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    // Frecuencia
    const baseFreq = STRING_FREQUENCIES[string];
    const frequency = baseFreq * Math.pow(2, fret / 12);

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Configuración de sonido (Sawtooth filtrada para sonar como bajo)
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(frequency, time);

    // Filtro para quitar agudos excesivos
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(600, time);

    // Envolvente (Envelope)
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.5, time + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.6);
  };

  const scheduleNote = (index, time) => {
    // 1. Programar audio
    const note = notesRef.current[index];
    playSound(note.string, note.fret, time);

    // 2. Programar actualización visual
    const ctx = audioContextRef.current;
    const delay = Math.max(0, (time - ctx.currentTime) * 1000);

    setTimeout(() => {
      if (isPlayingRef.current) {
        setCurrentNoteIndex(index);
      }
    }, delay);
  };

  const nextNote = () => {
    const secondsPerBeat = 60.0 / tempoRef.current;
    const noteTime = secondsPerBeat / 3; // Tresillos (3 notas por beat)
    nextNoteTimeRef.current += noteTime;

    playIndexRef.current++;

    if (playIndexRef.current >= notesRef.current.length) {
      if (isLoopingRef.current) {
        playIndexRef.current = 0;
      } else {
        return false; // Indica fin
      }
    }
    return true; // Continua
  };

  const scheduler = useCallback(() => {
    const ctx = audioContextRef.current;
    // Lookahead de 100ms
    while (nextNoteTimeRef.current < ctx.currentTime + 0.1) {
      if (playIndexRef.current < notesRef.current.length) {
        scheduleNote(playIndexRef.current, nextNoteTimeRef.current);
      }

      const shouldContinue = nextNote();

      if (!shouldContinue) {
        setIsPlaying(false);
        setCurrentNoteIndex(-1);
        return;
      }
    }
    timerIDRef.current = requestAnimationFrame(schedulerRef.current);
  }, []);

  useEffect(() => {
    schedulerRef.current = scheduler;
  }, [scheduler]);

  const handlePlay = async () => {
    const ctx = audioContextRef.current;

    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    setIsAudioReady(true);

    if (isPlaying) return;

    setIsPlaying(true);
    setCurrentNoteIndex(-1);
    playIndexRef.current = 0;

    nextNoteTimeRef.current = ctx.currentTime + 0.1;

    scheduler();
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentNoteIndex(-1);
    if (timerIDRef.current) cancelAnimationFrame(timerIDRef.current);
  };

  const renderString = (stringName) => (
    <div className="flex items-center mb-4 relative h-12 select-none group">
      {/* String Label */}
      <div 
        className="w-14 font-mono text-lg font-bold text-[var(--color-gold)] 
                   flex items-center justify-center"
      >
        <span className="bg-[var(--color-primary-dark)] px-3 py-1 rounded-lg border border-[var(--color-gold)]/30">
          {stringName}
        </span>
      </div>
      
      {/* String Container */}
      <div className="flex-1 relative flex items-center">
        {/* String Line with Gradient */}
        <div 
          className="absolute w-full h-[3px] rounded-full"
          style={{
            background: `linear-gradient(90deg, 
              var(--color-primary-medium) 0%, 
              var(--color-gold) 20%, 
              var(--color-gold-light) 50%, 
              var(--color-gold) 80%, 
              var(--color-primary-medium) 100%)`
          }}
        />

        {/* Frets / Notes */}
        <div className="flex w-full justify-between relative z-10 px-3">
          {tabData.map((note, idx) => {
            if (note.string !== stringName)
              return <div key={idx} className="w-10 h-10" />;

            const isActive = currentNoteIndex === idx;
            return (
              <div
                key={idx}
                className={`
                  w-10 h-10 flex items-center justify-center rounded-xl 
                  font-mono text-sm font-bold transition-all duration-100
                  ${
                    isActive
                      ? "bg-[var(--color-active)] text-[var(--color-primary-deep)] scale-125 animate-pulse-glow border-2 border-[var(--color-active)]"
                      : "bg-[var(--color-primary-dark)] text-[var(--color-cream)] border border-[var(--color-primary-medium)] hover:border-[var(--color-gold)]/50 hover:bg-[var(--color-primary-medium)]/50"
                  }
                `}
                style={{
                  boxShadow: isActive 
                    ? "0 0 20px var(--color-active-glow), 0 0 40px var(--color-active-glow)" 
                    : "0 4px 12px rgba(0,0,0,0.3)"
                }}
              >
                {note.fret}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4 font-[var(--font-body)]">
      {/* Main Container */}
      <div className="max-w-6xl w-full">
        
        {/* Academic Header */}
        <header className="mb-8 animate-fadeInUp">
          {/* Institution Badge */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center shadow-lg">
              <GraduationCap className="w-9 h-9 text-[var(--color-primary-deep)]" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)] font-medium">
                Bass Academy · Est. 2026
              </p>
              <h1 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-[var(--color-cream)]">
                John Patitucci
              </h1>
            </div>
          </div>

          {/* Main Title */}
          <div className="text-center mb-6">
            <h2 className="font-[var(--font-display)] text-2xl md:text-3xl font-semibold text-gradient-gold mb-2">
              Modern Jazz Bass Technique
            </h2>
            <p className="text-[var(--color-primary-light)] text-lg">
              Interactive Arpeggio Study · Web 4.0 Training System
            </p>
          </div>

          {/* Status Indicator */}
          <div className="flex justify-center">
            <div 
              className={`
                glass px-5 py-2 rounded-full flex items-center gap-3
                ${isPlaying ? "border-[var(--color-success)]" : "border-[var(--color-primary-medium)]"}
              `}
            >
              <span
                className={`w-3 h-3 rounded-full ${
                  isPlaying ? "bg-[var(--color-success)] animate-pulse" : "bg-[var(--color-error)]"
                }`}
              />
              <span className="text-sm uppercase tracking-wider font-medium text-[var(--color-cream)]">
                {isPlaying ? "Playing" : "Ready"}
              </span>
              <Music className={`w-4 h-4 ${isPlaying ? "text-[var(--color-success)]" : "text-[var(--color-primary-light)]"}`} />
            </div>
          </div>
        </header>

        {/* Educational Info Panel */}
        <div className="glass-strong rounded-2xl p-6 mb-6 animate-fadeInUp" style={{animationDelay: "0.1s"}}>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Technique Info */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-gold)]/20 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-[var(--color-gold)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-cream)] mb-1">Technique</h3>
                <p className="text-sm text-[var(--color-primary-light)]">
                  Triplet arpeggios ascending and descending across all four strings
                </p>
              </div>
            </div>

            {/* Chord Study */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-info)]/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-[var(--color-info)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-cream)] mb-1">Chords</h3>
                <p className="text-sm text-[var(--color-primary-light)]">
                  <span className="font-mono text-[var(--color-gold)]">Emaj11</span> → <span className="font-mono text-[var(--color-gold)]">Fm11</span> progression
                </p>
              </div>
            </div>

            {/* Goal */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-success)]/20 flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-[var(--color-success)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-cream)] mb-1">Objective</h3>
                <p className="text-sm text-[var(--color-primary-light)]">
                  Develop fluid arpeggio technique with even triplet timing
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Practice Area */}
        <div 
          className="glass-strong rounded-3xl overflow-hidden mb-6 animate-fadeInUp" 
          style={{animationDelay: "0.2s"}}
        >
          {/* Tab Section Header */}
          <div className="bg-[var(--color-primary-dark)]/50 px-8 py-4 border-b border-[var(--color-primary-medium)]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                  <Music className="w-5 h-5 text-[var(--color-primary-deep)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-cream)]">Interactive Tablature</h3>
                  <p className="text-xs text-[var(--color-primary-light)]">Follow the highlighted notes</p>
                </div>
              </div>
              
              {/* Note Counter */}
              <div className="font-mono text-sm bg-[var(--color-primary-deep)] px-4 py-2 rounded-lg border border-[var(--color-primary-medium)]">
                <span className="text-[var(--color-gold)]">{currentNoteIndex >= 0 ? currentNoteIndex + 1 : 0}</span>
                <span className="text-[var(--color-primary-light)]"> / {tabData.length}</span>
              </div>
            </div>
          </div>

          {/* Tablature */}
          <div className="p-8 overflow-x-auto">
            <div className="min-w-[800px]">
              {renderString("G")}
              {renderString("D")}
              {renderString("A")}
              {renderString("E")}
            </div>

            {/* Measure Guide */}
            <div className="flex pl-14 mt-6 gap-4">
              <div className="flex-1 glass rounded-xl p-3 text-center border-l-4 border-[var(--color-gold)]">
                <p className="text-xs uppercase tracking-wider text-[var(--color-primary-light)] mb-1">Measure 1</p>
                <p className="font-mono font-bold text-[var(--color-gold)]">Emaj11</p>
              </div>
              <div className="w-8 flex items-center justify-center">
                <ChevronRight className="w-6 h-6 text-[var(--color-primary-medium)]" />
              </div>
              <div className="flex-1 glass rounded-xl p-3 text-center border-l-4 border-[var(--color-info)]">
                <p className="text-xs uppercase tracking-wider text-[var(--color-primary-light)] mb-1">Measure 2</p>
                <p className="font-mono font-bold text-[var(--color-info)]">Fm11</p>
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div 
          className="glass-strong rounded-2xl p-6 animate-fadeInUp" 
          style={{animationDelay: "0.3s"}}
        >
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Playback Controls */}
            <div className="flex gap-4">
              {!isPlaying ? (
                <button
                  onClick={handlePlay}
                  className="group relative bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] 
                           text-[var(--color-primary-deep)] px-8 py-4 rounded-2xl font-bold 
                           flex items-center gap-3 transition-all duration-300 
                           hover:shadow-[0_0_30px_var(--color-gold)/40] hover:scale-105
                           active:scale-95"
                >
                  <Play className="w-6 h-6 fill-current" />
                  <span className="text-lg">PLAY</span>
                </button>
              ) : (
                <button
                  onClick={handleStop}
                  className="group relative bg-gradient-to-r from-[var(--color-error)] to-red-400 
                           text-white px-8 py-4 rounded-2xl font-bold 
                           flex items-center gap-3 transition-all duration-300 
                           hover:shadow-[0_0_30px_var(--color-error)/40] hover:scale-105
                           active:scale-95"
                >
                  <Square className="w-6 h-6 fill-current" />
                  <span className="text-lg">STOP</span>
                </button>
              )}

              <button
                onClick={() => setIsLooping(!isLooping)}
                className={`
                  px-6 py-4 rounded-2xl font-medium flex items-center gap-3 
                  transition-all duration-300 border-2
                  ${
                    isLooping
                      ? "bg-[var(--color-success)]/20 border-[var(--color-success)] text-[var(--color-success)]"
                      : "bg-[var(--color-primary-dark)] border-[var(--color-primary-medium)] text-[var(--color-primary-light)] hover:border-[var(--color-primary-light)]"
                  }
                `}
              >
                <RefreshCw
                  className={`w-5 h-5 ${isLooping ? "animate-spin-slow" : ""}`}
                />
                <span>{isLooping ? "Loop ON" : "Loop OFF"}</span>
              </button>
            </div>

            {/* Tempo Control */}
            <div className="flex-1 w-full max-w-md">
              <div className="glass rounded-2xl p-5 border border-[var(--color-primary-medium)]">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[var(--color-primary-light)] text-sm font-medium uppercase tracking-wider">
                    Tempo (BPM)
                  </span>
                  <span className="text-3xl font-mono font-bold text-[var(--color-gold)]">
                    {tempo}
                  </span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="160"
                  step="5"
                  value={tempo}
                  onChange={(e) => setTempo(Number(e.target.value))}
                  className="w-full h-3 bg-[var(--color-primary-dark)] rounded-full appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
                           [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-gold)] 
                           [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-4 
                           [&::-webkit-slider-thumb]:border-[var(--color-gold-light)] 
                           [&::-webkit-slider-thumb]:shadow-[0_0_10px_var(--color-gold)]
                           [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200
                           [&::-webkit-slider-thumb]:hover:scale-110"
                />
                <div className="flex justify-between mt-3 text-xs text-[var(--color-primary-medium)] font-medium">
                  <span>Slow (40)</span>
                  <span>Medium (100)</span>
                  <span>Fast (160)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audio Ready Notice */}
        {!isAudioReady && (
          <div 
            className="mt-6 glass rounded-xl p-4 border border-[var(--color-warning)]/30 
                       flex items-center justify-center gap-3 animate-fadeInUp"
            style={{animationDelay: "0.4s"}}
          >
            <AlertCircle className="w-5 h-5 text-[var(--color-warning)]" />
            <span className="text-[var(--color-warning)] text-sm font-medium">
              Press "PLAY" to activate the audio engine
            </span>
          </div>
        )}

        {/* Footer Component */}
        <Footer />
      </div>
    </div>
  );
};

export default BassTrainer;
