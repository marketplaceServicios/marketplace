const express = require('express')
const router = express.Router()
const planController = require('../controllers/planController')
const fechaBloqueadaController = require('../controllers/fechaBloqueadaController')
const { verifyToken, isProveedor } = require('../middlewares/auth')

// Rutas protegidas (proveedor) — deben ir antes de /:id
router.get('/mis/planes', verifyToken, isProveedor, planController.getMyPlanes)
router.get('/mis/fechas-bloqueadas', verifyToken, isProveedor, fechaBloqueadaController.getFechasBloqueadas)
router.post('/mis/fechas-bloqueadas', verifyToken, isProveedor, fechaBloqueadaController.bloquearFecha)
router.delete('/mis/fechas-bloqueadas/:planId/:fecha', verifyToken, isProveedor, fechaBloqueadaController.desbloquearFecha)

// Rutas públicas
router.get('/', planController.getAll)
router.get('/destacados', planController.getFeatured)
router.get('/ofertas', planController.getOffers)
router.get('/:id/fechas-llenas', planController.getFechasLlenas)
router.get('/:id/cupos', planController.getCuposDisponibles)
router.get('/:id', planController.getById)
router.post('/', verifyToken, isProveedor, planController.create)
router.put('/:id', verifyToken, isProveedor, planController.update)
router.delete('/:id', verifyToken, isProveedor, planController.remove)

module.exports = router
