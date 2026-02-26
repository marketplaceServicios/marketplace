import { create } from 'zustand'
import { api } from '../lib/api'

export const useEnlacesRapidosStore = create((set) => ({
  enlaces: [],
  loading: false,

  fetchEnlaces: async () => {
    set({ loading: true })
    try {
      const data = await api.get('/admin/enlaces-rapidos')
      set({ enlaces: data, loading: false })
    } catch (err) {
      console.error('Error al cargar enlaces rápidos:', err)
      set({ loading: false })
    }
  },

  createEnlace: async (datos) => {
    const data = await api.post('/admin/enlaces-rapidos', datos)
    set((state) => ({ enlaces: [...state.enlaces, data.enlace] }))
    return data.enlace
  },

  updateEnlace: async (id, datos) => {
    const data = await api.put(`/admin/enlaces-rapidos/${id}`, datos)
    set((state) => ({
      enlaces: state.enlaces.map((e) => (e.id === id ? data.enlace : e))
    }))
  },

  deleteEnlace: async (id) => {
    await api.delete(`/admin/enlaces-rapidos/${id}`)
    set((state) => ({
      enlaces: state.enlaces.filter((e) => e.id !== id)
    }))
  }
}))
