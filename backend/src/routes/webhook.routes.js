const express = require('express')
const router = express.Router()
const webhookController = require('../controllers/webhookController')

router.post('/wompi', webhookController.wompiWebhook)

module.exports = router
