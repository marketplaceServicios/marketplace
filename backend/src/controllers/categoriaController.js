const prisma = require('../config/database')

// Obtener todas las categorías globales (público)
const getAll = async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      where: { activo: true, proveedorId: null },
      include: { _count: { select: { planes: true } } },
      orderBy: { nombre: 'asc' }
    })

    res.json(categorias)
  } catch (error) {
    console.error('Error en getAll categorias:', error)
    res.status(500).json({ error: 'Error al obtener categorías' })
  }
}

// Obtener una categoría por ID (público)
const getById = async (req, res) => {
  try {
    const { id } = req.params

    const categoria = await prisma.categoria.findUnique({
      where: { id: parseInt(id) },
      include: {
        planes: { where: { activo: true } }
      }
    })

    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' })
    }

    res.json(categoria)
  } catch (error) {
    console.error('Error en getById categoria:', error)
    res.status(500).json({ error: 'Error al obtener categoría' })
  }
}

// Obtener una categoría por slug (público)
const getBySlug = async (req, res) => {
  try {
    const { slug } = req.params

    const categoria = await prisma.categoria.findUnique({
      where: { slug },
      include: { _count: { select: { planes: true } } }
    })

    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' })
    }

    res.json(categoria)
  } catch (error) {
    console.error('Error en getBySlug categoria:', error)
    res.status(500).json({ error: 'Error al obtener categoría' })
  }
}

module.exports = { getAll, getById, getBySlug }
