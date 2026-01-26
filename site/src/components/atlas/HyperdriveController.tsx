import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import * as Tone from 'tone';
import { useAtlasStore } from '../../stores/atlasStore';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const DURATIONS = {
  locking: 0.6,    // Turn to face target
  charging: 0.8,   // Energy buildup
  traveling: 0,    // Calculated from distance
  arriving: 0.5,   // Deceleration
  orbiting: 1.5,   // Circle once, then navigate
};

// Faster durations for reduced motion preference
const REDUCED_DURATIONS = {
  locking: 0.2,
  charging: 0.3,
  traveling: 0,
  arriving: 0.2,
  orbiting: 0.5,
};

export function HyperdriveController() {
  const { camera } = useThree();
  const hyperdrive = useAtlasStore((s) => s.hyperdrive);
  const advanceHyperdrive = useAtlasStore((s) => s.advanceHyperdrive);
  const cancelHyperdrive = useAtlasStore((s) => s.cancelHyperdrive);
  const reducedMotion = usePrefersReducedMotion();

  // Use faster durations when reduced motion is preferred
  const durations = reducedMotion ? REDUCED_DURATIONS : DURATIONS;

  const phaseTimer = useRef(0);
  const travelCurve = useRef<THREE.CatmullRomCurve3 | null>(null);
  const travelDuration = useRef(1.5);
  const initialRotation = useRef<THREE.Quaternion>(new THREE.Quaternion());
  const targetRotation = useRef<THREE.Quaternion>(new THREE.Quaternion());

  // Audio refs
  const chargeOsc = useRef<Tone.Oscillator | null>(null);
  const travelSynth = useRef<Tone.Synth | null>(null);

  // Initialize audio
  useEffect(() => {
    chargeOsc.current = new Tone.Oscillator({
      type: 'sine',
      frequency: 80,
    }).toDestination();
    chargeOsc.current.volume.value = -30;

    travelSynth.current = new Tone.Synth({
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.3, decay: 0.5, sustain: 0.4, release: 1.5 },
    }).toDestination();
    travelSynth.current.volume.value = -20;

    return () => {
      chargeOsc.current?.dispose();
      travelSynth.current?.dispose();
    };
  }, []);

  useFrame((state, delta) => {
    const { phase, targetPosition, startPosition } = hyperdrive;

    if (phase === 'idle') {
      phaseTimer.current = 0;
      return;
    }

    phaseTimer.current += delta;

    switch (phase) {
      case 'locking': {
        // Smoothly rotate camera to face target
        if (phaseTimer.current < 0.01 && targetPosition) {
          initialRotation.current.copy(camera.quaternion);
          const lookAtMatrix = new THREE.Matrix4().lookAt(
            camera.position,
            new THREE.Vector3(...targetPosition),
            camera.up
          );
          targetRotation.current.setFromRotationMatrix(lookAtMatrix);
        }

        const lockProgress = Math.min(phaseTimer.current / durations.locking, 1);
        camera.quaternion.slerpQuaternions(
          initialRotation.current,
          targetRotation.current,
          easeOutCubic(lockProgress)
        );

        if (lockProgress >= 1) {
          phaseTimer.current = 0;
          advanceHyperdrive('charging', 0);
          chargeOsc.current?.start();
        }
        break;
      }

      case 'charging': {
        const chargeProgress = Math.min(phaseTimer.current / durations.charging, 1);
        advanceHyperdrive('charging', chargeProgress);

        // Rising pitch during charge
        if (chargeOsc.current) {
          chargeOsc.current.frequency.value = 80 + chargeProgress * 320;
          chargeOsc.current.volume.value = -30 + chargeProgress * 15;
        }

        // Camera shake
        const shake = chargeProgress * 0.03;
        camera.position.x += (Math.random() - 0.5) * shake;
        camera.position.y += (Math.random() - 0.5) * shake;

        if (chargeProgress >= 1) {
          chargeOsc.current?.stop();

          // Build travel curve
          if (startPosition && targetPosition) {
            const start = new THREE.Vector3(...startPosition);
            const end = new THREE.Vector3(...targetPosition);
            const distance = start.distanceTo(end);

            // Arc height proportional to distance
            const mid = start.clone().lerp(end, 0.5);
            mid.y += distance * 0.25;

            // Control points for smooth S-curve
            const cp1 = start.clone().lerp(mid, 0.5);
            cp1.y += distance * 0.15;
            const cp2 = mid.clone().lerp(end, 0.5);
            cp2.y += distance * 0.1;

            travelCurve.current = new THREE.CatmullRomCurve3([start, cp1, mid, cp2, end]);

            // Store travel duration based on distance
            travelDuration.current = Math.max(1.5, distance / 15);
          }

          phaseTimer.current = 0;
          advanceHyperdrive('traveling', 0);
          travelSynth.current?.triggerAttack('C2');
        }
        break;
      }

      case 'traveling': {
        if (!travelCurve.current) break;

        const travelProgress = Math.min(phaseTimer.current / travelDuration.current, 1);
        const easedProgress = easeInOutQuart(travelProgress);

        const point = travelCurve.current.getPoint(easedProgress);
        camera.position.copy(point);

        // Look along the curve tangent
        const tangent = travelCurve.current.getTangent(easedProgress);
        camera.lookAt(camera.position.clone().add(tangent));

        advanceHyperdrive('traveling', travelProgress);

        // Pitch rises during travel
        if (travelSynth.current) {
          const freq = 65 + travelProgress * 130;
          travelSynth.current.frequency.value = freq;
        }

        if (travelProgress >= 1) {
          travelSynth.current?.triggerRelease();
          phaseTimer.current = 0;
          advanceHyperdrive('arriving', 0);
        }
        break;
      }

      case 'arriving': {
        const arriveProgress = Math.min(phaseTimer.current / durations.arriving, 1);
        advanceHyperdrive('arriving', arriveProgress);

        if (arriveProgress >= 1) {
          phaseTimer.current = 0;
          advanceHyperdrive('orbiting', 0);
        }
        break;
      }

      case 'orbiting': {
        if (!targetPosition) break;

        const orbitProgress = phaseTimer.current / durations.orbiting;
        const angle = orbitProgress * Math.PI * 2;
        const orbitRadius = 5;

        const target = new THREE.Vector3(...targetPosition);
        camera.position.set(
          target.x + Math.cos(angle) * orbitRadius,
          target.y + Math.sin(angle * 0.3) * 1.5 + 1,
          target.z + Math.sin(angle) * orbitRadius
        );
        camera.lookAt(target);

        advanceHyperdrive('orbiting', orbitProgress);

        if (orbitProgress >= 1) {
          // Navigate to world
          const nodeId = hyperdrive.targetNodeId;
          cancelHyperdrive();
          if (nodeId) {
            window.location.href = `/world/${nodeId}`;
          }
        }
        break;
      }
    }
  });

  return null;
}

// Easing functions
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutQuart(t: number): number {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}
