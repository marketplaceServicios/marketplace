const prisma = require('../config/database')
const { verifyWebhookSignature } = require('../services/wompiService')

const wompiWebhook = async (req, res) => {
  // Siempre responder 200 para que Wompi no reintente
  try {
    const checksum = req.headers['x-event-checksum']
    const event = req.body

    console.log('[Wompi webhook] evento recibido:', JSON.stringify({
      id: event?.id,
      event: event?.event,
      timestamp: event?.timestamp,
      environment: event?.environment,
      status: event?.data?.transaction?.status,
      reference: event?.data?.transaction?.reference,
      checksumHeader: checksum,
      signatureProps: event?.signature?.properties,
    }))

    if (!event || !event.data || !event.data.transaction) {
      console.log('[Wompi webhook] evento sin transaction, ignorando')
      return res.status(200).json({ received: true })
    }

    // Verificar firma si viene el header
    if (checksum && !verifyWebhookSignature(event, checksum)) {
      console.warn('[Wompi webhook] firma inválida, ignorando evento')
      return res.status(200).json({ received: true })
    }

    const { status, reference } = event.data.transaction

    const nuevoEstado =
      status === 'APPROVED' ? 'confirmada' :
      status === 'DECLINED' || status === 'VOIDED' ? 'cancelada' :
      null

    if (nuevoEstado && reference) {
      await prisma.reserva.updateMany({
        where: { codigo: reference },
        data: { estado: nuevoEstado }
      })
      console.log(`[Wompi webhook] reserva ${reference} → ${nuevoEstado}`)
    } else {
      console.log(`[Wompi webhook] sin acción: status=${status}, reference=${reference}`)
    }

    res.status(200).json({ received: true })
  } catch (error) {
    console.error('[Wompi webhook] error:', error)
    res.status(200).json({ received: true })
  }
}

module.exports = { wompiWebhook }
