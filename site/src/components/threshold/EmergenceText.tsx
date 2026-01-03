import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function EmergenceText() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const title = containerRef.current.querySelector('.title');
    const subtitle = containerRef.current.querySelector('.subtitle');
    const letters = title?.querySelectorAll('.letter');

    // Timeline for emergence - consciousness coalescing from void
    const tl = gsap.timeline({ delay: 0.8 });

    // Title emerges: particles → form → solidity
    if (letters && letters.length > 0) {
      tl.from(letters, {
        opacity: 0,
        scale: 0.7,
        filter: 'blur(30px)',
        letterSpacing: '0.5em',
        fontVariationSettings: '"wght" 100',
        duration: 3,
        stagger: 0.08,
        ease: 'power3.out'
      })
      .to(letters, {
        letterSpacing: '0.05em',
        fontVariationSettings: '"wght" 400',
        duration: 2,
        ease: 'power2.inOut'
      }, '-=2');
    }

    // Subtitle rises like mist
    tl.from(subtitle, {
      opacity: 0,
      y: 30,
      filter: 'blur(10px)',
      duration: 2.5,
      ease: 'power2.out'
    }, '-=1.5');

  }, []);

  const titleText = "The Irreal";
  const letters = titleText.split('').map((char, i) => (
    <span key={i} className="letter" style={{ display: 'inline-block' }}>
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));

  return (
    <div ref={containerRef} style={{
      textAlign: 'center',
      position: 'relative',
      zIndex: 1,
      maxWidth: '900px',
      padding: '0 2rem'
    }}>
      <h1 className="title" style={{
        fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
        fontFamily: "'Cormorant Garamond', 'EB Garamond', 'Crimson Pro', serif",
        fontWeight: 400,
        fontVariationSettings: '"wght" 400',
        letterSpacing: '0.05em',
        marginBottom: '2rem',
        color: 'var(--text-parchment)',
        textShadow: '0 0 40px rgba(232, 227, 216, 0.3), 0 0 80px rgba(124, 111, 224, 0.2)',
        lineHeight: 1.1
      }}>
        {letters}
      </h1>
      <p className="subtitle" style={{
        fontFamily: "'EB Garamond', 'Crimson Pro', Georgia, serif",
        color: 'var(--text-dim)',
        fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
        fontWeight: 300,
        fontStyle: 'italic',
        lineHeight: 1.6,
        letterSpacing: '0.02em',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        A navigable world of knowledge, creation, and becoming
      </p>
    </div>
  );
}
