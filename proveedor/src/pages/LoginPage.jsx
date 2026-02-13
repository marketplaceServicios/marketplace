import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import logo from '@/assets/images/logos/vertical-colores.png'

export function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      setError('Por favor complete todos los campos')
      return
    }

    // Simulated login
    login(formData.email, formData.password)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-sage flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Logo */}
        <div className="hidden md:flex flex-col items-center justify-center text-white">
          <img
            src={logo}
            alt="Vive Silver"
            className="h-64 w-auto mb-6"
          />
          <p className="text-lg text-white/80">Panel de Proveedor</p>
        </div>

        {/* Right side - Login Form */}
        <Card className="w-full max-w-md mx-auto shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4 md:hidden">
              <img
                src={logo}
                alt="Vive Silver"
                className="h-36 object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-primary font-serif">Bienvenido a Vive Silver</h2>
            <p className="text-slate">Tu vitrina confiable para clientes 50+ y sus familias. Gestiona planes, reservas y cotizaciones en un solo lugar.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-medium text-primary">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate" />
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="correo@ejemplo.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-primary">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-primary"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-cream text-accent focus:ring-accent"
                  />
                  <span className="text-slate">Recordarme</span>
                </label>
                <a href="#" className="text-accent hover:underline">
                  ¿Olvidaste tu contraseña? Te ayudamos a recuperarla.
                </a>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Ingresar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
