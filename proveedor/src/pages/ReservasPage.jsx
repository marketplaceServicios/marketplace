import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/PageHeader'
import { ReservationDetail } from '@/components/shared/ReservationDetail'
import { useReservasStore } from '@/store/reservasStore'
import { usePlanesStore } from '@/store/planesStore'
import { ChevronLeft, ChevronRight, Calendar, Lock } from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday
} from 'date-fns'
import { es } from 'date-fns/locale'

const ESTADO_COLORS = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  confirmada: 'bg-green-100 text-green-800',
  cancelada: 'bg-red-100 text-red-800',
  completada: 'bg-blue-100 text-blue-800',
}

const COLOR_CLASSES = {
  teal: 'bg-teal-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
}

export function ReservasPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [mostrandoSelector, setMostrandoSelector] = useState(false)
  const [planesSeleccionados, setPlanesSeleccionados] = useState([])

  const reservas = useReservasStore((state) => state.reservas)
  const fetchReservas = useReservasStore((state) => state.fetchReservas)
  const getReservasByDate = useReservasStore((state) => state.getReservasByDate)
  const fechasBloqueadas = useReservasStore((state) => state.fechasBloqueadas)
  const fetchFechasBloqueadas = useReservasStore((state) => state.fetchFechasBloqueadas)
  const bloquearFecha = useReservasStore((state) => state.bloquearFecha)
  const desbloquearFecha = useReservasStore((state) => state.desbloquearFecha)

  const planes = usePlanesStore((state) => state.planes)
  const fetchPlanes = usePlanesStore((state) => state.fetchPlanes)

  useEffect(() => { fetchReservas(); fetchFechasBloqueadas(); fetchPlanes() }, [])

  const selectedReservas = selectedDate ? getReservasByDate(selectedDate) : []
  const selectedReserva = selectedReservas[selectedIndex] || null

  const handleSelectDate = (date) => {
    setSelectedDate(date)
    setSelectedIndex(0)
    setMostrandoSelector(false)
  }

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  const getReservasForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return reservas.filter((r) => r.fecha === dateStr)
  }

  // ¿Tiene algún plan bloqueado en esta fecha?
  const tieneBloqueados = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return fechasBloqueadas.some((f) => f.fecha === dateStr)
  }

  // IDs de planes bloqueados para la fecha dada
  const getPlanesBloqueadosIds = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return fechasBloqueadas.filter((f) => f.fecha === dateStr).map((f) => f.planId)
  }

  const handleAbrirSelector = () => {
    setPlanesSeleccionados(getPlanesBloqueadosIds(selectedDate))
    setMostrandoSelector(true)
  }

  const handleTogglePlan = (planId) => {
    setPlanesSeleccionados((prev) =>
      prev.includes(planId) ? prev.filter((id) => id !== planId) : [...prev, planId]
    )
  }

  const handleConfirmarBloqueo = async () => {
    if (!selectedDate) return
    const yaBloqueados = getPlanesBloqueadosIds(selectedDate)
    const aBloquear = planesSeleccionados.filter((id) => !yaBloqueados.includes(id))
    const aDesbloquear = yaBloqueados.filter((id) => !planesSeleccionados.includes(id))

    if (aBloquear.length > 0) await bloquearFecha(selectedDate, aBloquear)
    for (const planId of aDesbloquear) await desbloquearFecha(selectedDate, planId)
    setMostrandoSelector(false)
  }

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <Button variant="ghost" size="icon" onClick={prevMonth}>
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <h2 className="text-lg font-semibold text-primary capitalize">
        {format(currentMonth, 'MMMM yyyy', { locale: es })}
      </h2>
      <Button variant="ghost" size="icon" onClick={nextMonth}>
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  )

  const renderDays = () => {
    const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-slate py-2">{day}</div>
        ))}
      </div>
    )
  }

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const rows = []
    let days = []
    let day = startDate

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day
        const dayReservas = getReservasForDate(day)
        const count = dayReservas.length
        const firstColor = dayReservas[0]?.color
        const bloqueado = tieneBloqueados(day)

        days.push(
          <div
            key={day.toString()}
            className={`
              relative p-2 text-center cursor-pointer transition-colors min-h-[44px]
              ${!isSameMonth(day, monthStart) ? 'text-slate/40' : 'text-primary'}
              ${isToday(day) ? 'font-bold' : ''}
              ${selectedDate && isSameDay(day, selectedDate)
                ? 'bg-sage text-white rounded-lg'
                : bloqueado
                  ? 'bg-red-50 hover:bg-red-100 rounded-lg'
                  : 'hover:bg-cream rounded-lg'
              }
            `}
            onClick={() => handleSelectDate(cloneDay)}
          >
            <span className="text-sm">{format(day, 'd')}</span>
            {bloqueado && (
              <Lock className="absolute top-0.5 right-0.5 h-2.5 w-2.5 text-red-400" />
            )}
            {!bloqueado && count === 1 && (
              <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${COLOR_CLASSES[firstColor] || 'bg-sage'}`} />
            )}
            {!bloqueado && count > 1 && (
              <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 bg-accent text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {count}
              </div>
            )}
          </div>
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">{days}</div>
      )
      days = []
    }

    return <div className="space-y-1">{rows}</div>
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reservas"
        subtitle="Confirma disponibilidad y mantén tu agenda al día. Vive Silver te ayuda a ordenar el flujo."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {renderHeader()}
              {renderDays()}
              {renderCells()}
              {/* Leyenda */}
              <div className="mt-4 pt-3 border-t border-cream flex items-center gap-5 text-xs text-slate">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-teal-500" />
                  <span>1 reserva</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-accent text-white text-[9px] font-bold flex items-center justify-center">2+</div>
                  <span>Varias reservas</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-red-400" />
                  <span>Bloqueada</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel derecho */}
        <div>
          {/* Sin fecha seleccionada */}
          {!selectedDate && (
            <Card className="bg-cream/30">
              <CardContent className="p-6 text-center text-slate">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Selecciona una fecha para ver sus reservas</p>
              </CardContent>
            </Card>
          )}

          {/* Selector de planes — se muestra cuando el proveedor quiere bloquear */}
          {selectedDate && mostrandoSelector && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="font-semibold text-primary capitalize">
                    {format(selectedDate, "d 'de' MMMM", { locale: es })}
                  </p>
                  <p className="text-sm text-slate mt-0.5">
                    Selecciona los planes que quieres bloquear en esta fecha
                  </p>
                </div>

                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {planes.length === 0 && (
                    <p className="text-sm text-slate text-center py-4">No tienes planes creados</p>
                  )}
                  {planes.map((plan) => (
                    <label
                      key={plan.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                        ${planesSeleccionados.includes(plan.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:bg-cream/50'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={planesSeleccionados.includes(plan.id)}
                        onChange={() => handleTogglePlan(plan.id)}
                        className="accent-primary flex-shrink-0"
                      />
                      <span className="text-sm font-medium text-primary truncate">{plan.titulo}</span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={handleConfirmarBloqueo}>
                    Confirmar
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setMostrandoSelector(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fecha con planes bloqueados (y no mostrando selector) */}
          {selectedDate && !mostrandoSelector && tieneBloqueados(selectedDate) && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-red-700">
                  <Lock className="h-5 w-5" />
                  <p className="font-medium capitalize">
                    {format(selectedDate, "d 'de' MMMM yyyy", { locale: es })}
                  </p>
                </div>
                <div className="space-y-1">
                  {fechasBloqueadas
                    .filter((f) => f.fecha === format(selectedDate, 'yyyy-MM-dd'))
                    .map((f) => (
                      <p key={f.planId} className="text-xs text-red-600 flex items-center gap-1.5">
                        <Lock className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{f.planTitulo}</span>
                      </p>
                    ))}
                </div>
                {selectedReservas.length > 0 && (
                  <p className="text-xs text-slate">
                    {selectedReservas.length} reserva{selectedReservas.length !== 1 ? 's' : ''} en este día
                  </p>
                )}
                <Button
                  variant="outline"
                  className="w-full border-red-300 text-red-700 hover:bg-red-100"
                  onClick={handleAbrirSelector}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Editar bloqueos
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Fecha seleccionada sin reservas y sin bloqueos */}
          {selectedDate && !mostrandoSelector && !tieneBloqueados(selectedDate) && selectedReservas.length === 0 && (
            <Card className="bg-cream/30">
              <CardContent className="p-6 text-center space-y-4">
                <Calendar className="h-10 w-10 mx-auto text-slate/40" />
                <div>
                  <p className="font-medium text-primary capitalize">
                    {format(selectedDate, "d 'de' MMMM", { locale: es })}
                  </p>
                  <p className="text-sm text-slate mt-1">Sin reservas para este día</p>
                </div>
                <Button variant="outline" className="w-full" onClick={handleAbrirSelector}>
                  <Lock className="h-4 w-4 mr-2" />
                  Bloquear fecha
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Fecha con reservas y sin bloqueos */}
          {selectedDate && !mostrandoSelector && !tieneBloqueados(selectedDate) && selectedReservas.length > 0 && (
            <div className="space-y-3">
              {/* Encabezado de fecha */}
              <div className="flex items-center justify-between px-1">
                <div>
                  <p className="font-semibold text-primary capitalize">
                    {format(selectedDate, "d 'de' MMMM yyyy", { locale: es })}
                  </p>
                  <p className="text-xs text-slate">
                    {selectedReservas.length} reserva{selectedReservas.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAbrirSelector}
                  className="text-slate hover:text-red-600 text-xs"
                >
                  <Lock className="h-3.5 w-3.5 mr-1" />
                  Bloquear
                </Button>
              </div>

              {/* Selector de reserva cuando hay varias */}
              {selectedReservas.length > 1 && (
                <div className="space-y-1.5">
                  {selectedReservas.map((r, i) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedIndex(i)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                        selectedIndex === i
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 bg-white hover:bg-cream/50 text-stormy'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-medium truncate">{r.servicio}</p>
                          <p className="text-xs opacity-60 truncate">{r.cliente}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${ESTADO_COLORS[r.estado] || 'bg-gray-100 text-gray-700'}`}>
                          {r.estado}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Detalle completo de la reserva seleccionada */}
              {selectedReserva && (
                <ReservationDetail
                  fecha={selectedReserva.fecha}
                  servicio={selectedReserva.servicio}
                  codigo={selectedReserva.codigo}
                  cantidadPersonas={selectedReserva.cantidadPersonas}
                  valorPagado={selectedReserva.valorPagado}
                  estado={selectedReserva.estado}
                  color={selectedReserva.color}
                  turistas={selectedReserva.turistas}
                  datosFacturacion={selectedReserva.datosFacturacion}
                  onBloquearFecha={handleAbrirSelector}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
