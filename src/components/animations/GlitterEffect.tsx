import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function GlitterEffect({ colors }: { colors: string[] }) {
  const particlesRef = useRef<THREE.Points>(null!)
  const particleCount = 1000

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 10
    }
    return pos
  }, [particleCount])

  const colorArray = useMemo(() => {
    const color = new Float32Array(particleCount * 3)
    const colorObj = new THREE.Color()
    for (let i = 0; i < particleCount; i++) {
      colorObj.set(colors[Math.floor(Math.random() * colors.length)])
      color[i * 3] = colorObj.r
      color[i * 3 + 1] = colorObj.g
      color[i * 3 + 2] = colorObj.b
    }
    return color
  }, [colors])

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        positions[i3 + 1] = Math.sin(state.clock.elapsedTime + i * 0.1) * 0.2
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colorArray}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors />
    </points>
  )
}

