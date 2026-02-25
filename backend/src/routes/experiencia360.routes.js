const express = require('express')
const router = express.Router()
const experiencia360Controller = require('../controllers/experiencia360Controller')

router.get('/', experiencia360Controller.getAll)

module.exports = router
