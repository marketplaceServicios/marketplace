const express = require('express')
const router = express.Router()
const testimonioController = require('../controllers/testimonioController')

// GET /api/testimonios — público
router.get('/', testimonioController.getAll)

module.exports = router
