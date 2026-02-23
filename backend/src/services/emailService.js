const nodemailer = require('nodemailer')

function createTransporter() {
  if (!process.env.SMTP_HOST) return null
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

async function sendWelcomeProveedorEmail({ email, nombreEmpresa, password }) {
  const loginUrl = `${process.env.PROVEEDOR_URL}/login`

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <body style="font-family: Georgia, serif; background: #f5f0eb; margin: 0; padding: 32px;">
      <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
        <div style="background: #3D4A3A; padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px; letter-spacing: 1px;">Vive Silver</h1>
          <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 14px;">Panel de Proveedores</p>
        </div>

        <div style="padding: 32px;">
          <h2 style="color: #3D4A3A; margin: 0 0 8px;">¡Bienvenido a Vive Silver!</h2>
          <p style="color: #6b7280; margin: 0 0 24px;">
            Hola, <strong>${nombreEmpresa}</strong>. Tu cuenta como proveedor ha sido creada exitosamente.
            A continuación encontrarás tus credenciales para acceder al panel.
          </p>

          <div style="background: #f5f0eb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; color: #3D4A3A; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Tus credenciales de acceso</p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #6b7280; font-size: 14px; width: 110px;">Correo</td>
                <td style="padding: 6px 0; color: #3D4A3A; font-size: 14px; font-weight: bold;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Contraseña</td>
                <td style="padding: 6px 0; color: #3D4A3A; font-size: 14px; font-weight: bold; font-family: monospace; letter-spacing: 1px;">${password}</td>
              </tr>
            </table>
          </div>

          <div style="background: #fff8f0; border: 1px solid #CB7A5B40; border-radius: 8px; padding: 16px; margin-bottom: 28px;">
            <p style="margin: 0; color: #CB7A5B; font-size: 13px;">
              <strong>Importante:</strong> Al ingresar por primera vez se te pedirá que cambies tu contraseña
              por una de tu elección. Guarda este correo hasta entonces.
            </p>
          </div>

          <div style="text-align: center;">
            <a href="${loginUrl}" style="display: inline-block; background: #3D4A3A; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: bold;">
              Ingresar al panel
            </a>
          </div>
        </div>

        <div style="padding: 20px 32px; background: #f9f9f7; border-top: 1px solid #e5e0d8; text-align: center;">
          <p style="margin: 0; color: #9ca3af; font-size: 12px;">
            Si tienes problemas para ingresar, contacta a tu administrador Vive Silver.
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  const transporter = createTransporter()

  if (!transporter) {
    // Modo desarrollo sin SMTP configurado: mostrar en consola
    console.log('\n' + '='.repeat(60))
    console.log('📧  WELCOME EMAIL (no SMTP configured — dev mode)')
    console.log('='.repeat(60))
    console.log(`  To:        ${email}`)
    console.log(`  Empresa:   ${nombreEmpresa}`)
    console.log(`  Contraseña: ${password}`)
    console.log(`  Login URL: ${loginUrl}`)
    console.log('='.repeat(60) + '\n')
    return
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"Vive Silver" <noreply@vivesilver.com>',
    to: email,
    subject: `Bienvenido a Vive Silver — Tus credenciales de acceso`,
    html,
  })
}

module.exports = { sendWelcomeProveedorEmail }
