import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { TrendingUp, ShoppingBag, Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatCOP = (value) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value)

const formatFecha = (iso) => {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date(iso))
}

export function IngresosAdminPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/ingresos')
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted">Cargando ingresos...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Ingresos</h1>
        <p className="text-muted mt-1 text-sm">Resumen de ingresos generados por reservas confirmadas en toda la plataforma.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{formatCOP(data?.totalIngresos ?? 0)}</p>
              <p className="text-xs text-muted">Ingresos totales</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{data?.totalReservas ?? 0}</p>
              <p className="text-xs text-muted">Reservas confirmadas</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{data?.porProveedor?.length ?? 0}</p>
              <p className="text-xs text-muted">Proveedores con ingresos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Per-provider summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumen por proveedor</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!data?.porProveedor?.length ? (
            <p className="text-muted text-sm text-center py-10">No hay reservas confirmadas aún.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left px-5 py-3 font-medium text-muted">Proveedor</th>
                    <th className="text-center px-5 py-3 font-medium text-muted">Reservas</th>
                    <th className="text-right px-5 py-3 font-medium text-muted">Total ingresos</th>
                  </tr>
                </thead>
                <tbody>
                  {data.porProveedor.map((p, i) => (
                    <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-muted/10'}>
                      <td className="px-5 py-3 font-medium text-primary">{p.nombreEmpresa}</td>
                      <td className="px-5 py-3 text-center text-stormy">{p.numReservas}</td>
                      <td className="px-5 py-3 text-right font-semibold text-green-700">{formatCOP(p.totalIngresos)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t bg-muted/20">
                    <td className="px-5 py-3 font-bold text-primary">Total</td>
                    <td className="px-5 py-3 text-center font-bold text-primary">{data.totalReservas}</td>
                    <td className="px-5 py-3 text-right font-bold text-green-700">{formatCOP(data.totalIngresos)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Individual payments detail */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detalle de pagos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!data?.reservas?.length ? (
            <p className="text-muted text-sm text-center py-10">No hay pagos registrados aún.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left px-5 py-3 font-medium text-muted">Código</th>
                    <th className="text-left px-5 py-3 font-medium text-muted">Proveedor</th>
                    <th className="text-left px-5 py-3 font-medium text-muted">Plan</th>
                    <th className="text-left px-5 py-3 font-medium text-muted">Cliente</th>
                    <th className="text-left px-5 py-3 font-medium text-muted">Fecha de pago</th>
                    <th className="text-right px-5 py-3 font-medium text-muted">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.reservas.map((r, i) => (
                    <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-muted/10'}>
                      <td className="px-5 py-3">
                        <span className="font-mono text-xs bg-primary/8 text-primary px-2 py-0.5 rounded">
                          {r.codigo}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-stormy">{r.proveedorNombre}</td>
                      <td className="px-5 py-3 text-stormy">{r.planTitulo}</td>
                      <td className="px-5 py-3 text-stormy">
                        <div>{r.clienteNombre}</div>
                        {r.clienteEmail !== r.clienteNombre && (
                          <div className="text-xs text-muted">{r.clienteEmail}</div>
                        )}
                      </td>
                      <td className="px-5 py-3 text-stormy whitespace-nowrap">{formatFecha(r.fechaPago)}</td>
                      <td className="px-5 py-3 text-right font-semibold text-green-700">{formatCOP(r.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
