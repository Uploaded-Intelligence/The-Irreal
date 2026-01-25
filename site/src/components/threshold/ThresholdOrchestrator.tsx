import { useEffect, useRef, useCallback } from 'react';
import { useThresholdStore } from '../../stores/thresholdStore';
import { thresholdAudio } from '../../lib/audio/ThresholdAudio';

// Stage durations in milliseconds
const STAGE_DURATIONS: Record<string, number> = {
  detection: 500,
  void: 2000,
  attunement: 2000,
  crystallization: 2000,
  portals: Infinity,  // User-driven
  crossing: 1200,
};

const STAGE_ORDER = [
  'detection',
  'void',
  'attunement',
  'crystallization',
  'portals',
] as const;

export function ThresholdOrchestrator() {
  const stage = useThresholdStore((s) => s.stage);
  const setStage = useThresholdStore((s) => s.setStage);
  const setPrefersReducedMotion = useThresholdStore((s) => s.setPrefersReducedMotion);
  const setAudioEnabled = useThresholdStore((s) => s.setAudioEnabled);
  const setMouseVelocity = useThresholdStore((s) => s.setMouseVelocity);
  const audioEnabled = useThresholdStore((s) => s.audioEnabled);
  const selectedPortal = useThresholdStore((s) => s.selectedPortal);

  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastMouseTime = useRef(Date.now());
  const audioInitialized = useRef(false);

  // Detection stage: detect preferences
  useEffect(() => {
    if (stage === 'detection') {
      // Check reduced motion preference
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(motionQuery.matches);

      // Check if audio context can be created (will need user gesture)
      setAudioEnabled(!motionQuery.matches);
    }
  }, [stage, setPrefersReducedMotion, setAudioEnabled]);

  // Stage progression timer
  useEffect(() => {
    const duration = STAGE_DURATIONS[stage];
    if (duration === Infinity) return;

    const currentIndex = STAGE_ORDER.indexOf(stage as typeof STAGE_ORDER[number]);
    if (currentIndex === -1 || currentIndex >= STAGE_ORDER.length - 1) return;

    const nextStage = STAGE_ORDER[currentIndex + 1];

    const timer = setTimeout(() => {
      setStage(nextStage);
    }, duration);

    return () => clearTimeout(timer);
  }, [stage, setStage]);

  // Audio management
  useEffect(() => {
    if (!audioEnabled) return;

    const initAudio = async () => {
      if (audioInitialized.current) return;

      try {
        await thresholdAudio.init();
        audioInitialized.current = true;
      } catch (e) {
        console.warn('Audio init failed:', e);
      }
    };

    initAudio();
  }, [audioEnabled]);

  // Update audio for stage changes
  useEffect(() => {
    if (audioEnabled && audioInitialized.current) {
      thresholdAudio.setStage(stage as any);
    }
  }, [stage, audioEnabled]);

  // Mouse tracking for attunement
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    const dt = now - lastMouseTime.current;

    if (dt > 0) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const velocity = Math.min(distance / dt / 2, 1); // Normalize to 0-1

      setMouseVelocity(velocity);

      if (audioEnabled && audioInitialized.current) {
        thresholdAudio.setMouseVelocity(velocity);
      }
    }

    lastMousePos.current = { x: e.clientX, y: e.clientY };
    lastMouseTime.current = now;
  }, [setMouseVelocity, audioEnabled]);

  // Start audio on first interaction (required by browsers)
  const handleFirstInteraction = useCallback(async () => {
    if (!audioEnabled || !audioInitialized.current) return;

    try {
      await thresholdAudio.start();
      thresholdAudio.setStage(stage as any);
    } catch (e) {
      console.warn('Audio start failed:', e);
    }

    // Remove listeners after first interaction
    window.removeEventListener('click', handleFirstInteraction);
    window.removeEventListener('keydown', handleFirstInteraction);
  }, [audioEnabled, stage]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [handleMouseMove, handleFirstInteraction]);

  // Handle crossing navigation
  useEffect(() => {
    if (stage === 'crossing' && selectedPortal) {
      const timer = setTimeout(() => {
        const destination = selectedPortal === 'atlas' ? '/atlas' : '/grove';
        window.location.href = destination;
      }, STAGE_DURATIONS.crossing);

      return () => clearTimeout(timer);
    }
  }, [stage, selectedPortal]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      thresholdAudio.dispose();
    };
  }, []);

  return null; // Orchestrator is logic-only
}
