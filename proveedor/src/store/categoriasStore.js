import { create } from 'zustand'
import { api } from '@/lib/api'

export const useCategoriasStore = create((set) => ({
  categorias: [],
  loading: false,

  // Las categorías son globales (admin las gestiona). Solo lectura para el proveedor.
  fetchCategorias: async () => {
    set({ loading: true })
    try {
      const data = await api.get('/categorias')
      set({ categorias: data, loading: false })
    } catch (err) {
      console.error('Error al cargar categorías:', err)
      set({ loading: false })
    }
  }
}))
