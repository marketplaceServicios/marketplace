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

    const subtotal = parseFloat(plan.precio) * numPersonas
    const impuestos = subtotal * 0.19
    const total = subtotal + impuestos

    const reserva = await prisma.reserva.create({
      data: {
        codigo: generateCodigo(),
        planId: parseInt(planId),
        usuarioId: usuarioId || null,
        numPersonas,
        turistas: turistas || [],
        datosFacturacion: datosFacturacion || {},
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
            ubicacion: true,
            duracion: true,
            imagenes: true,
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

module.exports = { create, getByProveedor, getById, updateEstado, getByCodigo }
