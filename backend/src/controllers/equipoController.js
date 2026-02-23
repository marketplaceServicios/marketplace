const prisma = require('../config/database')

// Obtener equipo del proveedor
const getByProveedor = async (req, res) => {
  try {
    const proveedorId = req.proveedor.id

    const equipo = await prisma.equipo.findMany({
      where: { proveedorId, activo: true },
      orderBy: { nombre: 'asc' }
    })

    res.json(equipo)
  } catch (error) {
    console.error('Error en getByProveedor equipo:', error)
    res.status(500).json({ error: 'Error al obtener equipo' })
  }
}

// Crear miembro del equipo
const create = async (req, res) => {
  try {
    const proveedorId = req.proveedor.id
    const { nombre, cargo, email, telefono, foto } = req.body

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' })
    }

    const miembro = await prisma.equipo.create({
      data: { proveedorId, nombre, cargo, email, telefono, foto }
    })

    res.status(201).json({
      message: 'Miembro agregado exitosamente',
      miembro
    })
  } catch (error) {
    console.error('Error en create equipo:', error)
    res.status(500).json({ error: 'Error al crear miembro' })
  }
}

// Actualizar miembro del equipo
const update = async (req, res) => {
  try {
    const { id } = req.params
    const proveedorId = req.proveedor.id
    const { nombre, cargo, email, telefono, foto } = req.body

    const existing = await prisma.equipo.findFirst({
      where: { id: parseInt(id), proveedorId }
    })

    if (!existing) {
      return res.status(404).json({ error: 'Miembro no encontrado' })
    }

    const miembro = await prisma.equipo.update({
      where: { id: parseInt(id) },
      data: { nombre, cargo, email, telefono, foto }
    })

    res.json({
      message: 'Miembro actualizado exitosamente',
      miembro
    })
  } catch (error) {
    console.error('Error en update equipo:', error)
    res.status(500).json({ error: 'Error al actualizar miembro' })
  }
}

// Eliminar miembro del equipo
const remove = async (req, res) => {
  try {
    const { id } = req.params
    const proveedorId = req.proveedor.id

    const existing = await prisma.equipo.findFirst({
      where: { id: parseInt(id), proveedorId }
    })

    if (!existing) {
      return res.status(404).json({ error: 'Miembro no encontrado' })
    }

    await prisma.equipo.update({
      where: { id: parseInt(id) },
      data: { activo: false }
    })

    res.json({ message: 'Miembro eliminado exitosamente' })
  } catch (error) {
    console.error('Error en remove equipo:', error)
    res.status(500).json({ error: 'Error al eliminar miembro' })
  }
}

module.exports = { getByProveedor, create, update, remove }
