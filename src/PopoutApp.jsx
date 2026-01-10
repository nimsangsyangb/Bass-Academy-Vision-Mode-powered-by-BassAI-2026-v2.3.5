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

  const [isConnected, setIsConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const mainWindowRef = useRef(window.opener);

  // Handle state updates from main window
  const handleStateReceived = useCallback((state) => {
    setSyncedState(prev => ({ ...prev, ...state }));
  }, []);

  // Handle commands from main window (if any)
  const handleCommandReceived = useCallback((command, value) => {
    // Popout mostly receives state, but could receive commands
    console.log('[PopoutApp] Command received:', command, value);
  }, []);

  // Handle connection status changes
  const handleConnectionChange = useCallback((connected) => {
    setIsConnected(connected);
    if (connected) {
      setConnectionAttempts(0);
    }
  }, []);

  const {
    sendCommand,
    sendHandshake,
    setPartnerWindow,
  } = useWindowSync({
    isPopout: true,
    onStateReceived: handleStateReceived,
    onCommandReceived: handleCommandReceived,
    onConnectionChange: handleConnectionChange,
  });

  // Set up connection to main window
  useEffect(() => {
    if (mainWindowRef.current) {
      setPartnerWindow(mainWindowRef.current);
      // Send handshake to establish connection
      sendHandshake();
    }
  }, [setPartnerWindow, sendHandshake]);

  // Retry handshake if not connected
  useEffect(() => {
    if (!isConnected && connectionAttempts < 10) {
      const timer = setTimeout(() => {
        sendHandshake();
        setConnectionAttempts(prev => prev + 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isConnected, connectionAttempts, sendHandshake]);

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
