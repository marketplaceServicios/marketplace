import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, X } from 'lucide-react'

const DIAS = [
  { value: 1, label: 'Lun' },
  { value: 2, label: 'Mar' },
  { value: 3, label: 'Mié' },
  { value: 4, label: 'Jue' },
  { value: 5, label: 'Vie' },
  { value: 6, label: 'Sáb' },
  { value: 0, label: 'Dom' },
]

const TIPOS = [
  { value: 'siempre', label: 'Siempre disponible' },
  { value: 'dias_semana', label: 'Días de semana' },
  { value: 'fechas_especificas', label: 'Fechas puntuales' },
]

function formatLocalDate(iso) {
  const [y, m, d] = iso.split('-')
  const nombres = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${parseInt(d)} ${nombres[parseInt(m) - 1]} ${y}`
}

export function DisponibilidadForm({ value, onChange, precioBase }) {
  const tipo = value.tipo || 'siempre'
  const diasSemana = value.diasSemana || []
  const precioFinDeSemana = value.precioFinDeSemana
  const fechasEspeciales = value.fechasEspeciales || []

  const [nuevaFecha, setNuevaFecha] = useState('')
  const [nuevoPrecio, setNuevoPrecio] = useState('')

  const update = (partial) => onChange({ ...value, ...partial })

  const toggleDia = (dia) => {
    const nuevo = diasSemana.includes(dia)
      ? diasSemana.filter(d => d !== dia)
      : [...diasSemana, dia]
    update({ diasSemana: nuevo })
  }

  const agregarFecha = () => {
    if (!nuevaFecha) return
    const precio = parseInt(nuevoPrecio) || precioBase || 0
    // Evitar duplicados
    if (fechasEspeciales.some(f => f.fecha === nuevaFecha)) return
    update({ fechasEspeciales: [...fechasEspeciales, { fecha: nuevaFecha, precio }] })
    setNuevaFecha('')
    setNuevoPrecio('')
  }

  const eliminarFecha = (fecha) => {
    update({ fechasEspeciales: fechasEspeciales.filter(f => f.fecha !== fecha) })
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-4">
      {/* Tipo selector */}
      <div className="grid grid-cols-3 gap-2">
        {TIPOS.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => update({ tipo: opt.value })}
            className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              tipo === opt.value
                ? 'bg-primary text-white shadow-sm'
                : 'bg-ivory text-primary hover:bg-cream border border-cream'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Siempre disponible */}
      {tipo === 'siempre' && (
        <div className="p-4 bg-ivory/50 rounded-lg space-y-3">
          <p className="text-sm text-slate">El plan está disponible todos los días del año.</p>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={precioFinDeSemana != null}
              onChange={(e) =>
                update({ precioFinDeSemana: e.target.checked ? (precioBase || 0) : null })
              }
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm font-medium text-primary">
              Precio diferente para sábado y domingo
            </span>
          </label>
          {precioFinDeSemana != null && (
            <div>
              <label className="block text-xs text-slate mb-1">
                Precio fin de semana (COP)
              </label>
              <Input
                type="number"
                value={precioFinDeSemana}
                onChange={(e) => update({ precioFinDeSemana: parseInt(e.target.value) || 0 })}
                placeholder="Ej: 1800000"
              />
            </div>
          )}
        </div>
      )}

      {/* Días de semana */}
      {tipo === 'dias_semana' && (
        <div className="p-4 bg-ivory/50 rounded-lg space-y-3">
          <p className="text-sm text-slate">Selecciona los días en que el plan opera:</p>
          <div className="flex flex-wrap gap-2">
            {DIAS.map(dia => (
              <button
                key={dia.value}
                type="button"
                onClick={() => toggleDia(dia.value)}
                className={`w-12 h-12 rounded-lg text-sm font-semibold transition-colors ${
                  diasSemana.includes(dia.value)
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white text-primary border border-cream hover:border-primary/50'
                }`}
              >
                {dia.label}
              </button>
            ))}
          </div>
          {diasSemana.length === 0 && (
            <p className="text-xs text-danger">Selecciona al menos un día.</p>
          )}
        </div>
      )}

      {/* Fechas puntuales */}
      {tipo === 'fechas_especificas' && (
        <div className="p-4 bg-ivory/50 rounded-lg space-y-3">
          <p className="text-sm text-slate">Agrega cada fecha disponible con su precio:</p>

          <div className="flex gap-2">
            <input
              type="date"
              value={nuevaFecha}
              onChange={(e) => setNuevaFecha(e.target.value)}
              min={today}
              className="flex-1 px-3 py-2 text-sm border border-cream rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sage"
            />
            <Input
              type="number"
              value={nuevoPrecio}
              onChange={(e) => setNuevoPrecio(e.target.value)}
              placeholder={`Precio (def: ${(precioBase || 0).toLocaleString('es-CO')})`}
              className="flex-1"
            />
            <Button type="button" onClick={agregarFecha} size="sm" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {fechasEspeciales.length > 0 ? (
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {[...fechasEspeciales]
                .sort((a, b) => a.fecha.localeCompare(b.fecha))
                .map((fe) => (
                  <div
                    key={fe.fecha}
                    className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-cream"
                  >
                    <span className="text-sm text-primary">{formatLocalDate(fe.fecha)}</span>
                    <span className="text-sm font-semibold text-accent">
                      ${fe.precio.toLocaleString('es-CO')}
                    </span>
                    <button
                      type="button"
                      onClick={() => eliminarFecha(fe.fecha)}
                      className="text-danger hover:text-danger/70 ml-2"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-xs text-slate italic">Aún no hay fechas agregadas.</p>
          )}
        </div>
      )}
    </div>
  )
}
