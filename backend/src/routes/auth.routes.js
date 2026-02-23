const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { verifyToken } = require('../middlewares/auth')

// Login
router.post('/admin/login', authController.loginAdmin)
router.post('/proveedor/login', authController.loginProveedor)
router.post('/usuario/login', authController.loginUsuario)

// Registro (solo usuarios)
router.post('/usuario/register', authController.registerUsuario)

// Cambiar contraseña en primer acceso (proveedor)
router.post('/proveedor/change-password', verifyToken, authController.changeProveedorPassword)

// Perfil (requiere autenticación)
router.get('/profile', verifyToken, authController.getProfile)

module.exports = router
