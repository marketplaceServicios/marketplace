const prisma = require('../config/database')

// Público: testimonios activos ordenados
const getAll = async (req, res) => {
  try {
    const testimonios = await prisma.testimonio.findMany({
      where: { activo: true },
      orderBy: [{ orden: 'asc' }, { createdAt: 'desc' }]
    })
    res.json(testimonios)
  } catch (error) {
    console.error('Error en getAll testimonios:', error)
    res.status(500).json({ error: 'Error al obtener testimonios' })
  }
}

// Admin: todos los testimonios
const getAllAdmin = async (req, res) => {
  try {
    const testimonios = await prisma.testimonio.findMany({
      orderBy: [{ orden: 'asc' }, { createdAt: 'desc' }]
    })
    res.json(testimonios)
  } catch (error) {
    console.error('Error en getAllAdmin testimonios:', error)
    res.status(500).json({ error: 'Error al obtener testimonios' })
  }
}

const create = async (req, res) => {
  try {
    const { nombre, ciudad, texto, rating, foto, activo, orden } = req.body

    if (!nombre || !texto) {
      return res.status(400).json({ error: 'Nombre y texto son requeridos' })
    }

    const ratingNum = parseInt(rating) || 5
    if (ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: 'El rating debe ser entre 1 y 5' })
    }

    const testimonio = await prisma.testimonio.create({
      data: {
        nombre,
        ciudad: ciudad || null,
        texto,
        rating: ratingNum,
        foto: foto || null,
        activo: activo !== undefined ? activo : true,
        orden: parseInt(orden) || 0
      }
    })

    res.status(201).json({ message: 'Testimonio creado exitosamente', testimonio })
  } catch (error) {
    console.error('Error en create testimonio:', error)
    res.status(500).json({ error: 'Error al crear testimonio' })
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, ciudad, texto, rating, foto, activo, orden } = req.body

    const existing = await prisma.testimonio.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return res.status(404).json({ error: 'Testimonio no encontrado' })
    }

    const data = {}
    if (nombre !== undefined) data.nombre = nombre
    if (ciudad !== undefined) data.ciudad = ciudad || null
    if (texto !== undefined) data.texto = texto
    if (rating !== undefined) {
      const ratingNum = parseInt(rating)
      if (ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({ error: 'El rating debe ser entre 1 y 5' })
      }
      data.rating = ratingNum
    }
    if (foto !== undefined) data.foto = foto || null
    if (activo !== undefined) data.activo = activo
    if (orden !== undefined) data.orden = parseInt(orden)

    const testimonio = await prisma.testimonio.update({
      where: { id: parseInt(id) },
      data
    })

    res.json({ message: 'Testimonio actualizado exitosamente', testimonio })
  } catch (error) {
    console.error('Error en update testimonio:', error)
    res.status(500).json({ error: 'Error al actualizar testimonio' })
  }
}

const remove = async (req, res) => {
  try {
    const { id } = req.params

    const existing = await prisma.testimonio.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return res.status(404).json({ error: 'Testimonio no encontrado' })
    }

    await prisma.testimonio.delete({ where: { id: parseInt(id) } })

    res.json({ message: 'Testimonio eliminado exitosamente' })
  } catch (error) {
    console.error('Error en remove testimonio:', error)
    res.status(500).json({ error: 'Error al eliminar testimonio' })
  }
}

module.exports = { getAll, getAllAdmin, create, update, remove }
