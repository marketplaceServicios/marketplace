const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../config/database')

// Generar token JWT
const generateToken = (user, role) => {
  return jwt.sign(
    { id: user.id, email: user.email, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  )
}

// Login Admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' })
    }

    const admin = await prisma.admin.findUnique({ where: { email } })

    if (!admin) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }

    const validPassword = await bcrypt.compare(password, admin.password)

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }

    if (!admin.activo) {
      return res.status(401).json({ error: 'Cuenta desactivada' })
    }

    const token = generateToken(admin, 'admin')

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: admin.id,
        email: admin.email,
        nombre: admin.nombre,
        role: 'admin'
      }
    })
  } catch (error) {
    console.error('Error en loginAdmin:', error)
    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
}

// Login Proveedor
const loginProveedor = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' })
    }

    const proveedor = await prisma.proveedor.findUnique({ where: { email } })

    if (!proveedor) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }

    const validPassword = await bcrypt.compare(password, proveedor.password)

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }

    if (!proveedor.activo) {
      return res.status(401).json({ error: 'Cuenta desactivada' })
    }

    const token = generateToken(proveedor, 'proveedor')

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: proveedor.id,
        email: proveedor.email,
        nombreEmpresa: proveedor.nombreEmpresa,
        role: 'proveedor',
        mustChangePassword: proveedor.mustChangePassword,
      }
    })
  } catch (error) {
    console.error('Error en loginProveedor:', error)
    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
}

// Login Usuario (web pública)
const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' })
    }

    const usuario = await prisma.usuario.findUnique({ where: { email } })

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }

    const validPassword = await bcrypt.compare(password, usuario.password)

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }

    if (!usuario.activo) {
      return res.status(401).json({ error: 'Cuenta desactivada' })
    }

    const token = generateToken(usuario, 'usuario')

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        role: 'usuario'
      }
    })
  } catch (error) {
    console.error('Error en loginUsuario:', error)
    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
}

// Registro de Usuario (web pública)
const registerUsuario = async (req, res) => {
  try {
    const { nombre, email, password, telefono } = req.body

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' })
    }

    const existingUser = await prisma.usuario.findUnique({ where: { email } })

    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        telefono
      }
    })

    const token = generateToken(usuario, 'usuario')

    res.status(201).json({
      message: 'Registro exitoso',
      token,
      user: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        role: 'usuario'
      }
    })
  } catch (error) {
    console.error('Error en registerUsuario:', error)
    res.status(500).json({ error: 'Error al registrar usuario' })
  }
}

// Cambiar contraseña en primer acceso (proveedor)
const changeProveedorPassword = async (req, res) => {
  try {
    const { id, role } = req.user
    const { newPassword } = req.body

    if (role !== 'proveedor') {
      return res.status(403).json({ error: 'No autorizado' })
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.proveedor.update({
      where: { id },
      data: { password: hashedPassword, mustChangePassword: false }
    })

    res.json({ message: 'Contraseña actualizada exitosamente' })
  } catch (error) {
    console.error('Error en changeProveedorPassword:', error)
    res.status(500).json({ error: 'Error al cambiar contraseña' })
  }
}

// Obtener perfil del usuario actual
const getProfile = async (req, res) => {
  try {
    const { id, role } = req.user
    let user

    if (role === 'admin') {
      user = await prisma.admin.findUnique({
        where: { id },
        select: { id: true, email: true, nombre: true, createdAt: true }
      })
    } else if (role === 'proveedor') {
      user = await prisma.proveedor.findUnique({
        where: { id },
        select: {
          id: true, email: true, nombreEmpresa: true, telefono: true,
          direccion: true, logo: true, descripcion: true, createdAt: true
        }
      })
    } else if (role === 'usuario') {
      user = await prisma.usuario.findUnique({
        where: { id },
        select: {
          id: true, email: true, nombre: true, telefono: true,
          fechaNacimiento: true, createdAt: true
        }
      })
    }

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.json({ ...user, role })
  } catch (error) {
    console.error('Error en getProfile:', error)
    res.status(500).json({ error: 'Error al obtener perfil' })
  }
}

module.exports = {
  loginAdmin,
  loginProveedor,
  loginUsuario,
  registerUsuario,
  getProfile,
  changeProveedorPassword
}
