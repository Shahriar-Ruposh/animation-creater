import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function FluidGradientAnimation({ colors }: { colors: string[] }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * 0.5
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

    // Simplex 2D noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    vec3 getFluidColor(vec2 uv) {
      float noise1 = snoise(uv * 3.0 + uTime * 0.1) * 0.5 + 0.5;
      float noise2 = snoise(uv * 2.0 - uTime * 0.15) * 0.5 + 0.5;
      float noise3 = snoise(uv * 4.0 + uTime * 0.2) * 0.5 + 0.5;

      vec3 color1 = mix(uColor1, uColor2, smoothstep(0.0, 0.33, noise1));
      vec3 color2 = mix(uColor2, uColor3, smoothstep(0.33, 0.66, noise2));
      vec3 color3 = mix(uColor3, uColor4, smoothstep(0.66, 1.0, noise3));

      vec3 finalColor = mix(
        mix(color1, color2, noise1),
        mix(color2, color3, noise2),
        noise3
      );

      // Add subtle variation with the 5th color
      finalColor = mix(finalColor, uColor5, noise1 * noise2 * noise3 * 0.2);

      return finalColor;
    }

    void main() {
      vec2 uv = vUv;
      
      // Create fluid-like distortion
      float distortion = snoise(uv * 2.0 + uTime * 0.1) * 0.1;
      uv += distortion;

      vec3 fluidColor = getFluidColor(uv);

      // Add subtle shimmering effect
      float shimmer = snoise(uv * 10.0 + uTime) * 0.05 + 0.95;
      fluidColor *= shimmer;

      gl_FragColor = vec4(fluidColor, 1.0);
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

