const prisma = require('../config/database')
const { buildCheckoutUrl } = require('../services/wompiService')

// Generar código de reserva único
const generateCodigo = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let codigo = 'VS-'
  for (let i = 0; i < 8; i++) {
    codigo += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return codigo
}

// Crear reserva (Usuario web)
const create = async (req, res) => {
  try {
    const {
      planId, numPersonas, turistas, datosFacturacion,
      metodoPago, usuarioId
    } = req.body

    if (!planId || !numPersonas) {
      return res.status(400).json({ error: 'Plan y número de personas son requeridos' })
    }

    const plan = await prisma.plan.findUnique({ where: { id: parseInt(planId) } })

    if (!plan || !plan.activo) {
      return res.status(404).json({ error: 'Plan no encontrado' })
    }

    // Verificar cupo máximo por día si está configurado
    const selectedDate = datosFacturacion?.selectedDate
    if (plan.cupoMaximoDiario && selectedDate) {
      const result = await prisma.$queryRaw`
        SELECT COUNT(*) as cnt FROM reservas
        WHERE planId = ${parseInt(planId)}
        AND JSON_UNQUOTE(JSON_EXTRACT(datosFacturacion, '$.selectedDate')) = ${selectedDate}
        AND estado NOT IN ('cancelada')
      `
      const ocupadas = Number(result[0]?.cnt || 0)
      if (ocupadas >= plan.cupoMaximoDiario) {
        return res.status(409).json({
          error: `No hay disponibilidad para esta fecha. Este plan permite máximo ${plan.cupoMaximoDiario} reserva${plan.cupoMaximoDiario !== 1 ? 's' : ''} por día.`
        })
      }
    }

    const subtotal = parseFloat(plan.precio) * numPersonas
    const impuestos = plan.cobrarIva
      ? Math.round(subtotal * (plan.porcentajeIva / 100) * 100) / 100
      : 0
    const total = subtotal + impuestos

    const reserva = await prisma.reserva.create({
      data: {
        codigo: generateCodigo(),
        planId: parseInt(planId),
        usuarioId: usuarioId || null,
        numPersonas,
        turistas: turistas || [],
        datosFacturacion: {
          ...(datosFacturacion || {}),
          cobrarIva: plan.cobrarIva,
          porcentajeIva: plan.porcentajeIva,
        },
        metodoPago,
        subtotal,
        impuestos,
        total,
        estado: 'pendiente'
      },
      include: {
        plan: { select: { titulo: true, ubicacion: true, duracion: true } }
      }
    })

    const redirectUrl = `${process.env.WEB_URL}/orden?codigo=${reserva.codigo}`
    const checkoutUrl = buildCheckoutUrl({
      reference: reserva.codigo,
      amountCents: Math.round(total * 100),
      currency: 'COP',
      email: datosFacturacion?.email || '',
      redirectUrl,
    })

    res.status(201).json({
      message: 'Reserva creada exitosamente',
      reserva,
      checkoutUrl,
    })
  } catch (error) {
    console.error('Error en create reserva:', error)
    res.status(500).json({ error: 'Error al crear reserva' })
  }
}

// Obtener reservas del proveedor
const getByProveedor = async (req, res) => {
  try {
    const proveedorId = req.proveedor.id
    const { estado } = req.query

    const where = { plan: { proveedorId } }
    if (estado) where.estado = estado

    const reservas = await prisma.reserva.findMany({
      where,
      include: {
        plan: { select: { id: true, titulo: true, precio: true } },
        usuario: { select: { id: true, nombre: true, email: true } }
      },
      orderBy: { id: 'desc' }
    })

    res.json(reservas)
  } catch (error) {
    console.error('Error en getByProveedor reservas:', error)
    res.status(500).json({ error: 'Error al obtener reservas' })
  }
}

