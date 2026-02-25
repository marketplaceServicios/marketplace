const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const contactoController = require('../controllers/contactoController')
const testimonioController = require('../controllers/testimonioController')
const experiencia360Controller = require('../controllers/experiencia360Controller')
const enlaceRapidoController = require('../controllers/enlaceRapidoController')
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

// Testimonios
router.get('/testimonios', testimonioController.getAllAdmin)
router.post('/testimonios', testimonioController.create)
router.put('/testimonios/:id', testimonioController.update)
router.delete('/testimonios/:id', testimonioController.remove)

// Experiencias 360
router.get('/experiencias360', experiencia360Controller.getAllAdmin)
router.post('/experiencias360', experiencia360Controller.create)
router.put('/experiencias360/:id', experiencia360Controller.update)
router.delete('/experiencias360/:id', experiencia360Controller.remove)

// Enlaces rápidos
router.get('/enlaces-rapidos', enlaceRapidoController.getAllAdmin)
router.post('/enlaces-rapidos', enlaceRapidoController.create)
router.put('/enlaces-rapidos/:id', enlaceRapidoController.update)
router.delete('/enlaces-rapidos/:id', enlaceRapidoController.remove)

// Gestión de planes
router.get('/planes', adminController.getPlanes)
router.patch('/planes/:id/toggle', adminController.togglePlan)
router.patch('/planes/:id/destacado', adminController.toggleDestacado)
router.patch('/planes/:id/oferta', adminController.toggleEsOferta)

module.exports = router
