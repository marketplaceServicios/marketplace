const prisma = require('../config/database')

// Crear mensaje desde la web pública (sin auth)
const create = async (req, res) => {
  try {
    const { nombre, email, celular, mensaje, preferenciaContacto } = req.body

    if (!nombre || !email || !celular || !mensaje) {
      return res.status(400).json({ error: 'Nombre, email, celular y mensaje son requeridos' })
    }

    const contacto = await prisma.contacto.create({
      data: {
        nombre,
        email,
        celular,
        mensaje,
        preferenciaContacto: preferenciaContacto || 'whatsapp',
      }
    })

    res.status(201).json({ message: 'Mensaje enviado exitosamente', contacto })
  } catch (error) {
    console.error('Error en create contacto:', error)
    res.status(500).json({ error: 'Error al enviar mensaje' })
  }
}

// Obtener todos los mensajes (Admin)
const getAll = async (req, res) => {
  try {
    const contactos = await prisma.contacto.findMany({
      orderBy: { createdAt: 'desc' }
    })
    res.json(contactos)
  } catch (error) {
    console.error('Error en getAll contactos:', error)
    res.status(500).json({ error: 'Error al obtener mensajes' })
  }
}

// Marcar como leído (Admin)
const marcarLeido = async (req, res) => {
  try {
    const { id } = req.params
    const contacto = await prisma.contacto.update({
      where: { id: parseInt(id) },
      data: { leido: true }
    })
    res.json(contacto)
  } catch (error) {
    console.error('Error en marcarLeido contacto:', error)
    res.status(500).json({ error: 'Error al marcar como leído' })
  }
}

module.exports = { create, getAll, marcarLeido }
