const jwt = require('jsonwebtoken')
const prisma = require('../config/database')

// Verificar token JWT
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}

// Verificar si es admin
const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador.' })
    }

    const admin = await prisma.admin.findUnique({
      where: { id: req.user.id }
    })

    if (!admin || !admin.activo) {
      return res.status(403).json({ error: 'Administrador no encontrado o inactivo' })
    }

    req.admin = admin
    next()
  } catch (error) {
    return res.status(500).json({ error: 'Error al verificar permisos' })
  }
}

// Verificar si es proveedor
const isProveedor = async (req, res, next) => {
  try {
    if (req.user.role !== 'proveedor') {
      return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de proveedor.' })
    }

    const proveedor = await prisma.proveedor.findUnique({
      where: { id: req.user.id }
    })

    if (!proveedor || !proveedor.activo) {
      return res.status(403).json({ error: 'Proveedor no encontrado o inactivo' })
    }

    req.proveedor = proveedor
    next()
  } catch (error) {
    return res.status(500).json({ error: 'Error al verificar permisos' })
  }
}

// Verificar si es usuario
const isUsuario = async (req, res, next) => {
  try {
    if (req.user.role !== 'usuario') {
      return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de usuario.' })
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: req.user.id }
    })

    if (!usuario || !usuario.activo) {
      return res.status(403).json({ error: 'Usuario no encontrado o inactivo' })
    }

    req.usuario = usuario
    next()
  } catch (error) {
    return res.status(500).json({ error: 'Error al verificar permisos' })
  }
}

module.exports = {
  verifyToken,
  isAdmin,
  isProveedor,
  isUsuario
}
