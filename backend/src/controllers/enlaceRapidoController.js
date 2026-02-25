const prisma = require('../config/database')

const getAll = async (req, res) => {
  try {
    const enlaces = await prisma.enlaceRapido.findMany({
      where: { activo: true },
      orderBy: [{ orden: 'asc' }, { createdAt: 'desc' }]
    })
    res.json(enlaces)
  } catch (error) {
    console.error('Error en getAll enlacesRapidos:', error)
    res.status(500).json({ error: 'Error al obtener enlaces rápidos' })
  }
}

const getAllAdmin = async (req, res) => {
  try {
    const enlaces = await prisma.enlaceRapido.findMany({
      orderBy: [{ orden: 'asc' }, { createdAt: 'desc' }]
    })
    res.json(enlaces)
  } catch (error) {
    console.error('Error en getAllAdmin enlacesRapidos:', error)
    res.status(500).json({ error: 'Error al obtener enlaces rápidos' })
  }
}

const create = async (req, res) => {
  try {
    const { titulo, url, activo, orden } = req.body
    if (!titulo || !url) {
      return res.status(400).json({ error: 'Título y URL son requeridos' })
    }
    const enlace = await prisma.enlaceRapido.create({
      data: {
        titulo,
        url,
        activo: activo !== undefined ? activo : true,
        orden: parseInt(orden) || 0
      }
    })
    res.status(201).json({ message: 'Enlace creado exitosamente', enlace })
  } catch (error) {
    console.error('Error en create enlaceRapido:', error)
    res.status(500).json({ error: 'Error al crear enlace rápido' })
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params
    const { titulo, url, activo, orden } = req.body

    const existing = await prisma.enlaceRapido.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return res.status(404).json({ error: 'Enlace no encontrado' })
    }

    const data = {}
    if (titulo !== undefined) data.titulo = titulo
    if (url !== undefined) data.url = url
    if (activo !== undefined) data.activo = activo
    if (orden !== undefined) data.orden = parseInt(orden)

    const enlace = await prisma.enlaceRapido.update({
      where: { id: parseInt(id) },
      data
    })
    res.json({ message: 'Enlace actualizado exitosamente', enlace })
  } catch (error) {
    console.error('Error en update enlaceRapido:', error)
    res.status(500).json({ error: 'Error al actualizar enlace rápido' })
  }
}

const remove = async (req, res) => {
  try {
    const { id } = req.params
    const existing = await prisma.enlaceRapido.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return res.status(404).json({ error: 'Enlace no encontrado' })
    }
    await prisma.enlaceRapido.delete({ where: { id: parseInt(id) } })
    res.json({ message: 'Enlace eliminado exitosamente' })
  } catch (error) {
    console.error('Error en remove enlaceRapido:', error)
    res.status(500).json({ error: 'Error al eliminar enlace rápido' })
  }
}

module.exports = { getAll, getAllAdmin, create, update, remove }
