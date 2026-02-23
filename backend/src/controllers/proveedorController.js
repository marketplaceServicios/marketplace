const bcrypt = require('bcryptjs')
const prisma = require('../config/database')
const { sendWelcomeProveedorEmail } = require('../services/emailService')

// Obtener todos los proveedores (Admin)
const getAll = async (req, res) => {
  try {
    const proveedores = await prisma.proveedor.findMany({
      select: {
        id: true,
        nombreEmpresa: true,
        email: true,
        telefono: true,
        direccion: true,
        logo: true,
        activo: true,
        createdAt: true,
        _count: {
          select: { planes: true, categorias: true }
        }
      },
      orderBy: { id: 'desc' }
    })

    res.json(proveedores)
  } catch (error) {
    console.error('Error en getAll proveedores:', error)
    res.status(500).json({ error: 'Error al obtener proveedores' })
  }
}

// Obtener un proveedor por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params

    const proveedor = await prisma.proveedor.findUnique({
      where: { id: parseInt(id) },
      include: {
        categorias: true,
        planes: { take: 5, orderBy: { id: 'desc' } },
        equipo: true,
        _count: {
          select: { planes: true, categorias: true }
        }
      }
    })

    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' })
    }

    // Contar planes activos/inactivos, cotizaciones y reservas
    const [planesActivos, planesPausados, cotizacionesResueltas, cotizacionesPendientes, reservasConcretadas] = await Promise.all([
      prisma.plan.count({ where: { proveedorId: parseInt(id), activo: true } }),
      prisma.plan.count({ where: { proveedorId: parseInt(id), activo: false } }),
      prisma.cotizacion.count({ where: { plan: { proveedorId: parseInt(id) }, estado: 'respondida' } }),
      prisma.cotizacion.count({ where: { plan: { proveedorId: parseInt(id) }, estado: 'pendiente' } }),
      prisma.reserva.count({ where: { plan: { proveedorId: parseInt(id) }, estado: 'completada' } }),
    ])

    const { password, ...proveedorSinPassword } = proveedor
    res.json({
      ...proveedorSinPassword,
      planesActivos,
      planesPausados,
      cotizacionesResueltas,
      cotizacionesPendientes,
      reservasConcretadas,
    })
  } catch (error) {
    console.error('Error en getById proveedor:', error)
    res.status(500).json({ error: 'Error al obtener proveedor' })
  }
}

// Crear proveedor (Admin)
const create = async (req, res) => {
  try {
    const {
      nombreEmpresa, nombreLegal, nit, email, password,
      telefono, telefonoFijo, celular, direccion, tipoServicio,
      descripcion, representante
    } = req.body
    const adminId = req.admin.id

    if (!nombreEmpresa || !email || !password) {
      return res.status(400).json({ error: 'Nombre de empresa, email y contraseña son requeridos' })
    }

    const existingProveedor = await prisma.proveedor.findUnique({ where: { email } })

    if (existingProveedor) {
      return res.status(400).json({ error: 'El email ya está registrado' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const proveedor = await prisma.proveedor.create({
      data: {
        adminId,
        nombreEmpresa,
        nombreLegal,
        nit,
        email,
        password: hashedPassword,
        telefono,
        telefonoFijo,
        celular,
        direccion,
        tipoServicio,
        descripcion,
        representante: representante || null,
        mustChangePassword: true,
      }
    })

    // Enviar correo de bienvenida con credenciales (no bloquea la respuesta)
    sendWelcomeProveedorEmail({ email, nombreEmpresa, password }).catch((err) => {
      console.error('Error al enviar email de bienvenida:', err)
    })

    const { password: _, ...proveedorSinPassword } = proveedor
    res.status(201).json({
      message: 'Proveedor creado exitosamente',
      proveedor: proveedorSinPassword
    })
  } catch (error) {
    console.error('Error en create proveedor:', error)
    res.status(500).json({ error: 'Error al crear proveedor' })
  }
}

// Actualizar proveedor
const update = async (req, res) => {
  try {
    const { id } = req.params
    const {
      nombreEmpresa, nombreLegal, nit, telefono, telefonoFijo,
      celular, direccion, tipoServicio, descripcion, logo,
      activo, representante
    } = req.body

    const proveedor = await prisma.proveedor.update({
      where: { id: parseInt(id) },
      data: {
        nombreEmpresa,
        nombreLegal,
        nit,
        telefono,
        telefonoFijo,
        celular,
        direccion,
        tipoServicio,
        descripcion,
        logo,
        activo,
        representante: representante !== undefined ? representante : undefined
      }
    })

    const { password, ...proveedorSinPassword } = proveedor
    res.json({
      message: 'Proveedor actualizado exitosamente',
      proveedor: proveedorSinPassword
    })
  } catch (error) {
    console.error('Error en update proveedor:', error)
    res.status(500).json({ error: 'Error al actualizar proveedor' })
  }
}

// Cambiar contraseña del proveedor
const changePassword = async (req, res) => {
  try {
    const { id } = req.params
    const { newPassword } = req.body

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.proveedor.update({
      where: { id: parseInt(id) },
      data: { password: hashedPassword }
    })

    res.json({ message: 'Contraseña actualizada exitosamente' })
  } catch (error) {
    console.error('Error en changePassword proveedor:', error)
    res.status(500).json({ error: 'Error al cambiar contraseña' })
  }
}

// Eliminar proveedor — desactiva sus planes (no los borra), limpia el resto
const deleteProveedor = async (req, res) => {
  try {
    const { id } = req.params
    const proveedorId = parseInt(id)

    const proveedor = await prisma.proveedor.findUnique({ where: { id: proveedorId } })
    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' })
    }

    const planesIds = await prisma.plan.findMany({
      where: { proveedorId },
      select: { id: true }
    }).then(p => p.map(p => p.id))

    await prisma.$transaction([
      // Desactivar planes (no eliminarlos)
      prisma.plan.updateMany({ where: { proveedorId }, data: { activo: false } }),
      // Limpiar equipo y categorías propias del proveedor
      prisma.equipo.deleteMany({ where: { proveedorId } }),
      prisma.categoria.deleteMany({ where: { proveedorId } }),
      // Desactivar el proveedor
      prisma.proveedor.update({ where: { id: proveedorId }, data: { activo: false } }),
    ])

    res.json({ message: 'Proveedor eliminado exitosamente' })
  } catch (error) {
    console.error('Error en deleteProveedor:', error)
    res.status(500).json({ error: 'Error al eliminar proveedor' })
  }
}

// Suspender/Reactivar proveedor — propaga el estado a todos sus planes
const toggleActive = async (req, res) => {
  try {
    const { id } = req.params
    const proveedorId = parseInt(id)

    const proveedor = await prisma.proveedor.findUnique({ where: { id: proveedorId } })

    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' })
    }

    const nuevoEstado = !proveedor.activo

    // Actualizar proveedor y todos sus planes en una transacción
    await prisma.$transaction([
      prisma.proveedor.update({
        where: { id: proveedorId },
        data: { activo: nuevoEstado }
      }),
      prisma.plan.updateMany({
        where: { proveedorId },
        data: { activo: nuevoEstado }
      })
    ])

    res.json({
      message: `Proveedor ${nuevoEstado ? 'reactivado' : 'suspendido'} exitosamente`,
      activo: nuevoEstado
    })
  } catch (error) {
    console.error('Error en toggleActive proveedor:', error)
    res.status(500).json({ error: 'Error al cambiar estado del proveedor' })
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  changePassword,
  toggleActive,
  deleteProveedor
}
