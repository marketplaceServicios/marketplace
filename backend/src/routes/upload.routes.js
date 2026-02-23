const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const { verifyToken, isAdmin } = require('../middlewares/auth')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'))
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`
    cb(null, unique)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Solo se permiten imágenes'))
  }
})

router.post('/', verifyToken, isAdmin, (req, res, next) => {
  upload.single('imagen')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'La imagen supera el límite de 5 MB permitido en el servidor.' })
      }
      return res.status(400).json({ error: err.message || 'Error al procesar la imagen' })
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo' })
    }
    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    res.json({ url })
  })
})

module.exports = router
