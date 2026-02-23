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
    { nombre: 'Bodas Silver', descripcion: 'Celebraciones cuidadas, locaciones confiables y planificación sin estrés.', icono: 'rings', imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800' },
    { nombre: 'Viajes Silver', descripcion: 'Rutas tranquilas, tiempos humanos y experiencias con sentido.', icono: 'plane', imagen: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' },
    { nombre: 'Celebraciones', descripcion: 'Aniversarios, renovación de votos, encuentros familiares.', icono: 'party', imagen: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800' },
    { nombre: 'Servicios', descripcion: 'Fotografía, música, catering y aliados verificados para tu evento o viaje.', icono: 'sparkles', imagen: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800' },
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
