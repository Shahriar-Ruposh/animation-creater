import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function GradientAnimationEffect({ colors }: { colors: string[] }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * 0.2
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

    vec3 getGradientColor(vec2 uv) {
      float diagonalPos = (uv.x + uv.y) * 0.5;
      float t = fract(diagonalPos - uTime * 0.1);
      
      vec3 color = mix(uColor1, uColor2, smoothstep(0.0, 0.3, t));
      color = mix(color, uColor3, smoothstep(0.3, 0.5, t));
      color = mix(color, uColor4, smoothstep(0.5, 0.7, t));
      color = mix(color, uColor5, smoothstep(0.7, 1.0, t));
      
      vec2 center = vec2(0.5);
      float radius = length(uv - center);
      float radialGradient = smoothstep(1.0, 0.0, radius * 1.5);
      
      return mix(color, color * 1.2, radialGradient);
    }

    void main() {
      vec3 gradientColor = getGradientColor(vUv);
      float pulseEffect = sin(uTime * 0.5) * 0.05 + 0.95;
      gradientColor *= pulseEffect;
      
      float noise = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453);
      gradientColor += noise * 0.02;

      gl_FragColor = vec4(gradientColor, 1.0);
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

