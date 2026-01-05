/**
 * Bass Trainer - Exercise View Component
 * Mobile-first responsive layout
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Music, AlertCircle, Guitar, List, ArrowLeft } from "lucide-react";

// Components - Layout
import Header from "./components/layout/Header.jsx";
import CountdownOverlay from "./components/layout/CountdownOverlay.jsx";
import Footer from "./components/Footer.jsx";

// Components - Exercise
import ExerciseSelector from "./components/ExerciseSelector.jsx";
import EducationalInfoPanel from "./components/exercise/EducationalInfoPanel.jsx";

// Components - Tablature
import TablatureDesktop from "./components/tablature/TablatureDesktop.jsx";
import TablatureMobile from "./components/tablature/TablatureMobile.jsx";
import FretboardView from "./components/FretboardView.jsx";

// Components - Player
import ControlPanel from "./components/player/ControlPanel.jsx";

// PWA Components
import PWAInstallBanner from "./components/PWAInstallBanner.jsx";
import UpdateNotification from "./components/UpdateNotification.jsx";
import OfflineIndicator from "./components/OfflineIndicator.jsx";

// Hooks
import { useBassAudio } from "./hooks/useBassAudio.js";
import { usePlayerState } from "./hooks/usePlayerState.js";
import { useAudioScheduler } from "./hooks/useAudioScheduler.js";
import { usePWA } from "./hooks/usePWA.js";

// Config
import { THEME_CONFIG, COUNTDOWN_CONFIG, VIEW_MODES } from "./config/uiConfig.js";

// Data
import { 
  generateTabData, 
  getHeaderInfo,
  DEFAULT_EXERCISE,
  PATTERNS,
  getPatternsByCategory 
} from "./data/exerciseLibrary.js";

const EXERCISE_STORAGE_KEY = 'bass-trainer-exercise-state';

const BassTrainer = ({ selectedCategory, onBack }) => {
  // PWA Hook
  const {
    isInstallable,
    isInstalled,
    isOnline,
    updateAvailable,
    install,
    update,
    dismissUpdate,
  } = usePWA();
  
  // Player state
  const { state: playerState, actions } = usePlayerState();
  const audio = useBassAudio();
  
  const [viewMode, setViewMode] = useState(VIEW_MODES.TAB);
  
  // Exercise State - Initialize safe defaults
  const [exerciseState, setExerciseState] = useState(() => {
    // Priority 1: If an artist was selected from Home, try to load their first pattern
    if (selectedCategory) {
      const patterns = getPatternsByCategory()[selectedCategory];
      if (patterns && patterns.length > 0) {
        return {
          patternId: patterns[0].id,
          rootNote: 'E',
          secondPatternId: patterns.length > 1 ? patterns[1].id : patterns[0].id,
          secondRootNote: 'A'
        };
      }
    }

    // Priority 2: Load from storage if valid
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(EXERCISE_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.patternId && PATTERNS[parsed.patternId]) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn("State load failed", e);
      }
    }
    
    return DEFAULT_EXERCISE;
  });

  // Effect: Update exercises if category changes externally
  useEffect(() => {
    if (selectedCategory) {
      const patterns = getPatternsByCategory()[selectedCategory];
      if (patterns && patterns.length > 0) {
        setExerciseState(prev => ({
          ...prev,
          patternId: patterns[0].id,
          secondPatternId: patterns.length > 1 ? patterns[1].id : patterns[0].id
        }));
      }
    }
  }, [selectedCategory]);

  const { 
    patternId: selectedPattern, 
    rootNote: selectedRoot, 
    secondPatternId: secondPattern, 
    secondRootNote: secondRoot 
  } = exerciseState;

  // Setters
  const setSelectedPattern = (val) => setExerciseState(prev => ({ ...prev, patternId: val }));
  const setSelectedRoot = (val) => setExerciseState(prev => ({ ...prev, rootNote: val }));
  const setSecondPattern = (val) => setExerciseState(prev => ({ ...prev, secondPatternId: val }));
  const setSecondRoot = (val) => setExerciseState(prev => ({ ...prev, secondRootNote: val }));

  // Persist State
  useEffect(() => {
    localStorage.setItem(EXERCISE_STORAGE_KEY, JSON.stringify(exerciseState));
  }, [exerciseState]);

  // Theme
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_CONFIG.storageKey) || THEME_CONFIG.default);
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_CONFIG.storageKey, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme(p => p === 'dark' ? 'light' : 'dark'), []);

  // Audio & Logic
  const countdownTimeoutsRef = useRef([]);

  const tabData = useMemo(() => {
    const measure1 = generateTabData(selectedPattern, selectedRoot);
    const measure2 = generateTabData(secondPattern, secondRoot);
    return [...measure1, ...measure2.map((note, idx) => ({ ...note, id: measure1.length + idx }))];
  }, [selectedPattern, selectedRoot, secondPattern, secondRoot]);

  const headerInfo = useMemo(() => getHeaderInfo(selectedPattern, secondPattern), [selectedPattern, secondPattern]);

  const scheduler = useAudioScheduler({ audio, notes: tabData, playerState, actions });

  const handlePlay = useCallback(async () => {
    await audio.resume();
    actions.setAudioReady(true);
    if (playerState.isPlaying || playerState.isCountingDown) return;

    if (!playerState.isCountdownEnabled) {
      actions.playImmediate();
      scheduler.start();
      return;
    }

    actions.play();
    audio.playCountdownBeep();
    
    // Countdown logic
    let tick = 1;
    const interval = setInterval(() => {
      if (tick < 3) {
        actions.countdownTick();
        audio.playCountdownBeep();
        tick++;
      } else {
        clearInterval(interval);
        audio.playCountdownBeep(true);
        actions.countdownComplete();
        scheduler.start();
      }
    }, COUNTDOWN_CONFIG.interval);
    
    countdownTimeoutsRef.current.push(interval);
  }, [audio, playerState, actions, scheduler]);

  const handleStop = useCallback(() => {
    countdownTimeoutsRef.current.forEach(id => clearInterval(id));
    countdownTimeoutsRef.current = [];
    scheduler.stop();
    actions.stop();
  }, [scheduler, actions]);

  // Volume
  const handleBassVolume = (v) => { actions.setBassVolume(v); audio.setBassVolume(v); };
  const handleMetronomeVolume = (v) => { actions.setMetronomeVolume(v); audio.setMetronomeVolume(v); };

  const { isPlaying, isCountingDown, countdown, currentNoteIndex, currentBeat, currentTriplet, isAudioReady, tempo, isLooping, isMetronomeEnabled, isNotesMuted, isCountdownEnabled } = playerState;

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'SELECT'].includes(e.target.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        isPlaying || isCountingDown ? handleStop() : handlePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isCountingDown, handlePlay, handleStop]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-3 sm:py-5 md:py-8 px-3 sm:px-4 md:px-6 font-[var(--font-body)]">
      <OfflineIndicator isOnline={isOnline} />
      <PWAInstallBanner isInstallable={isInstallable && !isInstalled} onInstall={install} />
      <UpdateNotification isVisible={updateAvailable} onUpdate={update} onDismiss={dismissUpdate} />
      
      <div className="max-w-6xl w-full">
        {/* Navigation Back Button - Mobile Optimized */}
        <button 
          onClick={onBack}
          className="mb-3 sm:mb-4 md:mb-6 flex items-center gap-1.5 sm:gap-2 text-[var(--color-primary-light)] hover:text-[var(--color-gold)] transition-colors group"
        >
          <div className="p-1.5 sm:p-2 rounded-full glass group-hover:bg-[var(--color-primary-dark)]">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="font-medium text-xs sm:text-sm md:text-base">Volver a Artistas</span>
        </button>

        <Header headerInfo={headerInfo} isPlaying={isPlaying} isCountingDown={isCountingDown} theme={theme} toggleTheme={toggleTheme} />

        {isCountingDown && <CountdownOverlay countdown={countdown} onCancel={handleStop} />}

        <ExerciseSelector
          selectedPattern={selectedPattern} setSelectedPattern={setSelectedPattern}
          selectedRoot={selectedRoot} setSelectedRoot={setSelectedRoot}
          secondPattern={secondPattern} setSecondPattern={setSecondPattern}
          secondRoot={secondRoot} setSecondRoot={setSecondRoot}
          isPlaying={isPlaying || isCountingDown}
          selectedCategory={selectedCategory}
        />

        <EducationalInfoPanel selectedRoot={selectedRoot} selectedPattern={selectedPattern} />

        <div className="glass-strong rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden mb-3 sm:mb-4 md:mb-6 animate-fadeInUp">
          <div className="bg-[var(--color-primary-dark)]/50 px-3 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 border-b border-[var(--color-primary-medium)]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg gradient-gold flex items-center justify-center">
                  {viewMode === VIEW_MODES.TAB ? <Music className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-[var(--color-primary-deep)]" /> : <Guitar className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-[var(--color-primary-deep)]" />}
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-cream)] text-xs sm:text-sm">{viewMode === VIEW_MODES.TAB ? 'Tablature' : 'Fretboard'}</h3>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <button onClick={() => setViewMode(VIEW_MODES.TAB)} className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-[10px] sm:text-xs font-medium transition-all ${viewMode === VIEW_MODES.TAB ? 'bg-[var(--color-gold)] text-[var(--color-primary-deep)]' : 'bg-[var(--color-primary-dark)] text-[var(--color-primary-light)]'}`}>Tab</button>
                <button onClick={() => setViewMode(VIEW_MODES.FRETBOARD)} className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-[10px] sm:text-xs font-medium transition-all ${viewMode === VIEW_MODES.FRETBOARD ? 'bg-[var(--color-gold)] text-[var(--color-primary-deep)]' : 'bg-[var(--color-primary-dark)] text-[var(--color-primary-light)]'}`}>Diapasón</button>
              </div>
            </div>
          </div>

          {viewMode === VIEW_MODES.FRETBOARD ? (
            <FretboardView tabData={tabData} currentNoteIndex={currentNoteIndex} />
          ) : (
            <>
              <TablatureDesktop tabData={tabData} currentNoteIndex={currentNoteIndex} selectedRoot={selectedRoot} selectedPattern={selectedPattern} secondRoot={secondRoot} secondPattern={secondPattern} />
              <TablatureMobile tabData={tabData} currentNoteIndex={currentNoteIndex} />
            </>
          )}
        </div>

        <ControlPanel
          currentBeat={currentBeat} currentTriplet={currentTriplet} isPlaying={isPlaying}
          handlePlay={handlePlay} handleStop={handleStop}
          isLooping={isLooping} toggleLoop={actions.toggleLoop}
          isNotesMuted={isNotesMuted} toggleNotesMuted={actions.toggleNotesMuted}
          isMetronomeEnabled={isMetronomeEnabled} toggleMetronome={actions.toggleMetronome}
          isCountdownEnabled={isCountdownEnabled} toggleCountdown={actions.toggleCountdown}
          tempo={tempo} setTempo={actions.setTempo}
          bassVolume={playerState.bassVolume} setBassVolume={handleBassVolume}
          metronomeVolume={playerState.metronomeVolume} setMetronomeVolume={handleMetronomeVolume}
        />

        {!isAudioReady && (
          <div className="mt-3 sm:mt-4 glass rounded-lg sm:rounded-xl p-3 sm:p-4 border border-[var(--color-warning)]/30 flex items-center justify-center gap-2 sm:gap-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-warning)]" />
            <span className="text-[var(--color-warning)] font-medium text-xs sm:text-sm">Presiona PLAY para activar el audio</span>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default BassTrainer;