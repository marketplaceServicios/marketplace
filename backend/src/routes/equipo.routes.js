const express = require('express')
const router = express.Router()
const equipoController = require('../controllers/equipoController')
const { verifyToken, isProveedor } = require('../middlewares/auth')

// Todas las rutas requieren ser proveedor
router.use(verifyToken, isProveedor)

router.get('/', equipoController.getByProveedor)
router.post('/', equipoController.create)
router.put('/:id', equipoController.update)
router.delete('/:id', equipoController.remove)

module.exports = router
