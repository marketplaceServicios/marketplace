const prisma = require('../config/database')

// GET /planes/mis/fechas-bloqueadas
// Retorna [{ planId, planTitulo, fecha }] para todos los planes del proveedor autenticado
const getFechasBloqueadas = async (req, res) => {
  try {
    const proveedorId = req.proveedor.id
    const datos = await prisma.fechaBloqueada.findMany({
      where: { plan: { proveedorId } },
      select: {
        planId: true,
        fecha: true,
        plan: { select: { titulo: true } }
      },
      orderBy: { fecha: 'asc' }
    })
    res.json(datos.map((d) => ({ planId: d.planId, planTitulo: d.plan.titulo, fecha: d.fecha })))
  } catch (error) {
    console.error('Error en getFechasBloqueadas:', error)
    res.status(500).json({ error: 'Error al obtener fechas bloqueadas' })
  }
}

// POST /planes/mis/fechas-bloqueadas  body: { fecha: "YYYY-MM-DD", planIds: [1, 2, 3] }
// Bloquea una fecha para uno o varios planes del proveedor
const bloquearFecha = async (req, res) => {
  try {
    const proveedorId = req.proveedor.id
    const { fecha, planIds } = req.body

    if (!fecha || !planIds?.length) {
      return res.status(400).json({ error: 'Fecha y al menos un plan son requeridos' })
    }

    // Verificar que todos los planes pertenecen al proveedor
    const planes = await prisma.plan.findMany({
      where: { id: { in: planIds }, proveedorId }
    })
    if (planes.length !== planIds.length) {
      return res.status(403).json({ error: 'Alguno de los planes no te pertenece' })
    }

    await Promise.all(
      planIds.map((planId) =>
        prisma.fechaBloqueada.upsert({
          where: { planId_fecha: { planId, fecha } },
          update: {},
          create: { planId, fecha }
        })
      )
    )

    res.status(201).json({ message: 'Fecha bloqueada', planes: planIds.length })
  } catch (error) {
    console.error('Error en bloquearFecha:', error)
    res.status(500).json({ error: 'Error al bloquear fecha' })
  }
}

// DELETE /planes/mis/fechas-bloqueadas/:planId/:fecha
// Desbloquea una fecha para un plan específico
const desbloquearFecha = async (req, res) => {
  try {
    const proveedorId = req.proveedor.id
    const { planId, fecha } = req.params

    const plan = await prisma.plan.findFirst({
      where: { id: parseInt(planId), proveedorId }
    })
    if (!plan) return res.status(403).json({ error: 'El plan no te pertenece' })

    await prisma.fechaBloqueada.deleteMany({ where: { planId: parseInt(planId), fecha } })
    res.json({ message: 'Fecha desbloqueada' })
  } catch (error) {
    console.error('Error en desbloquearFecha:', error)
    res.status(500).json({ error: 'Error al desbloquear fecha' })
  }
}

module.exports = { getFechasBloqueadas, bloquearFecha, desbloquearFecha }
