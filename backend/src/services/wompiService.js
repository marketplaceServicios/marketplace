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

  const publicKey = process.env.WOMPI_PUBLIC_KEY || ''
  const isSandbox = publicKey.startsWith('pub_test_')
  const baseUrl = isSandbox
    ? 'https://sandbox.wompi.co/p/'
    : 'https://checkout.wompi.co/p/'

  return `${baseUrl}?${params.toString()}`
}

/**
 * Verifica la firma del webhook de Wompi.
 * Algoritmo: SHA256(valor1 + valor2 + ... + timestamp + WOMPI_EVENTS_SECRET)
 * Donde los valores son los de event.signature.properties sobre event.data.transaction
 * Docs: https://docs.wompi.co/docs/en/events
 */
function verifyWebhookSignature(event, checksum) {
  const eventsSecret = process.env.WOMPI_EVENTS_SECRET || ''
  if (!eventsSecret) return true // sin secret configurado, omitir verificación

  const properties = event?.signature?.properties || []
  const transaction = event?.data?.transaction || {}
  const timestamp = event?.timestamp

  if (!timestamp) return false

  const propertyValues = properties.map((prop) => {
    // prop es "transaction.id", "transaction.status", etc.
    const keys = prop.split('.').slice(1) // quita "transaction."
    return keys.reduce((obj, key) => (obj != null ? obj[key] : ''), transaction) ?? ''
  })

  const concatenated = propertyValues.join('') + timestamp + eventsSecret
  const hash = crypto.createHash('sha256').update(concatenated).digest('hex')
  return hash === checksum
}

module.exports = { buildCheckoutUrl, verifyWebhookSignature }
