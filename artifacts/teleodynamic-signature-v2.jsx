import React, { useRef, useEffect, useState, useCallback } from 'react';

const TeleodynamicSignature = () => {
  const canvasRef = useRef(null);
  const deepCanvasRef = useRef(null);
  const surfaceCanvasRef = useRef(null);
  const animationRef = useRef(null);
  
  const stateRef = useRef({
    // Deep layer - slow, structural, the "sanctuary"
    deepField: null,
    deepPhase: 0,
    
    // Middle layer - the ecology itself
    particles: [],
    attractors: [],
    mycelium: [],
    emergentForms: [],
    
    // Surface layer - fast, ephemeral, traces
    traces: [],
    ripples: [],
    
    // Temporal state
    time: 0,
    breath: 0,
    
    // Phase transition tracking
    entropy: 0.5,
    coherence: 0.5,
    transitionPending: false,
    currentPhase: 'flowing', // flowing, crystallizing, dissolving, dreaming
    
    // Memory - what has emerged before
    patternMemory: [],
  });

  // Initialize the flow field (Perlin-like noise field)
  const initDeepField = (width, height) => {
    const resolution = 20;
    const cols = Math.ceil(width / resolution);
    const rows = Math.ceil(height / resolution);
    const field = [];
    
    for (let y = 0; y < rows; y++) {
      field[y] = [];
      for (let x = 0; x < cols; x++) {
        field[y][x] = {
          angle: 0,
          magnitude: 0,
          memory: 0,
        };
      }
    }
    return { field, resolution, cols, rows };
  };

  // Simplex-like noise (simplified)
  const noise = (x, y, z) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const zf = z - Math.floor(z);
    
    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);
    const w = zf * zf * (3 - 2 * zf);
    
    const a = (Math.sin(X * 12.9898 + Y * 78.233 + Z * 37.719) * 43758.5453) % 1;
    const b = (Math.sin((X+1) * 12.9898 + Y * 78.233 + Z * 37.719) * 43758.5453) % 1;
    const c = (Math.sin(X * 12.9898 + (Y+1) * 78.233 + Z * 37.719) * 43758.5453) % 1;
    const d = (Math.sin((X+1) * 12.9898 + (Y+1) * 78.233 + Z * 37.719) * 43758.5453) % 1;
    const e = (Math.sin(X * 12.9898 + Y * 78.233 + (Z+1) * 37.719) * 43758.5453) % 1;
    const f = (Math.sin((X+1) * 12.9898 + Y * 78.233 + (Z+1) * 37.719) * 43758.5453) % 1;
    const g = (Math.sin(X * 12.9898 + (Y+1) * 78.233 + (Z+1) * 37.719) * 43758.5453) % 1;
    const h = (Math.sin((X+1) * 12.9898 + (Y+1) * 78.233 + (Z+1) * 37.719) * 43758.5453) % 1;
    
    const lerp = (a, b, t) => a + t * (b - a);
    
    return lerp(
      lerp(lerp(a, b, u), lerp(c, d, u), v),
      lerp(lerp(e, f, u), lerp(g, h, u), v),
      w
    );
  };

  const initializeSystem = useCallback((width, height) => {
    const state = stateRef.current;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Initialize deep field
    state.deepField = initDeepField(width, height);
    
    // Attractors - morphodynamic basins
    state.attractors = [];
    const attractorCount = 7;
    for (let i = 0; i < attractorCount; i++) {
      const angle = (i / attractorCount) * Math.PI * 2 + Math.random() * 0.5;
      const radius = 80 + Math.random() * 100;
      state.attractors.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        homeX: centerX + Math.cos(angle) * radius,
        homeY: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        phase: Math.random() * Math.PI * 2,
        strength: 0.3 + Math.random() * 0.7,
        rhythm: 0.3 + Math.random() * 2,
        size: 30 + Math.random() * 50,
        hue: (i / attractorCount) * 360,
        type: ['void', 'pulse', 'spiral', 'nest'][Math.floor(Math.random() * 4)],
        breathPhase: Math.random() * Math.PI * 2,
      });
    }
    
    // Particles - multiple types for different temporalities
    state.particles = [];
    
    // Fast particles - ephemeral, reactive
    for (let i = 0; i < 150; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 200;
      state.particles.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        type: 'fast',
        life: 1,
        maxLife: 200 + Math.random() * 300,
        age: 0,
        memory: new Array(attractorCount).fill(0),
        trail: [],
        size: 1 + Math.random() * 2,
      });
    }
    
    // Slow particles - structural, persistent
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 150;
      state.particles.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        type: 'slow',
        life: 1,
        maxLife: 1000 + Math.random() * 2000,
        age: 0,
        memory: new Array(attractorCount).fill(0),
        connections: [],
        size: 3 + Math.random() * 4,
      });
    }
    
    // Mycelium network - grows organically
    state.mycelium = [];
    for (let i = 0; i < 5; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 100;
      state.mycelium.push({
        nodes: [{
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          parent: null,
          children: [],
          age: 0,
          alive: true,
        }],
        hue: Math.random() * 360,
        growth: 0.5 + Math.random() * 0.5,
      });
    }
    
    state.emergentForms = [];
    state.traces = [];
    state.ripples = [];
  }, []);

  const updateDeepField = (state, width, height, time) => {
    const { deepField } = state;
    if (!deepField) return;
    
    const { field, resolution, cols, rows } = deepField;
    const phase = state.currentPhase;
    
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const noiseScale = 0.02;
        const timeScale = phase === 'dreaming' ? 0.0003 : 0.001;
        
        let angle = noise(x * noiseScale, y * noiseScale, time * timeScale) * Math.PI * 4;
        let magnitude = noise(x * noiseScale + 100, y * noiseScale + 100, time * timeScale * 0.5);
        
        // Phase-specific field modifications
        if (phase === 'crystallizing') {
          // More structured, geometric
          angle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
          magnitude *= 1.5;
        } else if (phase === 'dissolving') {
          // More chaotic
          angle += noise(x * 0.1, y * 0.1, time * 0.01) * Math.PI;
          magnitude *= 0.5;
        } else if (phase === 'dreaming') {
          // Slow, spiraling
          const cx = cols / 2, cy = rows / 2;
          const spiralAngle = Math.atan2(y - cy, x - cx);
          angle = angle * 0.3 + spiralAngle * 0.7 + time * 0.0002;
        }
        
        // Memory - fields remember where particles have been
        field[y][x].angle = angle;
        field[y][x].magnitude = Math.max(0.1, Math.min(1, magnitude + field[y][x].memory * 0.5));
        field[y][x].memory *= 0.995; // Slow decay
      }
    }
  };

  const getFieldVector = (state, x, y) => {
    const { deepField } = state;
    if (!deepField) return { angle: 0, magnitude: 0 };
    
    const { field, resolution, cols, rows } = deepField;
    const col = Math.floor(x / resolution);
    const row = Math.floor(y / resolution);
    
    if (col < 0 || col >= cols || row < 0 || row >= rows) {
      return { angle: 0, magnitude: 0 };
    }
    
    return field[row][col];
  };

  const updateMycelium = (state, centerX, centerY) => {
    state.mycelium.forEach(network => {
      // Growth - add new nodes
      if (Math.random() < 0.02 * network.growth) {
        const aliveNodes = network.nodes.filter(n => n.alive && n.children.length < 3);
        if (aliveNodes.length > 0) {
          const parent = aliveNodes[Math.floor(Math.random() * aliveNodes.length)];
          const angle = Math.random() * Math.PI * 2;
          const dist = 15 + Math.random() * 25;
          const newNode = {
            x: parent.x + Math.cos(angle) * dist,
            y: parent.y + Math.sin(angle) * dist,
            parent: parent,
            children: [],
            age: 0,
            alive: true,
          };
          
          // Don't grow too far from center
          const distFromCenter = Math.sqrt((newNode.x - centerX) ** 2 + (newNode.y - centerY) ** 2);
          if (distFromCenter < 250) {
            parent.children.push(newNode);
            network.nodes.push(newNode);
          }
        }
      }
      
      // Aging and death
      network.nodes.forEach(node => {
        node.age++;
        if (node.age > 500 && Math.random() < 0.001) {
          node.alive = false;
        }
      });
      
      // Prune dead branches (keep some for visual)
      if (network.nodes.length > 100) {
        network.nodes = network.nodes.filter(n => n.alive || n.age < 200);
      }
    });
  };

  const detectEmergentForms = (state, centerX, centerY) => {
    // Look for clusters of slow particles that form shapes
    const slowParticles = state.particles.filter(p => p.type === 'slow');
    
    // Simple clustering
    const clusters = [];
    const used = new Set();
    
    slowParticles.forEach((p, i) => {
      if (used.has(i)) return;
      
      const cluster = [p];
      used.add(i);
      
      slowParticles.forEach((other, j) => {
        if (used.has(j)) return;
        const dx = other.x - p.x;
        const dy = other.y - p.y;
        if (Math.sqrt(dx * dx + dy * dy) < 60) {
          cluster.push(other);
          used.add(j);
        }
      });
      
      if (cluster.length >= 4) {
        clusters.push(cluster);
      }
    });
    
    // Create emergent forms from clusters
    clusters.forEach(cluster => {
      const avgX = cluster.reduce((s, p) => s + p.x, 0) / cluster.length;
      const avgY = cluster.reduce((s, p) => s + p.y, 0) / cluster.length;
      const avgMemory = cluster[0].memory.map((_, i) => 
        cluster.reduce((s, p) => s + p.memory[i], 0) / cluster.length
      );
      
      // Find dominant attractor
      let maxMem = 0, dominantHue = 0;
      avgMemory.forEach((m, i) => {
        if (m > maxMem) {
          maxMem = m;
          dominantHue = state.attractors[i]?.hue || 0;
        }
      });
      
      const existingForm = state.emergentForms.find(f => {
        const dx = f.x - avgX;
        const dy = f.y - avgY;
        return Math.sqrt(dx * dx + dy * dy) < 50;
      });
      
      if (!existingForm) {
        state.emergentForms.push({
          x: avgX,
          y: avgY,
          particles: cluster,
          size: cluster.length * 5,
          hue: dominantHue,
          age: 0,
          maxAge: 200 + Math.random() * 300,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    });
    
    // Age and remove forms
    state.emergentForms = state.emergentForms.filter(f => {
      f.age++;
      f.pulsePhase += 0.05;
      return f.age < f.maxAge;
    });
  };

  const checkPhaseTransition = (state) => {
    // Calculate system entropy and coherence
    const fastParticles = state.particles.filter(p => p.type === 'fast');
    const slowParticles = state.particles.filter(p => p.type === 'slow');
    
    // Entropy - how spread out/chaotic is movement
    let totalSpeed = 0;
    fastParticles.forEach(p => {
      totalSpeed += Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    });
    state.entropy = Math.min(1, totalSpeed / (fastParticles.length * 3));
    
    // Coherence - how clustered are slow particles
    let connectionCount = 0;
    slowParticles.forEach(p => {
      connectionCount += p.connections?.length || 0;
    });
    state.coherence = Math.min(1, connectionCount / (slowParticles.length * 5));
    
    // Phase transitions
    if (!state.transitionPending) {
      if (state.entropy < 0.2 && state.coherence > 0.6 && state.currentPhase !== 'crystallizing') {
        state.currentPhase = 'crystallizing';
        state.transitionPending = true;
        setTimeout(() => { state.transitionPending = false; }, 3000);
      } else if (state.entropy > 0.7 && state.coherence < 0.3 && state.currentPhase !== 'dissolving') {
        state.currentPhase = 'dissolving';
        state.transitionPending = true;
        setTimeout(() => { state.transitionPending = false; }, 3000);
      } else if (state.entropy > 0.3 && state.entropy < 0.5 && state.coherence > 0.4 && state.currentPhase !== 'flowing') {
        state.currentPhase = 'flowing';
        state.transitionPending = true;
        setTimeout(() => { state.transitionPending = false; }, 3000);
      } else if (state.emergentForms.length > 3 && state.currentPhase !== 'dreaming') {
        state.currentPhase = 'dreaming';
        state.transitionPending = true;
        setTimeout(() => { state.transitionPending = false; }, 5000);
      }
    }
  };

  const update = useCallback((width, height) => {
    const state = stateRef.current;
    const centerX = width / 2;
    const centerY = height / 2;
    
    state.time++;
    state.breath += 0.008;
    
    const breathScale = Math.sin(state.breath) * 0.3 + 1;
    
    // Update deep field
    updateDeepField(state, width, height, state.time);
    
    // Update attractors
    state.attractors.forEach(att => {
      att.phase += 0.002 * att.rhythm;
      att.breathPhase += 0.01 * att.rhythm;
      
      // Attractors wander
      const fieldVec = getFieldVector(state, att.x, att.y);
      att.vx += Math.cos(fieldVec.angle) * 0.01 * fieldVec.magnitude;
      att.vy += Math.sin(fieldVec.angle) * 0.01 * fieldVec.magnitude;
      
      // Return home tendency
      att.vx += (att.homeX - att.x) * 0.001;
      att.vy += (att.homeY - att.y) * 0.001;
      
      att.x += att.vx;
      att.y += att.vy;
      att.vx *= 0.95;
      att.vy *= 0.95;
      
      // Breathing
      att.currentSize = att.size * (1 + Math.sin(att.breathPhase) * 0.2) * breathScale;
    });
    
    // Update particles
    state.particles.forEach((p, pi) => {
      p.age++;
      p.life = 1 - (p.age / p.maxLife);
      
      if (p.life <= 0) {
        // Rebirth
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 150;
        p.x = centerX + Math.cos(angle) * radius;
        p.y = centerY + Math.sin(angle) * radius;
        p.vx = (Math.random() - 0.5) * (p.type === 'fast' ? 3 : 0.5);
        p.vy = (Math.random() - 0.5) * (p.type === 'fast' ? 3 : 0.5);
        p.age = 0;
        p.life = 1;
        p.memory = new Array(state.attractors.length).fill(0);
        p.trail = [];
      }
      
      // Flow field influence
      const fieldVec = getFieldVector(state, p.x, p.y);
      const fieldStrength = p.type === 'fast' ? 0.3 : 0.1;
      p.vx += Math.cos(fieldVec.angle) * fieldVec.magnitude * fieldStrength;
      p.vy += Math.sin(fieldVec.angle) * fieldVec.magnitude * fieldStrength;
      
      // Attractor influence
      state.attractors.forEach((att, ai) => {
        const dx = att.x - p.x;
        const dy = att.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < att.currentSize * 3) {
          let force = att.strength * 0.0005 * (1 - dist / (att.currentSize * 3));
          
          // Different attractor behaviors
          if (att.type === 'void') {
            force *= -0.5; // Repel slightly
          } else if (att.type === 'spiral') {
            // Add tangential force
            p.vx += (-dy / dist) * force * 2;
            p.vy += (dx / dist) * force * 2;
          } else if (att.type === 'pulse') {
            force *= Math.sin(att.phase * 3) * 0.5 + 0.5;
          }
          
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
          
          // Memory
          p.memory[ai] = Math.min(1, p.memory[ai] + 0.005);
          
          // Mark field memory
          const col = Math.floor(p.x / state.deepField.resolution);
          const row = Math.floor(p.y / state.deepField.resolution);
          if (state.deepField.field[row]?.[col]) {
            state.deepField.field[row][col].memory += 0.01;
          }
        } else {
          p.memory[ai] *= 0.998;
        }
      });
      
      // Slow particles connect
      if (p.type === 'slow') {
        p.connections = [];
        state.particles.forEach((other, oi) => {
          if (pi === oi || other.type !== 'slow') return;
          const dx = other.x - p.x;
          const dy = other.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            p.connections.push({ particle: other, strength: 1 - dist / 80 });
            // Gentle cohesion
            p.vx += (dx / dist) * 0.003;
            p.vy += (dy / dist) * 0.003;
          }
        });
      }
      
      // Boundary
      const distFromCenter = Math.sqrt((p.x - centerX) ** 2 + (p.y - centerY) ** 2);
      const boundaryRadius = 250 * breathScale;
      if (distFromCenter > boundaryRadius) {
        const angle = Math.atan2(p.y - centerY, p.x - centerX);
        const overflow = distFromCenter - boundaryRadius;
        p.vx -= Math.cos(angle) * overflow * 0.005;
        p.vy -= Math.sin(angle) * overflow * 0.005;
      }
      
      // Apply velocity
      const maxSpeed = p.type === 'fast' ? 4 : 1.5;
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > maxSpeed) {
        p.vx = (p.vx / speed) * maxSpeed;
        p.vy = (p.vy / speed) * maxSpeed;
      }
      
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= p.type === 'fast' ? 0.98 : 0.99;
      p.vy *= p.type === 'fast' ? 0.98 : 0.99;
      
      // Trail for fast particles
      if (p.type === 'fast' && state.time % 2 === 0) {
        p.trail.push({ x: p.x, y: p.y, age: 0 });
        if (p.trail.length > 20) p.trail.shift();
      }
      p.trail?.forEach(t => t.age++);
    });
    
    // Update mycelium
    updateMycelium(state, centerX, centerY);
    
    // Detect emergent forms
    if (state.time % 30 === 0) {
      detectEmergentForms(state, centerX, centerY);
    }
    
    // Check phase transitions
    if (state.time % 60 === 0) {
      checkPhaseTransition(state);
    }
    
    // Update ripples
    state.ripples = state.ripples.filter(r => {
      r.radius += r.speed;
      r.life -= 0.02;
      return r.life > 0;
    });
  }, []);

  const renderDeepLayer = useCallback((ctx, width, height) => {
    const state = stateRef.current;
    
    // Dark base with phase-dependent tint
    let bgHue = 240;
    if (state.currentPhase === 'crystallizing') bgHue = 200;
    else if (state.currentPhase === 'dissolving') bgHue = 280;
    else if (state.currentPhase === 'dreaming') bgHue = 260;
    
    ctx.fillStyle = `hsla(${bgHue}, 30%, 5%, 0.1)`;
    ctx.fillRect(0, 0, width, height);
    
    // Flow field visualization (very subtle)
    if (state.deepField) {
      const { field, resolution, cols, rows } = state.deepField;
      
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const cell = field[y][x];
          if (cell.memory > 0.1) {
            const px = x * resolution + resolution / 2;
            const py = y * resolution + resolution / 2;
            
            ctx.beginPath();
            ctx.arc(px, py, cell.memory * 8, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${bgHue + 40}, 50%, 30%, ${cell.memory * 0.3})`;
            ctx.fill();
          }
        }
      }
    }
  }, []);

  const renderMainLayer = useCallback((ctx, width, height) => {
    const state = stateRef.current;
    
    // Clear with transparency
    ctx.clearRect(0, 0, width, height);
    
    // Draw mycelium networks
    state.mycelium.forEach(network => {
      ctx.strokeStyle = `hsla(${network.hue}, 40%, 40%, 0.4)`;
      ctx.lineWidth = 1;
      
      network.nodes.forEach(node => {
        if (node.parent && node.alive) {
          ctx.beginPath();
          ctx.moveTo(node.parent.x, node.parent.y);
          ctx.lineTo(node.x, node.y);
          ctx.stroke();
        }
        
        // Node points
        if (node.alive) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${network.hue}, 60%, 50%, 0.6)`;
          ctx.fill();
        }
      });
    });
    
    // Draw slow particle connections
    state.particles.filter(p => p.type === 'slow').forEach(p => {
      p.connections?.forEach(conn => {
        // Blend hues based on memory
        let hue = 0, totalMem = 0;
        p.memory.forEach((m, i) => {
          hue += (state.attractors[i]?.hue || 0) * m;
          totalMem += m;
        });
        hue = totalMem > 0 ? hue / totalMem : 200;
        
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(conn.particle.x, conn.particle.y);
        ctx.strokeStyle = `hsla(${hue}, 60%, 50%, ${conn.strength * 0.5 * p.life})`;
        ctx.lineWidth = conn.strength * 3;
        ctx.stroke();
      });
    });
    
    // Draw attractors (subtle presence)
    state.attractors.forEach(att => {
      const gradient = ctx.createRadialGradient(att.x, att.y, 0, att.x, att.y, att.currentSize);
      gradient.addColorStop(0, `hsla(${att.hue}, 70%, 50%, 0.15)`);
      gradient.addColorStop(0.5, `hsla(${att.hue}, 60%, 40%, 0.08)`);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(att.x, att.y, att.currentSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Attractor type indicator
      if (att.type === 'spiral') {
        ctx.beginPath();
        for (let t = 0; t < Math.PI * 4; t += 0.1) {
          const r = t * 3;
          const x = att.x + Math.cos(t + att.phase) * r;
          const y = att.y + Math.sin(t + att.phase) * r;
          if (t === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `hsla(${att.hue}, 70%, 60%, 0.2)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });
    
    // Draw emergent forms
    state.emergentForms.forEach(form => {
      const pulse = Math.sin(form.pulsePhase) * 0.3 + 0.7;
      const alpha = (1 - form.age / form.maxAge) * 0.5;
      
      const gradient = ctx.createRadialGradient(form.x, form.y, 0, form.x, form.y, form.size * pulse);
      gradient.addColorStop(0, `hsla(${form.hue}, 80%, 60%, ${alpha})`);
      gradient.addColorStop(0.5, `hsla(${form.hue}, 70%, 50%, ${alpha * 0.5})`);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(form.x, form.y, form.size * pulse, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw slow particles
    state.particles.filter(p => p.type === 'slow').forEach(p => {
      let hue = 0, totalMem = 0;
      p.memory.forEach((m, i) => {
        hue += (state.attractors[i]?.hue || 0) * m;
        totalMem += m;
      });
      hue = totalMem > 0 ? hue / totalMem : 200;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${p.life * 0.8})`;
      ctx.fill();
      
      // Glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2 * p.life, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${p.life * 0.2})`;
      ctx.fill();
    });
  }, []);

  const renderSurfaceLayer = useCallback((ctx, width, height) => {
    const state = stateRef.current;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw fast particles with trails
    state.particles.filter(p => p.type === 'fast').forEach(p => {
      let hue = 0, totalMem = 0;
      p.memory.forEach((m, i) => {
        hue += (state.attractors[i]?.hue || 0) * m;
        totalMem += m;
      });
      hue = totalMem > 0 ? hue / totalMem : 200;
      
      // Trail
      if (p.trail && p.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(p.trail[0].x, p.trail[0].y);
        for (let i = 1; i < p.trail.length; i++) {
          ctx.lineTo(p.trail[i].x, p.trail[i].y);
        }
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `hsla(${hue}, 70%, 70%, ${p.life * 0.3})`;
        ctx.lineWidth = p.size * 0.5;
        ctx.stroke();
      }
      
      // Particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, 80%, 80%, ${p.life * 0.7})`;
      ctx.fill();
    });
    
    // Draw ripples
    state.ripples.forEach(r => {
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${r.hue}, 70%, 60%, ${r.life * 0.5})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    });
    
    // Phase indicator (subtle)
    const phaseColors = {
      flowing: 'hsla(200, 60%, 50%, 0.5)',
      crystallizing: 'hsla(180, 70%, 60%, 0.5)',
      dissolving: 'hsla(280, 60%, 50%, 0.5)',
      dreaming: 'hsla(260, 70%, 60%, 0.5)',
    };
    
    ctx.fillStyle = phaseColors[state.currentPhase] || phaseColors.flowing;
    ctx.beginPath();
    ctx.arc(width - 20, 20, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Coherence/entropy bars
    ctx.fillStyle = `hsla(${state.coherence * 120}, 60%, 50%, 0.4)`;
    ctx.fillRect(10, height - 8, (width / 2 - 15) * state.coherence, 4);
    
    ctx.fillStyle = `hsla(${(1 - state.entropy) * 120 + 240}, 60%, 50%, 0.4)`;
    ctx.fillRect(width / 2 + 5, height - 8, (width / 2 - 15) * state.entropy, 4);
  }, []);

  const handleInteraction = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const state = stateRef.current;
    
    // Create ripple
    state.ripples.push({
      x, y,
      radius: 0,
      speed: 3,
      life: 1,
      hue: Math.random() * 360,
    });
    
    // Perturb nearby particles
    state.particles.forEach(p => {
      const dx = p.x - x;
      const dy = p.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (1 - dist / 100) * 5;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }
    });
    
    // Nudge nearby attractors
    state.attractors.forEach(att => {
      const dx = att.x - x;
      const dy = att.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        const force = (1 - dist / 150) * 2;
        att.vx += (dx / dist) * force;
        att.vy += (dy / dist) * force;
      }
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const deepCanvas = deepCanvasRef.current;
    const surfaceCanvas = surfaceCanvasRef.current;
    
    const width = 700;
    const height = 700;
    
    canvas.width = deepCanvas.width = surfaceCanvas.width = width;
    canvas.height = deepCanvas.height = surfaceCanvas.height = height;
    
    const ctx = canvas.getContext('2d');
    const deepCtx = deepCanvas.getContext('2d');
    const surfaceCtx = surfaceCanvas.getContext('2d');
    
    // Initial dark fill
    deepCtx.fillStyle = 'hsl(240, 30%, 5%)';
    deepCtx.fillRect(0, 0, width, height);
    
    initializeSystem(width, height);
    
    const animate = () => {
      update(width, height);
      renderDeepLayer(deepCtx, width, height);
      renderMainLayer(ctx, width, height);
      renderSurfaceLayer(surfaceCtx, width, height);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initializeSystem, update, renderDeepLayer, renderMainLayer, renderSurfaceLayer]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-8">
      <div 
        className="relative"
        style={{ width: 700, height: 700 }}
      >
        {/* Deep layer - structural, slow */}
        <canvas
          ref={deepCanvasRef}
          className="absolute inset-0 rounded-2xl"
          style={{ zIndex: 1 }}
        />
        {/* Main layer - ecology */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 rounded-2xl"
          style={{ zIndex: 2 }}
        />
        {/* Surface layer - fast, ephemeral */}
        <canvas
          ref={surfaceCanvasRef}
          onClick={handleInteraction}
          className="absolute inset-0 rounded-2xl cursor-crosshair"
          style={{ 
            zIndex: 3,
            boxShadow: '0 0 80px rgba(100, 80, 150, 0.3), inset 0 0 100px rgba(0, 0, 0, 0.5)',
          }}
        />
      </div>
      
      <div className="mt-6 text-center max-w-lg">
        <p className="text-gray-500 text-sm">
          click to perturb — watch phase transitions emerge
        </p>
        <p className="text-gray-600 text-xs mt-2">
          coherence ← | → entropy
        </p>
      </div>
    </div>
  );
};

export default TeleodynamicSignature;
