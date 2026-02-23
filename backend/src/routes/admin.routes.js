const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const contactoController = require('../controllers/contactoController')
const { verifyToken, isAdmin } = require('../middlewares/auth')

// Todas las rutas requieren ser admin
router.use(verifyToken, isAdmin)

router.get('/dashboard', adminController.getDashboard)
router.get('/usuarios', adminController.getUsuarios)

// Gestión de categorías globales
router.get('/categorias', adminController.getCategorias)
router.post('/categorias', adminController.createCategoria)
router.put('/categorias/:id', adminController.updateCategoria)
router.delete('/categorias/:id', adminController.deleteCategoria)

// Cotizaciones
router.get('/cotizaciones', adminController.getCotizaciones)

// Mensajes de contacto
router.get('/contactos', contactoController.getAll)
router.patch('/contactos/:id/leido', contactoController.marcarLeido)

// Gestión de planes
router.get('/planes', adminController.getPlanes)
router.patch('/planes/:id/toggle', adminController.togglePlan)
router.patch('/planes/:id/destacado', adminController.toggleDestacado)
router.patch('/planes/:id/oferta', adminController.toggleEsOferta)

module.exports = router
