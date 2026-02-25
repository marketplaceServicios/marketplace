const express = require('express')
const router = express.Router()
const enlaceRapidoController = require('../controllers/enlaceRapidoController')

router.get('/', enlaceRapidoController.getAll)

module.exports = router
