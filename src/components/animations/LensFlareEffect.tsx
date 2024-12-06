import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function LensFlareEffect({ colors }: { colors: string[] }) {
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

    float circle(vec2 uv, vec2 center, float radius, float softness) {
      float d = length(uv - center);
      return 1.0 - smoothstep(radius - softness, radius, d);
    }

    void main() {
      vec2 uv = vUv - 0.5;
      
      // Main lens flare
      float flare1 = circle(uv, vec2(0.0), 0.1, 0.05);
      float flare2 = circle(uv, vec2(0.2, 0.0), 0.05, 0.02);
      float flare3 = circle(uv, vec2(-0.2, 0.0), 0.05, 0.02);
      float flare4 = circle(uv, vec2(0.0, 0.2), 0.05, 0.02);
      float flare5 = circle(uv, vec2(0.0, -0.2), 0.05, 0.02);
      
      // Glow
      float glow = circle(uv, vec2(0.0), 0.3, 0.2);
      
      // Animate flare position
      vec2 flarePos = vec2(sin(uTime) * 0.2, cos(uTime) * 0.2);
      float animatedFlare = circle(uv, flarePos, 0.1, 0.05);

      float totalFlare = max(max(max(max(flare1, flare2), flare3), max(flare4, flare5)), animatedFlare);
      
      vec3 color1 = mix(uColor1, uColor2, totalFlare);
      vec3 color2 = mix(uColor2, uColor3, glow);
      vec3 color3 = mix(uColor3, uColor4, animatedFlare);
      
      vec3 finalColor = mix(
        mix(color1, color2, uv.x + 0.5),
        mix(color2, color3, uv.y + 0.5),
        (sin(uTime) * 0.5 + 0.5)
      );
      
      finalColor = mix(finalColor, uColor5, pow(max(totalFlare, glow), 3.0));
      
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
        transparent={true}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

