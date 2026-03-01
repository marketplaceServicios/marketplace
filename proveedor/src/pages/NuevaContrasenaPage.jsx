import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { api } from '@/lib/api'
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import logo from '@/assets/images/logos/vertical-colores.png'

export function NuevaContrasenaPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [exito, setExito] = useState(false)
  const [error, setError] = useState('')

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-sage flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-danger mx-auto" />
            <p className="font-semibold text-primary">Enlace inválido</p>
            <p className="text-sm text-slate">Este enlace no es válido o ya fue utilizado.</p>
            <Link to="/recuperar-contrasena" className="block">
              <Button variant="outline" className="w-full">Solicitar nuevo enlace</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

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
      await api.post('/auth/proveedor/reset-password', { token, newPassword })
      setExito(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.message || 'El enlace no es válido o ha expirado. Solicita uno nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-sage flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <img src={logo} alt="Vive Silver" className="h-24 object-contain" />
            </div>
            <h2 className="text-2xl font-bold text-primary font-serif">Nueva contraseña</h2>
            <p className="text-slate text-sm mt-1">Elige una contraseña segura para tu cuenta.</p>
          </CardHeader>

          <CardContent className="pt-2">
            {exito ? (
              <div className="text-center space-y-4 py-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-sage/10 rounded-full">
                    <CheckCircle className="h-10 w-10 text-sage" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-primary">¡Contraseña actualizada!</p>
                  <p className="text-sm text-slate mt-1">
                    Tu contraseña fue cambiada exitosamente. Serás redirigido al inicio de sesión en unos segundos.
                  </p>
                </div>
                <Link to="/login" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Ir al inicio de sesión ahora
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-sm font-medium text-primary">Nueva contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setError('') }}
                      placeholder="Mínimo 6 caracteres"
                      className="pl-10 pr-10"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-primary"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-primary">Confirmar contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError('') }}
                      placeholder="Repite tu nueva contraseña"
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
                </Button>

                <div className="text-center">
                  <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-primary transition-colors">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Volver al inicio de sesión
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
