import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function VeinFlow({ start, end }: { start: [number, number, number], end: [number, number, number] }) {
  const points = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...start),
      new THREE.Vector3(
        (start[0] + end[0]) / 2 + (Math.random() - 0.5) * 2, // Jitter mid point
        (start[1] + end[1]) / 2 + (Math.random() - 0.5) * 2,
        (start[2] + end[2]) / 2 + (Math.random() - 0.5) * 2
      ),
      new THREE.Vector3(...end)
    ]);
    return curve.getPoints(20);
  }, [start, end]);

  const matRef = useRef<any>(null);

  useFrame((state, delta) => {
    if (matRef.current) {
      // Flow animation
      matRef.current.dashOffset -= delta * 0.5;
    }
  });

  return (
    <Line
      points={points}
      color="#9d8fff"
      lineWidth={0.2}
      dashed
      dashScale={2}
      dashSize={1}
      gapSize={0.5}
      ref={matRef}
    />
  );
}
