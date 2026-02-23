import { create } from 'zustand'
import { api } from '@/lib/api'

const parseNotas = (respuesta) => {
  if (!respuesta) return []
  try {
    const parsed = JSON.parse(respuesta)
    return Array.isArray(parsed) ? parsed : [{ texto: respuesta, fecha: '' }]
  } catch {
    return [{ texto: respuesta, fecha: '' }]
  }
}

const mapCotizacion = (c) => ({
  id: c.id,
  plan: c.plan?.titulo || '—',
  planId: c.planId,
  categoria: c.plan?.categoria?.nombre || '—',
  imagen: (c.plan?.imagenes || [])[0] || '',
  proveedor: c.plan?.proveedor?.nombreEmpresa || '—',
  proveedorId: c.plan?.proveedor?.id || null,
  cliente: c.nombre,
  email: c.email,
  telefono: c.telefono || '—',
  requerimientos: c.mensaje || '—',
  notas: parseNotas(c.respuesta),
  estado: c.estado,
  resuelta: c.estado === 'respondida' || c.estado === 'cerrada',
  fechaCreacion: c.createdAt
    ? new Date(c.createdAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—',
  fechaRespuesta: c.fechaRespuesta
    ? new Date(c.fechaRespuesta).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
    : null,
})

export const useCotizacionesAdminStore = create((set) => ({
  cotizaciones: [],
  loading: false,
  error: null,

  fetchCotizaciones: async ({ estado, proveedorId } = {}) => {
    set({ loading: true, error: null })
    try {
      const params = new URLSearchParams()
      if (estado) params.append('estado', estado)
      if (proveedorId) params.append('proveedorId', proveedorId)
      const query = params.toString() ? `?${params.toString()}` : ''
      const data = await api.get(`/admin/cotizaciones${query}`)
      set({ cotizaciones: data.map(mapCotizacion), loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },
}))
