const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // Crear Admin
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@vivesilver.com' },
    update: {},
    create: {
      email: 'admin@vivesilver.com',
      password: adminPassword,
      nombre: 'Administrador Vive Silver'
    }
  })
  console.log('✅ Admin creado:', admin.email)

  // Crear Proveedor de ejemplo
  const proveedorPassword = await bcrypt.hash('proveedor123', 10)
  const proveedor = await prisma.proveedor.upsert({
    where: { email: 'viajes@ejemplo.com' },
    update: {},
    create: {
      adminId: admin.id,
      nombreEmpresa: 'Viajes Colombia Aventura',
      email: 'viajes@ejemplo.com',
      password: proveedorPassword,
      telefono: '3001234567',
      direccion: 'Calle 100 #15-20, Bogotá',
      descripcion: 'Somos una agencia de viajes especializada en experiencias únicas para adultos mayores.'
    }
  })
  console.log('✅ Proveedor creado:', proveedor.email)

  // Desactivar categorías antiguas por proveedor (si existen)
  await prisma.categoria.updateMany({
    where: { proveedorId: { not: null } },
    data: { activo: false }
  })

  // Crear categorías globales (solo el admin puede gestionarlas)
  const categoriasGlobales = [
    { nombre: 'Bodas Silver', slug: 'bodas-silver', descripcion: 'Celebraciones cuidadas, locaciones confiables y planificación sin estrés.', icono: 'rings', imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800' },
    { nombre: 'Viajes Silver', slug: 'viajes-silver', descripcion: 'Rutas tranquilas, tiempos humanos y experiencias con sentido.', icono: 'plane', imagen: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' },
    { nombre: 'Celebraciones', slug: 'celebraciones', descripcion: 'Aniversarios, renovación de votos, encuentros familiares.', icono: 'party', imagen: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800' },
    { nombre: 'Servicios', slug: 'servicios', descripcion: 'Fotografía, música, catering y aliados verificados para tu evento o viaje.', icono: 'sparkles', imagen: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800' },
  ]

  const categorias = []
  for (let i = 0; i < categoriasGlobales.length; i++) {
    const cat = await prisma.categoria.upsert({
      where: { id: i + 10 },
      update: { activo: true, ...categoriasGlobales[i] },
      create: { id: i + 10, proveedorId: null, ...categoriasGlobales[i] }
    })
    categorias.push(cat)
  }
  console.log('✅ Categorías globales creadas:', categorias.length)

  // Crear Planes de ejemplo
  const planes = await Promise.all([
    prisma.plan.upsert({
      where: { id: 1 },
      update: {},
      create: {
        proveedorId: proveedor.id,
        categoriaId: categorias[1].id, // Viajes Silver
        titulo: 'Catedral de Sal - Zipaquirá',
        descripcion: 'Visita la majestuosa Catedral de Sal, una joya arquitectónica construida en el interior de las minas de sal de Zipaquirá.',
        ubicacion: 'Zipaquirá, Cundinamarca',
        precio: 150000,
        duracion: '1 día',
        imagenes: ['https://images.unsplash.com/photo-1569161031903-96c4e671c5bd'],
        incluye: ['Transporte', 'Guía turístico', 'Entrada a la catedral', 'Seguro de viaje'],
        amenidades: ['transport', 'guide'],
        destacado: true
      }
    }),
    prisma.plan.upsert({
      where: { id: 2 },
      update: {},
      create: {
        proveedorId: proveedor.id,
        categoriaId: categorias[1].id, // Viajes Silver
        titulo: 'Amazonas - 4 días de aventura',
        descripcion: 'Explora la selva amazónica colombiana con guías expertos y vive una experiencia inolvidable.',
        ubicacion: 'Leticia, Amazonas',
        precio: 1200000,
        precioOriginal: 1500000,
        duracion: '4 días / 3 noches',
        imagenes: ['https://images.unsplash.com/photo-1516026672322-bc52d61a55d5'],
        incluye: ['Vuelos', 'Alojamiento', 'Alimentación', 'Tours', 'Guía'],
        amenidades: ['transport', 'restaurant', 'guide', 'photos'],
        destacado: true,
        esOferta: true
      }
    }),
    prisma.plan.upsert({
      where: { id: 3 },
      update: {},
      create: {
        proveedorId: proveedor.id,
        categoriaId: categorias[1].id, // Viajes Silver
        titulo: 'San Andrés Paradise',
        descripcion: 'Disfruta del mar de los siete colores en este paraíso caribeño.',
        ubicacion: 'San Andrés Isla',
        precio: 1450000,
        duracion: '5 días / 4 noches',
        imagenes: ['https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b'],
        incluye: ['Vuelos', 'Hotel 4 estrellas', 'Desayunos', 'Tour en lancha'],
        amenidades: ['transport', 'restaurant', 'spa'],
        destacado: true
      }
    })
  ])
  console.log('✅ Planes creados:', planes.length)

  // Crear 100 planes de prueba para scroll infinito
  const ubicaciones = [
    'Cartagena, Bolívar', 'Medellín, Antioquia', 'Santa Marta, Magdalena',
    'Bogotá, Cundinamarca', 'Cali, Valle del Cauca', 'Bucaramanga, Santander',
    'Pereira, Risaralda', 'Barranquilla, Atlántico', 'Villa de Leyva, Boyacá',
    'Salento, Quindío', 'Barichara, Santander', 'Guatapé, Antioquia',
    'San Gil, Santander', 'Popayán, Cauca', 'Manizales, Caldas'
  ]
  const titulos = [
    'Escapada romántica', 'Aventura natural', 'Tour cultural', 'Relax total',
    'Experiencia gastronómica', 'Ruta colonial', 'Senderismo suave',
    'Paseo por el río', 'Atardecer mágico', 'Recorrido histórico',
    'Día de spa', 'Tour del café', 'Playa y brisa', 'Noche de gala',
    'Caminata ecológica', 'Festival local', 'Retiro de bienestar',
    'Travesía en lancha', 'Visita a hacienda', 'Mirador panorámico'
  ]
  const duraciones = ['4 horas', '1 día', '2 días / 1 noche', '3 días / 2 noches', '5 días / 4 noches']

  const bulkPlans = []
  for (let i = 0; i < 100; i++) {
    const catIndex = i % categorias.length
    const precio = 100000 + Math.floor(Math.random() * 4900000)
    bulkPlans.push({
      proveedorId: proveedor.id,
      categoriaId: categorias[catIndex].id,
      titulo: `${titulos[i % titulos.length]} en ${ubicaciones[i % ubicaciones.length].split(',')[0]}`,
      descripcion: `Plan especial: ${titulos[i % titulos.length].toLowerCase()} con acompañamiento y comodidad garantizada.`,
      ubicacion: ubicaciones[i % ubicaciones.length],
      precio,
      precioOriginal: Math.random() > 0.7 ? Math.round(precio * 1.25) : null,
      duracion: duraciones[i % duraciones.length],
      imagenes: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600'],
      incluye: ['Transporte', 'Guía', 'Seguro'],
      amenidades: ['transport', 'guide'],
      activo: true
    })
  }
  await prisma.plan.createMany({ data: bulkPlans, skipDuplicates: true })
  console.log('✅ 100 planes de prueba creados')

  // Crear Usuario de ejemplo
  const usuarioPassword = await bcrypt.hash('usuario123', 10)
  const usuario = await prisma.usuario.upsert({
    where: { email: 'usuario@ejemplo.com' },
    update: {},
    create: {
      nombre: 'Juan Pérez',
      email: 'usuario@ejemplo.com',
      password: usuarioPassword,
      telefono: '3109876543'
    }
  })
  console.log('✅ Usuario creado:', usuario.email)

  // Crear Testimonios iniciales
  const testimoniosData = [
    {
      nombre: 'María González',
      ciudad: 'Bogotá',
      texto: 'Lo que más me gustó fue la claridad. Sabíamos exactamente qué esperar, los accesos, los tiempos y el acompañamiento.',
      rating: 5,
      foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      orden: 1
    },
    {
      nombre: 'Carlos Rodríguez',
      ciudad: 'Medellín',
      texto: 'Mi mamá se sintió cuidada desde el primer mensaje. El equipo fue atento y resolvió todas nuestras dudas sin afán.',
      rating: 5,
      foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      orden: 2
    },
    {
      nombre: 'Ana Martínez',
      ciudad: 'Manizales',
      texto: 'El acompañamiento fue excepcional. Nos sentimos tranquilos en todo momento y la experiencia superó nuestras expectativas.',
      rating: 5,
      foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      orden: 3
    }
  ]

  for (let i = 0; i < testimoniosData.length; i++) {
    await prisma.testimonio.upsert({
      where: { id: i + 1 },
      update: testimoniosData[i],
      create: { id: i + 1, ...testimoniosData[i] }
    })
  }
  console.log('✅ Testimonios creados:', testimoniosData.length)

  // Crear Servicios Incluidos
  const serviciosData = [
    { slug: 'transport',     label: 'Transporte',        icono: 'Bus',           orden: 0  },
    { slug: 'food',          label: 'Alimentación',       icono: 'Utensils',      orden: 1  },
    { slug: 'guide',         label: 'Guía turístico',     icono: 'UserCheck',     orden: 2  },
    { slug: 'photos',        label: 'Fotos',              icono: 'Camera',        orden: 3  },
    { slug: 'hotel',         label: 'Alojamiento',        icono: 'Home',          orden: 4  },
    { slug: 'breakfast',     label: 'Desayuno',           icono: 'Coffee',        orden: 5  },
    { slug: 'spa',           label: 'SPA',                icono: 'Sparkles',      orden: 6  },
    { slug: 'pool',          label: 'Piscina',            icono: 'Waves',         orden: 7  },
    { slug: 'medical',       label: 'Asistencia médica',  icono: 'Heart',         orden: 8  },
    { slug: 'insurance',     label: 'Seguro de viaje',    icono: 'Shield',        orden: 9  },
    { slug: 'wifi',          label: 'WiFi',               icono: 'Wifi',          orden: 10 },
    { slug: 'parking',       label: 'Parqueadero',        icono: 'Car',           orden: 11 },
    { slug: 'entertainment', label: 'Entretenimiento',    icono: 'Music',         orden: 12 },
    { slug: 'shopping',      label: 'Compras',            icono: 'ShoppingBag',   orden: 13 },
    { slug: 'accessibility', label: 'Silla de ruedas',    icono: 'Accessibility', orden: 14 },
    { slug: 'tour',          label: 'Recorrido guiado',   icono: 'Compass',       orden: 15 },
    { slug: 'wellness',      label: 'Bienestar',          icono: 'Leaf',          orden: 16 },
    { slug: 'activities',    label: 'Actividades',        icono: 'Activity',      orden: 17 },
    { slug: 'workshop',      label: 'Taller / Clase',     icono: 'BookOpen',      orden: 18 },
    { slug: 'dinner',        label: 'Cena incluida',      icono: 'Star',          orden: 19 },
  ]
  for (const s of serviciosData) {
    await prisma.servicioIncluido.upsert({
      where: { slug: s.slug },
      update: { label: s.label, icono: s.icono, orden: s.orden },
      create: s,
    })
  }
  console.log('✅ Servicios incluidos creados:', serviciosData.length)

  console.log('')
  console.log('🎉 Seed completado!')
  console.log('')
  console.log('📋 Credenciales de prueba:')
  console.log('   Admin:     admin@vivesilver.com / admin123')
  console.log('   Proveedor: viajes@ejemplo.com / proveedor123')
  console.log('   Usuario:   usuario@ejemplo.com / usuario123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
