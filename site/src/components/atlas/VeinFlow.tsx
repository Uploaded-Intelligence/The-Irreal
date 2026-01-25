import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

interface VeinFlowProps {
  start: [number, number, number];
  end: [number, number, number];
}

export function VeinFlow({ start, end }: VeinFlowProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lineRef = useRef<any>(null);

  const points = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const mid = startVec.clone().lerp(endVec, 0.5);
    // Add random offset to midpoint for organic curve
    mid.x += (Math.random() - 0.5) * 2;
    mid.y += (Math.random() - 0.5) * 2;
    mid.z += (Math.random() - 0.5) * 2;

    const curve = new THREE.CatmullRomCurve3([startVec, mid, endVec]);
    return curve.getPoints(20);
  }, [start, end]);

  useFrame((_, delta) => {
    if (lineRef.current?.material) {
      // Access dashOffset from the line material
      const mat = lineRef.current.material;
      if (mat && typeof mat.dashOffset === 'number') {
        mat.dashOffset -= delta * 0.5;
      }
    }
  });

  return (
    <Line
      ref={lineRef as any}
      points={points}
      color="#6bc5ff"
      lineWidth={1}
      dashed
      dashSize={0.3}
      gapSize={0.2}
    />
  );
}
