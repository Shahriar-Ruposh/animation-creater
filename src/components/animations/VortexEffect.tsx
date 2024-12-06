import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function VortexEffect({ colors }: { colors: string[] }) {
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
      float r = length(uv);
      float angle = atan(uv.y, uv.x) + uTime;
      
      float vortex1 = sin(r * 10.0 - angle * 5.0) * 0.5 + 0.5;
      float vortex2 = sin(r * 15.0 - angle * 7.0) * 0.5 + 0.5;
      float vortex3 = sin(r * 20.0 - angle * 9.0) * 0.5 + 0.5;
      float vortex4 = sin(r * 25.0 - angle * 11.0) * 0.5 + 0.5;

      vec3 color1 = mix(uColor1, uColor2, vortex1);
      vec3 color2 = mix(uColor2, uColor3, vortex2);
      vec3 color3 = mix(uColor3, uColor4, vortex3);
      vec3 color4 = mix(uColor4, uColor5, vortex4);

      vec3 finalColor = mix(
        mix(color1, color2, 0.5),
        mix(color3, color4, 0.5),
        0.5
      );

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

