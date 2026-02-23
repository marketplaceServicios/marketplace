const express = require('express')
const router = express.Router()
const cotizacionController = require('../controllers/cotizacionController')
const { verifyToken, isProveedor } = require('../middlewares/auth')

// Rutas públicas
router.post('/', cotizacionController.create)

// Rutas protegidas (proveedor)
router.get('/', verifyToken, isProveedor, cotizacionController.getByProveedor)
router.get('/:id', verifyToken, isProveedor, cotizacionController.getById)
router.patch('/:id/responder', verifyToken, isProveedor, cotizacionController.respond)

module.exports = router
