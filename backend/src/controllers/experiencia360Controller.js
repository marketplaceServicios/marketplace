const prisma = require('../config/database')

const getAll = async (req, res) => {
  try {
    const experiencias = await prisma.experiencia360.findMany({
      where: { activo: true },
      orderBy: [{ orden: 'asc' }, { createdAt: 'desc' }]
    })
    res.json(experiencias)
  } catch (error) {
    console.error('Error en getAll experiencias360:', error)
    res.status(500).json({ error: 'Error al obtener experiencias 360' })
  }
}

const getAllAdmin = async (req, res) => {
  try {
    const experiencias = await prisma.experiencia360.findMany({
      orderBy: [{ orden: 'asc' }, { createdAt: 'desc' }]
    })
    res.json(experiencias)
  } catch (error) {
    console.error('Error en getAllAdmin experiencias360:', error)
    res.status(500).json({ error: 'Error al obtener experiencias 360' })
  }
}

const create = async (req, res) => {
  try {
    const { titulo, descripcion, iframeSrc, thumbnail, activo, orden } = req.body
    if (!titulo || !iframeSrc) {
      return res.status(400).json({ error: 'Título e iframeSrc son requeridos' })
    }
    const experiencia = await prisma.experiencia360.create({
      data: {
        titulo,
        descripcion: descripcion || null,
        iframeSrc,
        thumbnail: thumbnail || null,
        activo: activo !== undefined ? activo : true,
        orden: parseInt(orden) || 0
      }
    })
    res.status(201).json({ message: 'Experiencia 360 creada exitosamente', experiencia })
  } catch (error) {
    console.error('Error en create experiencia360:', error)
    res.status(500).json({ error: 'Error al crear experiencia 360' })
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params
    const { titulo, descripcion, iframeSrc, thumbnail, activo, orden } = req.body

    const existing = await prisma.experiencia360.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return res.status(404).json({ error: 'Experiencia 360 no encontrada' })
    }

    const data = {}
    if (titulo !== undefined) data.titulo = titulo
    if (descripcion !== undefined) data.descripcion = descripcion || null
    if (iframeSrc !== undefined) data.iframeSrc = iframeSrc
    if (thumbnail !== undefined) data.thumbnail = thumbnail || null
    if (activo !== undefined) data.activo = activo
    if (orden !== undefined) data.orden = parseInt(orden)

    const experiencia = await prisma.experiencia360.update({
      where: { id: parseInt(id) },
      data
    })
    res.json({ message: 'Experiencia 360 actualizada exitosamente', experiencia })
  } catch (error) {
    console.error('Error en update experiencia360:', error)
    res.status(500).json({ error: 'Error al actualizar experiencia 360' })
  }
}

const remove = async (req, res) => {
  try {
    const { id } = req.params
    const existing = await prisma.experiencia360.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return res.status(404).json({ error: 'Experiencia 360 no encontrada' })
    }
    await prisma.experiencia360.delete({ where: { id: parseInt(id) } })
    res.json({ message: 'Experiencia 360 eliminada exitosamente' })
  } catch (error) {
    console.error('Error en remove experiencia360:', error)
    res.status(500).json({ error: 'Error al eliminar experiencia 360' })
  }
}

module.exports = { getAll, getAllAdmin, create, update, remove }
