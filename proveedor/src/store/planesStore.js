import { create } from 'zustand'
import { mockPlanes } from '@/data/mockData'

export const usePlanesStore = create((set, get) => ({
  planes: mockPlanes,

  addPlan: (plan) => {
    const newPlan = {
      ...plan,
      id: Date.now(),
      createdAt: new Date().toISOString()
    }
    set((state) => ({
      planes: [...state.planes, newPlan]
    }))
  },

  setPlanPrincipal: (id) => {
    set((state) => ({
      planes: state.planes.map((plan) => ({
        ...plan,
        isPrincipal: plan.id === id
      }))
    }))
  },

  setPlanOferta: (id) => {
    set((state) => ({
      planes: state.planes.map((plan) => ({
        ...plan,
        isOferta: plan.id === id
      }))
    }))
  },

  getPlanesByCategoria: () => {
    const planes = get().planes
    return planes.reduce((acc, plan) => {
      const categoria = plan.categoria
      if (!acc[categoria]) {
        acc[categoria] = []
      }
      acc[categoria].push(plan)
      return acc
    }, {})
  }
}))
