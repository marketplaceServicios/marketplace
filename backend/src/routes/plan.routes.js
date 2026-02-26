const express = require('express')
const router = express.Router()
const planController = require('../controllers/planController')
const { verifyToken, isProveedor } = require('../middlewares/auth')

// Rutas protegidas (proveedor) — deben ir antes de /:id
router.get('/mis/planes', verifyToken, isProveedor, planController.getMyPlanes)

// Rutas públicas
router.get('/', planController.getAll)
router.get('/destacados', planController.getFeatured)
router.get('/ofertas', planController.getOffers)
router.get('/:id/fechas-llenas', planController.getFechasLlenas)
router.get('/:id', planController.getById)
router.post('/', verifyToken, isProveedor, planController.create)
router.put('/:id', verifyToken, isProveedor, planController.update)
router.delete('/:id', verifyToken, isProveedor, planController.remove)

module.exports = router
