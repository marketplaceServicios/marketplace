import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/authStore'
import logo from '@/assets/images/logo/vertical-colores.png'

export function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Por favor complete todos los campos')
      return
    }

    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas')
    }
  }

  return (
    <div className="min-h-screen bg-cream-light flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Leaf patterns */}
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-sage/20 rounded-full blur-3xl" />
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute left-1/4 top-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl" />

        {/* Decorative leaves - hidden on mobile */}
        <svg
          className="hidden md:block absolute left-10 bottom-10 w-32 h-32 text-sage/30"
          viewBox="0 0 100 100"
          fill="currentColor"
        >
          <path d="M50 5 C20 20, 10 50, 30 80 C40 95, 60 95, 70 80 C90 50, 80 20, 50 5" />
        </svg>

        <svg
          className="hidden md:block absolute right-20 top-20 w-24 h-24 text-accent/20"
          viewBox="0 0 100 100"
          fill="currentColor"
        >
          <path d="M50 5 C20 20, 10 50, 30 80 C40 95, 60 95, 70 80 C90 50, 80 20, 50 5" />
        </svg>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-primary rounded-2xl p-6 sm:p-8 relative z-10 shadow-2xl mx-4">
        {/* Logo */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <img
            src={logo}
            alt="Vive Silver"
            className="h-36 sm:h-44 w-auto"
          />
        </div>

        {/* Title */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Acceso administrativo</h1>
          <p className="text-cream/70 text-sm">Gestiona calidad, contenidos, proveedores y soporte del ecosistema Vive Silver.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-cream text-sm mb-2 font-medium">Email</label>
            <Input
              type="email"
              placeholder="Ingresa tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/95 border-0 h-11 sm:h-12"
            />
          </div>

          <div>
            <label className="block text-cream text-sm mb-2 font-medium">Contraseña</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/95 border-0 pr-10 h-11 sm:h-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-300 text-sm text-center bg-red-500/20 py-2 px-3 rounded-lg">{error}</p>
          )}

          <Button type="submit" className="w-full h-11 sm:h-12 text-base font-semibold">
            Iniciar sesión
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-cream/50 text-xs mt-6">
          Vive Silver &copy; {new Date().getFullYear()} - Todos los derechos reservados
        </p>
      </div>
    </div>
  )
}
