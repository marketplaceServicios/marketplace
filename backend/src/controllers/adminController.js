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

// Obtener todas las reservas (Admin)
const getReservas = async (req, res) => {
  try {
    const { estado } = req.query
    const where = {}
    if (estado) where.estado = estado

    const reservas = await prisma.reserva.findMany({
      where,
      include: {
        plan: {
          select: {
            id: true,
            titulo: true,
            proveedor: { select: { id: true, nombreEmpresa: true } }
          }
        },
        usuario: { select: { id: true, nombre: true, email: true } }
      },
      orderBy: { id: 'desc' }
    })

    res.json(reservas)
  } catch (error) {
    console.error('Error en getReservas admin:', error)
    res.status(500).json({ error: 'Error al obtener reservas' })
  }
}

// Resumen de ingresos para el admin (todas las reservas confirmadas)
const getIngresos = async (req, res) => {
  try {
    const reservas = await prisma.reserva.findMany({
      where: { estado: 'confirmada' },
      include: {
        plan: {
          select: {
            id: true,
            titulo: true,
            proveedor: { select: { id: true, nombreEmpresa: true } }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    const totalIngresos = reservas.reduce((acc, r) => acc + Number(r.total), 0)
    const totalReservas = reservas.length

    const byProveedor = {}
    reservas.forEach(r => {
      if (!r.plan?.proveedor) return
      const pid = r.plan.proveedor.id
      if (!byProveedor[pid]) {
        byProveedor[pid] = {
          id: pid,
          nombreEmpresa: r.plan.proveedor.nombreEmpresa,
          totalIngresos: 0,
          numReservas: 0
        }
      }
      byProveedor[pid].totalIngresos += Number(r.total)
      byProveedor[pid].numReservas++
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
        proveedorNombre: r.plan?.proveedor?.nombreEmpresa || '—',
        clienteNombre,
        clienteEmail: df.email || '—',
      }
    })

    res.json({
      totalIngresos,
      totalReservas,
      porProveedor: Object.values(byProveedor).sort((a, b) => b.totalIngresos - a.totalIngresos),
      reservas: detalleReservas,
    })
  } catch (error) {
    console.error('Error en getIngresos admin:', error)
    res.status(500).json({ error: 'Error al obtener ingresos' })
  }
}

module.exports = { getDashboard, getUsuarios, getCategorias, createCategoria, updateCategoria, deleteCategoria, getPlanes, togglePlan, toggleDestacado, toggleEsOferta, getCotizaciones, getIngresos, getReservas }
// ==================== ADMINISTRADORES ====================

// Obtener todos los admins
const getAdmins = async (req, res) => {
  try {
    const admins = await prisma.admin.findMany({
      select: { id: true, email: true, nombre: true, activo: true, createdAt: true },
      orderBy: { id: 'desc' }
    })
    res.json(admins)
  } catch (error) {
    console.error('Error en getAdmins:', error)
    res.status(500).json({ error: 'Error al obtener administradores' })
  }
}

// Crear admin
const createAdmin = async (req, res) => {
  try {
    const { nombre, email, password } = req.body
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' })
    }
    const existing = await prisma.admin.findUnique({ where: { email } })
    if (existing) {
      return res.status(400).json({ error: 'El email ya está registrado' })
    }
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash(password, 10)
    const admin = await prisma.admin.create({
      data: { nombre, email, password: hashedPassword }
    })
    const { password: _, ...adminSinPassword } = admin
    res.status(201).json({ message: 'Administrador creado exitosamente', admin: adminSinPassword })
  } catch (error) {
    console.error('Error en createAdmin:', error)
    res.status(500).json({ error: 'Error al crear administrador' })
  }
}

// Actualizar admin
const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, email, activo } = req.body
    const existing = await prisma.admin.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return res.status(404).json({ error: 'Administrador no encontrado' })
    }
    if (activo === false && req.admin.id === parseInt(id)) {
      return res.status(400).json({ error: 'No puedes desactivarte a ti mismo' })
    }
    if (email && email !== existing.email) {
      const emailTaken = await prisma.admin.findUnique({ where: { email } })
      if (emailTaken) {
        return res.status(400).json({ error: 'El email ya está en uso' })
      }
    }
    const admin = await prisma.admin.update({
      where: { id: parseInt(id) },
      data: { nombre, email, activo }
    })
    const { password: _, ...adminSinPassword } = admin
    res.json({ message: 'Administrador actualizado', admin: adminSinPassword })
  } catch (error) {
    console.error('Error en updateAdmin:', error)
    res.status(500).json({ error: 'Error al actualizar administrador' })
  }
}

