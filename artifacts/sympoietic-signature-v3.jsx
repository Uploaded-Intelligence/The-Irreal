import React, { useRef, useEffect, useCallback } from 'react';

/*
 * SYMPOIETIC SIGNATURE v3
 * 
 * NO THINGS. ONLY PROCESSES.
 * 
 * Attractors are invisible - known only through behavior.
 * Structure emerges from dynamics.
 * Self-reference: the system observes itself and changes.
 * Co-dynamics: interaction creates lasting novelty.
 * 
 * Aesthetic: Bioluminescent abyss.
 * Everything is trace, flow, memory, emergence from darkness.
 */

const SympoieticSignature = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  const state = useRef({
    // Flow field - the invisible topology
    field: null,
    
    // Multiple particle systems at different temporal scales
    fastParticles: [],   // ephemeral, reactive (surface thoughts)
    slowParticles: [],   // structural, persistent (deep patterns)
    bridgeParticles: [], // weave between, create connections
    
    // Mycelium - grows organically
    myceliumNetworks: [],
    
    // Emergent forms - arise from clustering, fade naturally
    emergentForms: [],
    
    // Invisible attractors - pure force, no representation
    attractors: [],
    
    // Self-reference: system observes itself
    coherence: 0.5,
    entropy: 0.5,
    emergenceLevel: 0,
    phaseHistory: [],
    
    // Co-dynamic memory: interactions leave lasting traces
    interactionMemory: [],
    fieldMemory: null,
    
    // Temporal
    time: 0,
    breath: 0,
    
    // Phase (emergent, not assigned)
    phase: 'sensing',
  });

  // Organic noise
  const noise = (x, y, z = 0) => {
    const p = (n) => {
      const s = Math.sin(n) * 43758.5453;
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
    const h = p(fx + 1 + (fy + 1) * 57 + (fz + 1) * 113);
    
    const lerp = (a, b, t) => a + t * (b - a);
    
    return lerp(
      lerp(lerp(a, b, u), lerp(c, d, u), v),
      lerp(lerp(e, f, u), lerp(g, h, u), v),
      w
    );
  };

  const fbm = (x, y, z, octaves = 4) => {
    let value = 0, amplitude = 0.5, frequency = 1;
    for (let i = 0; i < octaves; i++) {
      value += amplitude * noise(x * frequency, y * frequency, z);
      amplitude *= 0.5;
      frequency *= 2;
    }
    return value;
  };

  const init = useCallback((width, height) => {
    const s = state.current;
    const cx = width / 2, cy = height / 2;
    
    // Flow field
    const res = 12;
    const cols = Math.ceil(width / res);
    const rows = Math.ceil(height / res);
    s.field = { res, cols, rows };
    s.fieldMemory = Array(rows).fill(null).map(() => 
      Array(cols).fill(null).map(() => ({ 
        strength: 0, 
        hue: 200,
        persistentAngle: 0,
      }))
    );
    
    // INVISIBLE attractors - no visual representation
    // These are force patterns, not things
    const attractorSeeds = [
      { x: 0, y: -0.3, strength: 1, type: 'spiral', hue: 280 },
      { x: -0.35, y: -0.2, strength: 0.8, type: 'well', hue: 180 },
      { x: 0.3, y: -0.25, strength: 0.9, type: 'pulse', hue: 320 },
      { x: 0.25, y: 0.35, strength: 0.7, type: 'bloom', hue: 140 },
      { x: -0.3, y: 0.3, strength: 0.85, type: 'vortex', hue: 40 },
      { x: 0, y: 0.4, strength: 0.75, type: 'breath', hue: 200 },
    ];
    
    s.attractors = attractorSeeds.map(seed => ({
      x: cx + seed.x * width * 0.4,
      y: cy + seed.y * height * 0.4,
      baseX: cx + seed.x * width * 0.4,
      baseY: cy + seed.y * height * 0.4,
      vx: 0, vy: 0,
      strength: seed.strength,
      type: seed.type,
      hue: seed.hue,
      phase: Math.random() * Math.PI * 2,
      radius: 60 + Math.random() * 40,
    }));
    
    // Fast particles - ephemeral
    s.fastParticles = [];
    for (let i = 0; i < 400; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 250;
      s.fastParticles.push({
        x: cx + Math.cos(a) * r,
        y: cy + Math.sin(a) * r,
        vx: 0, vy: 0,
        life: 1,
        maxLife: 150 + Math.random() * 200,
        age: Math.random() * 100,
        hue: 200,
        saturation: 50,
        trail: [],
        size: 0.5 + Math.random() * 1.5,
      });
    }
    
    // Slow particles - structural
    s.slowParticles = [];
    for (let i = 0; i < 80; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 180;
      s.slowParticles.push({
        x: cx + Math.cos(a) * r,
        y: cy + Math.sin(a) * r,
        vx: 0, vy: 0,
        life: 1,
        maxLife: 800 + Math.random() * 1200,
        age: Math.random() * 400,
        hue: 200,
        connections: [],
        size: 2 + Math.random() * 3,
        memory: 0, // how long in attractor field
      });
    }
    
    // Bridge particles - weavers
    s.bridgeParticles = [];
    for (let i = 0; i < 40; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 50 + Math.random() * 150;
      s.bridgeParticles.push({
        x: cx + Math.cos(a) * r,
        y: cy + Math.sin(a) * r,
        vx: 0, vy: 0,
        life: 1,
        maxLife: 500 + Math.random() * 700,
        age: Math.random() * 200,
        hue: 200,
        visitedAttractors: [],
        trail: [],
        size: 1.5 + Math.random() * 2,
      });
    }
    
    // Mycelium networks
    s.myceliumNetworks = [];
    for (let i = 0; i < 4; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 100;
      s.myceliumNetworks.push({
        nodes: [{
          x: cx + Math.cos(a) * r,
          y: cy + Math.sin(a) * r,
          parent: null,
          children: [],
          age: 0,
          alive: true,
          strength: 1,
        }],
        hue: 180 + Math.random() * 80,
        activity: 0.5 + Math.random() * 0.5,
      });
    }
    
    s.emergentForms = [];
    s.interactionMemory = [];
    s.phaseHistory = [];
  }, []);

  const getFieldInfluence = (s, x, y, time) => {
    // Base organic flow
    const scale = 0.008;
    let angle = fbm(x * scale, y * scale, time * 0.0003, 4) * Math.PI * 4;
    let magnitude = fbm(x * scale + 100, y * scale + 100, time * 0.0002, 3) * 0.4 + 0.2;
    let hue = 200;
    
    // Attractor influences (invisible forces)
    let totalInfluence = 0;
    s.attractors.forEach(att => {
      const dx = att.x - x;
      const dy = att.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < att.radius * 3) {
        const influence = Math.pow(1 - dist / (att.radius * 3), 2) * att.strength;
        totalInfluence += influence;
        
        switch (att.type) {
          case 'spiral':
            const tangent = Math.atan2(dy, dx) + Math.PI / 2;
            angle = angle * (1 - influence * 0.7) + tangent * influence * 0.7;
            angle += influence * 0.1; // inward pull
            break;
          case 'well':
            const toward = Math.atan2(dy, dx);
            angle = angle * (1 - influence * 0.5) + toward * influence * 0.5;
            magnitude += influence * 0.3;
            break;
          case 'pulse':
            const pulseFactor = Math.sin(att.phase * 3) * 0.5 + 0.5;
            magnitude += influence * pulseFactor * 0.4;
            break;
          case 'bloom':
            const bloomFactor = Math.sin(att.phase) * 0.5 + 0.5;
            const outward = Math.atan2(y - att.y, x - att.x);
            angle = angle * (1 - influence * bloomFactor * 0.4) + outward * influence * bloomFactor * 0.4;
            break;
          case 'vortex':
            const vortexAngle = Math.atan2(dy, dx) + Math.PI / 2 + dist * 0.02;
            angle = angle * (1 - influence * 0.6) + vortexAngle * influence * 0.6;
            break;
          case 'breath':
            const breathFactor = Math.sin(time * 0.003 + dist * 0.01);
            const breathDir = breathFactor > 0 ? Math.atan2(dy, dx) : Math.atan2(y - att.y, x - att.x);
            angle = angle * (1 - influence * 0.3 * Math.abs(breathFactor)) + breathDir * influence * 0.3 * Math.abs(breathFactor);
            break;
        }
        
        hue = hue * (1 - influence) + att.hue * influence;
      }
    });
    
    // Field memory influence
    const col = Math.floor(x / s.field.res);
    const row = Math.floor(y / s.field.res);
    if (s.fieldMemory[row]?.[col]) {
      const mem = s.fieldMemory[row][col];
      if (mem.strength > 0.1) {
        angle = angle * (1 - mem.strength * 0.3) + mem.persistentAngle * mem.strength * 0.3;
        hue = hue * (1 - mem.strength * 0.5) + mem.hue * mem.strength * 0.5;
      }
    }
    
    // Self-reference: coherence affects flow
    if (s.coherence > 0.6) {
      // High coherence = more structured flow
      angle = Math.round(angle / (Math.PI / 6)) * (Math.PI / 6) * 0.3 + angle * 0.7;
    } else if (s.entropy > 0.7) {
      // High entropy = more chaotic
      angle += (Math.random() - 0.5) * 0.5;
    }
    
    return { angle, magnitude: Math.min(1, magnitude), hue };
  };

  const updateMycelium = (s, cx, cy, width, height) => {
    s.myceliumNetworks.forEach(network => {
      // Growth - influenced by field and attractor proximity
      if (Math.random() < 0.03 * network.activity * (1 + s.coherence)) {
        const growableNodes = network.nodes.filter(n => n.alive && n.children.length < 3 && n.age > 20);
        if (growableNodes.length > 0 && network.nodes.length < 60) {
          const parent = growableNodes[Math.floor(Math.random() * growableNodes.length)];
          
          // Grow in direction influenced by field
          const fieldHere = getFieldInfluence(s, parent.x, parent.y, s.time);
          const growAngle = fieldHere.angle + (Math.random() - 0.5) * Math.PI * 0.5;
          const growDist = 12 + Math.random() * 18;
          
          const newNode = {
            x: parent.x + Math.cos(growAngle) * growDist,
            y: parent.y + Math.sin(growAngle) * growDist,
            parent,
            children: [],
            age: 0,
            alive: true,
            strength: parent.strength * (0.85 + Math.random() * 0.15),
          };
          
          // Boundary check with soft edge
          const distFromCenter = Math.sqrt((newNode.x - cx) ** 2 + (newNode.y - cy) ** 2);
          if (distFromCenter < Math.min(width, height) * 0.42) {
            parent.children.push(newNode);
            network.nodes.push(newNode);
          }
        }
      }
      
      // Aging and death
      network.nodes.forEach(node => {
        node.age++;
        // Nodes near high-activity areas live longer
        if (node.alive && node.age > 300) {
          const deathChance = 0.002 * (1 - s.coherence * 0.5);
          if (Math.random() < deathChance) {
            node.alive = false;
          }
        }
        // Strength fades on dead nodes
        if (!node.alive) {
          node.strength *= 0.995;
        }
      });
      
      // Prune very dead nodes
      network.nodes = network.nodes.filter(n => n.alive || n.strength > 0.1);
    });
  };

  const detectEmergentForms = (s, cx, cy) => {
    // Find clusters of slow particles
    const clusters = [];
    const used = new Set();
    
    s.slowParticles.forEach((p, i) => {
      if (used.has(i) || p.life < 0.3) return;
      
      const cluster = [{ particle: p, index: i }];
      used.add(i);
      
      // Find nearby particles
      s.slowParticles.forEach((other, j) => {
        if (used.has(j) || other.life < 0.3) return;
        const dx = other.x - p.x;
        const dy = other.y - p.y;
        if (dx * dx + dy * dy < 50 * 50) {
          cluster.push({ particle: other, index: j });
          used.add(j);
        }
      });
      
      if (cluster.length >= 4) {
        clusters.push(cluster);
      }
    });
    
    // Create or reinforce emergent forms
    clusters.forEach(cluster => {
      const avgX = cluster.reduce((sum, c) => sum + c.particle.x, 0) / cluster.length;
      const avgY = cluster.reduce((sum, c) => sum + c.particle.y, 0) / cluster.length;
      const avgHue = cluster.reduce((sum, c) => sum + c.particle.hue, 0) / cluster.length;
      
      // Check if this overlaps an existing form
      const existing = s.emergentForms.find(f => {
        const dx = f.x - avgX;
        const dy = f.y - avgY;
        return dx * dx + dy * dy < 40 * 40;
      });
      
      if (existing) {
        existing.strength = Math.min(1, existing.strength + 0.05);
        existing.x = existing.x * 0.9 + avgX * 0.1;
        existing.y = existing.y * 0.9 + avgY * 0.1;
        existing.particleCount = cluster.length;
      } else {
        s.emergentForms.push({
          x: avgX,
          y: avgY,
          hue: avgHue,
          strength: 0.3,
          age: 0,
          particleCount: cluster.length,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    });
    
    // Age and fade forms
    s.emergentForms = s.emergentForms.filter(f => {
      f.age++;
      f.pulsePhase += 0.03;
      
      // Forms not being reinforced fade
      if (f.age > 10) {
        f.strength *= 0.98;
      }
      f.age = 0; // Reset age for next frame
      
      return f.strength > 0.05;
    });
  };

  const updateSelfReference = (s) => {
    // Calculate coherence (how organized/clustered)
    let clusterScore = 0;
    s.slowParticles.forEach(p => {
      if (p.memory > 0.5) clusterScore++;
    });
    s.coherence = s.coherence * 0.95 + (clusterScore / s.slowParticles.length) * 0.05;
    
    // Calculate entropy (how chaotic/spread)
    let speedSum = 0;
    s.fastParticles.forEach(p => {
      speedSum += Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    });
    const avgSpeed = speedSum / s.fastParticles.length;
    s.entropy = s.entropy * 0.95 + Math.min(1, avgSpeed / 3) * 0.05;
    
    // Emergence level (from emergent forms and mycelium growth)
    const formStrength = s.emergentForms.reduce((sum, f) => sum + f.strength, 0);
    const myceliumSize = s.myceliumNetworks.reduce((sum, n) => sum + n.nodes.length, 0);
    s.emergenceLevel = s.emergenceLevel * 0.98 + (formStrength * 0.3 + myceliumSize * 0.005) * 0.02;
    s.emergenceLevel = Math.min(1, s.emergenceLevel);
    
    // Phase detection
    s.phaseHistory.push({ coherence: s.coherence, entropy: s.entropy, emergence: s.emergenceLevel });
    if (s.phaseHistory.length > 60) s.phaseHistory.shift();
    
    const avgCoherence = s.phaseHistory.reduce((sum, p) => sum + p.coherence, 0) / s.phaseHistory.length;
    const avgEntropy = s.phaseHistory.reduce((sum, p) => sum + p.entropy, 0) / s.phaseHistory.length;
    const avgEmergence = s.phaseHistory.reduce((sum, p) => sum + p.emergence, 0) / s.phaseHistory.length;
    
    if (avgEmergence > 0.4) {
      s.phase = 'transcending';
    } else if (avgCoherence > 0.55 && avgEntropy < 0.4) {
      s.phase = 'crystallizing';
    } else if (avgEntropy > 0.6 && avgCoherence < 0.35) {
      s.phase = 'dissolving';
    } else if (avgCoherence > 0.35) {
      s.phase = 'building';
    } else {
      s.phase = 'sensing';
    }
  };

  const update = useCallback((width, height) => {
    const s = state.current;
    const cx = width / 2, cy = height / 2;
    
    s.time++;
    s.breath += 0.005;
    
    const breathScale = Math.sin(s.breath) * 0.12 + 1;
    
    // Update invisible attractors (they drift, respond to system state)
    s.attractors.forEach(att => {
      att.phase += 0.008 * att.strength;
      
      // Attractors drift based on field
      const fieldHere = getFieldInfluence(s, att.x, att.y, s.time);
      att.vx += Math.cos(fieldHere.angle) * 0.02;
      att.vy += Math.sin(fieldHere.angle) * 0.02;
      
      // Return home
      att.vx += (att.baseX - att.x) * 0.003;
      att.vy += (att.baseY - att.y) * 0.003;
      
      // Self-reference: high emergence pulls attractors slightly together
      if (s.emergenceLevel > 0.3) {
        att.vx += (cx - att.x) * 0.0005 * s.emergenceLevel;
        att.vy += (cy - att.y) * 0.0005 * s.emergenceLevel;
      }
      
      att.x += att.vx;
      att.y += att.vy;
      att.vx *= 0.92;
      att.vy *= 0.92;
      
      // Breathing affects radius
      att.currentRadius = att.radius * breathScale * (1 + s.coherence * 0.2);
    });
    
    // Update fast particles
    s.fastParticles.forEach(p => {
      p.age++;
      p.life = Math.max(0, 1 - p.age / p.maxLife);
      
      if (p.life <= 0) {
        // Rebirth
        const a = Math.random() * Math.PI * 2;
        const r = 30 + Math.random() * 200;
        p.x = cx + Math.cos(a) * r;
        p.y = cy + Math.sin(a) * r;
        p.vx = 0;
        p.vy = 0;
        p.age = 0;
        p.life = 1;
        p.trail = [];
      }
      
      const field = getFieldInfluence(s, p.x, p.y, s.time);
      p.vx += Math.cos(field.angle) * field.magnitude * 0.25;
      p.vy += Math.sin(field.angle) * field.magnitude * 0.25;
      p.hue = p.hue * 0.9 + field.hue * 0.1;
      p.saturation = 40 + field.magnitude * 40;
      
      // Boundary
      const dist = Math.sqrt((p.x - cx) ** 2 + (p.y - cy) ** 2);
      const maxDist = Math.min(width, height) * 0.45 * breathScale;
      if (dist > maxDist) {
        const angle = Math.atan2(p.y - cy, p.x - cx);
        p.vx -= Math.cos(angle) * (dist - maxDist) * 0.02;
        p.vy -= Math.sin(angle) * (dist - maxDist) * 0.02;
      }
      
      // Apply
      const maxSpeed = 4;
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > maxSpeed) {
        p.vx = (p.vx / speed) * maxSpeed;
        p.vy = (p.vy / speed) * maxSpeed;
      }
      
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      
      // Trail
      if (s.time % 2 === 0) {
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 12) p.trail.shift();
      }
      
      // Mark field memory
      const col = Math.floor(p.x / s.field.res);
      const row = Math.floor(p.y / s.field.res);
      if (s.fieldMemory[row]?.[col]) {
        s.fieldMemory[row][col].strength = Math.min(1, s.fieldMemory[row][col].strength + 0.008);
        s.fieldMemory[row][col].hue = s.fieldMemory[row][col].hue * 0.95 + p.hue * 0.05;
        s.fieldMemory[row][col].persistentAngle = Math.atan2(p.vy, p.vx);
      }
    });
    
    // Update slow particles
    s.slowParticles.forEach(p => {
      p.age++;
      p.life = Math.max(0, 1 - p.age / p.maxLife);
      
      if (p.life <= 0) {
        const a = Math.random() * Math.PI * 2;
        const r = 30 + Math.random() * 150;
        p.x = cx + Math.cos(a) * r;
        p.y = cy + Math.sin(a) * r;
        p.vx = 0;
        p.vy = 0;
        p.age = 0;
        p.life = 1;
        p.memory = 0;
      }
      
      const field = getFieldInfluence(s, p.x, p.y, s.time);
      p.vx += Math.cos(field.angle) * field.magnitude * 0.08;
      p.vy += Math.sin(field.angle) * field.magnitude * 0.08;
      p.hue = p.hue * 0.95 + field.hue * 0.05;
      
      // Check attractor proximity for memory
      let inAttractor = false;
      s.attractors.forEach(att => {
        const dx = att.x - p.x;
        const dy = att.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < att.currentRadius * 1.5) {
          inAttractor = true;
        }
      });
      p.memory = inAttractor ? Math.min(1, p.memory + 0.02) : Math.max(0, p.memory - 0.005);
      
      // Connections to nearby slow particles
      p.connections = [];
      s.slowParticles.forEach(other => {
        if (other === p) return;
        const dx = other.x - p.x;
        const dy = other.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 70) {
          p.connections.push({ x: other.x, y: other.y, strength: 1 - dist / 70, hue: (p.hue + other.hue) / 2 });
          // Gentle cohesion
          p.vx += dx * 0.0003;
          p.vy += dy * 0.0003;
        }
      });
      
      // Boundary
      const dist = Math.sqrt((p.x - cx) ** 2 + (p.y - cy) ** 2);
      const maxDist = Math.min(width, height) * 0.4 * breathScale;
      if (dist > maxDist) {
        const angle = Math.atan2(p.y - cy, p.x - cx);
        p.vx -= Math.cos(angle) * (dist - maxDist) * 0.01;
        p.vy -= Math.sin(angle) * (dist - maxDist) * 0.01;
      }
      
      const maxSpeed = 1.5;
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > maxSpeed) {
        p.vx = (p.vx / speed) * maxSpeed;
        p.vy = (p.vy / speed) * maxSpeed;
      }
      
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.98;
      p.vy *= 0.98;
    });
    
    // Update bridge particles
    s.bridgeParticles.forEach(p => {
      p.age++;
      p.life = Math.max(0, 1 - p.age / p.maxLife);
      
      if (p.life <= 0) {
        const a = Math.random() * Math.PI * 2;
        const r = 50 + Math.random() * 120;
        p.x = cx + Math.cos(a) * r;
        p.y = cy + Math.sin(a) * r;
        p.vx = 0;
        p.vy = 0;
        p.age = 0;
        p.life = 1;
        p.visitedAttractors = [];
        p.trail = [];
      }
      
      const field = getFieldInfluence(s, p.x, p.y, s.time);
      p.vx += Math.cos(field.angle) * field.magnitude * 0.15;
      p.vy += Math.sin(field.angle) * field.magnitude * 0.15;
      p.hue = p.hue * 0.92 + field.hue * 0.08;
      
      // Track visited attractors
      s.attractors.forEach((att, i) => {
        const dx = att.x - p.x;
        const dy = att.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < att.currentRadius && !p.visitedAttractors.includes(i)) {
          p.visitedAttractors.push(i);
        }
      });
      
      // If visited multiple attractors, actively seek unvisited ones
      if (p.visitedAttractors.length > 0 && p.visitedAttractors.length < s.attractors.length) {
        const unvisited = s.attractors.filter((_, i) => !p.visitedAttractors.includes(i));
        if (unvisited.length > 0) {
          const target = unvisited[0];
          const dx = target.x - p.x;
          const dy = target.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          p.vx += (dx / dist) * 0.03;
          p.vy += (dy / dist) * 0.03;
        }
      }
      
      // Boundary
      const dist = Math.sqrt((p.x - cx) ** 2 + (p.y - cy) ** 2);
      const maxDist = Math.min(width, height) * 0.43 * breathScale;
      if (dist > maxDist) {
        const angle = Math.atan2(p.y - cy, p.x - cx);
        p.vx -= Math.cos(angle) * (dist - maxDist) * 0.015;
        p.vy -= Math.sin(angle) * (dist - maxDist) * 0.015;
      }
      
      const maxSpeed = 2.5;
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > maxSpeed) {
        p.vx = (p.vx / speed) * maxSpeed;
        p.vy = (p.vy / speed) * maxSpeed;
      }
      
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.97;
      p.vy *= 0.97;
      
      // Trail
      if (s.time % 3 === 0) {
        p.trail.push({ x: p.x, y: p.y, hue: p.hue });
        if (p.trail.length > 25) p.trail.shift();
      }
    });
    
    // Update mycelium
    if (s.time % 3 === 0) {
      updateMycelium(s, cx, cy, width, height);
    }
    
    // Detect emergent forms
    if (s.time % 10 === 0) {
      detectEmergentForms(s, cx, cy);
    }
    
    // Self-reference update
    if (s.time % 5 === 0) {
      updateSelfReference(s);
    }
    
    // Decay field memory
    for (let row = 0; row < s.field.rows; row++) {
      for (let col = 0; col < s.field.cols; col++) {
        s.fieldMemory[row][col].strength *= 0.997;
      }
    }
    
    // Process interaction memory
    s.interactionMemory = s.interactionMemory.filter(m => {
      m.age++;
      m.strength *= 0.98;
      m.radius += m.speed;
      m.speed *= 0.97;
      return m.strength > 0.02;
    });
  }, []);

  const render = useCallback((ctx, width, height) => {
    const s = state.current;
    const cx = width / 2, cy = height / 2;
    
    // Background - phase-dependent, subtle
    const phaseHues = {
      sensing: 250,
      building: 230,
      crystallizing: 200,
      dissolving: 280,
      transcending: 260,
    };
    const bgHue = phaseHues[s.phase] || 250;
    
    ctx.fillStyle = `hsla(${bgHue}, 50%, 3%, 0.12)`;
    ctx.fillRect(0, 0, width, height);
    
    // Field memory glow (very subtle, like traces of past movement)
    for (let row = 0; row < s.field.rows; row++) {
      for (let col = 0; col < s.field.cols; col++) {
        const cell = s.fieldMemory[row][col];
        if (cell.strength > 0.08) {
          const x = col * s.field.res + s.field.res / 2;
          const y = row * s.field.res + s.field.res / 2;
          
          ctx.beginPath();
          ctx.arc(x, y, s.field.res * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${cell.hue}, 60%, 40%, ${cell.strength * 0.08})`;
          ctx.fill();
        }
      }
    }
    
    // Mycelium networks
    s.myceliumNetworks.forEach(network => {
      network.nodes.forEach(node => {
        if (node.parent) {
          const alpha = node.strength * (node.alive ? 0.4 : 0.15);
          ctx.beginPath();
          ctx.moveTo(node.parent.x, node.parent.y);
          ctx.lineTo(node.x, node.y);
          ctx.strokeStyle = `hsla(${network.hue}, 50%, 45%, ${alpha})`;
          ctx.lineWidth = node.strength * 1.5;
          ctx.stroke();
        }
        
        if (node.alive && node.strength > 0.5) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 2 * node.strength, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${network.hue}, 60%, 55%, ${node.strength * 0.5})`;
          ctx.fill();
        }
      });
    });
    
    // Slow particle connections
    s.slowParticles.forEach(p => {
      p.connections.forEach(conn => {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(conn.x, conn.y);
        ctx.strokeStyle = `hsla(${conn.hue}, 55%, 50%, ${conn.strength * p.life * 0.35})`;
        ctx.lineWidth = conn.strength * 2;
        ctx.stroke();
      });
    });
    
    // Emergent forms (soft glows, not objects)
    s.emergentForms.forEach(form => {
      const pulse = Math.sin(form.pulsePhase) * 0.15 + 0.85;
      const radius = (20 + form.particleCount * 4) * pulse;
      
      const gradient = ctx.createRadialGradient(form.x, form.y, 0, form.x, form.y, radius);
      gradient.addColorStop(0, `hsla(${form.hue}, 70%, 60%, ${form.strength * 0.25})`);
      gradient.addColorStop(0.5, `hsla(${form.hue}, 60%, 50%, ${form.strength * 0.1})`);
      gradient.addColorStop(1, 'transparent');
      
      ctx.beginPath();
      ctx.arc(form.x, form.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    });
    
    // Bridge particle trails (the weavers, longer trails)
    s.bridgeParticles.forEach(p => {
      if (p.trail.length > 2) {
        ctx.beginPath();
        ctx.moveTo(p.trail[0].x, p.trail[0].y);
        for (let i = 1; i < p.trail.length; i++) {
          ctx.lineTo(p.trail[i].x, p.trail[i].y);
        }
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `hsla(${p.hue}, 65%, 60%, ${p.life * 0.25})`;
        ctx.lineWidth = p.size * 0.6;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
      
      // Bridge particles glow if they've visited multiple attractors
      const glowIntensity = Math.min(1, p.visitedAttractors.length / 3);
      if (glowIntensity > 0.3) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4 * glowIntensity, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 65%, ${p.life * glowIntensity * 0.15})`;
        ctx.fill();
      }
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 70%, 70%, ${p.life * 0.7})`;
      ctx.fill();
    });
    
    // Slow particles
    s.slowParticles.forEach(p => {
      const memoryGlow = p.memory * 0.3;
      if (memoryGlow > 0.1) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 60%, 55%, ${memoryGlow * p.life})`;
        ctx.fill();
      }
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 65%, 60%, ${p.life * 0.6})`;
      ctx.fill();
    });
    
    // Fast particles with trails
    s.fastParticles.forEach(p => {
      if (p.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(p.trail[0].x, p.trail[0].y);
        for (let i = 1; i < p.trail.length; i++) {
          ctx.lineTo(p.trail[i].x, p.trail[i].y);
        }
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `hsla(${p.hue}, ${p.saturation}%, 65%, ${p.life * 0.2})`;
        ctx.lineWidth = p.size * 0.4;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, ${p.saturation + 15}%, 75%, ${p.life * 0.6})`;
      ctx.fill();
    });
    
    // Interaction ripples
    s.interactionMemory.forEach(m => {
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${m.hue}, 60%, 65%, ${m.strength * 0.4})`;
      ctx.lineWidth = 2 * m.strength;
      ctx.stroke();
    });
    
    // Subtle phase/emergence indicator
    const indicatorY = height - 20;
    
    // Coherence bar (left)
    ctx.fillStyle = `hsla(${180 + s.coherence * 60}, 50%, 50%, 0.3)`;
    ctx.fillRect(15, indicatorY, (width / 2 - 20) * s.coherence, 4);
    
    // Entropy bar (right, inverted color)
    ctx.fillStyle = `hsla(${280 - s.entropy * 60}, 50%, 50%, 0.3)`;
    ctx.fillRect(width / 2 + 5, indicatorY, (width / 2 - 20) * s.entropy, 4);
    
    // Emergence spiral (center, when active)
    if (s.emergenceLevel > 0.2) {
      ctx.beginPath();
      const spiralTurns = s.emergenceLevel * 3;
      for (let t = 0; t < Math.PI * 2 * spiralTurns; t += 0.1) {
        const r = 5 + t * 2;
        const x = cx + Math.cos(t + s.time * 0.01) * r;
        const y = cy + Math.sin(t + s.time * 0.01) * r;
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `hsla(50, 70%, 60%, ${s.emergenceLevel * 0.15})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }, []);

  const handleInteraction = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    const s = state.current;
    
    // Create interaction memory (lasting trace)
    s.interactionMemory.push({
      x, y,
      radius: 5,
      speed: 3,
      strength: 1,
      age: 0,
      hue: 40 + Math.random() * 40,
    });
    
    // Mark field memory permanently at interaction point
    const col = Math.floor(x / s.field.res);
    const row = Math.floor(y / s.field.res);
    for (let dr = -2; dr <= 2; dr++) {
      for (let dc = -2; dc <= 2; dc++) {
        if (s.fieldMemory[row + dr]?.[col + dc]) {
          const dist = Math.sqrt(dr * dr + dc * dc);
          s.fieldMemory[row + dr][col + dc].strength = Math.min(1, 
            s.fieldMemory[row + dr][col + dc].strength + 0.3 * (1 - dist / 3)
          );
          s.fieldMemory[row + dr][col + dc].hue = 50;
        }
      }
    }
    
    // Perturb nearby particles
    [...s.fastParticles, ...s.slowParticles, ...s.bridgeParticles].forEach(p => {
      const dx = p.x - x;
      const dy = p.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (1 - dist / 100) * 3;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }
    });
    
    // Slightly nudge nearby attractors
    s.attractors.forEach(att => {
      const dx = att.x - x;
      const dy = att.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (1 - dist / 120) * 1.5;
        att.vx += (dx / dist) * force;
        att.vy += (dy / dist) * force;
      }
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const size = Math.min(850, window.innerWidth - 32);
    canvas.width = size;
    canvas.height = size;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'hsl(250, 50%, 3%)';
    ctx.fillRect(0, 0, size, size);
    
    init(size, size);
    
    const animate = () => {
      update(size, size);
      render(ctx, size, size);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [init, update, render]);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ 
        background: 'linear-gradient(135deg, hsl(250, 50%, 3%) 0%, hsl(270, 40%, 5%) 50%, hsl(240, 45%, 4%) 100%)',
      }}
    >
      <canvas
        ref={canvasRef}
        onClick={handleInteraction}
        className="cursor-crosshair"
        style={{ 
          borderRadius: '1.5rem',
          boxShadow: `
            0 0 120px hsla(260, 60%, 30%, 0.2),
            0 0 60px hsla(200, 50%, 40%, 0.1),
            inset 0 0 100px hsla(0, 0%, 0%, 0.4)
          `,
        }}
      />
      
      <div className="mt-8 text-center">
        <p 
          className="text-sm tracking-widest"
          style={{ 
            color: 'hsla(200, 40%, 60%, 0.6)',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
          }}
        >
          sympoiesis
        </p>
        <p 
          className="text-xs mt-2 tracking-wide"
          style={{ color: 'hsla(260, 30%, 50%, 0.4)' }}
        >
          click to leave traces in the between
        </p>
      </div>
    </div>
  );
};

export default SympoieticSignature;
