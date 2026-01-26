import { create } from 'zustand'
import { mockCotizaciones } from '@/data/mockData'

export const useCotizacionesStore = create((set, get) => ({
  cotizaciones: mockCotizaciones,
  filtroCategoria: 'todas',

  setFiltroCategoria: (categoria) => {
    set({ filtroCategoria: categoria })
  },

  getCotizacionesFiltradas: () => {
    const { cotizaciones, filtroCategoria } = get()
    if (filtroCategoria === 'todas') {
      return cotizaciones.filter((c) => !c.resuelta)
    }
    return cotizaciones.filter(
      (c) => c.categoria === filtroCategoria && !c.resuelta
    )
  },

  getCotizacionById: (id) => {
    const cotizaciones = get().cotizaciones
    return cotizaciones.find((c) => c.id === parseInt(id))
  },

  marcarResuelta: (id) => {
    set((state) => ({
      cotizaciones: state.cotizaciones.map((c) =>
        c.id === id ? { ...c, resuelta: true } : c
      )
    }))
  },

  getCotizacionesSinResponder: () => {
    const cotizaciones = get().cotizaciones
    return cotizaciones.filter((c) => !c.resuelta).length
  }
}))
