import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useThresholdStore } from '../../stores/thresholdStore';

export function CrystallizingText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stage = useThresholdStore((s) => s.stage);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (stage !== 'crystallization' || hasAnimated.current) return;
    if (!containerRef.current) return;

    hasAnimated.current = true;

    const title = containerRef.current.querySelector('.title');
    const subtitle = containerRef.current.querySelector('.subtitle');

    // Timeline: emerge from blur/scale, crystallize into clarity
    const tl = gsap.timeline();

    tl.fromTo(title,
      {
        opacity: 0,
        scale: 0.8,
        filter: 'blur(30px)',
        letterSpacing: '0.5em'
      },
      {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        letterSpacing: '0.2em',
        duration: 2,
        ease: 'power2.out'
      }
    )
    .fromTo(subtitle,
      {
        opacity: 0,
        y: 20
      },
      {
        opacity: 0.7,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      },
      '-=0.8'
    );
  }, [stage]);

  // Only render during crystallization and beyond
  const visible = ['crystallization', 'portals', 'crossing'].includes(stage);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: '35%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        zIndex: 10,
        opacity: visible ? 1 : 0,
        pointerEvents: 'none',
      }}
    >
      <h1
        className="title"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(2.5rem, 8vw, 5rem)',
          fontWeight: 300,
          letterSpacing: '0.2em',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #7c6fe0 0%, #9d8fff 50%, #7c6fe0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 60px rgba(124, 111, 224, 0.5)',
          opacity: 0,
        }}
      >
        The Irreal
      </h1>
      <p
        className="subtitle"
        style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
          fontWeight: 400,
          fontStyle: 'italic',
          color: '#8888a0',
          opacity: 0,
        }}
      >
        A navigable world of knowledge, creation, and becoming
      </p>
    </div>
  );
}
