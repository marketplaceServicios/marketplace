import { create } from 'zustand'
import { api } from '../lib/api'

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  init: async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) return
    try {
      const user = await api.get('/auth/profile')
      set({ user, isAuthenticated: true })
    } catch {
      localStorage.removeItem('admin_token')
    }
  },

  login: async (email, password) => {
    const data = await api.post('/auth/admin/login', { email, password })
    localStorage.setItem('admin_token', data.token)
    set({ user: data.user, isAuthenticated: true })
    return data.user
  },

  logout: () => {
    localStorage.removeItem('admin_token')
    set({ user: null, isAuthenticated: false })
  },

  updateProfile: async (data) => {
    set((state) => ({ user: { ...state.user, ...data } }))
  }
}))
