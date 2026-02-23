import { create } from 'zustand'
import { api } from '../lib/api'

export const useCategoriasAdminStore = create((set) => ({
  categorias: [],
  loading: false,

  fetchCategorias: async () => {
    set({ loading: true })
    try {
      const data = await api.get('/admin/categorias')
      set({ categorias: data, loading: false })
    } catch (err) {
      console.error('Error al cargar categorías:', err)
      set({ loading: false })
    }
  },

  createCategoria: async (datos) => {
    const data = await api.post('/admin/categorias', datos)
    set((state) => ({ categorias: [...state.categorias, data.categoria] }))
    return data.categoria
  },

  updateCategoria: async (id, datos) => {
    const data = await api.put(`/admin/categorias/${id}`, datos)
    set((state) => ({
      categorias: state.categorias.map((c) => (c.id === id ? data.categoria : c))
    }))
  },

  deleteCategoria: async (id) => {
    await api.delete(`/admin/categorias/${id}`)
    set((state) => ({
      categorias: state.categorias.filter((c) => c.id !== id)
    }))
  }
}))
