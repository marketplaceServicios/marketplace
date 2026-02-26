import { create } from 'zustand'
import { api } from '../lib/api'

export const useExperiencias360Store = create((set) => ({
  experiencias: [],
  loading: false,

  fetchExperiencias: async () => {
    set({ loading: true })
    try {
      const data = await api.get('/admin/experiencias360')
      set({ experiencias: data, loading: false })
    } catch (err) {
      console.error('Error al cargar experiencias 360:', err)
      set({ loading: false })
    }
  },

  createExperiencia: async (datos) => {
    const data = await api.post('/admin/experiencias360', datos)
    set((state) => ({ experiencias: [...state.experiencias, data.experiencia] }))
    return data.experiencia
  },

  updateExperiencia: async (id, datos) => {
    const data = await api.put(`/admin/experiencias360/${id}`, datos)
    set((state) => ({
      experiencias: state.experiencias.map((e) => (e.id === id ? data.experiencia : e))
    }))
  },

  deleteExperiencia: async (id) => {
    await api.delete(`/admin/experiencias360/${id}`)
    set((state) => ({
      experiencias: state.experiencias.filter((e) => e.id !== id)
    }))
  }
}))
