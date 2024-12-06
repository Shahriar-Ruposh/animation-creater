import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function SlowMotionEffect({ colors }: { colors: string[] }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * 0.1; // Slow down time even more
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

    void main() {
      vec2 uv = vUv;
      
float noise1 = snoise(uv * 4.0 + uTime * 0.1) * 0.5 + 0.5;
float noise2 = snoise(uv * 5.0 - uTime * 0.15) * 0.5 + 0.5;
float noise3 = snoise(uv * 6.0 + uTime * 0.2) * 0.5 + 0.5;
float noise4 = snoise(uv * 7.0 - uTime * 0.25) * 0.5 + 0.5;
      
      vec3 color1 = mix(uColor1, uColor2, smoothstep(0.0, 0.5, noise1));
      vec3 color2 = mix(uColor2, uColor3, smoothstep(0.0, 0.5, noise2));
      vec3 color3 = mix(uColor3, uColor4, smoothstep(0.0, 0.5, noise3));
      vec3 color4 = mix(uColor4, uColor5, smoothstep(0.0, 0.5, noise4));
      
      vec3 finalColor = mix(
        mix(color1, color2, smoothstep(0.0, 0.5, uv.x)),
        mix(color3, color4, smoothstep(0.5, 1.0, uv.x)),
        smoothstep(0.0, 1.0, uv.y)
      );
      
      float alpha = smoothstep(0.4, 0.9, max(noise1, max(noise2, max(noise3, noise4))));  // Increase the threshold

      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[5, 5, 64, 64]} />
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
      />
    </mesh>
  );
}
