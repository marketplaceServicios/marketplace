import { create } from 'zustand'
import { mockCategorias } from '@/data/mockData'

export const useCategoriasStore = create((set) => ({
  categorias: mockCategorias,

  addCategoria: (categoria) => {
    const newCategoria = {
      ...categoria,
      id: Date.now(),
      createdAt: new Date().toISOString()
    }
    set((state) => ({
      categorias: [...state.categorias, newCategoria]
    }))
  },

  updateCategoria: (id, data) => {
    set((state) => ({
      categorias: state.categorias.map((cat) =>
        cat.id === id ? { ...cat, ...data } : cat
      )
    }))
  },

  deleteCategoria: (id) => {
    set((state) => ({
      categorias: state.categorias.filter((cat) => cat.id !== id)
    }))
  }
}))
