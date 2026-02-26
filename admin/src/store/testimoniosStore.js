import { create } from 'zustand'
import { api } from '../lib/api'

export const useTestimoniosStore = create((set) => ({
  testimonios: [],
  loading: false,

  fetchTestimonios: async () => {
    set({ loading: true })
    try {
      const data = await api.get('/admin/testimonios')
      set({ testimonios: data, loading: false })
    } catch (err) {
      console.error('Error al cargar testimonios:', err)
      set({ loading: false })
    }
  },

  createTestimonio: async (datos) => {
    const data = await api.post('/admin/testimonios', datos)
    set((state) => ({ testimonios: [...state.testimonios, data.testimonio] }))
    return data.testimonio
  },

  updateTestimonio: async (id, datos) => {
    const data = await api.put(`/admin/testimonios/${id}`, datos)
    set((state) => ({
      testimonios: state.testimonios.map((t) => (t.id === id ? data.testimonio : t))
    }))
  },

  deleteTestimonio: async (id) => {
    await api.delete(`/admin/testimonios/${id}`)
    set((state) => ({
      testimonios: state.testimonios.filter((t) => t.id !== id)
    }))
  }
}))
