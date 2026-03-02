const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// GET públicos (solo activos)
const getAll = async (req, res) => {
  try {
    const servicios = await prisma.servicioIncluido.findMany({
      where: { activo: true },
      orderBy: { orden: 'asc' },
    })
    res.json(servicios)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET admin (todos)
const getAllAdmin = async (req, res) => {
  try {
    const servicios = await prisma.servicioIncluido.findMany({
      orderBy: { orden: 'asc' },
    })
    res.json(servicios)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const create = async (req, res) => {
  try {
    const { slug, label, icono, activo = true, orden = 0 } = req.body
    if (!slug || !label || !icono)
      return res.status(400).json({ error: 'slug, label e icono son requeridos' })
    const servicio = await prisma.servicioIncluido.create({
      data: { slug, label, icono, activo, orden: parseInt(orden) || 0 },
    })
    res.status(201).json(servicio)
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'El slug ya existe' })
    res.status(500).json({ error: err.message })
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params
    const { label, icono, activo, orden } = req.body
    const servicio = await prisma.servicioIncluido.update({
      where: { id: parseInt(id) },
      data: {
        ...(label !== undefined && { label }),
        ...(icono !== undefined && { icono }),
        ...(activo !== undefined && { activo }),
        ...(orden !== undefined && { orden: parseInt(orden) }),
      },
    })
    res.json(servicio)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const remove = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.servicioIncluido.delete({ where: { id: parseInt(id) } })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { getAll, getAllAdmin, create, update, remove }
