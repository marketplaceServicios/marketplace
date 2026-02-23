const express = require('express')
const router = express.Router()
const categoriaController = require('../controllers/categoriaController')

// Solo lectura pública — el CRUD lo gestiona el admin
router.get('/', categoriaController.getAll)
router.get('/:id', categoriaController.getById)

module.exports = router
