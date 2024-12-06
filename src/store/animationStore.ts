import { create } from 'zustand'

type AnimationStore = {
  colors: string[]
  animationType: string
  updateAnimation: (colors: string[], animationType: string) => void
}

export const useAnimationStore = create<AnimationStore>((set) => ({
  colors: ['#FF00FF', '#800080', '#0000FF', '#00FFFF', '#FF69B4'],
  animationType: 'Smoke Effects',
  updateAnimation: (colors, animationType) => set({ colors, animationType }),
}))

