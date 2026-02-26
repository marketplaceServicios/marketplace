const express = require('express')
const router = express.Router()
const reviewController = require('../controllers/reviewController')

// Rutas públicas
router.get('/plan/:planId', reviewController.getByPlan)
router.post('/', reviewController.create)

module.exports = router
