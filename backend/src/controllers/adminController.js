const prisma = require('../config/database')
const slugify = require('../utils/slugify')

// Dashboard del admin - estadísticas generales
const getDashboard = async (req, res) => {
  try {
    const [
      totalProveedores,
      proveedoresActivos,
      totalUsuarios,
      totalPlanes,
      totalReservas
    ] = await Promise.all([
      prisma.proveedor.count(),
      prisma.proveedor.count({ where: { activo: true } }),
      prisma.usuario.count(),
      prisma.plan.count({ where: { activo: true } }),
      prisma.reserva.count()
    ])

    const reservasPorEstado = await prisma.reserva.groupBy({
      by: ['estado'],
      _count: { estado: true }
    })

    res.json({
      proveedores: {
        total: totalProveedores,
        activos: proveedoresActivos
      },
      usuarios: totalUsuarios,
      planes: totalPlanes,
      reservas: {
        total: totalReservas,
        porEstado: reservasPorEstado
      }
    })
  } catch (error) {
    console.error('Error en getDashboard:', error)
    res.status(500).json({ error: 'Error al obtener estadísticas' })
  }
}

// Obtener todos los usuarios registrados
const getUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        email: true,
        telefono: true,
        activo: true,
        createdAt: true,
        _count: { select: { reservas: true } }
      },
      orderBy: { id: 'desc' }
    })

    res.json(usuarios)
  } catch (error) {
    console.error('Error en getUsuarios:', error)
    res.status(500).json({ error: 'Error al obtener usuarios' })
  }
}

// ==================== CATEGORÍAS GLOBALES ====================

const getCategorias = async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      where: { proveedorId: null },
      include: { _count: { select: { planes: true } } },
      orderBy: { nombre: 'asc' }
    })
    res.json(categorias)
  } catch (error) {
    console.error('Error en getCategorias:', error)
    res.status(500).json({ error: 'Error al obtener categorías' })
  }
}

const createCategoria = async (req, res) => {
  try {
    const { nombre, descripcion, imagen, icono } = req.body

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' })
    }

    let slug = slugify(nombre)
    let suffix = 0
    let candidate = slug
    while (await prisma.categoria.findUnique({ where: { slug: candidate } })) {
      suffix++
      candidate = `${slug}-${suffix}`
    }

    const categoria = await prisma.categoria.create({
      data: { nombre, descripcion, imagen, icono, slug: candidate, proveedorId: null }
    })

    res.status(201).json({ message: 'Categoría creada exitosamente', categoria })
  } catch (error) {
    console.error('Error en createCategoria:', error)
    res.status(500).json({ error: 'Error al crear categoría' })
  }
}

const updateCategoria = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, descripcion, imagen, icono, activo } = req.body

    const existing = await prisma.categoria.findFirst({
      where: { id: parseInt(id), proveedorId: null }
    })

    if (!existing) {
      return res.status(404).json({ error: 'Categoría no encontrada' })
    }

    const data = { nombre, descripcion, imagen, icono, activo }

    // Regenerate slug if nombre changed
    if (nombre && nombre !== existing.nombre) {
      let slug = slugify(nombre)
      let suffix = 0
      let candidate = slug
      while (true) {
        const found = await prisma.categoria.findUnique({ where: { slug: candidate } })
        if (!found || found.id === parseInt(id)) break
        suffix++
        candidate = `${slug}-${suffix}`
      }
      data.slug = candidate
    }

    const categoria = await prisma.categoria.update({
      where: { id: parseInt(id) },
      data
    })

    res.json({ message: 'Categoría actualizada exitosamente', categoria })
  } catch (error) {
    console.error('Error en updateCategoria:', error)
    res.status(500).json({ error: 'Error al actualizar categoría' })
  }
}

const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params

    const existing = await prisma.categoria.findFirst({
      where: { id: parseInt(id), proveedorId: null }
    })

    if (!existing) {
      return res.status(404).json({ error: 'Categoría no encontrada' })
    }

    await prisma.categoria.update({
      where: { id: parseInt(id) },
      data: { activo: false }
    })

    res.json({ message: 'Categoría eliminada exitosamente' })
  } catch (error) {
    console.error('Error en deleteCategoria:', error)
    res.status(500).json({ error: 'Error al eliminar categoría' })
  }
}

