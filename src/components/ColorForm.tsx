"use client";

import { useState } from "react";
import { useAnimationStore } from "../store/animationStore";

const animationTypes = [
  "Smoke Effects",
  "Particle Effects",
  "Wave-Like Flow",
  "Swirling Vortex",
  "Glitter and Sparkle",
  "Lens Flares and Glows",
  "Wave Pulsation",
  "Geometric Shapes",
  "Slow-Motion Effects",
  "Energy Burst",
  "Shimmering Light",
  "Gradient Animation",
  "Fluid Gradient Animation",
  "Fluid Jar Gradient",
];

export default function ColorForm() {
  const [colors, setColors] = useState(["#FF00FF", "#800080", "#0000FF", "#00FFFF", "#FF69B4"]);
  const [animationType, setAnimationType] = useState(animationTypes[0]);
  const updateAnimation = useAnimationStore((state) => state.updateAnimation);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAnimation(colors, animationType);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
      <div className="flex-grow flex flex-wrap gap-2">
        {colors.map((color, index) => (
          <div key={index} className="flex-grow">
            <label htmlFor={`color-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
              Color {index + 1}
            </label>
            <input
              type="color"
              id={`color-${index}`}
              value={color}
              onChange={(e) => {
                const newColors = [...colors];
                newColors[index] = e.target.value;
                setColors(newColors);
              }}
              className="w-full h-8 rounded-md"
            />
          </div>
        ))}
      </div>
      <div className="flex-grow min-w-[200px]">
        <label htmlFor="animation-type" className="block text-sm font-medium text-gray-700 mb-1">
          Animation Type
        </label>
        <select id="animation-type" value={animationType} onChange={(e) => setAnimationType(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
          {animationTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
        Generate Animation
      </button>
    </form>
  );
}
