import { create } from 'zustand'
import { api } from '../lib/api'

// Mapea un proveedor del backend al formato que usa el admin
const mapProveedor = (p) => ({
  id: p.id,
  nombre: p.nombreEmpresa,
  nombreLegal: p.nombreLegal || '',
  tipoServicio: p.tipoServicio || '',
  nit: p.nit || '',
  direccion: p.direccion || '',
  telefonoFijo: p.telefonoFijo || '',
  celular: p.celular || '',
  correo: p.email,
  activa: p.activo,
  avatar: p.logo || null,
  descripcion: p.descripcion || '',
  planesActivos: p.planesActivos ?? p._count?.planes ?? 0,
  planesPausados: p.planesPausados ?? 0,
  cotizacionesResueltas: p.cotizacionesResueltas ?? 0,
  cotizacionesPendientes: p.cotizacionesPendientes ?? 0,
  reservasConcretadas: p.reservasConcretadas ?? 0,
  representante: p.representante || null,
  documentos: [],
  equipo: p.equipo || [],
})

export const useEmpresasStore = create((set, get) => ({
  empresas: [],
  usuarios: [],
  empresaActual: null,
  filtroServicio: null,
  loading: false,
  error: null,

  fetchEmpresas: async () => {
    set({ loading: true, error: null })
    try {
      const data = await api.get('/proveedores')
      set({ empresas: data.map(mapProveedor), loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  setFiltroServicio: (servicio) => {
    set({ filtroServicio: servicio })
  },

  getEmpresasFiltradas: () => {
    const { empresas, filtroServicio } = get()
    if (!filtroServicio) return empresas
    return empresas.filter(e => e.tipoServicio === filtroServicio)
  },

  setEmpresaActual: (empresa) => {
    set({ empresaActual: empresa })
  },

  getEmpresaById: (id) => {
    const { empresas } = get()
    return empresas.find(e => e.id === parseInt(id))
  },

  fetchEmpresaById: async (id) => {
    try {
      const data = await api.get(`/proveedores/${id}`)
      return mapProveedor(data)
    } catch (err) {
      return null
    }
  },

  addEmpresa: async (empresa) => {
    const data = await api.post('/proveedores', {
      nombreEmpresa: empresa.nombre,
      nombreLegal: empresa.nombreLegal,
      nit: empresa.nit,
      email: empresa.correo,
      password: empresa.password,
      telefono: empresa.celular,
      telefonoFijo: empresa.telefonoFijo,
      celular: empresa.celular,
      direccion: empresa.direccion,
      tipoServicio: empresa.tipoServicio,
      descripcion: empresa.descripcion,
      representante: empresa.representante || null,
    })
    const nueva = mapProveedor(data.proveedor)
    set((state) => ({ empresas: [...state.empresas, nueva] }))
    return nueva
  },

  toggleEmpresaActiva: async (id) => {
    try {
      const result = await api.patch(`/proveedores/${id}/toggle-active`)
      set((state) => ({
        empresas: state.empresas.map(e =>
          e.id === id ? { ...e, activa: result.activo } : e
        )
      }))
    } catch (err) {
      console.error('Error al cambiar estado:', err)
      throw err
    }
  },

  deleteEmpresa: async (id) => {
    await api.delete(`/proveedores/${id}`)
    set((state) => ({
      empresas: state.empresas.filter(e => e.id !== id)
    }))
  },

  getUsuariosByEmpresa: (empresaId) => {
    const { usuarios } = get()
    if (!empresaId) return usuarios
    return usuarios.filter(u => u.empresaId === parseInt(empresaId))
  }
}))
