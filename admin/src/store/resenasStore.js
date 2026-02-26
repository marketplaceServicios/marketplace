import { create } from 'zustand'
import { api } from '../lib/api'

export const useResenasStore = create((set) => ({
  resenas: [],
  counts: { pendiente: 0, aprobado: 0, rechazado: 0 },
  loading: false,

  fetchResenas: async (estado = 'todos') => {
    set({ loading: true })
    try {
      const data = await api.get(`/admin/resenas${estado !== 'todos' ? `?estado=${estado}` : ''}`)
      set({ resenas: data.resenas, counts: data.counts, loading: false })
    } catch (err) {
      console.error('Error al cargar reseñas:', err)
      set({ loading: false })
    }
  },

  aprobar: async (id) => {
    await api.patch(`/admin/resenas/${id}/estado`, { estado: 'aprobado' })
    set((state) => ({
      resenas: state.resenas.map((r) =>
        r.id === id ? { ...r, estado: 'aprobado' } : r
      ),
      counts: {
        ...state.counts,
        pendiente: state.counts.pendiente - 1,
        aprobado: state.counts.aprobado + 1
      }
    }))
  },

  rechazar: async (id) => {
    await api.patch(`/admin/resenas/${id}/estado`, { estado: 'rechazado' })
    set((state) => ({
      resenas: state.resenas.filter((r) => r.id !== id),
      counts: {
        ...state.counts,
        pendiente: state.counts.pendiente - 1
      }
    }))
  },

  batchAprobar: async (ids) => {
    await api.post('/admin/resenas/batch', { ids, estado: 'aprobado' })
    set((state) => ({
      resenas: state.resenas.map((r) =>
        ids.includes(r.id) ? { ...r, estado: 'aprobado' } : r
      ),
      counts: {
        ...state.counts,
        pendiente: state.counts.pendiente - ids.length,
        aprobado: state.counts.aprobado + ids.length
      }
    }))
  },

  batchRechazar: async (ids) => {
    await api.post('/admin/resenas/batch', { ids, estado: 'rechazado' })
    set((state) => ({
      resenas: state.resenas.filter((r) => !ids.includes(r.id)),
      counts: {
        ...state.counts,
        pendiente: state.counts.pendiente - ids.length
      }
    }))
  }
}))
