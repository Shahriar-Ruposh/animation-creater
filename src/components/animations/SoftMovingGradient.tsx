import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function SoftMovingGradient({ colors }: { colors: string[] }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * 0.05
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

    vec3 rgb2hsv(vec3 c) {
      vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
      vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
      vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
      float d = q.x - min(q.w, q.y);
      float e = 1.0e-10;
      return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }

    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    void main() {
      vec2 uv = vUv;
      
      // Create a soft, moving gradient
      float t = fract(uTime * 0.1 + uv.x * 0.7 + uv.y * 0.3);
      
      // Interpolate between the five colors
      vec3 color;
      if (t < 0.25) {
        color = mix(uColor1, uColor2, smoothstep(0.0, 0.25, t) * 4.0);
      } else if (t < 0.5) {
        color = mix(uColor2, uColor3, smoothstep(0.25, 0.5, t) * 4.0 - 1.0);
      } else if (t < 0.75) {
        color = mix(uColor3, uColor4, smoothstep(0.5, 0.75, t) * 4.0 - 2.0);
      } else {
        color = mix(uColor4, uColor5, smoothstep(0.75, 1.0, t) * 4.0 - 3.0);
      }
      
      // Convert to HSV for smoother transitions
      vec3 hsvColor = rgb2hsv(color);
      
      // Add some subtle variation
      hsvColor.x += sin(uTime * 0.2 + uv.x * 10.0) * 0.02;
      hsvColor.y += cos(uTime * 0.3 + uv.y * 8.0) * 0.02;
      
      // Convert back to RGB
      vec3 finalColor = hsv2rgb(hsvColor);
      
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

