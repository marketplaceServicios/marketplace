const prisma = require('../config/database')

// Obtener todos los planes (público) — con paginación, búsqueda y filtros de precio
const getAll = async (req, res) => {
  try {
    const {
      categoriaId, proveedorId, destacado, esOferta,
      page: rawPage, limit: rawLimit, q, precioMin, precioMax
    } = req.query

    const page = Math.max(1, parseInt(rawPage) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(rawLimit) || 20))
    const skip = (page - 1) * limit

    const where = { activo: true }

    if (categoriaId) where.categoriaId = parseInt(categoriaId)
    if (proveedorId) where.proveedorId = parseInt(proveedorId)
    if (destacado === 'true') where.destacado = true
    if (esOferta === 'true') where.esOferta = true

    // Text search (MySQL is case-insensitive by default, no mode needed)
    if (q) {
      where.OR = [
        { titulo: { contains: q } },
        { ubicacion: { contains: q } }
      ]
    }

    // Price range filters
    if (precioMin || precioMax) {
      where.precio = {}
      if (precioMin) where.precio.gte = parseFloat(precioMin)
      if (precioMax) where.precio.lte = parseFloat(precioMax)
    }

    const [planes, total] = await Promise.all([
      prisma.plan.findMany({
        where,
        include: {
          categoria: { select: { id: true, nombre: true, slug: true } },
          proveedor: { select: { id: true, nombreEmpresa: true, logo: true } }
        },
        orderBy: { id: 'desc' },
        skip,
        take: limit
      }),
      prisma.plan.count({ where })
    ])

    // Agregar ratings dinámicos
    const planIds = planes.map(p => p.id)
    const ratings = await prisma.resena.groupBy({
      by: ['planId'],
      where: { planId: { in: planIds }, estado: 'aprobado' },
      _avg: { rating: true },
      _count: { id: true }
    })
    const ratingsMap = {}
    ratings.forEach(r => { ratingsMap[r.planId] = { avg: r._avg.rating, count: r._count.id } })

    const planesConRating = planes.map(p => ({
      ...p,
      _rating: ratingsMap[p.id] ? parseFloat(ratingsMap[p.id].avg.toFixed(1)) : 0,
      _reviewCount: ratingsMap[p.id]?.count || 0
    }))

    res.json({
      data: planesConRating,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Error en getAll planes:', error)
    res.status(500).json({ error: 'Error al obtener planes' })
  }
}

// Obtener planes destacados (público)
const getFeatured = async (req, res) => {
  try {
    const planes = await prisma.plan.findMany({
      where: { activo: true, destacado: true },
      include: {
        categoria: { select: { id: true, nombre: true, slug: true } },
        proveedor: { select: { id: true, nombreEmpresa: true } }
      },
      take: 6,
      orderBy: { id: 'desc' }
    })

    const planIds = planes.map(p => p.id)
    const ratings = await prisma.resena.groupBy({
      by: ['planId'],
      where: { planId: { in: planIds }, estado: 'aprobado' },
      _avg: { rating: true },
      _count: { id: true }
    })
    const ratingsMap = {}
    ratings.forEach(r => { ratingsMap[r.planId] = { avg: r._avg.rating, count: r._count.id } })

    const planesConRating = planes.map(p => ({
      ...p,
      _rating: ratingsMap[p.id] ? parseFloat(ratingsMap[p.id].avg.toFixed(1)) : 0,
      _reviewCount: ratingsMap[p.id]?.count || 0
    }))

    res.json(planesConRating)
  } catch (error) {
    console.error('Error en getFeatured planes:', error)
    res.status(500).json({ error: 'Error al obtener planes destacados' })
  }
}

// Obtener planes en oferta (público)
const getOffers = async (req, res) => {
  try {
    const planes = await prisma.plan.findMany({
      where: { activo: true, esOferta: true },
      include: {
        categoria: { select: { id: true, nombre: true, slug: true } },
        proveedor: { select: { id: true, nombreEmpresa: true } }
      },
      orderBy: { id: 'desc' }
    })

    const planIds = planes.map(p => p.id)
    const ratings = await prisma.resena.groupBy({
      by: ['planId'],
      where: { planId: { in: planIds }, estado: 'aprobado' },
      _avg: { rating: true },
      _count: { id: true }
    })
    const ratingsMap = {}
    ratings.forEach(r => { ratingsMap[r.planId] = { avg: r._avg.rating, count: r._count.id } })

    const planesConRating = planes.map(p => ({
      ...p,
      _rating: ratingsMap[p.id] ? parseFloat(ratingsMap[p.id].avg.toFixed(1)) : 0,
      _reviewCount: ratingsMap[p.id]?.count || 0
    }))

    res.json(planesConRating)
  } catch (error) {
    console.error('Error en getOffers planes:', error)
    res.status(500).json({ error: 'Error al obtener ofertas' })
  }
}

// Obtener un plan por ID (público)
const getById = async (req, res) => {
  try {
    const { id } = req.params

    const plan = await prisma.plan.findUnique({
      where: { id: parseInt(id) },
      include: {
        categoria: true,
        proveedor: {
          select: { id: true, nombreEmpresa: true, logo: true, descripcion: true }
        }
      }
    })

    if (!plan) {
      return res.status(404).json({ error: 'Plan no encontrado' })
    }

    const agg = await prisma.resena.aggregate({
      where: { planId: plan.id, estado: 'aprobado' },
      _avg: { rating: true },
      _count: { id: true }
    })

    res.json({
      ...plan,
      _rating: agg._avg.rating ? parseFloat(agg._avg.rating.toFixed(1)) : 0,
      _reviewCount: agg._count.id
    })
  } catch (error) {
    console.error('Error en getById plan:', error)
    res.status(500).json({ error: 'Error al obtener plan' })
  }
}

// Obtener planes del proveedor actual
const getMyPlanes = async (req, res) => {
  try {
    const proveedorId = req.proveedor.id

    const planes = await prisma.plan.findMany({
      where: { proveedorId },
      include: {
        categoria: { select: { id: true, nombre: true } },
        _count: { select: { reservas: true, cotizaciones: true } }
      },
      orderBy: { id: 'desc' }
    })

    res.json(planes)
  } catch (error) {
    console.error('Error en getMyPlanes:', error)
    res.status(500).json({ error: 'Error al obtener planes' })
  }
}

// Crear plan (Proveedor)
const create = async (req, res) => {
  try {
    const proveedorId = req.proveedor.id
    const {
      categoriaId, titulo, descripcion, ubicacion,
      precio, precioOriginal, duracion, fechaInicio, fechaFin,
      imagenes, incluye, amenidades, datoClave, notasAccesibilidad,
      politicasCancelacion, disponibilidad, destacado, esOferta
    } = req.body

    if (!categoriaId || !titulo || !precio) {
      return res.status(400).json({ error: 'Categoría, título y precio son requeridos' })
    }

    // Verificar que la categoría existe y está activa
    const categoria = await prisma.categoria.findFirst({
      where: { id: parseInt(categoriaId), activo: true }
    })

    if (!categoria) {
      return res.status(400).json({ error: 'Categoría no válida' })
    }

    const plan = await prisma.plan.create({
      data: {
        proveedorId,
        categoriaId: parseInt(categoriaId),
        titulo,
        descripcion,
        ubicacion,
        precio: parseFloat(precio),
        precioOriginal: precioOriginal ? parseFloat(precioOriginal) : null,
        duracion,
        fechaInicio: fechaInicio ? new Date(fechaInicio) : null,
        fechaFin: fechaFin ? new Date(fechaFin) : null,
        imagenes: imagenes || [],
        incluye: incluye || [],
        amenidades: amenidades || [],
        datoClave,
        notasAccesibilidad,
        politicasCancelacion,
        disponibilidad: disponibilidad || null,
        destacado: destacado || false,
        esOferta: esOferta || false
      },
      include: {
        categoria: { select: { id: true, nombre: true } }
      }
    })

    res.status(201).json({
      message: 'Plan creado exitosamente',
      plan
    })
  } catch (error) {
    console.error('Error en create plan:', error)
    res.status(500).json({ error: 'Error al crear plan' })
  }
}

// Actualizar plan (Proveedor)
const update = async (req, res) => {
  try {
    const { id } = req.params
    const proveedorId = req.proveedor.id
    const {
      categoriaId, titulo, descripcion, ubicacion,
      precio, precioOriginal, duracion, fechaInicio, fechaFin,
      imagenes, incluye, amenidades, datoClave, notasAccesibilidad,
      politicasCancelacion, disponibilidad, destacado, esOferta, activo
    } = req.body

    // Verificar que el plan pertenece al proveedor
    const existingPlan = await prisma.plan.findFirst({
      where: { id: parseInt(id), proveedorId }
    })

    if (!existingPlan) {
      return res.status(404).json({ error: 'Plan no encontrado' })
    }

    const plan = await prisma.plan.update({
      where: { id: parseInt(id) },
      data: {
        categoriaId: categoriaId ? parseInt(categoriaId) : undefined,
        titulo,
        descripcion,
        ubicacion,
        precio: precio ? parseFloat(precio) : undefined,
        precioOriginal: precioOriginal ? parseFloat(precioOriginal) : null,
        duracion,
        fechaInicio: fechaInicio ? new Date(fechaInicio) : undefined,
        fechaFin: fechaFin ? new Date(fechaFin) : undefined,
        imagenes,
        incluye,
        amenidades,
        datoClave,
        notasAccesibilidad,
        politicasCancelacion,
        disponibilidad: disponibilidad !== undefined ? disponibilidad : undefined,
        destacado,
        esOferta,
        activo
      },
      include: {
        categoria: { select: { id: true, nombre: true } }
      }
    })

    res.json({
      message: 'Plan actualizado exitosamente',
      plan
    })
  } catch (error) {
    console.error('Error en update plan:', error)
    res.status(500).json({ error: 'Error al actualizar plan' })
  }
}

// Eliminar plan (soft delete)
const remove = async (req, res) => {
  try {
    const { id } = req.params
    const proveedorId = req.proveedor.id

    const plan = await prisma.plan.findFirst({
      where: { id: parseInt(id), proveedorId }
    })

    if (!plan) {
      return res.status(404).json({ error: 'Plan no encontrado' })
    }

    await prisma.plan.update({
      where: { id: parseInt(id) },
      data: { activo: false }
    })

    res.json({ message: 'Plan eliminado exitosamente' })
  } catch (error) {
    console.error('Error en remove plan:', error)
    res.status(500).json({ error: 'Error al eliminar plan' })
  }
}

module.exports = {
  getAll,
  getFeatured,
  getOffers,
  getById,
  getMyPlanes,
  create,
  update,
  remove
}
