import React, { useRef, useEffect, useCallback, useState } from 'react';

/*
 * TELEODYNAMIC SIGNATURE v8
 * 
 * Built from first principles:
 * 
 * 1. NO DRAWN SELVES - selves emerge from density, color coherence, coordinated movement
 * 2. COLOR = STATE ENCODING - arousal→hue, coherence→saturation, energy→brightness
 * 3. DIFFERENT MECHANISMS PER MODE - not parameter tweaks, different dynamical systems
 * 4. THE CLICK TEST - regulated recovers, dysregulated amplifies
 * 5. VISIBLE BREATHING - global rhythm in regulated, conflicting local rhythms in dysregulated
 * 6. ENERGY CIRCULATION vs POOLING - healthy flow vs stuck hot spots
 * 
 * Success criteria:
 * - Can you tell states apart WITHOUT reading the label?
 * - Does clicking demonstrate recovery vs amplification?
 * - Do selves EMERGE or do they look drawn?
 * - Does color MEAN something?
 */

const TeleodynamicSignature = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [showUI, setShowUI] = useState(true);
  const [currentMode, setCurrentMode] = useState('regulated');
  
  const state = useRef({
    particles: [],
    
    // Energy field - tracks where energy accumulates vs circulates
    energyField: null,
    fieldCols: 0,
    fieldRows: 0,
    fieldRes: 16,
    
    // Invisible attractors - create flow patterns, NOT drawn
    attractors: [],
    
    // Click perturbations - to demonstrate recovery vs amplification
    perturbations: [],
    
    // Mouse position for ambient hover interaction
    mouse: { x: -1000, y: -1000, active: false },
    
    // Global state
    time: 0,
    breath: 0,
    chaos: 0,  // 0 = stable (tight spirals), 1 = excited (free flowing)
    
    // Measured metrics (computed from actual dynamics)
    metrics: {
      avgArousal: 0.5,
      avgCoherence: 0.5,
      avgEnergy: 0.5,
      recoveryRate: 0,
      amplificationRate: 0,
      breathCoherence: 0,
      sympoiesisIndex: 0,
    },
    
    // Mode-specific mechanisms
    mode: 'regulated',
  });

  // ═══════════════════════════════════════════════════════════════
  // MODE DEFINITIONS - Different dynamical systems, not just parameters
  // ═══════════════════════════════════════════════════════════════
  
  const MODES = {
    regulated: {
      name: 'co-regulated',
      // Recovery mechanism
      recoveryStrength: 0.04,        // Strong return to baseline
      feedbackType: 'negative',       // Disturbances dampen
      feedbackStrength: 0.7,
      // Breathing
      breathEnabled: true,
      breathCoherence: 'global',      // Whole system breathes together
      breathAmplitude: 0.12,
      breathFrequency: 0.008,
      // Energy dynamics
      energyDecayRate: 0.92,          // Fast decay - energy circulates
      energyDepositRate: 0.015,       // Low deposit
      // Sympoiesis
      sympoiesisStrength: 0.6,
      interactionRadius: 50,
      // Color
      baseHueShift: 150,              // Toward greens/teals (safety)
      saturationBoost: 1.0,
      // Click response
      clickAmplification: 1.0,        // Normal
      cascadeThreshold: Infinity,     // No cascade
      // Movement quality
      jitterStrength: 0,              // No jitter - smooth
      boundaryStiffness: 0.08,        // Normal boundary
      // Chaos sensitivity - how much clicks release from attractors
      chaosMultiplier: 0.1,           // Minimal - stays organized
      chaosDecay: 0.98,               // Fast recovery
      baseChaos: 0,                   // Decays to full stability
      cohesionStrength: 1,            // Normal cohesion
      noiseTimeScale: 0.0001,         // Slow - stable patterns
      noiseMagnitude: 1.0,            // Normal
    },
    
    dysregulated: {
      name: 'dysregulated',
      // Recovery mechanism - VERY WEAK (not negative - that pushed particles off)
      recoveryStrength: 0.005,        // Weak - slow incomplete recovery
      feedbackType: 'positive',       // Disturbances AMPLIFY
      feedbackStrength: 1.4,
      // Breathing - CONFLICTING
      breathEnabled: true,
      breathCoherence: 'local',       // Each region has different rhythm
      breathAmplitude: 0.06,
      breathFrequency: 0.015,
      // Energy dynamics - POOLING
      energyDecayRate: 0.994,         // Slow decay - energy gets stuck
      energyDepositRate: 0.12,        // High deposit - creates hot spots
      // Sympoiesis - stressed, erratic
      sympoiesisStrength: 0.4,
      interactionRadius: 45,
      // Color
      baseHueShift: 20,               // Toward reds/oranges (threat)
      saturationBoost: 1.2,
      // Click response - AMPLIFYING
      clickAmplification: 2.0,        // Perturbations grow
      cascadeThreshold: 1.5,          // Triggers cascade
      // Movement quality
      jitterStrength: 0.15,           // Random perturbation each frame
      boundaryStiffness: 0.15,        // Stronger boundary to keep contained
      // Chaos sensitivity
      chaosMultiplier: 0.15,          // Some release, but energy pooling is key
      chaosDecay: 0.99,               // Slower recovery
      baseChaos: 0,                   // Decays to stability
      cohesionStrength: 1,            // Normal cohesion
      noiseTimeScale: 0.0002,         // Slightly faster - more erratic
      noiseMagnitude: 1.1,            // Slightly stronger
    },
    
    dissociated: {
      name: 'dissociated',
      // Recovery - ABSENT
      recoveryStrength: 0.002,        // Almost none
      feedbackType: 'none',
      feedbackStrength: 0.1,
      // Breathing - ABSENT
      breathEnabled: false,
      breathCoherence: 'none',
      breathAmplitude: 0,
      breathFrequency: 0,
      // Energy dynamics - DEPLETED
      energyDecayRate: 0.998,         // Very slow - but nothing coming in
      energyDepositRate: 0.005,
      // Sympoiesis - BROKEN
      sympoiesisStrength: 0.03,       // Near zero
      interactionRadius: 15,
      // Color - DESATURATED
      baseHueShift: 220,              // Cool blues
      saturationBoost: 0.3,           // Gray, washed out
      // Click response - MINIMAL
      clickAmplification: 0.3,
      cascadeThreshold: Infinity,
      // Movement quality
      jitterStrength: 0,              // No jitter - sluggish
      boundaryStiffness: 0.06,        // Weak boundary
      // Chaos sensitivity - NONE (dissociation doesn't respond)
      chaosMultiplier: 0.0,           // No chaos effect
      chaosDecay: 0.99,
      baseChaos: 0,
      cohesionStrength: 0.3,          // Weak cohesion - fits isolation theme
      noiseTimeScale: 0.00005,        // Very slow - sluggish
      noiseMagnitude: 0.5,            // Weak - low energy
    },
    
    hyperfocused: {
      name: 'hyperfocused',
      // Recovery - ASYMMETRIC (winner-take-all)
      recoveryStrength: 0.01,
      feedbackType: 'concentrating',
      feedbackStrength: 1.0,
      // Breathing - CENTER ONLY
      breathEnabled: true,
      breathCoherence: 'center',
      breathAmplitude: 0.15,
      breathFrequency: 0.015,
      // Energy dynamics - DRAINING toward center
      energyDecayRate: 0.96,
      energyDepositRate: 0.04,
      // Sympoiesis - ONE WAY
      sympoiesisStrength: 0.25,
      interactionRadius: 60,
      // Color - DOMINANT VIVID, others faded
      baseHueShift: 280,              // The focused attractor's hue dominates
      saturationBoost: 1.5,
      // Click response - feeds dominant or ignored
      clickAmplification: 0.5,
      cascadeThreshold: Infinity,
      // Movement quality
      jitterStrength: 0,              // No jitter
      boundaryStiffness: 0.1,         // Normal boundary
      // Chaos sensitivity - minimal
      chaosMultiplier: 0.1,           // Very little release
      chaosDecay: 0.98,
      baseChaos: 0,
      cohesionStrength: 1.2,          // Strong cohesion - fits concentration theme
      noiseTimeScale: 0.0001,         // Slow - focused
      noiseMagnitude: 0.8,            // Slightly weaker - controlled
    },
    
    flowing: {
      name: 'flowing',
      // Recovery - NONE for true flowing
      recoveryStrength: 0.001,        // Near-zero - particles drift freely
      feedbackType: 'generative',
      feedbackStrength: 0.9,
      // Breathing - MULTI-RHYTHM
      breathEnabled: true,
      breathCoherence: 'multi',
      breathAmplitude: 0.1,
      breathFrequency: 0.01,
      // Energy dynamics - CIRCULATING freely
      energyDecayRate: 0.94,
      energyDepositRate: 0.025,
      // Sympoiesis - MAXIMUM
      sympoiesisStrength: 0.85,
      interactionRadius: 70,
      // Color - FULL SPECTRUM
      baseHueShift: 0,                // All hues present
      saturationBoost: 1.1,
      // Click response - seeds emergence
      clickAmplification: 1.2,
      cascadeThreshold: Infinity,
      // Movement quality
      jitterStrength: 0.02,           // Slight organic variation
      boundaryStiffness: 0.08,        // Normal boundary
      // Chaos sensitivity - FULL (this is THE mode for freedom/release)
      chaosMultiplier: 1.0,           // Full chaos effect
      chaosDecay: 0.995,              // Slow decay
      baseChaos: 0.7,                 // FLOOR - never decays below this. Flowing's stable state IS freedom.
      // Cohesion control - ZERO prevents clustering/orbiting
      cohesionStrength: 0,            // NO cohesion - particles flow through, don't cluster
      // Noise dynamics - FAST evolution prevents stable orbits
      noiseTimeScale: 0.002,          // Fast - flow field constantly shifts
      noiseMagnitude: 1.5,            // Stronger flow
    },
  };

  // ═══════════════════════════════════════════════════════════════
  // UTILITY FUNCTIONS
  // ═══════════════════════════════════════════════════════════════
  
  const hsl = (h, s, l, a = 1) => `hsla(${h}, ${s}%, ${l}%, ${a})`;
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  
  // Simplex-like noise
  const noise = (x, y, z = 0) => {
    const p = (n) => {
      const s = Math.sin(n) * 43758.5453123;
      return s - Math.floor(s);
    };
    const fx = Math.floor(x), fy = Math.floor(y), fz = Math.floor(z);
    const dx = x - fx, dy = y - fy, dz = z - fz;
    const u = dx * dx * (3 - 2 * dx);
    const v = dy * dy * (3 - 2 * dy);
    const w = dz * dz * (3 - 2 * dz);
    
    const a = p(fx + fy * 57 + fz * 113);
    const b = p(fx + 1 + fy * 57 + fz * 113);
    const c = p(fx + (fy + 1) * 57 + fz * 113);
    const d = p(fx + 1 + (fy + 1) * 57 + fz * 113);
    const e = p(fx + fy * 57 + (fz + 1) * 113);
    const f = p(fx + 1 + fy * 57 + (fz + 1) * 113);
    const g = p(fx + (fy + 1) * 57 + (fz + 1) * 113);
    const hh = p(fx + 1 + (fy + 1) * 57 + (fz + 1) * 113);
    
    return lerp(lerp(lerp(a, b, u), lerp(c, d, u), v), 
                lerp(lerp(e, f, u), lerp(g, hh, u), v), w);
  };

  // ═══════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════
  
  const init = useCallback((width, height) => {
    const s = state.current;
    const cx = width / 2, cy = height / 2;
    
    // Energy field grid
    s.fieldRes = 14;
    s.fieldCols = Math.ceil(width / s.fieldRes);
    s.fieldRows = Math.ceil(height / s.fieldRes);
    s.energyField = Array(s.fieldRows).fill(null).map(() =>
      Array(s.fieldCols).fill(null).map(() => ({
        energy: 0,
        velocity: { x: 0, y: 0 },
        arousal: 0,
      }))
    );
    
    // Invisible attractors - positioned to create organic flow
    const attractorConfigs = [
      { angle: -Math.PI/2, dist: 0.22, type: 'spiral' },
      { angle: Math.PI * 0.9, dist: 0.28, type: 'well' },
      { angle: Math.PI * 0.3, dist: 0.25, type: 'pulse' },
      { angle: -Math.PI * 0.7, dist: 0.2, type: 'bloom' },
      { angle: 0, dist: 0.15, type: 'vortex' },
    ];
    
    s.attractors = attractorConfigs.map((cfg, i) => ({
      x: cx + Math.cos(cfg.angle) * width * cfg.dist,
      y: cy + Math.sin(cfg.angle) * height * cfg.dist,
      baseX: cx + Math.cos(cfg.angle) * width * cfg.dist,
      baseY: cy + Math.sin(cfg.angle) * height * cfg.dist,
      type: cfg.type,
      strength: 0.8 + Math.random() * 0.4,  // Stronger base
      baseStrength: 0.8 + Math.random() * 0.4,
      radius: 80 + Math.random() * 40,  // Tighter radius
      phase: Math.random() * Math.PI * 2,
      // For hyperfocused mode
      dominance: i === 0 ? 0.8 : 0.2,
    }));
    
    // Dense particle field - the visual substrate
    s.particles = [];
    const particleCount = 900;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.pow(Math.random(), 0.6) * Math.min(width, height) * 0.42;
      
      s.particles.push({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        
        // Baseline position - for recovery calculation
        baseX: cx + Math.cos(angle) * radius,
        baseY: cy + Math.sin(angle) * radius,
        
        // State variables
        energy: 0.5 + Math.random() * 0.3,
        arousal: 0.3 + Math.random() * 0.2,  // Measured from velocity
        coherence: 0.5,                        // Measured from neighbor alignment
        
        // Visual
        size: 2 + Math.random() * 2.5,
        trail: [],
        
        // For sympoietic connections
        neighbors: [],
      });
    }
    
    s.perturbations = [];
    s.time = 0;
    s.breath = 0;
    s.chaos = 0;  // Start stable - tight spirals
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // BREATHING MECHANISM
  // ═══════════════════════════════════════════════════════════════
  
  const calculateBreath = (s, particle, mode, cx, cy) => {
    if (!mode.breathEnabled) return 0;
    
    const t = s.time * mode.breathFrequency;
    
    switch (mode.breathCoherence) {
      case 'global':
        // Whole system breathes together
        return Math.sin(t) * mode.breathAmplitude;
        
      case 'local':
        // Each region has different, conflicting rhythm
        // This creates the sense of "no coherent breath"
        const localPhase = noise(particle.x * 0.008, particle.y * 0.008) * Math.PI * 2;
        const localFreq = 1 + noise(particle.x * 0.01, particle.y * 0.01) * 0.8;
        return Math.sin(t * localFreq + localPhase) * mode.breathAmplitude;
        
      case 'center':
        // Only center breathes, periphery is still
        const distFromCenter = Math.sqrt((particle.x - cx) ** 2 + (particle.y - cy) ** 2);
        const maxDist = Math.min(cx, cy) * 0.8;
        const centerWeight = Math.max(0, 1 - distFromCenter / maxDist);
        return Math.sin(t) * mode.breathAmplitude * centerWeight;
        
      case 'multi':
        // Multiple rhythms creating interference - creative
        const r1 = Math.sin(t) * 0.4;
        const r2 = Math.sin(t * 1.618) * 0.35;  // Golden ratio
        const r3 = Math.sin(t * 0.618 + particle.x * 0.005) * 0.25;
        return (r1 + r2 + r3) * mode.breathAmplitude;
        
      default:
        return 0;
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // FEEDBACK MECHANISM - The core difference between states
  // ═══════════════════════════════════════════════════════════════
  
  const applyFeedback = (particle, perturbationEnergy, mode) => {
    switch (mode.feedbackType) {
      case 'negative':
        // Disturbances DAMPEN - energy spreads out and dissipates
        // This is the healthy response
        particle.energy += perturbationEnergy * 0.3;
        particle.energy *= 0.95;  // Quick dissipation
        return perturbationEnergy * 0.6;  // Reduced for neighbors
        
      case 'positive':
        // Disturbances AMPLIFY - energy concentrates and builds
        // This is the dysregulated pattern
        particle.energy += perturbationEnergy * mode.feedbackStrength;
        // Check for cascade trigger
        if (particle.energy > mode.cascadeThreshold) {
          particle.energy *= 1.2;  // Runaway
          return perturbationEnergy * 1.5;  // MORE for neighbors
        }
        return perturbationEnergy * 1.1;
        
      case 'concentrating':
        // Energy flows toward dominant attractor
        // Winner-take-all dynamics
        particle.energy += perturbationEnergy * 0.5;
        return perturbationEnergy * 0.4;
        
      case 'generative':
        // Energy creates new patterns
        particle.energy += perturbationEnergy * 0.8;
        particle.energy = Math.min(2, particle.energy);
        return perturbationEnergy * 0.7;
        
      default:
        // 'none' - minimal response
        particle.energy += perturbationEnergy * 0.1;
        return perturbationEnergy * 0.05;
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // RECOVERY MECHANISM
  // ═══════════════════════════════════════════════════════════════
  
  const applyRecovery = (particle, mode, cx, cy, chaos = 0) => {
    const dx = particle.baseX - particle.x;
    const dy = particle.baseY - particle.y;
    
    // All modes have positive recovery, just different strengths
    // Dysregulated has WEAK recovery (slow, incomplete)
    // Regulated has STRONG recovery (quick return to baseline)
    // High chaos weakens recovery - scaled by mode's sensitivity
    const effectiveChaos = chaos * (mode.chaosMultiplier || 0);
    const effectiveRecovery = mode.recoveryStrength * (1 - effectiveChaos * 0.7);
    
    if (effectiveRecovery > 0) {
      particle.vx += dx * effectiveRecovery;
      particle.vy += dy * effectiveRecovery;
    }
    // If recoveryStrength is 0 or near-zero (dissociated), no recovery happens
  };

  // ═══════════════════════════════════════════════════════════════
  // FLOW FIELD CALCULATION
  // ═══════════════════════════════════════════════════════════════
  
  const calculateFlowField = (s, x, y, mode, cx, cy) => {
    // Base organic flow from noise
    // Use mode-specific time scale - flowing has fast evolution to prevent stable orbits
    const scale = 0.005;
    const timeScale = mode.noiseTimeScale || 0.0001;
    const magnitudeMultiplier = mode.noiseMagnitude || 1.0;
    
    let angle = noise(x * scale, y * scale, s.time * timeScale) * Math.PI * 4;
    let magnitude = (0.3 + noise(x * scale + 100, y * scale + 100, s.time * timeScale * 0.8) * 0.4) * magnitudeMultiplier;
    
    // Chaos reduces attractor influence - scaled by mode's sensitivity
    // Multiplier 1.43 means at effectiveChaos=0.7, attractorScale=0 (no attractors)
    // Above 0.7, attractorScale goes negative (repulsion)
    const effectiveChaos = s.chaos * (mode.chaosMultiplier || 0);
    const attractorScale = 1 - effectiveChaos * 1.43;
    
    // Attractor influences
    s.attractors.forEach(att => {
      const dx = att.x - x;
      const dy = att.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < att.radius * 2.5) {
        const influence = Math.pow(1 - dist / (att.radius * 2.5), 1.5) * att.strength * attractorScale;
        
        // Different attractor types create different flows
        switch (att.type) {
          case 'spiral':
            const spiralAngle = Math.atan2(dy, dx) + Math.PI / 2;
            angle = angle * (1 - influence * 0.5) + spiralAngle * influence * 0.5;
            break;
          case 'well':
            const towardAngle = Math.atan2(dy, dx);
            angle = angle * (1 - influence * 0.4) + towardAngle * influence * 0.4;
            magnitude += influence * 0.2;
            break;
          case 'pulse':
            magnitude += Math.sin(att.phase) * influence * 0.3;
            break;
          case 'vortex':
            const vortexAngle = Math.atan2(dy, dx) + Math.PI / 2 + dist * 0.015;
            angle = angle * (1 - influence * 0.45) + vortexAngle * influence * 0.45;
            break;
          case 'bloom':
            const outAngle = Math.atan2(y - att.y, x - att.x);
            const bloomFactor = (Math.sin(att.phase * 0.7) + 1) * 0.5;
            angle = angle * (1 - influence * bloomFactor * 0.3) + outAngle * influence * bloomFactor * 0.3;
            break;
        }
      }
    });
    
    // High chaos = more independent movement, add variation
    if (effectiveChaos > 0.1) {
      angle += (noise(x * 0.02, y * 0.02, s.time * 0.002) - 0.5) * effectiveChaos * 2;
      magnitude *= 1 + effectiveChaos * 0.5;
    }
    
    // Mode-specific modifications
    if (mode.feedbackType === 'positive') {
      // Add erratic jitter in dysregulated state
      angle += (Math.random() - 0.5) * 0.4;
      magnitude *= 0.9 + Math.random() * 0.3;
    }
    
    return { angle, magnitude };
  };

  // ═══════════════════════════════════════════════════════════════
  // MAIN UPDATE LOOP
  // ═══════════════════════════════════════════════════════════════
  
  const update = useCallback((width, height) => {
    const s = state.current;
    const mode = MODES[s.mode];
    const cx = width / 2, cy = height / 2;
    
    s.time++;
    s.breath += mode.breathFrequency;
    
    // Decay chaos toward mode's baseChaos floor (not zero for flowing)
    const baseChaos = mode.baseChaos || 0;
    s.chaos = Math.max(baseChaos, s.chaos * (mode.chaosDecay || 0.995));
    
    // Update attractors
    s.attractors.forEach(att => {
      att.phase += 0.02;
      
      // Subtle drift
      const drift = noise(att.baseX * 0.005, att.baseY * 0.005, s.time * 0.0003);
      att.x = att.baseX + Math.cos(drift * Math.PI * 2) * 15;
      att.y = att.baseY + Math.sin(drift * Math.PI * 2) * 15;
      
      // Hyperfocused: dominant attractor grows, others shrink
      if (mode.feedbackType === 'concentrating') {
        if (att.dominance > 0.5) {
          att.strength = att.baseStrength * 1.8;
        } else {
          att.strength = att.baseStrength * 0.4;
        }
      } else {
        att.strength = att.baseStrength;
      }
    });
    
    // Decay energy field
    for (let row = 0; row < s.fieldRows; row++) {
      for (let col = 0; col < s.fieldCols; col++) {
        s.energyField[row][col].energy *= mode.energyDecayRate;
        s.energyField[row][col].arousal *= 0.95;
      }
    }
    
    // Process perturbations (from clicks)
    s.perturbations = s.perturbations.filter(p => {
      p.age++;
      p.radius += p.speed;
      p.energy *= mode.feedbackType === 'positive' ? 1.02 : 0.92;
      return p.age < p.maxAge && p.energy > 0.05;
    });
    
    // Update particles
    let totalArousal = 0;
    let totalCoherence = 0;
    let totalEnergy = 0;
    
    s.particles.forEach((particle, idx) => {
      // Calculate flow field influence
      const flow = calculateFlowField(s, particle.x, particle.y, mode, cx, cy);
      
      // Apply flow
      particle.vx += Math.cos(flow.angle) * flow.magnitude * 0.08;
      particle.vy += Math.sin(flow.angle) * flow.magnitude * 0.08;
      
      // Apply breathing
      const breath = calculateBreath(s, particle, mode, cx, cy);
      const breathDx = (particle.x - cx) * breath * 0.015;
      const breathDy = (particle.y - cy) * breath * 0.015;
      particle.vx += breathDx;
      particle.vy += breathDy;
      
      // Ambient hover interaction - soft reaction to cursor
      if (s.mouse.active) {
        const mdx = particle.x - s.mouse.x;
        const mdy = particle.y - s.mouse.y;
        const mouseDist = Math.sqrt(mdx * mdx + mdy * mdy);
        
        if (mouseDist < 60 && mouseDist > 1) {
          // Gentle push away - like particles softly parting
          const ambientStrength = (1 - mouseDist / 60) * 0.15;
          particle.vx += (mdx / mouseDist) * ambientStrength;
          particle.vy += (mdy / mouseDist) * ambientStrength;
          // Slight energy boost from attention
          particle.energy += ambientStrength * 0.02;
          // Tiny chaos contribution - scaled by mode sensitivity
          s.chaos = Math.min(1, s.chaos + 0.0003 * (mode.chaosMultiplier || 0));
        }
      }
      
      // Apply recovery mechanism
      applyRecovery(particle, mode, cx, cy, s.chaos);
      
      // Process perturbations
      s.perturbations.forEach(p => {
        const dx = particle.x - p.x;
        const dy = particle.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Ring perturbation
        const ringDist = Math.abs(dist - p.radius);
        if (ringDist < 30) {
          const strength = (1 - ringDist / 30) * p.energy * mode.clickAmplification;
          
          // Apply feedback mechanism
          const propagatedEnergy = applyFeedback(particle, strength * 0.3, mode);
          
          // Push outward
          if (dist > 1) {
            particle.vx += (dx / dist) * strength * 0.15;
            particle.vy += (dy / dist) * strength * 0.15;
          }
          
          // Deposit energy to field
          const col = Math.floor(particle.x / s.fieldRes);
          const row = Math.floor(particle.y / s.fieldRes);
          if (s.energyField[row]?.[col]) {
            s.energyField[row][col].energy += propagatedEnergy * mode.energyDepositRate;
          }
        }
      });
      
      // Sympoietic interactions - particles influence each other
      // Chaos boosts sympoiesis - scaled by mode's sensitivity
      const effectiveChaos = s.chaos * (mode.chaosMultiplier || 0);
      const effectiveSympoiesis = mode.sympoiesisStrength * (1 + effectiveChaos * 0.5);
      
      if (effectiveSympoiesis > 0.1) {
        particle.neighbors = [];
        let neighborVxSum = 0, neighborVySum = 0, neighborCount = 0;
        
        // Chaos also expands interaction radius
        const effectiveRadius = mode.interactionRadius * (1 + effectiveChaos * 0.4);
        
        s.particles.forEach((other, otherIdx) => {
          if (idx === otherIdx) return;
          
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < effectiveRadius && dist > 5) {
            const strength = (1 - dist / effectiveRadius) * effectiveSympoiesis;
            
            // Attraction (cohesion) - scaled by mode's cohesionStrength
            // Flowing has cohesionStrength=0, so particles don't cluster
            const cohesion = mode.cohesionStrength ?? 1;
            particle.vx += dx * strength * 0.002 * cohesion;
            particle.vy += dy * strength * 0.002 * cohesion;
            
            // Alignment
            neighborVxSum += other.vx;
            neighborVySum += other.vy;
            neighborCount++;
            
            // Store for drawing connections
            if (dist < effectiveRadius * 0.6 && particle.neighbors.length < 4) {
              particle.neighbors.push({ x: other.x, y: other.y, strength });
            }
          } else if (dist < 8 && dist > 0) {
            // Separation
            particle.vx -= (dx / dist) * 0.08;
            particle.vy -= (dy / dist) * 0.08;
          }
        });
        
        // Calculate coherence from neighbor alignment
        if (neighborCount > 0) {
          const avgNeighborVx = neighborVxSum / neighborCount;
          const avgNeighborVy = neighborVySum / neighborCount;
          const mySpeed = Math.sqrt(particle.vx ** 2 + particle.vy ** 2);
          const neighborSpeed = Math.sqrt(avgNeighborVx ** 2 + avgNeighborVy ** 2);
          
          if (mySpeed > 0.01 && neighborSpeed > 0.01) {
            const dot = (particle.vx * avgNeighborVx + particle.vy * avgNeighborVy) / (mySpeed * neighborSpeed);
            particle.coherence = particle.coherence * 0.9 + ((dot + 1) / 2) * 0.1;
          }
        }
      }
      
      // Boundary - soft containment (use mode-specific stiffness)
      const distFromCenter = Math.sqrt((particle.x - cx) ** 2 + (particle.y - cy) ** 2);
      const maxDist = Math.min(width, height) * 0.44;
      if (distFromCenter > maxDist * 0.85) {
        const overflow = (distFromCenter - maxDist * 0.85) / (maxDist * 0.15);
        const angle = Math.atan2(particle.y - cy, particle.x - cx);
        const stiffness = mode.boundaryStiffness || 0.08;
        particle.vx -= Math.cos(angle) * overflow * stiffness;
        particle.vy -= Math.sin(angle) * overflow * stiffness;
      }
      
      // Jitter - erratic movement for dysregulated state
      if (mode.jitterStrength > 0) {
        particle.vx += (Math.random() - 0.5) * mode.jitterStrength;
        particle.vy += (Math.random() - 0.5) * mode.jitterStrength;
      }
      
      // Velocity limits
      const speed = Math.sqrt(particle.vx ** 2 + particle.vy ** 2);
      const maxSpeed = 2.5;
      if (speed > maxSpeed) {
        particle.vx = (particle.vx / speed) * maxSpeed;
        particle.vy = (particle.vy / speed) * maxSpeed;
      }
      
      // Apply velocity
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Damping
      particle.vx *= 0.96;
      particle.vy *= 0.97;
      
      // Update arousal from velocity
      particle.arousal = particle.arousal * 0.92 + (speed / maxSpeed) * 0.08;
      
      // Energy decay
      particle.energy *= 0.995;
      particle.energy = Math.max(0.1, Math.min(2, particle.energy));
      
      // Trail
      if (s.time % 3 === 0 && speed > 0.2) {
        particle.trail.push({ x: particle.x, y: particle.y, arousal: particle.arousal });
        if (particle.trail.length > 10) particle.trail.shift();
      }
      
      // Deposit to energy field
      const col = Math.floor(particle.x / s.fieldRes);
      const row = Math.floor(particle.y / s.fieldRes);
      if (s.energyField[row]?.[col]) {
        s.energyField[row][col].energy += particle.energy * mode.energyDepositRate * 0.3;
        s.energyField[row][col].arousal = Math.max(s.energyField[row][col].arousal, particle.arousal);
      }
      
      // Accumulate for metrics
      totalArousal += particle.arousal;
      totalCoherence += particle.coherence;
      totalEnergy += particle.energy;
    });
    
    // Update metrics
    const n = s.particles.length;
    s.metrics.avgArousal = totalArousal / n;
    s.metrics.avgCoherence = totalCoherence / n;
    s.metrics.avgEnergy = totalEnergy / n;
    
    // Calculate breath coherence
    if (mode.breathCoherence === 'global') {
      s.metrics.breathCoherence = 0.9;
    } else if (mode.breathCoherence === 'local') {
      s.metrics.breathCoherence = 0.2;
    } else {
      s.metrics.breathCoherence = 0;
    }
    
    // Calculate sympoiesis index
    let totalConnections = 0;
    s.particles.forEach(p => totalConnections += p.neighbors.length);
    s.metrics.sympoiesisIndex = totalConnections / (n * 4);
    
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // COLOR CALCULATION - Diagnostically meaningful per mode
  // ═══════════════════════════════════════════════════════════════
  
  const getParticleColor = (particle, mode, s, cx, cy, alpha = 1) => {
    let hue, saturation, lightness;
    
    switch (s.mode) {
      case 'regulated':
        // GREEN/TEAL = safety, balance
        // Slight variation from energy: balanced = green, elevated = yellow-green
        // Shows healthy circulation without alarm colors
        hue = lerp(160, 120, particle.energy);  // Green to yellow-green
        saturation = clamp(60 + particle.coherence * 30, 50, 90);
        lightness = clamp(40 + particle.energy * 20, 35, 65);
        break;
        
      case 'dysregulated':
        // HOT SPOTS: high stuck energy = RED, normal = orange, cool = yellow
        // Shows WHERE energy is pooling/stuck
        const stuckEnergy = particle.energy;
        if (stuckEnergy > 0.8) {
          hue = lerp(20, 0, (stuckEnergy - 0.8) / 0.2);  // Orange to red
        } else if (stuckEnergy > 0.5) {
          hue = lerp(45, 20, (stuckEnergy - 0.5) / 0.3);  // Yellow-orange to orange
        } else {
          hue = lerp(60, 45, stuckEnergy / 0.5);  // Yellow to yellow-orange
        }
        // High saturation to show intensity
        saturation = clamp(70 + stuckEnergy * 25, 60, 95);
        lightness = clamp(45 + particle.arousal * 15, 40, 65);
        break;
        
      case 'dissociated':
        // GRAY-BLUE: flat affect, numbed, depleted
        // Low saturation, cool hues, everything looks washed out
        hue = lerp(220, 200, particle.arousal);  // Cool blue range only
        saturation = clamp(15 + particle.coherence * 20, 10, 40);  // Very desaturated
        lightness = clamp(35 + particle.energy * 15, 30, 55);  // Dim
        break;
        
      case 'hyperfocused':
        // CENTER VIVID (magenta/purple), PERIPHERY FADED (gray)
        // Shows tunnel vision - where attention is concentrated
        const distFromCenter = Math.sqrt((particle.x - cx) ** 2 + (particle.y - cy) ** 2);
        const maxDist = Math.min(cx, cy) * 0.8;
        const centralness = 1 - clamp(distFromCenter / maxDist, 0, 1);
        
        // Center: vivid magenta/purple. Edge: desaturated gray-blue
        hue = lerp(220, 280, centralness);  // Gray-blue to magenta
        saturation = clamp(20 + centralness * 70, 15, 90);  // Gray to vivid
        lightness = clamp(30 + centralness * 35, 30, 65);  // Dim to bright
        break;
        
      case 'flowing':
        // RAINBOW FROM POSITION in noise field
        // As particles flow through space, color shifts continuously
        // Creates living gradients that map to flow topology
        const flowHue = noise(
          particle.x * 0.008, 
          particle.y * 0.008, 
          s.time * 0.001
        ) * 360;
        hue = flowHue;
        // Saturation from coherence - aligned particles are vivid
        saturation = clamp(50 + particle.coherence * 40, 40, 90);
        // Lightness from energy
        lightness = clamp(40 + particle.energy * 25, 35, 70);
        break;
        
      default:
        // Fallback
        hue = 180;
        saturation = 60;
        lightness = 50;
    }
    
    return hsl(hue, saturation, lightness, alpha);
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDERING
  // ═══════════════════════════════════════════════════════════════
  
  const render = useCallback((ctx, width, height) => {
    const s = state.current;
    const mode = MODES[s.mode];
    const cx = width / 2, cy = height / 2;
    
    // Background - mode-specific subtle coloring
    let bgHue, bgSat;
    switch (s.mode) {
      case 'regulated':
        bgHue = lerp(200, 180, s.metrics.avgArousal);  // Blue to teal
        bgSat = 25;
        break;
      case 'dysregulated':
        bgHue = lerp(20, 0, s.metrics.avgEnergy);  // Warm undertone
        bgSat = 20;
        break;
      case 'dissociated':
        bgHue = 230;  // Cool blue-gray
        bgSat = 10;   // Very desaturated
        break;
      case 'hyperfocused':
        bgHue = 260;  // Purple undertone
        bgSat = 15;
        break;
      case 'flowing':
        bgHue = (s.time * 0.1) % 360;  // Slowly shifting
        bgSat = 20;
        break;
      default:
        bgHue = 240;
        bgSat = 20;
    }
    ctx.fillStyle = hsl(bgHue, bgSat, 4, 0.12);
    ctx.fillRect(0, 0, width, height);
    
    // Energy field visualization (subtle) - mode-specific colors
    for (let row = 0; row < s.fieldRows; row++) {
      for (let col = 0; col < s.fieldCols; col++) {
        const cell = s.energyField[row][col];
        if (cell.energy > 0.05) {
          const x = col * s.fieldRes + s.fieldRes / 2;
          const y = row * s.fieldRes + s.fieldRes / 2;
          
          // Energy hot spots - more visible in dysregulated
          const intensity = cell.energy * (mode.feedbackType === 'positive' ? 1.5 : 0.6);
          
          // Mode-specific energy field colors
          let hue, sat;
          switch (s.mode) {
            case 'regulated':
              hue = lerp(160, 140, cell.energy);  // Green spectrum
              sat = 40;
              break;
            case 'dysregulated':
              hue = lerp(50, 0, cell.energy);  // Yellow to red - shows hot spots
              sat = 60;
              break;
            case 'dissociated':
              hue = 220;  // Constant cool blue
              sat = 20;   // Very desaturated
              break;
            case 'hyperfocused':
              const distFromCenterField = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
              const centralField = 1 - clamp(distFromCenterField / (cx * 0.8), 0, 1);
              hue = lerp(220, 280, centralField);  // Blue to purple at center
              sat = lerp(20, 50, centralField);
              break;
            case 'flowing':
              hue = noise(x * 0.01, y * 0.01, s.time * 0.0005) * 360;  // Rainbow from position
              sat = 45;
              break;
            default:
              hue = 180;
              sat = 40;
          }
          
          ctx.beginPath();
          ctx.arc(x, y, s.fieldRes * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = hsl(hue, sat, 50, intensity * 0.15);
          ctx.fill();
        }
      }
    }
    
    // Perturbation rings (click ripples) - mode-specific colors
    s.perturbations.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      
      // Mode-specific ripple colors
      let ringHue, ringSat;
      switch (s.mode) {
        case 'regulated':
          ringHue = 160;  // Green - safe ripple
          ringSat = 50;
          break;
        case 'dysregulated':
          ringHue = mode.feedbackType === 'positive' ? 10 : 40;  // Red if amplifying
          ringSat = 70;
          break;
        case 'dissociated':
          ringHue = 220;  // Muted blue
          ringSat = 25;
          break;
        case 'hyperfocused':
          ringHue = 275;  // Purple
          ringSat = 60;
          break;
        case 'flowing':
          ringHue = (s.time * 2 + p.radius) % 360;  // Rainbow expanding
          ringSat = 60;
          break;
        default:
          ringHue = 180;
          ringSat = 50;
      }
      
      ctx.strokeStyle = hsl(ringHue, ringSat, 55, p.energy * 0.4);
      ctx.lineWidth = 2 + p.energy * 3;
      ctx.stroke();
    });
    
    // Subtle cursor presence indicator - mode-specific color
    if (s.mouse.active) {
      let cursorHue;
      switch (s.mode) {
        case 'regulated': cursorHue = 150; break;  // Green
        case 'dysregulated': cursorHue = 30; break;  // Orange
        case 'dissociated': cursorHue = 210; break;  // Muted blue
        case 'hyperfocused': cursorHue = 270; break;  // Purple
        case 'flowing': cursorHue = (s.time * 0.5) % 360; break;  // Shifting
        default: cursorHue = 180;
      }
      const gradient = ctx.createRadialGradient(s.mouse.x, s.mouse.y, 0, s.mouse.x, s.mouse.y, 50);
      gradient.addColorStop(0, `hsla(${cursorHue}, 40%, 60%, 0.08)`);
      gradient.addColorStop(1, 'hsla(0, 0%, 0%, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(s.mouse.x, s.mouse.y, 50, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Sympoietic connections - mode-specific colors
    s.particles.forEach(p => {
      p.neighbors.forEach(n => {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(n.x, n.y);
        
        const connectionAlpha = n.strength * 0.3 * mode.sympoiesisStrength;
        
        // Mode-specific connection colors
        let connectionHue;
        switch (s.mode) {
          case 'regulated':
            connectionHue = lerp(150, 170, p.coherence);  // Green-teal
            break;
          case 'dysregulated':
            connectionHue = lerp(40, 10, p.energy);  // Yellow-orange to red
            break;
          case 'dissociated':
            connectionHue = 215;  // Muted blue-gray
            break;
          case 'hyperfocused':
            connectionHue = lerp(240, 290, p.energy);  // Blue to purple
            break;
          case 'flowing':
            connectionHue = noise(p.x * 0.01, p.y * 0.01, s.time * 0.001) * 360;
            break;
          default:
            connectionHue = 180;
        }
        
        const connectionSat = s.mode === 'dissociated' ? 25 : 50;
        ctx.strokeStyle = hsl(connectionHue, connectionSat, 50, connectionAlpha);
        ctx.lineWidth = n.strength * 2;
        ctx.stroke();
      });
    });
    
    // Particle trails
    s.particles.forEach(p => {
      if (p.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(p.trail[0].x, p.trail[0].y);
        for (let i = 1; i < p.trail.length; i++) {
          ctx.lineTo(p.trail[i].x, p.trail[i].y);
        }
        ctx.lineTo(p.x, p.y);
        
        const trailColor = getParticleColor(p, mode, s, cx, cy, 0.25);
        ctx.strokeStyle = trailColor;
        ctx.lineWidth = p.size * 0.35;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    });
    
    // Particles - the main visual layer
    s.particles.forEach(p => {
      // Glow for high energy particles
      if (p.energy > 0.7) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = getParticleColor(p, mode, s, cx, cy, (p.energy - 0.7) * 0.3);
        ctx.fill();
      }
      
      // Main particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (0.6 + p.energy * 0.4), 0, Math.PI * 2);
      ctx.fillStyle = getParticleColor(p, mode, s, cx, cy, 0.85);
      ctx.fill();
      
      // Bright core
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = getParticleColor(p, mode, s, cx, cy, 0.95);
      ctx.fill();
    });
    
    // UI
    if (showUI) {
      ctx.font = '11px "SF Mono", Monaco, monospace';
      ctx.textAlign = 'left';
      
      let y = 22;
      
      // Mode name
      ctx.fillStyle = 'hsla(0, 0%, 75%, 0.8)';
      ctx.fillText(`state: ${mode.name}`, 15, y);
      y += 22;
      
      const drawBar = (label, value, hueVal) => {
        ctx.fillStyle = 'hsla(0, 0%, 50%, 0.5)';
        ctx.fillText(label, 15, y);
        ctx.fillStyle = 'hsla(0, 0%, 20%, 0.3)';
        ctx.fillRect(95, y - 8, 80, 6);
        ctx.fillStyle = hsl(hueVal, 60, 55, 0.8);
        ctx.fillRect(95, y - 8, 80 * clamp(value, 0, 1), 6);
        y += 18;
      };
      
      // Metrics that actually tell you something
      drawBar('arousal', s.metrics.avgArousal, s.metrics.avgArousal < 0.5 ? 200 : 40);
      drawBar('coherence', s.metrics.avgCoherence, 160);
      drawBar('energy', s.metrics.avgEnergy / 1.5, 50);
      drawBar('sympoiesis', s.metrics.sympoiesisIndex, 280);
      drawBar('breath', s.metrics.breathCoherence, 180);
      drawBar('freedom', s.chaos, 30);  // Shows chaos/freedom level
      
      // Recovery indicator
      y += 6;
      ctx.fillStyle = 'hsla(0, 0%, 50%, 0.5)';
      ctx.fillText('feedback:', 15, y);
      ctx.fillStyle = mode.feedbackType === 'positive' 
        ? 'hsla(10, 70%, 55%, 0.8)' 
        : mode.feedbackType === 'negative'
          ? 'hsla(160, 70%, 50%, 0.8)'
          : 'hsla(0, 0%, 50%, 0.5)';
      ctx.fillText(mode.feedbackType || 'none', 95, y);
      
      // Click instruction
      ctx.fillStyle = 'hsla(0, 0%, 45%, 0.4)';
      ctx.fillText('hover · click', 15, height - 12);
    }
  }, [showUI]);

  // ═══════════════════════════════════════════════════════════════
  // INTERACTION
  // ═══════════════════════════════════════════════════════════════
  
  const handleClick = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    const s = state.current;
    const mode = MODES[s.mode];
    
    // Boost chaos - releases particles from attractor capture (scaled by mode)
    s.chaos = Math.min(1, s.chaos + 0.4 * (mode.chaosMultiplier || 0));
    
    // Create perturbation
    s.perturbations.push({
      x, y,
      radius: 10,
      speed: mode.feedbackType === 'positive' ? 4 : 6,
      energy: mode.clickAmplification,
      age: 0,
      maxAge: mode.feedbackType === 'positive' ? 200 : 80,
    });
    
    // Immediate particle perturbation
    s.particles.forEach(p => {
      const dx = p.x - x;
      const dy = p.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 80) {
        const strength = (1 - dist / 80) * mode.clickAmplification * 2;
        p.vx += (dx / dist) * strength;
        p.vy += (dy / dist) * strength;
        p.energy += strength * 0.3;
      }
    });
  }, []);

  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    state.current.mouse = { x, y, active: true };
  }, []);

  const handleMouseLeave = useCallback(() => {
    state.current.mouse = { x: -1000, y: -1000, active: false };
  }, []);

  const handleModeChange = useCallback((newMode) => {
    setCurrentMode(newMode);
    state.current.mode = newMode;
    state.current.perturbations = [];
    // Set chaos to the new mode's baseChaos floor
    state.current.chaos = MODES[newMode].baseChaos || 0;
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // ANIMATION LOOP
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const size = Math.min(800, window.innerWidth - 32);
    canvas.width = size;
    canvas.height = size;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'hsl(240, 20%, 4%)';
    ctx.fillRect(0, 0, size, size);
    
    init(size, size);
    state.current.mode = currentMode;
    state.current.chaos = MODES[currentMode].baseChaos || 0;
    
    const animate = () => {
      update(size, size);
      render(ctx, size, size);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [init, update, render, currentMode]);

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════
  
  const modes = ['regulated', 'dysregulated', 'dissociated', 'hyperfocused', 'flowing'];

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: 'linear-gradient(160deg, hsl(240, 25%, 3%) 0%, hsl(260, 20%, 5%) 100%)' }}
    >
      <div className="flex gap-2 mb-4 flex-wrap justify-center">
        {modes.map(mode => (
          <button
            key={mode}
            onClick={() => handleModeChange(mode)}
            className="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300"
            style={{
              background: currentMode === mode 
                ? `linear-gradient(135deg, hsla(${MODES[mode].baseHueShift}, 50%, 40%, 0.5) 0%, hsla(${MODES[mode].baseHueShift + 30}, 40%, 35%, 0.4) 100%)` 
                : 'hsla(0, 0%, 20%, 0.2)',
              color: currentMode === mode ? 'hsla(0, 0%, 90%, 0.95)' : 'hsla(0, 0%, 55%, 0.6)',
              border: currentMode === mode 
                ? `1px solid hsla(${MODES[mode].baseHueShift}, 40%, 50%, 0.4)` 
                : '1px solid transparent',
              boxShadow: currentMode === mode 
                ? `0 0 20px hsla(${MODES[mode].baseHueShift}, 40%, 40%, 0.2)` 
                : 'none',
            }}
          >
            {MODES[mode].name}
          </button>
        ))}
        <button
          onClick={() => setShowUI(!showUI)}
          className="px-3 py-1.5 rounded-md text-xs ml-2"
          style={{
            background: 'hsla(0, 0%, 15%, 0.3)',
            color: 'hsla(0, 0%, 50%, 0.6)',
            border: '1px solid hsla(0, 0%, 25%, 0.2)',
          }}
        >
          {showUI ? 'hide ui' : 'show ui'}
        </button>
      </div>
      
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="cursor-crosshair"
        style={{ 
          borderRadius: '1rem',
          boxShadow: `
            0 0 100px hsla(${MODES[currentMode].baseHueShift}, 40%, 25%, 0.25),
            0 0 50px hsla(220, 30%, 20%, 0.2)
          `,
        }}
      />
      
      <div className="mt-4 text-center max-w-md">
        <p style={{ 
          color: 'hsla(0, 0%, 60%, 0.5)', 
          fontSize: '11px',
          letterSpacing: '0.02em',
        }}>
          hover to touch · click to perturb
        </p>
        <p style={{ 
          color: 'hsla(0, 0%, 40%, 0.35)', 
          fontSize: '10px', 
          marginTop: '4px',
        }}>
          color encodes state: arousal→hue, coherence→saturation, energy→brightness
        </p>
      </div>
    </div>
  );
};

export default TeleodynamicSignature;
