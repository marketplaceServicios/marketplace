const express = require('express')
const router = express.Router()
const reservaController = require('../controllers/reservaController')
const { verifyToken, isProveedor } = require('../middlewares/auth')

// Rutas públicas
router.post('/', reservaController.create)
router.get('/codigo/:codigo', reservaController.getByCodigo)
router.post('/simular-pago/:codigo', reservaController.simularPago)

// Rutas protegidas (proveedor)
router.get('/ingresos', verifyToken, isProveedor, reservaController.getIngresosProveedor)
router.get('/', verifyToken, isProveedor, reservaController.getByProveedor)
router.get('/:id', verifyToken, isProveedor, reservaController.getById)
router.patch('/:id/estado', verifyToken, isProveedor, reservaController.updateEstado)

module.exports = router
