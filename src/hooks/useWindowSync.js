/**
 * useWindowSync Hook - Bass Trainer
 * Handles bi-directional postMessage communication between main and popout windows
 */

import { useEffect, useCallback, useRef, useState } from 'react';

// Message types for cross-window communication
export const SYNC_MESSAGE_TYPES = {
  STATE_UPDATE: 'TRAINER_STATE_UPDATE',
  COMMAND: 'TRAINER_COMMAND',
  PING: 'TRAINER_PING',
  PONG: 'TRAINER_PONG',
  HANDSHAKE: 'TRAINER_HANDSHAKE',
  DISCONNECT: 'TRAINER_DISCONNECT',
};

// Command types
export const SYNC_COMMANDS = {
  PLAY: 'PLAY',
  STOP: 'STOP',
  SET_TEMPO: 'SET_TEMPO',
  TOGGLE_METRONOME: 'TOGGLE_METRONOME',
  TOGGLE_LOOP: 'TOGGLE_LOOP',
};

// Origin for security validation
const getOrigin = () => window.location.origin;

/**
 * Hook for cross-window sync via postMessage
 * @param {Object} options
 * @param {boolean} options.isPopout - Whether this is the popout window
 * @param {Function} options.onStateReceived - Callback when state update received
 * @param {Function} options.onCommandReceived - Callback when command received
 * @param {Function} options.onConnectionChange - Callback when connection status changes
 */
export function useWindowSync({ 
  isPopout = false, 
  onStateReceived, 
  onCommandReceived,
  onConnectionChange,
}) {
  const [isConnected, setIsConnected] = useState(false);
  const partnerWindowRef = useRef(null);
  const lastPongRef = useRef(Date.now());
  
  // Store callbacks in refs to avoid effect re-runs
  const onStateReceivedRef = useRef(onStateReceived);
  const onCommandReceivedRef = useRef(onCommandReceived);
  const onConnectionChangeRef = useRef(onConnectionChange);
  
  // Update refs when callbacks change
  useEffect(() => {
    onStateReceivedRef.current = onStateReceived;
    onCommandReceivedRef.current = onCommandReceived;
    onConnectionChangeRef.current = onConnectionChange;
  }, [onStateReceived, onCommandReceived, onConnectionChange]);

  // Set partner window reference
  const setPartnerWindow = useCallback((win) => {
    partnerWindowRef.current = win;
    lastPongRef.current = Date.now(); // Reset pong timer
  }, []);

  // Send message to partner window (stable function)
  const sendMessage = useCallback((type, payload = {}) => {
    const target = partnerWindowRef.current;
    if (!target || target.closed) {
      return false;
    }

    try {
      target.postMessage(
        { type, payload, source: 'bass-trainer' },
        getOrigin()
      );
      return true;
    } catch (err) {
      console.warn('[useWindowSync] Failed to send message:', err);
      return false;
    }
  }, []);

  // Send state update
  const sendState = useCallback((state) => {
    return sendMessage(SYNC_MESSAGE_TYPES.STATE_UPDATE, state);
  }, [sendMessage]);

  // Send command
  const sendCommand = useCallback((command, value) => {
    return sendMessage(SYNC_MESSAGE_TYPES.COMMAND, { command, value });
  }, [sendMessage]);

  // Send handshake (for initial connection)
  const sendHandshake = useCallback(() => {
    return sendMessage(SYNC_MESSAGE_TYPES.HANDSHAKE, { isPopout });
  }, [sendMessage, isPopout]);

  // Handle incoming messages - single stable effect
  useEffect(() => {
    const handleMessage = (event) => {
      // Security: Only accept messages from same origin
      if (event.origin !== getOrigin()) return;
      
      const { type, payload, source } = event.data || {};
      
      // Only process bass-trainer messages
      if (source !== 'bass-trainer') return;

      switch (type) {
        case SYNC_MESSAGE_TYPES.STATE_UPDATE:
          onStateReceivedRef.current?.(payload);
          break;

        case SYNC_MESSAGE_TYPES.COMMAND:
          onCommandReceivedRef.current?.(payload.command, payload.value);
          break;

        case SYNC_MESSAGE_TYPES.HANDSHAKE:
          // Partner connected - store reference if we're main and this is from popout
          if (!isPopout && payload.isPopout && event.source) {
            partnerWindowRef.current = event.source;
          }
          lastPongRef.current = Date.now();
          setIsConnected(true);
          onConnectionChangeRef.current?.(true);
          // Respond to handshake
          sendMessage(SYNC_MESSAGE_TYPES.PONG);
          break;

        case SYNC_MESSAGE_TYPES.PING:
          sendMessage(SYNC_MESSAGE_TYPES.PONG);
          break;

        case SYNC_MESSAGE_TYPES.PONG:
          lastPongRef.current = Date.now();
          setIsConnected(true);
          break;

        case SYNC_MESSAGE_TYPES.DISCONNECT:
          setIsConnected(false);
          onConnectionChangeRef.current?.(false);
          break;

        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isPopout, sendMessage]); // Minimal dependencies

  // Heartbeat interval - only starts once on mount
  useEffect(() => {
    const heartbeatInterval = setInterval(() => {
      const target = partnerWindowRef.current;
      
      // Check if partner window is closed
      if (target?.closed) {
        setIsConnected(false);
        onConnectionChangeRef.current?.(false);
        return;
      }

      // Only send ping if we have a partner
      if (target) {
        sendMessage(SYNC_MESSAGE_TYPES.PING);
        
        // Check for stale connection (no pong in 6 seconds)
        if (Date.now() - lastPongRef.current > 6000) {
          setIsConnected(false);
          onConnectionChangeRef.current?.(false);
        }
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(heartbeatInterval);
  }, [sendMessage]); // Only depends on sendMessage

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      sendMessage(SYNC_MESSAGE_TYPES.DISCONNECT);
    };
  }, [sendMessage]);

  return {
    sendState,
    sendCommand,
    sendHandshake,
    setPartnerWindow,
    isConnected,
  };
}

export default useWindowSync;
