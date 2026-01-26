import { create } from 'zustand'
import { empresas as initialEmpresas, usuarios as initialUsuarios } from '../data/mockData'

export const useEmpresasStore = create((set, get) => ({
  empresas: initialEmpresas,
  usuarios: initialUsuarios,
  empresaActual: null,
  filtroServicio: null,

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

  addEmpresa: (empresa) => {
    set((state) => ({
      empresas: [...state.empresas, { ...empresa, id: state.empresas.length + 1 }]
    }))
  },

  toggleEmpresaActiva: (id) => {
    set((state) => ({
      empresas: state.empresas.map(e =>
        e.id === id ? { ...e, activa: !e.activa } : e
      )
    }))
  },

  getUsuariosByEmpresa: (empresaId) => {
    const { usuarios } = get()
    if (!empresaId) return usuarios
    return usuarios.filter(u => u.empresaId === parseInt(empresaId))
  }
}))
