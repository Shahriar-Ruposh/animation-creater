import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function WaveEffect({ colors }: { colors: string[] }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec3 uColor4;
    uniform vec3 uColor5;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      float wave1 = sin(uv.x * 10.0 + uTime) * 0.5 + 0.5;
      float wave2 = sin(uv.x * 15.0 - uTime * 1.2) * 0.5 + 0.5;
      float wave3 = sin(uv.x * 20.0 + uTime * 0.8) * 0.5 + 0.5;
      float wave4 = sin(uv.x * 25.0 - uTime * 1.5) * 0.5 + 0.5;

      vec3 color1 = mix(uColor1, uColor2, wave1);
      vec3 color2 = mix(uColor2, uColor3, wave2);
      vec3 color3 = mix(uColor3, uColor4, wave3);
      vec3 color4 = mix(uColor4, uColor5, wave4);

      float t = uv.y;
      vec3 finalColor = mix(
        mix(color1, color2, t),
        mix(color3, color4, t),
        t
      );

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[5, 5, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uColor1: { value: new THREE.Color(colors[0]) },
          uColor2: { value: new THREE.Color(colors[1]) },
          uColor3: { value: new THREE.Color(colors[2]) },
          uColor4: { value: new THREE.Color(colors[3]) },
          uColor5: { value: new THREE.Color(colors[4]) },
        }}
      />
    </mesh>
  );
}
