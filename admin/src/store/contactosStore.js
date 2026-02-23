import { create } from 'zustand'
import { api } from '@/lib/api'

const PREFERENCIAS = {
  whatsapp: 'WhatsApp',
  llamada: 'Llamada',
  email: 'Email',
}

const mapContacto = (c) => ({
  id: c.id,
  nombre: c.nombre,
  email: c.email,
  celular: c.celular,
  mensaje: c.mensaje,
  preferencia: PREFERENCIAS[c.preferenciaContacto] || c.preferenciaContacto,
  leido: c.leido,
  fecha: new Date(c.createdAt).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric'
  }),
})

export const useContactosStore = create((set, get) => ({
  contactos: [],
  loading: false,

  fetchContactos: async () => {
    set({ loading: true })
    try {
      const data = await api.get('/admin/contactos')
      set({ contactos: data.map(mapContacto), loading: false })
    } catch (err) {
      console.error('Error al cargar contactos:', err)
      set({ loading: false })
    }
  },

  marcarLeido: async (id) => {
    await api.patch(`/admin/contactos/${id}/leido`)
    set((state) => ({
      contactos: state.contactos.map((c) =>
        c.id === id ? { ...c, leido: true } : c
      )
    }))
  },

  getSinLeer: () => get().contactos.filter((c) => !c.leido).length,
}))
