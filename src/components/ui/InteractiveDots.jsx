'use client';
import { useEffect, useRef, useCallback } from 'react';

/**
 * InteractiveDots Component
 * A canvas-based animated dots pattern that responds to mouse interaction
 * Mobile-first design with optimized grid spacing for different screen sizes
 */
const InteractiveDots = ({
  dotColor = '#3B82F6',  // Blue color like in Cursify demo
  gridSpacing = 30,
  animationSpeed = 0.005,
  removeWaveLine = true,
}) => {
  const canvasRef = useRef(null);
  const timeRef = useRef(0);
  const animationFrameId = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const ripples = useRef([]);
  const dotsRef = useRef([]);

  const getMouseInfluence = useCallback((x, y) => {
    const dx = x - mouseRef.current.x;
    const dy = y - mouseRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 150;
    return Math.max(0, 1 - distance / maxDistance);
  }, []);

  const getRippleInfluence = useCallback((x, y, currentTime) => {
    let totalInfluence = 0;
    ripples.current.forEach((ripple) => {
      const age = currentTime - ripple.time;
      const maxAge = 3000;
      if (age < maxAge) {
        const dx = x - ripple.x;
        const dy = y - ripple.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const rippleRadius = (age / maxAge) * 300;
        const rippleWidth = 60;
        if (Math.abs(distance - rippleRadius) < rippleWidth) {
          const rippleStrength = (1 - age / maxAge) * ripple.intensity;
          const proximityToRipple =
            1 - Math.abs(distance - rippleRadius) / rippleWidth;
          totalInfluence += rippleStrength * proximityToRipple;
        }
      }
    });
    return Math.min(totalInfluence, 2);
  }, []);

  const initializeDots = useCallback((width, height) => {
    const dots = [];
    for (let x = gridSpacing / 2; x < width; x += gridSpacing) {
      for (let y = gridSpacing / 2; y < height; y += gridSpacing) {
        dots.push({
          x,
          y,
          originalX: x,
          originalY: y,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
    dotsRef.current = dots;
  }, [gridSpacing]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    canvas.style.width = displayWidth + 'px';
    canvas.style.height = displayHeight + 'px';

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    initializeDots(displayWidth, displayHeight);
  }, [initializeDots]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    timeRef.current += animationSpeed;
    const currentTime = Date.now();

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;

    // Clear with transparent background
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Parse dot color
    const red = parseInt(dotColor.slice(1, 3), 16);
    const green = parseInt(dotColor.slice(3, 5), 16);
    const blue = parseInt(dotColor.slice(5, 7), 16);

    dotsRef.current.forEach((dot) => {
      const mouseInfluence = getMouseInfluence(dot.originalX, dot.originalY);
      const rippleInfluence = getRippleInfluence(
        dot.originalX,
        dot.originalY,
        currentTime
      );
      const totalInfluence = mouseInfluence + rippleInfluence;

      // Base dot size with influence
      const baseDotSize = 2;
      const dotSize =
        baseDotSize +
        totalInfluence * 6 +
        Math.sin(timeRef.current + dot.phase) * 0.5;

      // Opacity based on influence - higher base opacity for visibility
      const opacity = Math.max(
        0.3,
        0.5 +
          totalInfluence * 0.5 +
          Math.abs(Math.sin(timeRef.current * 0.5 + dot.phase)) * 0.1
      );

      ctx.beginPath();
      ctx.arc(dot.originalX, dot.originalY, dotSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${opacity})`;
      ctx.fill();
    });

    // Optional ripple wave lines
    if (!removeWaveLine) {
      ripples.current.forEach((ripple) => {
        const age = currentTime - ripple.time;
        const maxAge = 3000;
        if (age < maxAge) {
          const progress = age / maxAge;
          const radius = progress * 300;
          const alpha = (1 - progress) * 0.3 * ripple.intensity;

          ctx.beginPath();
          ctx.strokeStyle = `rgba(100, 100, 100, ${alpha})`;
          ctx.lineWidth = 2;
          ctx.arc(ripple.x, ripple.y, radius, 0, 2 * Math.PI);
          ctx.stroke();
        }
      });
    }

    // Clean old ripples
    const now = Date.now();
    ripples.current = ripples.current.filter(
      (ripple) => now - ripple.time < 3000
    );

    animationFrameId.current = requestAnimationFrame(animate);
  }, [dotColor, removeWaveLine, animationSpeed, getMouseInfluence, getRippleInfluence]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    resizeCanvas();

    // Global mouse tracking on document level
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseDown = (e) => {
      ripples.current.push({
        x: e.clientX,
        y: e.clientY,
        time: Date.now(),
        intensity: 2,
      });
    };

    const handleTouchStart = (e) => {
      if (e.touches[0]) {
        const x = e.touches[0].clientX;
        const y = e.touches[0].clientY;
        mouseRef.current.x = x;
        mouseRef.current.y = y;
        ripples.current.push({
          x,
          y,
          time: Date.now(),
          intensity: 2,
        });
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches[0]) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
      }
    };

    const handleResize = () => resizeCanvas();

    // Add listeners to document for global tracking
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      timeRef.current = 0;
      ripples.current = [];
      dotsRef.current = [];
    };
  }, [animate, resizeCanvas]);

  return (
    <div
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default InteractiveDots;
