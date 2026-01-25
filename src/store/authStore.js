import { create } from 'zustand'
import { adminUser } from '../data/mockData'

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  login: (email, password) => {
    // Simulacion de login - siempre exitoso con datos mock
    set({ user: adminUser, isAuthenticated: true })
    return true
  },

  logout: () => {
    set({ user: null, isAuthenticated: false })
  },

  updateProfile: (data) => {
    set((state) => ({
      user: { ...state.user, ...data }
    }))
  }
}))
