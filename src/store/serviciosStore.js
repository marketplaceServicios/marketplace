import { create } from 'zustand'
import { servicios as initialServicios } from '../data/mockData'

export const useServiciosStore = create((set, get) => ({
  servicios: initialServicios,

  addServicio: (servicio) => {
    set((state) => ({
      servicios: [...state.servicios, {
        ...servicio,
        id: state.servicios.length + 1
      }]
    }))
  },

  getServicioById: (id) => {
    const { servicios } = get()
    return servicios.find(s => s.id === parseInt(id))
  },

  getServiciosNombres: () => {
    const { servicios } = get()
    return servicios.map(s => s.nombre)
  }
}))
