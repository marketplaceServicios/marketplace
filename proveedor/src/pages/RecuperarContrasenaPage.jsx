import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ArrowLeft, PhoneCall, KeyRound } from 'lucide-react'
import logo from '@/assets/images/logos/vertical-colores.png'

export function RecuperarContrasenaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-sage flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <img src={logo} alt="Vive Silver" className="h-24 object-contain" />
            </div>
            <h2 className="text-2xl font-bold text-primary font-serif">¿Olvidaste tu contraseña?</h2>
            <p className="text-slate text-sm mt-1">
              No te preocupes, el administrador puede ayudarte a recuperar el acceso.
            </p>
          </CardHeader>

          <CardContent className="pt-2 space-y-5">
            <div className="p-4 bg-sage/10 border border-sage/20 rounded-xl space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-sage/20 rounded-lg flex-shrink-0">
                  <PhoneCall className="h-5 w-5 text-sage" />
                </div>
                <div>
                  <p className="font-semibold text-primary text-sm">Contacta al administrador</p>
                  <p className="text-slate text-sm mt-0.5">
                    Comunícate con el equipo de Vive Silver por WhatsApp o teléfono y solicita el restablecimiento de tu contraseña.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-sage/20 rounded-lg flex-shrink-0">
                  <KeyRound className="h-5 w-5 text-sage" />
                </div>
                <div>
                  <p className="font-semibold text-primary text-sm">Recibe tu contraseña temporal</p>
                  <p className="text-slate text-sm mt-0.5">
                    El administrador generará una contraseña temporal y te la compartirá. Úsala para ingresar y luego cámbiala por una de tu preferencia.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Volver al inicio de sesión
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
