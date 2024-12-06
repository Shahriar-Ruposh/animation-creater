"use client";

import { Canvas } from "@react-three/fiber";
import { useAnimationStore } from "../store/animationStore";
import { OrthographicCamera } from "@react-three/drei";
import SmokeEffect from "./animations/SmokeEffect";
import ParticleEffect from "./animations/ParticleEffect";
import WaveEffect from "./animations/WaveEffect";
import VortexEffect from "./animations/VortexEffect";
import GlitterEffect from "./animations/GlitterEffect";
import LensFlareEffect from "./animations/LensFlareEffect";
import WavePulsationEffect from "./animations/WavePulsationEffect";
import GeometricShapesEffect from "./animations/GeometricShapesEffect";
import SlowMotionEffect from "./animations/SlowMotionEffect";
import EnergyBurstEffect from "./animations/EnergyBurstEffect";
import ShimmeringLightEffect from "./animations/ShimmeringLightEffect";
import GradientAnimationEffect from "./animations/GradientAnimationEffect";
import FluidGradientAnimation from "./animations/FluidGradientAnimation";
import FluidJarGradient from "./animations/FluidJarGradient";

export default function AnimationDisplay() {
  const { colors, animationType } = useAnimationStore();

  const getAnimation = () => {
    switch (animationType) {
      case "Smoke Effects":
        return <SmokeEffect colors={colors} />;
      case "Particle Effects":
        return <ParticleEffect colors={colors} />;
      case "Wave-Like Flow":
        return <WaveEffect colors={colors} />;
      case "Swirling Vortex":
        return <VortexEffect colors={colors} />;
      case "Glitter and Sparkle":
        return <GlitterEffect colors={colors} />;
      case "Lens Flares and Glows":
        return <LensFlareEffect colors={colors} />;
      case "Wave Pulsation":
        return <WavePulsationEffect colors={colors} />;
      case "Geometric Shapes":
        return <GeometricShapesEffect colors={colors} />;
      case "Slow-Motion Effects":
        return <SlowMotionEffect colors={colors} />;
      case "Energy Burst":
        return <EnergyBurstEffect colors={colors} />;
      case "Shimmering Light":
        return <ShimmeringLightEffect colors={colors} />;
      case "Gradient Animation":
        return <GradientAnimationEffect colors={colors} />;
      case "Fluid Gradient Animation":
        return <FluidGradientAnimation colors={colors} />;
      case "Fluid Jar Gradient":
        return <FluidJarGradient colors={colors} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full">
      <Canvas gl={{ antialias: true }} dpr={[1, 2]} camera={{ position: [0, 0, 1] }} style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, background: "black" }}>
        <ambientLight />
        {getAnimation()}
      </Canvas>
    </div>
  );
}
