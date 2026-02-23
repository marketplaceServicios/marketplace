const crypto = require('crypto')

/**
 * Construye la URL del checkout de Wompi con firma de integridad.
 * Docs: https://docs.wompi.co/docs/en/widget
 */
function buildCheckoutUrl({ reference, amountCents, currency, email, redirectUrl }) {
  const integritySecret = process.env.WOMPI_INTEGRITY_SECRET || ''
  const signatureString = `${reference}${amountCents}${currency}${integritySecret}`
  const integrity = crypto.createHash('sha256').update(signatureString).digest('hex')

  const params = new URLSearchParams({
    'public-key': process.env.WOMPI_PUBLIC_KEY || '',
    currency,
    'amount-in-cents': String(amountCents),
    reference,
    'redirect-url': redirectUrl,
    'signature:integrity': integrity,
  })

  if (email) {
    params.set('customer-data:email', email)
  }

  return `https://checkout.wompi.co/p/?${params.toString()}`
}

/**
 * Verifica la firma del webhook de Wompi.
 * Docs: https://docs.wompi.co/docs/en/events
 */
function verifyWebhookSignature(eventId, timestamp, checksum) {
  const eventsSecret = process.env.WOMPI_EVENTS_SECRET || ''
  const hash = crypto
    .createHash('sha256')
    .update(`${eventId}${timestamp}${eventsSecret}`)
    .digest('hex')
  return hash === checksum
}

module.exports = { buildCheckoutUrl, verifyWebhookSignature }
