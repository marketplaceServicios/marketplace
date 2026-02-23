import { create } from 'zustand'
import { api } from '@/lib/api'

const mapMiembro = (m) => ({
  id: m.id,
  nombre: m.nombre,
  email: m.email || '',
  celular: m.telefono || '',
  rol: m.cargo || '',
  avatar: m.foto || '',
  activo: m.activo,
})

export const useEquipoStore = create((set, get) => ({
  miembros: [],
  filtroRol: 'todos',
  busqueda: '',
  loading: false,

  fetchEquipo: async () => {
    set({ loading: true })
    try {
      const data = await api.get('/equipo')
      set({ miembros: data.map(mapMiembro), loading: false })
    } catch (err) {
      console.error('Error al cargar equipo:', err)
      set({ loading: false })
    }
  },

  setFiltroRol: (rol) => set({ filtroRol: rol }),
  setBusqueda: (texto) => set({ busqueda: texto }),

  getMiembrosFiltrados: () => {
    const { miembros, filtroRol, busqueda } = get()
    let filtrados = miembros.filter(m => m.activo !== false)

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

  addMiembro: async (miembro) => {
    const data = await api.post('/equipo', {
      nombre: miembro.nombre,
      cargo: miembro.rol,
      email: miembro.email,
      telefono: miembro.celular,
    })
    const nuevo = mapMiembro(data.miembro)
    set((state) => ({ miembros: [...state.miembros, nuevo] }))
    return nuevo
  },

  updateMiembro: async (id, datos) => {
    const data = await api.put(`/equipo/${id}`, {
      nombre: datos.nombre,
      cargo: datos.rol,
      email: datos.email,
      telefono: datos.celular,
    })
    const actualizado = mapMiembro(data.miembro)
    set((state) => ({
      miembros: state.miembros.map((m) => m.id === id ? actualizado : m)
    }))
  },

  deleteMiembro: async (id) => {
    await api.delete(`/equipo/${id}`)
    set((state) => ({
      miembros: state.miembros.filter((m) => m.id !== id)
    }))
  }
}))
