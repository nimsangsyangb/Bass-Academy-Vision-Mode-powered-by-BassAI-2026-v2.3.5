/**
 * Bass Trainer - Main Application Component
 * ✨ WITH PWA SUPPORT ✨
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Music, AlertCircle, Guitar, List } from "lucide-react";

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
  DEFAULT_EXERCISE 
} from "./data/exerciseLibrary.js";

const BassTrainer = () => {
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
  
  // Player state (from reducer with FSM)
  const { state: playerState, actions } = usePlayerState();
  
  // Audio hook
  const audio = useBassAudio();
  
  // View mode state
  const [viewMode, setViewMode] = useState(VIEW_MODES.TAB);
  
  // Exercise selection states
  const [selectedPattern, setSelectedPattern] = useState(DEFAULT_EXERCISE.patternId);
  const [selectedRoot, setSelectedRoot] = useState(DEFAULT_EXERCISE.rootNote);
  const [secondPattern, setSecondPattern] = useState(DEFAULT_EXERCISE.secondPatternId);
  const [secondRoot, setSecondRoot] = useState(DEFAULT_EXERCISE.secondRootNote);
  
  // Theme state with localStorage persistence
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(THEME_CONFIG.storageKey) || THEME_CONFIG.default;
    }
    return THEME_CONFIG.default;
  });

  // Countdown timeout refs
  const countdownTimeoutsRef = useRef([]);

  // Dynamic tab data generation based on selected exercises
  const tabData = useMemo(() => {
    const measure1 = generateTabData(selectedPattern, selectedRoot);
    const measure2 = generateTabData(secondPattern, secondRoot);
    
    return [
      ...measure1,
      ...measure2.map((note, idx) => ({
        ...note,
        id: measure1.length + idx
      }))
    ];
  }, [selectedPattern, selectedRoot, secondPattern, secondRoot]);

  // Dynamic header info
  const headerInfo = useMemo(() => {
    return getHeaderInfo(selectedPattern, secondPattern);
  }, [selectedPattern, secondPattern]);

  // Audio scheduler
  const scheduler = useAudioScheduler({
    audio,
    notes: tabData,
    playerState,
    actions,
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_CONFIG.storageKey, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  }, []);

  // Handle play button click (uses FSM transitions)
  const handlePlay = useCallback(async () => {
    await audio.resume();
    actions.setAudioReady(true);

    if (playerState.isPlaying || playerState.isCountingDown) return;

    if (!playerState.isCountdownEnabled) {
      actions.playImmediate();
      scheduler.start();
      return;
    }

    countdownTimeoutsRef.current.forEach(id => clearTimeout(id));
    countdownTimeoutsRef.current = [];

    actions.play();
    audio.playCountdownBeep();

    const timeout1 = setTimeout(() => {
      actions.countdownTick();
      audio.playCountdownBeep();
    }, COUNTDOWN_CONFIG.interval);

    const timeout2 = setTimeout(() => {
      actions.countdownTick();
      audio.playCountdownBeep();
    }, COUNTDOWN_CONFIG.interval * 2);

    const timeout3 = setTimeout(() => {
      countdownTimeoutsRef.current = [];
      audio.playCountdownBeep(true);
      actions.countdownComplete();
      scheduler.start();
    }, COUNTDOWN_CONFIG.interval * 3);

    countdownTimeoutsRef.current = [timeout1, timeout2, timeout3];
  }, [audio, playerState.isPlaying, playerState.isCountingDown, playerState.isCountdownEnabled, actions, scheduler]);

  const handleStop = useCallback(() => {
    countdownTimeoutsRef.current.forEach(id => clearTimeout(id));
    countdownTimeoutsRef.current = [];
    
    scheduler.stop();
    actions.stop();
  }, [scheduler, actions]);

  const {
    isPlaying,
    isCountingDown,
    countdown,
    currentNoteIndex,
    currentBeat,
    currentTriplet,
    isAudioReady,
    tempo,
    isLooping,
    isMetronomeEnabled,
    isNotesMuted,
    isCountdownEnabled,
  } = playerState;

  // Global keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ignore if typing in an input or select element
      const tagName = event.target.tagName;
      if (tagName === 'INPUT' || tagName === 'SELECT' || tagName === 'TEXTAREA') return;
      
      // Space key toggles play/pause
      if (event.code === 'Space') {
        event.preventDefault();
        if (isPlaying || isCountingDown) {
          handleStop();
        } else {
          handlePlay();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isCountingDown, handlePlay, handleStop]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-4 sm:py-8 px-2 sm:px-4 font-[var(--font-body)]">
      {/* PWA Components */}
      <OfflineIndicator isOnline={isOnline} />
      <PWAInstallBanner 
        isInstallable={isInstallable && !isInstalled}
        onInstall={install}
        onDismiss={() => {}}
      />
      <UpdateNotification
        isVisible={updateAvailable}
        onUpdate={update}
        onDismiss={dismissUpdate}
      />
      
      {/* Main Container */}
      <div className="max-w-6xl w-full">
        
        {/* Header */}
        <Header
          headerInfo={headerInfo}
          isPlaying={isPlaying}
          isCountingDown={isCountingDown}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        {/* Countdown Overlay */}
        {isCountingDown && (
          <CountdownOverlay 
            countdown={countdown} 
            onCancel={handleStop} 
          />
        )}

        {/* Exercise Selector */}
        <ExerciseSelector
          selectedPattern={selectedPattern}
          setSelectedPattern={setSelectedPattern}
          selectedRoot={selectedRoot}
          setSelectedRoot={setSelectedRoot}
          secondPattern={secondPattern}
          setSecondPattern={setSecondPattern}
          secondRoot={secondRoot}
          setSecondRoot={setSecondRoot}
          isPlaying={isPlaying || isCountingDown}
        />

        {/* Educational Info Panel */}
        <EducationalInfoPanel
          selectedRoot={selectedRoot}
          selectedPattern={selectedPattern}
          secondRoot={secondRoot}
          secondPattern={secondPattern}
        />

        {/* Main Practice Area */}
        <div 
          className="glass-strong rounded-2xl sm:rounded-3xl overflow-hidden mb-4 sm:mb-6 animate-fadeInUp" 
          style={{animationDelay: "0.2s"}}
        >
          <div className="bg-[var(--color-primary-dark)]/50 px-3 sm:px-8 py-2 sm:py-4 border-b border-[var(--color-primary-medium)]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl gradient-gold flex items-center justify-center">
                  {viewMode === VIEW_MODES.TAB ? (
                    <Music className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-primary-deep)]" />
                  ) : (
                    <Guitar className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-primary-deep)]" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-cream)] text-sm sm:text-base">
                    {viewMode === VIEW_MODES.TAB ? 'Tablature' : 'Fretboard'}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-[var(--color-primary-light)] hidden sm:block">
                    {viewMode === VIEW_MODES.TAB ? 'Follow the highlighted notes' : 'Vista del diapasón'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => setViewMode(VIEW_MODES.TAB)}
                  aria-label="Tablature view"
                  aria-pressed={viewMode === VIEW_MODES.TAB}
                  className={`
                    flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl
                    font-medium text-[10px] sm:text-xs transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:ring-offset-1 focus:ring-offset-[var(--color-primary-deep)]
                    ${viewMode === VIEW_MODES.TAB
                      ? 'bg-[var(--color-gold)] text-[var(--color-primary-deep)]'
                      : 'bg-[var(--color-primary-dark)] text-[var(--color-primary-light)] border border-[var(--color-primary-medium)] hover:border-[var(--color-gold)]/50'
                    }
                  `}
                >
                  <List className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Tab</span>
                </button>
                <button
                  onClick={() => setViewMode(VIEW_MODES.FRETBOARD)}
                  aria-label="Fretboard view"
                  aria-pressed={viewMode === VIEW_MODES.FRETBOARD}
                  className={`
                    flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl
                    font-medium text-[10px] sm:text-xs transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:ring-offset-1 focus:ring-offset-[var(--color-primary-deep)]
                    ${viewMode === VIEW_MODES.FRETBOARD
                      ? 'bg-[var(--color-gold)] text-[var(--color-primary-deep)]'
                      : 'bg-[var(--color-primary-dark)] text-[var(--color-primary-light)] border border-[var(--color-primary-medium)] hover:border-[var(--color-gold)]/50'
                    }
                  `}
                >
                  <Guitar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Diapasón</span>
                </button>
                
                <div className="font-mono text-xs sm:text-sm bg-[var(--color-primary-deep)] px-2 sm:px-4 py-1 sm:py-2 rounded-md sm:rounded-lg border border-[var(--color-primary-medium)] ml-1 sm:ml-2">
                  <span className="text-[var(--color-gold)]">{currentNoteIndex >= 0 ? currentNoteIndex + 1 : 0}</span>
                  <span className="text-[var(--color-primary-light)]"> / {tabData.length}</span>
                </div>
              </div>
            </div>
          </div>

          {viewMode === VIEW_MODES.FRETBOARD ? (
            <FretboardView 
              tabData={tabData} 
              currentNoteIndex={currentNoteIndex}
            />
          ) : (
            <>
              <TablatureDesktop
                tabData={tabData}
                currentNoteIndex={currentNoteIndex}
                selectedRoot={selectedRoot}
                selectedPattern={selectedPattern}
                secondRoot={secondRoot}
                secondPattern={secondPattern}
              />
              <TablatureMobile
                tabData={tabData}
                currentNoteIndex={currentNoteIndex}
                selectedRoot={selectedRoot}
                selectedPattern={selectedPattern}
                secondRoot={secondRoot}
                secondPattern={secondPattern}
              />
            </>
          )}
        </div>

        {/* Control Panel */}
        <ControlPanel
          currentBeat={currentBeat}
          currentTriplet={currentTriplet}
          isPlaying={isPlaying}
          handlePlay={handlePlay}
          handleStop={handleStop}
          isLooping={isLooping}
          toggleLoop={actions.toggleLoop}
          isNotesMuted={isNotesMuted}
          toggleNotesMuted={actions.toggleNotesMuted}
          isMetronomeEnabled={isMetronomeEnabled}
          toggleMetronome={actions.toggleMetronome}
          isCountdownEnabled={isCountdownEnabled}
          toggleCountdown={actions.toggleCountdown}
          tempo={tempo}
          setTempo={actions.setTempo}
        />

        {!isAudioReady && (
          <div 
            className="mt-3 sm:mt-6 glass rounded-lg sm:rounded-xl p-2 sm:p-4 border border-[var(--color-warning)]/30 
                       flex items-center justify-center gap-2 sm:gap-3 animate-fadeInUp"
            style={{animationDelay: "0.4s"}}
          >
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-warning)]" />
            <span className="text-[var(--color-warning)] text-xs sm:text-sm font-medium">
              Presiona PLAY para activar el audio
            </span>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default BassTrainer;