// Obtener una reserva por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params

    const reserva = await prisma.reserva.findUnique({
      where: { id: parseInt(id) },
      include: {
        plan: true,
        usuario: { select: { id: true, nombre: true, email: true, telefono: true } }
      }
    })

    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' })
    }

    res.json(reserva)
  } catch (error) {
    console.error('Error en getById reserva:', error)
    res.status(500).json({ error: 'Error al obtener reserva' })
  }
}

// Actualizar estado de reserva (Proveedor)
const updateEstado = async (req, res) => {
  try {
    const { id } = req.params
    const { estado } = req.body

    const estadosValidos = ['pendiente', 'confirmada', 'cancelada', 'completada']

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: 'Estado no válido' })
    }

    const reserva = await prisma.reserva.update({
      where: { id: parseInt(id) },
      data: { estado }
    })

    res.json({
      message: 'Estado actualizado exitosamente',
      reserva
    })
  } catch (error) {
    console.error('Error en updateEstado reserva:', error)
    res.status(500).json({ error: 'Error al actualizar estado' })
  }
}

// Buscar reserva por código (público)
const getByCodigo = async (req, res) => {
  try {
    const { codigo } = req.params

    const reserva = await prisma.reserva.findUnique({
      where: { codigo },
      include: {
        plan: {
          select: {
            titulo: true,
            descripcion: true,
            incluye: true,
            ubicacion: true,
            duracion: true,
            imagenes: true,
            contactoCelular: true,
            contactoEmail: true,
            categoria: { select: { nombre: true } }
          }
        }
      }
    })

    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' })
    }

    res.json(reserva)
  } catch (error) {
    console.error('Error en getByCodigo reserva:', error)
    res.status(500).json({ error: 'Error al buscar reserva' })
  }
}

// Simular pago aprobado (solo en desarrollo)
const simularPago = async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ error: 'Solo disponible en desarrollo' })
  }
  try {
    const { codigo } = req.params
    const reserva = await prisma.reserva.update({
      where: { codigo },
      data: { estado: 'confirmada' }
    })
    res.json({ message: 'Pago simulado exitosamente', reserva })
  } catch (error) {
    res.status(500).json({ error: 'Error al simular pago' })
  }
}

// Resumen de ingresos para el proveedor (solo sus planes)
const getIngresosProveedor = async (req, res) => {
  try {
    const proveedorId = req.proveedor.id

    const reservas = await prisma.reserva.findMany({
      where: {
        estado: 'confirmada',
        plan: { proveedorId }
      },
      include: {
        plan: { select: { id: true, titulo: true } }
      },
      orderBy: { updatedAt: 'desc' }
    })

    const totalIngresos = reservas.reduce((acc, r) => acc + Number(r.total), 0)
    const totalReservas = reservas.length

    const byPlan = {}
    reservas.forEach(r => {
      if (!r.plan) return
      const pid = r.plan.id
      if (!byPlan[pid]) {
        byPlan[pid] = {
          id: pid,
          titulo: r.plan.titulo,
          totalIngresos: 0,
          numReservas: 0
        }
      }
      byPlan[pid].totalIngresos += Number(r.total)
      byPlan[pid].numReservas++
    })

    const detalleReservas = reservas.map(r => {
      const df = r.datosFacturacion || {}
      const turistas = Array.isArray(r.turistas) ? r.turistas : []
      const clienteNombre = turistas[0]?.name || df.email || '—'
      return {
        id: r.id,
        codigo: r.codigo,
        fechaPago: r.updatedAt,
        total: Number(r.total),
        planTitulo: r.plan?.titulo || '—',
        clienteNombre,
        clienteEmail: df.email || '—',
        numPersonas: r.numPersonas,
      }
    })

    res.json({
      totalIngresos,
      totalReservas,
      porPlan: Object.values(byPlan).sort((a, b) => b.totalIngresos - a.totalIngresos),
      reservas: detalleReservas,
    })
  } catch (error) {
    console.error('Error en getIngresosProveedor:', error)
    res.status(500).json({ error: 'Error al obtener ingresos' })
  }
}

module.exports = { create, getByProveedor, getById, updateEstado, getByCodigo, simularPago, getIngresosProveedor }
