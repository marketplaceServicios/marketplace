const prisma = require('../config/database')

// Obtener reseñas aprobadas de un plan (público)
const getByPlan = async (req, res) => {
  try {
    const { planId } = req.params
    const id = parseInt(planId)

    const [resenas, agg] = await Promise.all([
      prisma.resena.findMany({
        where: { planId: id, estado: 'aprobado' },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.resena.aggregate({
        where: { planId: id, estado: 'aprobado' },
        _avg: { rating: true },
        _count: { id: true }
      })
    ])

    res.json({
      resenas,
      rating: agg._avg.rating ? parseFloat(agg._avg.rating.toFixed(1)) : 0,
      total: agg._count.id
    })
  } catch (error) {
    console.error('Error en getByPlan resenas:', error)
    res.status(500).json({ error: 'Error al obtener reseñas' })
  }
}

// Crear reseña (público, con validación hCaptcha)
const create = async (req, res) => {
  try {
    const { planId, nombre, email, rating, comentario, captchaToken } = req.body

    // Validaciones básicas
    if (!planId || !nombre || !email || !rating || !comentario) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'El rating debe ser entre 1 y 5' })
    }

    if (comentario.length > 200) {
      return res.status(400).json({ error: 'El comentario no puede exceder 200 caracteres' })
    }

    // Verificar hCaptcha
    const hcaptchaSecret = process.env.HCAPTCHA_SECRET_KEY
    if (hcaptchaSecret) {
      if (!captchaToken) {
        return res.status(400).json({ error: 'Captcha requerido' })
      }

      const verifyRes = await fetch('https://api.hcaptcha.com/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `response=${captchaToken}&secret=${hcaptchaSecret}`
      })
      const verifyData = await verifyRes.json()

      if (!verifyData.success) {
        return res.status(400).json({ error: 'Captcha inválido' })
      }
    }

    // Verificar que el plan existe
    const plan = await prisma.plan.findUnique({ where: { id: parseInt(planId) } })
    if (!plan) {
      return res.status(404).json({ error: 'Plan no encontrado' })
    }

    const resena = await prisma.resena.create({
      data: {
        planId: parseInt(planId),
        nombre,
        email,
        rating: parseInt(rating),
        comentario
      }
    })

    res.status(201).json({
      message: 'Reseña enviada. Será visible después de revisión.',
      resena
    })
  } catch (error) {
    console.error('Error en create resena:', error)
    res.status(500).json({ error: 'Error al crear reseña' })
  }
}

// Obtener todas las reseñas (admin)
const getAllAdmin = async (req, res) => {
  try {
    const { estado } = req.query

    const where = {}
    if (estado && estado !== 'todos') {
      where.estado = estado
    }

    const [resenas, conteos] = await Promise.all([
      prisma.resena.findMany({
        where,
        include: {
          plan: { select: { id: true, titulo: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.resena.groupBy({
        by: ['estado'],
        _count: { id: true }
      })
    ])

    const counts = { pendiente: 0, aprobado: 0, rechazado: 0 }
    conteos.forEach(c => { counts[c.estado] = c._count.id })

    res.json({ resenas, counts })
  } catch (error) {
    console.error('Error en getAllAdmin resenas:', error)
    res.status(500).json({ error: 'Error al obtener reseñas' })
  }
}

// Actualizar estado de una reseña (admin)
const updateEstado = async (req, res) => {
  try {
    const { id } = req.params
    const { estado } = req.body

    if (!['aprobado', 'rechazado'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' })
    }

    if (estado === 'rechazado') {
      await prisma.resena.delete({ where: { id: parseInt(id) } })
      return res.json({ message: 'Reseña eliminada permanentemente' })
    }

    const resena = await prisma.resena.update({
      where: { id: parseInt(id) },
      data: { estado }
    })

    res.json({ message: 'Reseña aprobada', resena })
  } catch (error) {
    console.error('Error en updateEstado resena:', error)
    res.status(500).json({ error: 'Error al actualizar reseña' })
  }
}

// Actualizar estado en lote (admin)
const batchUpdateEstado = async (req, res) => {
  try {
    const { ids, estado } = req.body

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Se requiere un array de IDs' })
    }

    if (!['aprobado', 'rechazado'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' })
    }

    const intIds = ids.map(id => parseInt(id))

    if (estado === 'rechazado') {
      await prisma.resena.deleteMany({ where: { id: { in: intIds } } })
      return res.json({ message: `${intIds.length} reseñas eliminadas permanentemente` })
    }

    await prisma.resena.updateMany({
      where: { id: { in: intIds } },
      data: { estado }
    })

    res.json({ message: `${intIds.length} reseñas aprobadas` })
  } catch (error) {
    console.error('Error en batchUpdateEstado resenas:', error)
    res.status(500).json({ error: 'Error al actualizar reseñas' })
  }
}

module.exports = {
  getByPlan,
  create,
  getAllAdmin,
  updateEstado,
  batchUpdateEstado
}
