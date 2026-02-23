import { create } from 'zustand'
import { api } from '@/lib/api'

const mapCotizacion = (c) => ({
  id: c.id,
  plan: c.plan?.titulo || '—',
  planId: c.planId,
  categoria: c.plan?.categoria?.nombre || '—',
  imagen: (c.plan?.imagenes || [])[0] || '',
  cliente: c.nombre,
  email: c.email,
  telefono: c.telefono || '—',
  requerimientos: c.mensaje || '—',
  fechaRespuesta: c.fechaRespuesta
    ? new Date(c.fechaRespuesta).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
    : null,
  notas: (() => {
    if (!c.respuesta) return []
    try {
      const parsed = JSON.parse(c.respuesta)
      return Array.isArray(parsed) ? parsed : [{ texto: c.respuesta, fecha: c.updatedAt?.split('T')[0] || '' }]
    } catch {
      return [{ texto: c.respuesta, fecha: c.updatedAt?.split('T')[0] || '' }]
    }
  })(),
  resuelta: c.estado === 'respondida' || c.estado === 'cerrada',
  estado: c.estado,
  fechaCreacion: c.createdAt?.split('T')[0] || '—',
  fechaServicio: c.fechaDeseada ? c.fechaDeseada.split('T')[0] : '—',
})

export const useCotizacionesStore = create((set, get) => ({
  cotizaciones: [],
  filtroCategoria: 'todas',
  loading: false,

  fetchCotizaciones: async () => {
    set({ loading: true })
    try {
      const data = await api.get('/cotizaciones')
      set({ cotizaciones: data.map(mapCotizacion), loading: false })
    } catch (err) {
      console.error('Error al cargar cotizaciones:', err)
      set({ loading: false })
    }
  },

  setFiltroCategoria: (categoria) => set({ filtroCategoria: categoria }),

  getCotizacionesFiltradas: () => {
    const { cotizaciones, filtroCategoria } = get()
    const pendientes = cotizaciones.filter((c) => !c.resuelta)
    if (filtroCategoria === 'todas') return pendientes
    return pendientes.filter((c) => c.categoria === filtroCategoria)
  },

  getCotizacionById: (id) => {
    return get().cotizaciones.find((c) => c.id === parseInt(id))
  },

  toggleEstado: async (id) => {
    const cotizacion = get().cotizaciones.find((c) => c.id === id)
    const nuevoEstado = cotizacion?.resuelta ? 'pendiente' : 'respondida'
    await api.patch(`/cotizaciones/${id}/responder`, { estado: nuevoEstado, actualizarFecha: true })
    const fechaRespuesta = new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
    set((state) => ({
      cotizaciones: state.cotizaciones.map((c) =>
        c.id === id
          ? { ...c, resuelta: nuevoEstado === 'respondida', estado: nuevoEstado, fechaRespuesta }
          : c
      )
    }))
  },

  guardarNotas: async (id, texto) => {
    const cotizacion = get().cotizaciones.find((c) => c.id === id)
    const nuevaNota = { texto, fecha: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) }
    const notasActualizadas = [...(cotizacion?.notas || []), nuevaNota]
    await api.patch(`/cotizaciones/${id}/responder`, {
      respuesta: JSON.stringify(notasActualizadas),
      estado: cotizacion?.estado || 'pendiente',
    })
    set((state) => ({
      cotizaciones: state.cotizaciones.map((c) =>
        c.id === id ? { ...c, notas: notasActualizadas } : c
      )
    }))
  },

  getCotizacionesSinResponder: () => {
    return get().cotizaciones.filter((c) => !c.resuelta).length
  }
}))
