import { create } from 'zustand'
import { api } from '@/lib/api'

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  init: async () => {
    const token = localStorage.getItem('proveedor_token')
    if (!token) return
    try {
      const user = await api.get('/auth/profile')
      set({ user, isAuthenticated: true })
    } catch {
      localStorage.removeItem('proveedor_token')
    }
  },

  login: async (email, password) => {
    const data = await api.post('/auth/proveedor/login', { email, password })
    localStorage.setItem('proveedor_token', data.token)
    set({ user: data.user, isAuthenticated: true })
    return data.user
  },

  confirmPasswordChanged: async (newPassword) => {
    await api.post('/auth/proveedor/change-password', { newPassword })
    set((state) => ({ user: { ...state.user, mustChangePassword: false } }))
  },

  logout: () => {
    localStorage.removeItem('proveedor_token')
    set({ user: null, isAuthenticated: false })
  },

  updateProfile: (data) => {
    set((state) => ({ user: { ...state.user, ...data } }))
  }
}))
