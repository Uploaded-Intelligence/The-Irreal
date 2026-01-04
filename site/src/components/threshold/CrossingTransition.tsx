import { useEffect, useState } from 'react';
import { useThresholdStore } from '../../stores/thresholdStore';

export function CrossingTransition() {
  const stage = useThresholdStore((s) => s.stage);
  const selectedPortal = useThresholdStore((s) => s.selectedPortal);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    if (stage === 'crossing') {
      // Animate scale from 0 to cover entire screen
      const start = Date.now();
      const duration = 1200;

      const animate = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setScale(eased);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    } else {
      setScale(0);
    }
  }, [stage]);

  if (stage !== 'crossing' || !selectedPortal) return null;

  const color = selectedPortal === 'atlas' ? '#7c6fe0' : '#4a9d6a';
  const maxSize = Math.max(window.innerWidth, window.innerHeight) * 3;

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: selectedPortal === 'atlas' ? '30%' : '70%',
        transform: 'translate(-50%, -50%)',
        width: maxSize,
        height: maxSize,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity: scale,
        scale: scale,
        zIndex: 100,
        pointerEvents: 'none',
      }}
    />
  );
}
