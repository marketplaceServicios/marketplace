import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: {
    id: 1,
    nombre: 'Sandra Bones',
    username: '@Sandra.Bones',
    email: 'sandra.bones@company.io',
    celular: '+57 111 222 3334',
    fechaNacimiento: '10/11/1997',
    direccion: '12/ A Street Name, Manizales, Colombia',
    rol: 'Administrador',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
  },
  isAuthenticated: true,

  login: (email, password) => {
    set({
      isAuthenticated: true,
      user: {
        id: 1,
        nombre: 'Sandra Bones',
        username: '@Sandra.Bones',
        email: email,
        celular: '+57 111 222 3334',
        fechaNacimiento: '10/11/1997',
        direccion: '12/ A Street Name, Manizales, Colombia',
        rol: 'Administrador',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
      }
    })
  },

  logout: () => {
    set({ isAuthenticated: false, user: null })
  },

  updateProfile: (data) => {
    set((state) => ({
      user: { ...state.user, ...data }
    }))
  }
}))
