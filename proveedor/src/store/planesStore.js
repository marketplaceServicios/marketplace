import { create } from 'zustand'
import { api } from '@/lib/api'

// Mapea plan del backend al formato del frontend
const mapPlan = (p) => ({
  id: p.id,
  titulo: p.titulo,
  descripcion: p.descripcion || '',
  categoria: p.categoria?.nombre || '',
  categoriaId: p.categoriaId,
  valor: Number(p.precio),
  ubicacion: p.ubicacion || '',
  duracion: p.duracion || '',
  imagenes: p.imagenes || [],
  imagen: (p.imagenes || [])[0] || '',
  incluye: p.incluye || [],
  amenidades: p.amenidades || [],
  datoClave: p.datoClave || '',
  notasAccesibilidad: p.notasAccesibilidad || '',
  politicasCancelacion: p.politicasCancelacion || '',
  disponibilidad: p.disponibilidad || null,
  contactoCelular: p.contactoCelular || '',
  contactoEmail: p.contactoEmail || '',
  cupoMaximoDiario: p.cupoMaximoDiario || null,
  cobrarIva: p.cobrarIva ?? false,
  porcentajeIva: p.porcentajeIva ?? 19,
  precioOriginal: p.precioOriginal ? Number(p.precioOriginal) : null,
  isPrincipal: p.destacado,
  isOferta: p.esOferta,
  activo: p.activo,
  createdAt: p.createdAt,
})

const COLORS = ['teal', 'green', 'blue', 'amber', 'purple', 'pink']

export const usePlanesStore = create((set, get) => ({
  planes: [],
  loading: false,

  fetchPlanes: async () => {
    set({ loading: true })
    try {
      const data = await api.get('/planes/mis/planes')
      set({ planes: data.map(mapPlan), loading: false })
    } catch (err) {
      console.error('Error al cargar planes:', err)
      set({ loading: false })
    }
  },

  addPlan: async (plan) => {
    const data = await api.post('/planes', {
      categoriaId: plan.categoriaId,
      titulo: plan.titulo,
      descripcion: plan.descripcion,
      ubicacion: plan.ubicacion,
      precio: plan.valor,
      imagenes: plan.imagenes || [],
      incluye: plan.incluye || [],
      amenidades: plan.amenidades || [],
      datoClave: plan.datoClave,
      notasAccesibilidad: plan.notasAccesibilidad,
      politicasCancelacion: plan.politicasCancelacion,
      disponibilidad: plan.disponibilidad || null,
      contactoCelular: plan.contactoCelular || '',
      contactoEmail: plan.contactoEmail || '',
      cupoMaximoDiario: plan.cupoMaximoDiario ? parseInt(plan.cupoMaximoDiario) : null,
      cobrarIva: plan.cobrarIva ?? false,
      porcentajeIva: plan.cobrarIva ? (parseInt(plan.porcentajeIva) || 19) : 19,
      destacado: false,
      esOferta: false,
    })
    const nuevo = mapPlan(data.plan)
    set((state) => ({ planes: [...state.planes, nuevo] }))
    return nuevo
  },

  updatePlan: async (id, planData) => {
    const data = await api.put(`/planes/${id}`, {
      categoriaId: parseInt(planData.categoriaId),
      titulo: planData.titulo,
      descripcion: planData.descripcion,
      ubicacion: planData.ubicacion,
      duracion: planData.duracion,
      precio: planData.valor,
      imagenes: planData.imagenes || [],
      incluye: planData.incluye || [],
      amenidades: planData.amenidades || [],
      datoClave: planData.datoClave,
      notasAccesibilidad: planData.notasAccesibilidad,
      politicasCancelacion: planData.politicasCancelacion,
      disponibilidad: planData.disponibilidad || null,
      contactoCelular: planData.contactoCelular || '',
      contactoEmail: planData.contactoEmail || '',
      cupoMaximoDiario: planData.cupoMaximoDiario ? parseInt(planData.cupoMaximoDiario) : null,
      cobrarIva: planData.cobrarIva ?? false,
      porcentajeIva: planData.cobrarIva ? (parseInt(planData.porcentajeIva) || 19) : 19,
    })
    const updated = mapPlan(data.plan)
    set((state) => ({
      planes: state.planes.map(p => p.id === id ? updated : p)
    }))
    return updated
  },

  toggleActivo: async (id) => {
    const plan = get().planes.find(p => p.id === id)
    if (!plan) return
    await api.put(`/planes/${id}`, { activo: !plan.activo })
    set((state) => ({
      planes: state.planes.map(p => p.id === id ? { ...p, activo: !p.activo } : p)
    }))
  },

  deletePlan: async (id) => {
    await api.delete(`/planes/${id}`)
    set((state) => ({ planes: state.planes.filter(p => p.id !== id) }))
  },

  setPlanPrincipal: async (id) => {
    await api.put(`/planes/${id}`, { destacado: true })
    set((state) => ({
      planes: state.planes.map((p) => ({ ...p, isPrincipal: p.id === id }))
    }))
  },

  setPlanOferta: async (id, precioOferta) => {
    const plan = get().planes.find(p => p.id === id)
    if (!plan) return
    if (!plan.isOferta && precioOferta) {
      // Activar oferta: nuevo precio es el de oferta, guardar original
      await api.put(`/planes/${id}`, {
        esOferta: true,
        precio: precioOferta,
        precioOriginal: plan.valor,
      })
      set((state) => ({
        planes: state.planes.map(p =>
          p.id === id ? { ...p, isOferta: true, valor: precioOferta, precioOriginal: p.valor } : p
        )
      }))
    } else if (plan.isOferta) {
      // Desactivar oferta: restaurar precio original
      const precioRestaurado = plan.precioOriginal || plan.valor
      await api.put(`/planes/${id}`, {
        esOferta: false,
        precio: precioRestaurado,
        precioOriginal: null,
      })
      set((state) => ({
        planes: state.planes.map(p =>
          p.id === id ? { ...p, isOferta: false, valor: precioRestaurado, precioOriginal: null } : p
        )
      }))
    }
  },

  getPlanesByCategoria: () => {
    const planes = get().planes
    return planes.reduce((acc, plan) => {
      const cat = plan.categoria || 'Sin categoría'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(plan)
      return acc
    }, {})
  }
}))
