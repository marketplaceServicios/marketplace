import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/PageHeader'
import { ReservationDetail } from '@/components/shared/ReservationDetail'
import { useReservasStore } from '@/store/reservasStore'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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

export function ReservasPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  const reservas = useReservasStore((state) => state.reservas)
  const getReservasByDate = useReservasStore((state) => state.getReservasByDate)
  const bloquearFecha = useReservasStore((state) => state.bloquearFecha)

  const selectedReservas = selectedDate ? getReservasByDate(selectedDate) : []
  const selectedReserva = selectedReservas[0] || null

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  const getReservaColor = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const reserva = reservas.find((r) => r.fecha === dateStr)
    return reserva?.color || null
  }

  const colorClasses = {
    teal: 'bg-teal-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500'
  }

  const renderHeader = () => {
    return (
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
  }

  const renderDays = () => {
    const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-slate py-2"
          >
            {day}
          </div>
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
        const reservaColor = getReservaColor(day)

        days.push(
          <div
            key={day.toString()}
            className={`
              relative p-2 text-center cursor-pointer transition-colors
              ${!isSameMonth(day, monthStart) ? 'text-slate/40' : 'text-primary'}
              ${isToday(day) ? 'font-bold' : ''}
              ${selectedDate && isSameDay(day, selectedDate)
                ? 'bg-sage text-white rounded-lg'
                : 'hover:bg-cream rounded-lg'
              }
            `}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <span className="text-sm">{format(day, 'd')}</span>
            {reservaColor && (
              <div
                className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${colorClasses[reservaColor] || 'bg-sage'}`}
              />
            )}
          </div>
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      )
      days = []
    }

    return <div className="space-y-1">{rows}</div>
  }

  const handleBloquearFecha = () => {
    if (selectedDate) {
      bloquearFecha(selectedDate)
      alert(`Fecha ${format(selectedDate, 'dd/MM/yyyy')} bloqueada`)
    }
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
            </CardContent>
          </Card>
        </div>

        {/* Reservation Detail */}
        <div>
          <ReservationDetail
            fecha={selectedReserva?.fecha}
            servicio={selectedReserva?.servicio}
            horario={selectedReserva?.horario}
            cliente={selectedReserva?.cliente}
            direccion={selectedReserva?.direccion}
            cantidadPersonas={selectedReserva?.cantidadPersonas}
            valorPagado={selectedReserva?.valorPagado}
            otrosItems={selectedReserva?.otrosItems}
            color={selectedReserva?.color}
            onBloquearFecha={handleBloquearFecha}
          />
        </div>
      </div>
    </div>
  )
}
