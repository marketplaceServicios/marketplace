const prisma = require('../config/database')

// Crear cotización (web pública)
const create = async (req, res) => {
  try {
    const { planId, nombre, email, telefono, mensaje, fechaDeseada, numPersonas, usuarioId } = req.body

    if (!planId || !nombre || !email) {
      return res.status(400).json({ error: 'Plan, nombre y email son requeridos' })
    }

    const plan = await prisma.plan.findUnique({ where: { id: parseInt(planId) } })

    if (!plan || !plan.activo) {
      return res.status(404).json({ error: 'Plan no encontrado' })
    }

    const cotizacion = await prisma.cotizacion.create({
      data: {
        planId: parseInt(planId),
        usuarioId: usuarioId || null,
        nombre,
        email,
        telefono,
        mensaje,
        fechaDeseada: fechaDeseada ? new Date(fechaDeseada) : null,
        numPersonas,
        estado: 'pendiente'
      },
      include: {
        plan: { select: { titulo: true } }
      }
    })

    res.status(201).json({
      message: 'Cotización enviada exitosamente',
      cotizacion
    })
  } catch (error) {
    console.error('Error en create cotizacion:', error)
    res.status(500).json({ error: 'Error al crear cotización' })
  }
}

// Obtener cotizaciones del proveedor
const getByProveedor = async (req, res) => {
  try {
    const proveedorId = req.proveedor.id
    const { estado } = req.query

    const where = { plan: { proveedorId } }
    if (estado) where.estado = estado

    const cotizaciones = await prisma.cotizacion.findMany({
      where,
      include: {
        plan: {
          select: {
            id: true, titulo: true, precio: true,
            imagenes: true,
            categoria: { select: { nombre: true } }
          }
        }
      },
      orderBy: { id: 'desc' }
    })

    res.json(cotizaciones)
  } catch (error) {
    console.error('Error en getByProveedor cotizaciones:', error)
    res.status(500).json({ error: 'Error al obtener cotizaciones' })
  }
}

// Obtener una cotización por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params

    const cotizacion = await prisma.cotizacion.findUnique({
      where: { id: parseInt(id) },
      include: { plan: true }
    })

    if (!cotizacion) {
      return res.status(404).json({ error: 'Cotización no encontrada' })
    }

    res.json(cotizacion)
  } catch (error) {
    console.error('Error en getById cotizacion:', error)
    res.status(500).json({ error: 'Error al obtener cotización' })
  }
}

// Responder cotización (Proveedor)
const respond = async (req, res) => {
  try {
    const { id } = req.params
    const { respuesta, estado, actualizarFecha } = req.body

    const data = {
      respuesta,
      estado: estado || 'respondida',
    }
    if (actualizarFecha) data.fechaRespuesta = new Date()

    const cotizacion = await prisma.cotizacion.update({
      where: { id: parseInt(id) },
      data
    })

    res.json({
      message: 'Cotización respondida exitosamente',
      cotizacion
    })
  } catch (error) {
    console.error('Error en respond cotizacion:', error)
    res.status(500).json({ error: 'Error al responder cotización' })
  }
}

module.exports = { create, getByProveedor, getById, respond }
