import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function GeometricShapesEffect({ colors }: { colors: string[] }) {
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

    float circle(vec2 uv, vec2 center, float radius) {
      return 1.0 - smoothstep(radius - 0.01, radius + 0.01, length(uv - center));
    }

    float triangle(vec2 uv, vec2 center, float size) {
      vec2 q = abs(uv - center) * 2.0;
      return max(q.x * 0.866025 + q.y * 0.5, q.y) - size;
    }

    float square(vec2 uv, vec2 center, float size) {
      vec2 q = abs(uv - center);
      return max(q.x, q.y) - size;
    }

    float pentagon(vec2 uv, vec2 center, float size) {
      vec2 q = abs(uv - center);
      float angle = atan(q.y, q.x) + 0.2;
      float radius = 0.5 * size / cos(3.141592 / 5.0);
      vec2 p = vec2(radius * cos(angle), radius * sin(angle));
      return length(q - p) - 0.02;
    }

    void main() {
      vec2 uv = vUv - 0.5;
      
      float circleShape = circle(uv, vec2(sin(uTime * 0.5) * 0.3, cos(uTime * 0.7) * 0.3), 0.1);
      float triangleShape = 1.0 - smoothstep(0.0, 0.01, triangle(uv, vec2(cos(uTime * 0.6) * 0.3, sin(uTime * 0.8) * 0.3), 0.1));
      float squareShape = 1.0 - smoothstep(0.0, 0.01, square(uv, vec2(sin(uTime * 0.9) * 0.3, cos(uTime * 0.5) * 0.3), 0.1));
      float pentagonShape = 1.0 - smoothstep(0.0, 0.01, pentagon(uv, vec2(cos(uTime * 0.7) * 0.3, sin(uTime * 0.6) * 0.3), 0.1));
      
      float shapeMix = max(max(circleShape, triangleShape), max(squareShape, pentagonShape));
      
      vec3 color1 = mix(uColor1, uColor2, circleShape);
      vec3 color2 = mix(uColor2, uColor3, triangleShape);
      vec3 color3 = mix(uColor3, uColor4, squareShape);
      vec3 color4 = mix(uColor4, uColor5, pentagonShape);
      
      vec3 finalColor = mix(
        mix(color1, color2, uv.x + 0.5),
        mix(color3, color4, uv.y + 0.5),
        (sin(uTime) * 0.5 + 0.5)
      );
      
      finalColor = mix(finalColor, uColor5, pow(shapeMix, 3.0));
      
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

