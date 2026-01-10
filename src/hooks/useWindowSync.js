/**
 * useWindowSync Hook - Bass Trainer
 * Handles bi-directional postMessage communication between main and popout windows
 */

import { useEffect, useCallback, useRef } from 'react';

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
  const connectedRef = useRef(false);
  const partnerWindowRef = useRef(null);
  const heartbeatIntervalRef = useRef(null);
  const lastPongRef = useRef(Date.now());

  // Set partner window reference
  const setPartnerWindow = useCallback((win) => {
    partnerWindowRef.current = win;
  }, []);

  // Send message to partner window
  const sendMessage = useCallback((type, payload = {}) => {
    const target = partnerWindowRef.current;
    if (!target || target.closed) {
      if (connectedRef.current) {
        connectedRef.current = false;
        onConnectionChange?.(false);
      }
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
  }, [onConnectionChange]);

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

  // Handle incoming messages
  useEffect(() => {
    const handleMessage = (event) => {
      // Security: Only accept messages from same origin
      if (event.origin !== getOrigin()) return;
      
      const { type, payload, source } = event.data || {};
      
      // Only process bass-trainer messages
      if (source !== 'bass-trainer') return;

      switch (type) {
        case SYNC_MESSAGE_TYPES.STATE_UPDATE:
          onStateReceived?.(payload);
          break;

        case SYNC_MESSAGE_TYPES.COMMAND:
          onCommandReceived?.(payload.command, payload.value);
          break;

        case SYNC_MESSAGE_TYPES.HANDSHAKE:
          // Partner connected - store reference if we're main and this is from popout
          if (!isPopout && payload.isPopout && event.source) {
            partnerWindowRef.current = event.source;
          }
          if (!connectedRef.current) {
            connectedRef.current = true;
            onConnectionChange?.(true);
          }
          // Respond to handshake
          sendMessage(SYNC_MESSAGE_TYPES.PONG);
          break;

        case SYNC_MESSAGE_TYPES.PING:
          sendMessage(SYNC_MESSAGE_TYPES.PONG);
          break;

        case SYNC_MESSAGE_TYPES.PONG:
          lastPongRef.current = Date.now();
          if (!connectedRef.current) {
            connectedRef.current = true;
            onConnectionChange?.(true);
          }
          break;

        case SYNC_MESSAGE_TYPES.DISCONNECT:
          connectedRef.current = false;
          onConnectionChange?.(false);
          break;

        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isPopout, onStateReceived, onCommandReceived, onConnectionChange, sendMessage]);

  // Heartbeat to check connection (only when connected)
  useEffect(() => {
    if (!partnerWindowRef.current) return;

    heartbeatIntervalRef.current = setInterval(() => {
      // Check if partner window is still open
      if (partnerWindowRef.current?.closed) {
        if (connectedRef.current) {
          connectedRef.current = false;
          onConnectionChange?.(false);
        }
        return;
      }

      // Send ping
      sendMessage(SYNC_MESSAGE_TYPES.PING);

      // Check for stale connection (no pong in 5 seconds)
      if (connectedRef.current && Date.now() - lastPongRef.current > 5000) {
        connectedRef.current = false;
        onConnectionChange?.(false);
      }
    }, 2000);

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [sendMessage, onConnectionChange]);

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
    isConnected: connectedRef.current,
  };
}

export default useWindowSync;
