const prisma = require('../config/database')
const { verifyWebhookSignature } = require('../services/wompiService')

const wompiWebhook = async (req, res) => {
  // Siempre responder 200 para que Wompi no reintente
  try {
    const checksum = req.headers['x-event-checksum']
    const event = req.body

    if (!event || !event.data || !event.data.transaction) {
      return res.status(200).json({ received: true })
    }

    const { id: eventId, sent_at: timestamp } = event

    // Verificar firma si viene el header
    if (checksum && !verifyWebhookSignature(eventId, timestamp, checksum)) {
      console.warn('Wompi webhook: firma inválida, ignorando evento')
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
      console.log(`Wompi webhook: reserva ${reference} → ${nuevoEstado}`)
    }

    res.status(200).json({ received: true })
  } catch (error) {
    console.error('Error procesando webhook Wompi:', error)
    res.status(200).json({ received: true })
  }
}

module.exports = { wompiWebhook }
