import { create } from 'zustand'
import { mockEquipo } from '@/data/mockData'

export const useEquipoStore = create((set, get) => ({
  miembros: mockEquipo,
  filtroRol: 'todos',
  busqueda: '',

  setFiltroRol: (rol) => {
    set({ filtroRol: rol })
  },

  setBusqueda: (texto) => {
    set({ busqueda: texto })
  },

  getMiembrosFiltrados: () => {
    const { miembros, filtroRol, busqueda } = get()
    let filtrados = miembros

    if (filtroRol !== 'todos') {
      filtrados = filtrados.filter((m) => m.rol === filtroRol)
    }

    if (busqueda.trim()) {
      const term = busqueda.toLowerCase()
      filtrados = filtrados.filter(
        (m) =>
          m.nombre.toLowerCase().includes(term) ||
          m.email.toLowerCase().includes(term)
      )
    }

    return filtrados
  },

  addMiembro: (miembro) => {
    const newMiembro = {
      ...miembro,
      id: Date.now()
    }
    set((state) => ({
      miembros: [...state.miembros, newMiembro]
    }))
  },

  updateMiembro: (id, data) => {
    set((state) => ({
      miembros: state.miembros.map((m) =>
        m.id === id ? { ...m, ...data } : m
      )
    }))
  },

  deleteMiembro: (id) => {
    set((state) => ({
      miembros: state.miembros.filter((m) => m.id !== id)
    }))
  }
}))
