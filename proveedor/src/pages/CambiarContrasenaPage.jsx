import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import logo from '@/assets/images/logos/vertical-colores.png'

export function CambiarContrasenaPage() {
  const navigate = useNavigate()
  const { confirmPasswordChanged, user } = useAuthStore()
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    try {
      await confirmPasswordChanged(newPassword)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Error al cambiar la contraseña. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-sage flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left */}
        <div className="hidden md:flex flex-col items-center justify-center text-white text-center">
          <img src={logo} alt="Vive Silver" className="h-52 w-auto mb-6" />
          <p className="text-lg text-white/80">Panel de Proveedor</p>
        </div>

        {/* Right */}
        <Card className="w-full max-w-md mx-auto shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4 md:hidden">
              <img src={logo} alt="Vive Silver" className="h-28 object-contain" />
            </div>
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-accent" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-primary font-serif">Crea tu nueva contraseña</h2>
            <p className="text-slate text-sm mt-1">
              {user?.nombreEmpresa && <span>Hola, <strong>{user.nombreEmpresa}</strong>. </span>}
              Por seguridad, debes establecer tu propia contraseña antes de continuar.
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-medium text-primary">Nueva contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate" />
                  <Input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-primary"
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-primary">Confirmar contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate" />
                  <Input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite tu nueva contraseña"
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-primary"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Guardando...' : 'Establecer contraseña y entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
