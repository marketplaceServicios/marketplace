const express = require('express')
const router = express.Router()
const proveedorController = require('../controllers/proveedorController')
const { verifyToken, isAdmin } = require('../middlewares/auth')

// Rutas públicas (para ver info de proveedores en web)
router.get('/:id', proveedorController.getById)

// Rutas protegidas (solo admin)
router.get('/', verifyToken, isAdmin, proveedorController.getAll)
router.post('/', verifyToken, isAdmin, proveedorController.create)
router.put('/:id', verifyToken, isAdmin, proveedorController.update)
router.patch('/:id/password', verifyToken, isAdmin, proveedorController.changePassword)
router.patch('/:id/toggle-active', verifyToken, isAdmin, proveedorController.toggleActive)
router.delete('/:id', verifyToken, isAdmin, proveedorController.deleteProveedor)

module.exports = router