// ==================== CLIENTES (USUARIOS) ====================

// Toggle activo cliente
const toggleUsuario = async (req, res) => {
  try {
    const { id } = req.params
    const usuario = await prisma.usuario.findUnique({ where: { id: parseInt(id) } })
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }
    const updated = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: { activo: !usuario.activo }
    })
    res.json({ message: `Usuario ${updated.activo ? 'activado' : 'desactivado'}`, activo: updated.activo })
  } catch (error) {
    console.error('Error en toggleUsuario:', error)
    res.status(500).json({ error: 'Error al actualizar usuario' })
  }
}

// ==================== EQUIPO ====================

// Obtener equipo de todas las empresas (Admin)
const getAllEquipo = async (req, res) => {
  try {
    const { proveedorId } = req.query
    const where = {}
    if (proveedorId) where.proveedorId = parseInt(proveedorId)

    const equipo = await prisma.equipo.findMany({
      where,
      include: {
        proveedor: { select: { id: true, nombreEmpresa: true } }
      },
      orderBy: { id: 'desc' }
    })
    res.json(equipo)
  } catch (error) {
    console.error('Error en getAllEquipo:', error)
    res.status(500).json({ error: 'Error al obtener equipo' })
  }
}

// Crear miembro de equipo (Admin)
const createEquipoAdmin = async (req, res) => {
  try {
    const { proveedorId, nombre, cargo, email, telefono } = req.body
    if (!proveedorId || !nombre) {
      return res.status(400).json({ error: 'Empresa y nombre son requeridos' })
    }
    const proveedor = await prisma.proveedor.findUnique({ where: { id: parseInt(proveedorId) } })
    if (!proveedor) {
      return res.status(400).json({ error: 'Empresa no encontrada' })
    }
    const miembro = await prisma.equipo.create({
      data: { proveedorId: parseInt(proveedorId), nombre, cargo, email, telefono },
      include: { proveedor: { select: { id: true, nombreEmpresa: true } } }
    })
    res.status(201).json({ message: 'Miembro de equipo creado', miembro })
  } catch (error) {
    console.error('Error en createEquipoAdmin:', error)
    res.status(500).json({ error: 'Error al crear miembro de equipo' })
  }
}

// Actualizar miembro de equipo (Admin)
const updateEquipoAdmin = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, cargo, email, telefono, proveedorId } = req.body
    const existing = await prisma.equipo.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return res.status(404).json({ error: 'Miembro no encontrado' })
    }
    const miembro = await prisma.equipo.update({
      where: { id: parseInt(id) },
      data: { nombre, cargo, email, telefono, proveedorId: proveedorId ? parseInt(proveedorId) : undefined },
      include: { proveedor: { select: { id: true, nombreEmpresa: true } } }
    })
    res.json({ message: 'Miembro actualizado', miembro })
  } catch (error) {
    console.error('Error en updateEquipoAdmin:', error)
    res.status(500).json({ error: 'Error al actualizar miembro' })
  }
}

// Eliminar miembro de equipo (Admin)
const deleteEquipoAdmin = async (req, res) => {
  try {
    const { id } = req.params
    const existing = await prisma.equipo.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return res.status(404).json({ error: 'Miembro no encontrado' })
    }
    await prisma.equipo.update({
      where: { id: parseInt(id) },
      data: { activo: false }
    })
    res.json({ message: 'Miembro eliminado exitosamente' })
  } catch (error) {
    console.error('Error en deleteEquipoAdmin:', error)
    res.status(500).json({ error: 'Error al eliminar miembro' })
  }
}

module.exports = { getDashboard, getUsuarios, getCategorias, createCategoria, updateCategoria, deleteCategoria, getPlanes, togglePlan, toggleDestacado, toggleEsOferta, getCotizaciones, getAdmins, createAdmin, updateAdmin, toggleUsuario, getAllEquipo, createEquipoAdmin, updateEquipoAdmin, deleteEquipoAdmin }
