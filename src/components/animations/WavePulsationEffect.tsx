import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function WavePulsationEffect({ colors }: { colors: string[] }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec3 uColor4;
    uniform vec3 uColor5;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv - 0.5;
      float dist = length(uv);
      
      float wave1 = sin(dist * 20.0 - uTime * 2.0) * 0.5 + 0.5;
      float wave2 = sin(dist * 15.0 - uTime * 1.5) * 0.5 + 0.5;
      float wave3 = sin(dist * 10.0 - uTime * 1.0) * 0.5 + 0.5;
      
      float pulse1 = (sin(uTime * 3.0) * 0.5 + 0.5) * 0.5 + 0.5;
      float pulse2 = (sin(uTime * 2.5 + 1.0) * 0.5 + 0.5) * 0.5 + 0.5;
      float pulse3 = (sin(uTime * 2.0 + 2.0) * 0.5 + 0.5) * 0.5 + 0.5;
      
      float intensity1 = wave1 * pulse1;
      float intensity2 = wave2 * pulse2;
      float intensity3 = wave3 * pulse3;
      
      vec3 color1 = mix(uColor1, uColor2, intensity1);
      vec3 color2 = mix(uColor2, uColor3, intensity2);
      vec3 color3 = mix(uColor3, uColor4, intensity3);
      
      vec3 finalColor = mix(
        mix(color1, color2, uv.x + 0.5),
        mix(color2, color3, uv.y + 0.5),
        (sin(uTime) * 0.5 + 0.5)
      );
      
      finalColor = mix(finalColor, uColor5, pow(max(intensity1, max(intensity2, intensity3)), 3.0));
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `

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
  )
}