// ==================== PLANES ====================

const getPlanes = async (req, res) => {
  try {
    const { activo } = req.query
    const where = {}
    if (activo === 'true') where.activo = true
    if (activo === 'false') where.activo = false

    const planes = await prisma.plan.findMany({
      where,
      include: {
        categoria: { select: { id: true, nombre: true } },
        proveedor: { select: { id: true, nombreEmpresa: true } }
      },
      orderBy: { id: 'desc' }
    })

    res.json(planes)
  } catch (error) {
    console.error('Error en getPlanes (admin):', error)
    res.status(500).json({ error: 'Error al obtener planes' })
  }
}

const togglePlan = async (req, res) => {
  try {
    const { id } = req.params
    const plan = await prisma.plan.findUnique({ where: { id: parseInt(id) } })

    if (!plan) {
      return res.status(404).json({ error: 'Plan no encontrado' })
    }

    const updated = await prisma.plan.update({
      where: { id: parseInt(id) },
      data: { activo: !plan.activo }
    })

    res.json({ message: 'Estado actualizado', plan: updated })
  } catch (error) {
    console.error('Error en togglePlan:', error)
    res.status(500).json({ error: 'Error al actualizar plan' })
  }
}

const MAX_PLANES_POPULARES = 3

const toggleDestacado = async (req, res) => {
  try {
    const { id } = req.params
    const plan = await prisma.plan.findUnique({ where: { id: parseInt(id) } })

    if (!plan) {
      return res.status(404).json({ error: 'Plan no encontrado' })
    }

    // Si está inactivo, verificar el límite antes de activar
    if (!plan.destacado) {
      const count = await prisma.plan.count({ where: { destacado: true } })
      if (count >= MAX_PLANES_POPULARES) {
        return res.status(400).json({
          error: `Solo puedes tener ${MAX_PLANES_POPULARES} planes populares. Quita uno antes de agregar otro.`
        })
      }
    }

    const updated = await prisma.plan.update({
      where: { id: parseInt(id) },
      data: { destacado: !plan.destacado }
    })

    res.json({ message: 'Destacado actualizado', plan: updated })
  } catch (error) {
    console.error('Error en toggleDestacado:', error)
    res.status(500).json({ error: 'Error al actualizar plan' })
  }
}

const toggleEsOferta = async (req, res) => {
  try {
    const { id } = req.params
    const plan = await prisma.plan.findUnique({ where: { id: parseInt(id) } })

    if (!plan) {
      return res.status(404).json({ error: 'Plan no encontrado' })
    }

    if (!plan.esOferta) {
      // Solo un plan puede ser el destacado de la semana: limpiar los demás
      await prisma.plan.updateMany({ data: { esOferta: false } })
      await prisma.plan.update({ where: { id: parseInt(id) }, data: { esOferta: true } })
    } else {
      await prisma.plan.update({ where: { id: parseInt(id) }, data: { esOferta: false } })
    }

    res.json({ message: 'Plan destacado de la semana actualizado' })
  } catch (error) {
    console.error('Error en toggleEsOferta:', error)
    res.status(500).json({ error: 'Error al actualizar plan' })
  }
}

// Obtener todas las cotizaciones (Admin)
const getCotizaciones = async (req, res) => {
  try {
    const { estado, proveedorId } = req.query

    const where = {}
    if (estado) where.estado = estado
    if (proveedorId) where.plan = { proveedorId: parseInt(proveedorId) }

    const cotizaciones = await prisma.cotizacion.findMany({
      where,
      include: {
        plan: {
          select: {
            id: true,
            titulo: true,
            imagenes: true,
            proveedor: { select: { id: true, nombreEmpresa: true } },
            categoria: { select: { nombre: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json(cotizaciones)
  } catch (error) {
    console.error('Error en getCotizaciones admin:', error)
    res.status(500).json({ error: 'Error al obtener cotizaciones' })
  }
}

module.exports = { getDashboard, getUsuarios, getCategorias, createCategoria, updateCategoria, deleteCategoria, getPlanes, togglePlan, toggleDestacado, toggleEsOferta, getCotizaciones }
