require('dotenv').config()
const app = require('./app')

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`
  🚀 Servidor Vive Silver corriendo en puerto ${PORT}
  📍 http://localhost:${PORT}
  🌿 Ambiente: ${process.env.NODE_ENV}
  `)
})
