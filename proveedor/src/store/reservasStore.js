import { create } from 'zustand'
import { mockReservas } from '@/data/mockData'

export const useReservasStore = create((set, get) => ({
  reservas: mockReservas,
  selectedDate: null,
  fechasBloqueadas: [],

  setSelectedDate: (date) => {
    set({ selectedDate: date })
  },

  getReservasByDate: (date) => {
    const reservas = get().reservas
    if (!date) return []
    const dateStr = date.toISOString().split('T')[0]
    return reservas.filter((r) => r.fecha === dateStr)
  },

  getReservasByMonth: (year, month) => {
    const reservas = get().reservas
    return reservas.filter((r) => {
      const fecha = new Date(r.fecha)
      return fecha.getFullYear() === year && fecha.getMonth() === month
    })
  },

  bloquearFecha: (date) => {
    const dateStr = date.toISOString().split('T')[0]
    set((state) => ({
      fechasBloqueadas: [...state.fechasBloqueadas, dateStr]
    }))
  },

  addReserva: (reserva) => {
    const newReserva = {
      ...reserva,
      id: Date.now()
    }
    set((state) => ({
      reservas: [...state.reservas, newReserva]
    }))
  }
}))
