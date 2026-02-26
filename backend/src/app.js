const express = require('express')
const cors = require('cors')
const path = require('path')

// Importar rutas
const authRoutes = require('./routes/auth.routes')
const adminRoutes = require('./routes/admin.routes')
const proveedorRoutes = require('./routes/proveedor.routes')
const categoriaRoutes = require('./routes/categoria.routes')
const planRoutes = require('./routes/plan.routes')
const reservaRoutes = require('./routes/reserva.routes')
const cotizacionRoutes = require('./routes/cotizacion.routes')
const contactoRoutes = require('./routes/contacto.routes')
const equipoRoutes = require('./routes/equipo.routes')
const testimonioRoutes = require('./routes/testimonio.routes')
const experiencia360Routes = require('./routes/experiencia360.routes')
const enlaceRapidoRoutes = require('./routes/enlaceRapido.routes')
const uploadRoutes = require('./routes/upload.routes')
const webhookRoutes = require('./routes/webhook.routes')
const reviewRoutes = require('./routes/review.routes')

const app = express()

// Configuración de CORS
const corsOptions = {
  origin: [
    process.env.ADMIN_URL,
    process.env.PROVEEDOR_URL,
    process.env.WEB_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176'
  ],
  credentials: true
}

// Middlewares globales
app.use(cors(corsOptions))
app.use(express.json({ limit: '10mb' }))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Vive Silver API funcionando',
    timestamp: new Date().toISOString()
  })
})

// Rutas de la API
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/proveedores', proveedorRoutes)
app.use('/api/categorias', categoriaRoutes)
app.use('/api/planes', planRoutes)
app.use('/api/reservas', reservaRoutes)
app.use('/api/cotizaciones', cotizacionRoutes)
app.use('/api/contacto', contactoRoutes)
app.use('/api/equipo', equipoRoutes)
app.use('/api/testimonios', testimonioRoutes)
app.use('/api/experiencias360', experiencia360Routes)
app.use('/api/enlaces-rapidos', enlaceRapidoRoutes)
app.use('/api/admin/upload', uploadRoutes)
app.use('/api/webhooks', webhookRoutes)
app.use('/api/resenas', reviewRoutes)

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path
  })
})

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  })
})

module.exports = app
