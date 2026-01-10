/**
 * usePopoutWindow Hook - Bass Trainer
 * Manages the pop-out trainer window lifecycle from the main window
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { POPOUT_CONFIG } from '../config/uiConfig.js';

/**
 * Hook to manage popout window lifecycle
 * @param {Object} options
 * @param {Function} options.onOpen - Callback when popout opens
 * @param {Function} options.onClose - Callback when popout closes
 */
export function usePopoutWindow({ onOpen, onClose } = {}) {
  const [isPopoutOpen, setIsPopoutOpen] = useState(false);
  const popoutRef = useRef(null);
  const checkIntervalRef = useRef(null);

  // Calculate centered window position
  const getCenteredPosition = useCallback(() => {
    const { width, height } = POPOUT_CONFIG;
    const left = Math.max(0, (window.screen.width - width) / 2 + window.screenX);
    const top = Math.max(0, (window.screen.height - height) / 2 + window.screenY);
    return { left, top };
  }, []);

  // Open popout window
  const openPopout = useCallback(() => {
    // If already open, focus it
    if (popoutRef.current && !popoutRef.current.closed) {
      popoutRef.current.focus();
      return popoutRef.current;
    }

    const { width, height, features } = POPOUT_CONFIG;
    const { left, top } = getCenteredPosition();

    const windowFeatures = `${features},width=${width},height=${height},left=${left},top=${top}`;
    
    // Open the popout page
    const popout = window.open('/popout.html', 'bass-trainer-popout', windowFeatures);

    if (popout) {
      popoutRef.current = popout;
      setIsPopoutOpen(true);
      onOpen?.(popout);

      // Start checking if window is still open
      checkIntervalRef.current = setInterval(() => {
        if (popout.closed) {
          setIsPopoutOpen(false);
          popoutRef.current = null;
          onClose?.();
          if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current);
            checkIntervalRef.current = null;
          }
        }
      }, 500);
    } else {
      // Popup was blocked
      console.warn('[usePopoutWindow] Popup blocked by browser');
    }

    return popout;
  }, [getCenteredPosition, onOpen, onClose]);

  // Close popout window
  const closePopout = useCallback(() => {
    if (popoutRef.current && !popoutRef.current.closed) {
      popoutRef.current.close();
    }
    popoutRef.current = null;
    setIsPopoutOpen(false);

    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }
  }, []);

  // Focus popout window
  const focusPopout = useCallback(() => {
    if (popoutRef.current && !popoutRef.current.closed) {
      popoutRef.current.focus();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      // Optionally close popout when main window unloads
      // (uncomment if desired behavior)
      // closePopout();
    };
  }, []);

  // Close popout when main window is about to unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (popoutRef.current && !popoutRef.current.closed) {
        popoutRef.current.close();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return {
    openPopout,
    closePopout,
    focusPopout,
    isPopoutOpen,
    popoutWindow: popoutRef.current,
  };
}

export default usePopoutWindow;
