import { create } from 'zustand'
import { api } from '@/lib/api'

const COLORS = ['teal', 'green', 'blue', 'amber', 'purple', 'pink']

const mapReserva = (r, i) => ({
  id: r.id,
  codigo: r.codigo,
  fecha: r.createdAt?.split('T')[0] || '',
  servicio: r.plan?.titulo || '—',
  cliente: r.usuario?.nombre || '—',
  cantidadPersonas: r.numPersonas,
  valorPagado: Number(r.total),
  estado: r.estado,
  color: COLORS[i % COLORS.length],
  turistas: r.turistas || [],
  metodoPago: r.metodoPago || '—',
})

export const useReservasStore = create((set, get) => ({
  reservas: [],
  selectedDate: null,
  fechasBloqueadas: [],
  loading: false,

  fetchReservas: async () => {
    set({ loading: true })
    try {
      const data = await api.get('/reservas')
      set({ reservas: data.map(mapReserva), loading: false })
    } catch (err) {
      console.error('Error al cargar reservas:', err)
      set({ loading: false })
    }
  },

  setSelectedDate: (date) => set({ selectedDate: date }),

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

  cambiarEstado: async (id, estado) => {
    await api.patch(`/reservas/${id}/estado`, { estado })
    set((state) => ({
      reservas: state.reservas.map((r) =>
        r.id === id ? { ...r, estado } : r
      )
    }))
  },

  bloquearFecha: (date) => {
    const dateStr = date.toISOString().split('T')[0]
    set((state) => ({
      fechasBloqueadas: [...state.fechasBloqueadas, dateStr]
    }))
  },
}))
