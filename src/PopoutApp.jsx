/**
 * PopoutApp - Bass Trainer
 * Root component for the pop-out trainer window
 * Receives state from main window via postMessage
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useWindowSync, SYNC_COMMANDS } from './hooks/useWindowSync.js';
import PopoutTrainer from './components/popout/PopoutTrainer.jsx';

const PopoutApp = () => {
  // Synced state from main window
  const [syncedState, setSyncedState] = useState({
    isPlaying: false,
    tempo: 100,
    currentNoteIndex: -1,
    tabData: [],
    headerInfo: { displayName: 'Connecting...', subtitle: '' },
    selectedRoot: 'E',
    selectedPattern: null,
    secondRoot: 'A',
    secondPattern: null,
    theme: 'dark',
    isMetronomeEnabled: false,
    isLooping: true,
  });

  const mainWindowRef = useRef(window.opener);
  const sendHandshakeRef = useRef(null);
  const setPartnerWindowRef = useRef(null);

  // Handle state updates from main window
  const handleStateReceived = useCallback((state) => {
    setSyncedState(prev => ({ ...prev, ...state }));
  }, []);

  // Handle commands from main window (if any)
  const handleCommandReceived = useCallback((command, value) => {
    // Popout mostly receives state, but could receive commands
    console.log('[PopoutApp] Command received:', command, value);
  }, []);

  // Use isConnected directly from the hook
  const {
    sendCommand,
    sendHandshake,
    setPartnerWindow,
    isConnected,
  } = useWindowSync({
    isPopout: true,
    onStateReceived: handleStateReceived,
    onCommandReceived: handleCommandReceived,
  });

  // Store functions in refs for stable access in mount effect
  useEffect(() => {
    sendHandshakeRef.current = sendHandshake;
    setPartnerWindowRef.current = setPartnerWindow;
  }, [sendHandshake, setPartnerWindow]);

  // Set up connection to main window on mount
  useEffect(() => {
    if (!mainWindowRef.current) return;
    
    // Use a small delay to ensure functions are ready
    const initTimer = setTimeout(() => {
      setPartnerWindowRef.current?.(mainWindowRef.current);
      sendHandshakeRef.current?.();
    }, 100);
    
    // Retry handshake a few times in case of timing issues
    const retryTimers = [600, 1200, 2500].map(delay => 
      setTimeout(() => {
        sendHandshakeRef.current?.();
      }, delay)
    );
    
    return () => {
      clearTimeout(initTimer);
      retryTimers.forEach(t => clearTimeout(t));
    };
  }, []); // Empty deps - only run once on mount

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', syncedState.theme);
  }, [syncedState.theme]);

  // Command handlers (send to main window)
  const handlePlayPause = useCallback(() => {
    if (syncedState.isPlaying) {
      sendCommand(SYNC_COMMANDS.STOP);
    } else {
      sendCommand(SYNC_COMMANDS.PLAY);
    }
  }, [syncedState.isPlaying, sendCommand]);

  const handleTempoChange = useCallback((newTempo) => {
    sendCommand(SYNC_COMMANDS.SET_TEMPO, newTempo);
  }, [sendCommand]);

  const handleToggleMetronome = useCallback(() => {
    sendCommand(SYNC_COMMANDS.TOGGLE_METRONOME);
  }, [sendCommand]);

  const handleToggleLoop = useCallback(() => {
    sendCommand(SYNC_COMMANDS.TOGGLE_LOOP);
  }, [sendCommand]);

  const handleClose = useCallback(() => {
    window.close();
  }, []);

  const handleReturnToMain = useCallback(() => {
    if (mainWindowRef.current && !mainWindowRef.current.closed) {
      mainWindowRef.current.focus();
    }
    window.close();
  }, []);

  return (
    <div className="popout-app min-h-screen">
      <PopoutTrainer
        isConnected={isConnected}
        isPlaying={syncedState.isPlaying}
        tempo={syncedState.tempo}
        currentNoteIndex={syncedState.currentNoteIndex}
        tabData={syncedState.tabData}
        headerInfo={syncedState.headerInfo}
        selectedRoot={syncedState.selectedRoot}
        selectedPattern={syncedState.selectedPattern}
        secondRoot={syncedState.secondRoot}
        secondPattern={syncedState.secondPattern}
        isMetronomeEnabled={syncedState.isMetronomeEnabled}
        isLooping={syncedState.isLooping}
        onPlayPause={handlePlayPause}
        onTempoChange={handleTempoChange}
        onToggleMetronome={handleToggleMetronome}
        onToggleLoop={handleToggleLoop}
        onClose={handleClose}
        onReturnToMain={handleReturnToMain}
      />
    </div>
  );
};

export default PopoutApp;
