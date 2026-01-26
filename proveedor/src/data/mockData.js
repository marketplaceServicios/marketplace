// Categorías del proveedor
export const mockCategorias = [
  {
    id: 1,
    nombre: 'Ciudades',
    descripcion: 'Planes turisticos en ciudades principales',
    imagen: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300&h=200&fit=crop'
  },
  {
    id: 2,
    nombre: 'Playa',
    descripcion: 'Destinos de playa y costa',
    imagen: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop'
  },
  {
    id: 3,
    nombre: 'Naturaleza',
    descripcion: 'Experiencias en la naturaleza',
    imagen: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop'
  },
  {
    id: 4,
    nombre: 'Aventura',
    descripcion: 'Actividades de aventura y deportes extremos',
    imagen: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=300&h=200&fit=crop'
  },
  {
    id: 5,
    nombre: 'Cultural',
    descripcion: 'Tours culturales e historicos',
    imagen: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=300&h=200&fit=crop'
  },
  {
    id: 6,
    nombre: 'Gastronomia',
    descripcion: 'Experiencias gastronomicas',
    imagen: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=200&fit=crop'
  },
  {
    id: 7,
    nombre: 'Bienestar',
    descripcion: 'Spa y bienestar',
    imagen: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=200&fit=crop'
  }
]

// Planes del proveedor
export const mockPlanes = [
  // Ciudades
  {
    id: 1,
    titulo: 'Catedral de sal',
    descripcion: 'Visita guiada a la catedral de sal de Zipaquira',
    categoria: 'Ciudades',
    valor: 150000,
    imagen: 'https://images.unsplash.com/photo-1583531172705-9b3b5d8e6e9b?w=400&h=300&fit=crop',
    isPrincipal: true,
    isOferta: false
  },
  {
    id: 2,
    titulo: 'Ipiales',
    descripcion: 'Tour al santuario de Las Lajas',
    categoria: 'Ciudades',
    valor: 280000,
    imagen: 'https://images.unsplash.com/photo-1568402102990-bc541580b59f?w=400&h=300&fit=crop',
    isPrincipal: false,
    isOferta: true
  },
  // Playa
  {
    id: 3,
    titulo: 'Cartagena',
    descripcion: 'Paquete completo en Cartagena de Indias',
    categoria: 'Playa',
    valor: 450000,
    imagen: 'https://images.unsplash.com/photo-1583531172705-9b3b5d8e6e9b?w=400&h=300&fit=crop',
    isPrincipal: false,
    isOferta: false
  },
  {
    id: 4,
    titulo: 'San Andres',
    descripcion: 'Paraiso en el Caribe colombiano',
    categoria: 'Playa',
    valor: 850000,
    imagen: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=400&h=300&fit=crop',
    isPrincipal: true,
    isOferta: false
  },
  {
    id: 5,
    titulo: 'Pacifico',
    descripcion: 'Avistamiento de ballenas en el Pacifico',
    categoria: 'Playa',
    valor: 650000,
    imagen: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    isPrincipal: false,
    isOferta: true
  },
  // Naturaleza
  {
    id: 6,
    titulo: 'Cascada 1',
    descripcion: 'Caminata a cascadas naturales',
    categoria: 'Naturaleza',
    valor: 120000,
    imagen: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=400&h=300&fit=crop',
    isPrincipal: false,
    isOferta: false
  },
  {
    id: 7,
    titulo: 'Cascada 2',
    descripcion: 'Tour de cascadas premium',
    categoria: 'Naturaleza',
    valor: 180000,
    imagen: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400&h=300&fit=crop',
    isPrincipal: true,
    isOferta: false
  },
  {
    id: 8,
    titulo: 'Cascada 3',
    descripcion: 'Aventura en cascadas secretas',
    categoria: 'Naturaleza',
    valor: 220000,
    imagen: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&h=300&fit=crop',
    isPrincipal: false,
    isOferta: true
  }
]

// Reservas
export const mockReservas = [
  {
    id: 1,
    fecha: '2026-01-21',
    servicio: 'Tour Cartagena',
    horario: '02:13 PM - 7:00 PM',
    cliente: 'Juan Perez',
    direccion: 'Calle 123, Bogota',
    cantidadPersonas: 4,
    valorPagado: 1800000,
    otrosItems: ['Transporte incluido', 'Almuerzo'],
    color: 'teal'
  },
  {
    id: 2,
    fecha: '2026-01-15',
    servicio: 'Catedral de Sal',
    horario: '09:00 AM - 2:00 PM',
    cliente: 'Maria Rodriguez',
    direccion: 'Carrera 45, Medellin',
    cantidadPersonas: 2,
    valorPagado: 300000,
    otrosItems: ['Guia bilingue'],
    color: 'green'
  },
  {
    id: 3,
    fecha: '2026-01-08',
    servicio: 'San Andres Premium',
    horario: 'Todo el dia',
    cliente: 'Carlos Gomez',
    direccion: 'Av Principal, Cali',
    cantidadPersonas: 6,
    valorPagado: 5100000,
    otrosItems: ['Hotel 5 estrellas', 'Snorkel', 'Paseo en bote'],
    color: 'blue'
  },
  {
    id: 4,
    fecha: '2026-01-25',
    servicio: 'Cascadas Tour',
    horario: '07:00 AM - 5:00 PM',
    cliente: 'Ana Martinez',
    direccion: 'Calle 80, Bogota',
    cantidadPersonas: 8,
    valorPagado: 960000,
    otrosItems: ['Refrigerio', 'Equipo de seguridad'],
    color: 'amber'
  }
]

// Cotizaciones
export const mockCotizaciones = [
  {
    id: 1,
    titulo: 'Cotizacion 1',
    plan: 'Tour Cartagena',
    categoria: 'Ciudades',
    cliente: 'Pedro Sanchez',
    email: 'pedro@email.com',
    telefono: '+57 300 123 4567',
    presupuesto: '$2,000,000 - $3,000,000',
    fechaRequerida: '15 de marzo 2026',
    fechaCreacion: '02 de febrero',
    fechaServicio: '20 de febrero',
    requerimientos: 'Necesitamos transporte para 10 personas desde Bogota. Preferimos hotel en el centro historico.',
    imagen: 'https://images.unsplash.com/photo-1583531172705-9b3b5d8e6e9b?w=400&h=300&fit=crop',
    resuelta: false
  },
  {
    id: 2,
    titulo: 'Cotizacion 2',
    plan: 'San Andres VIP',
    categoria: 'Playa',
    cliente: 'Laura Jimenez',
    email: 'laura@email.com',
    telefono: '+57 310 987 6543',
    presupuesto: '$5,000,000 - $8,000,000',
    fechaRequerida: '20 de abril 2026',
    fechaCreacion: '02 de febrero',
    fechaServicio: '20 de febrero',
    requerimientos: 'Viaje de bodas para 2 personas. Queremos la experiencia mas lujosa posible.',
    imagen: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=400&h=300&fit=crop',
    resuelta: false
  },
  {
    id: 3,
    titulo: 'Cotizacion 3',
    plan: 'Aventura Cascadas',
    categoria: 'Naturaleza',
    cliente: 'Roberto Castro',
    email: 'roberto@email.com',
    telefono: '+57 320 456 7890',
    presupuesto: '$500,000 - $1,000,000',
    fechaRequerida: '10 de febrero 2026',
    fechaCreacion: '02 de febrero',
    fechaServicio: '20 de febrero',
    requerimientos: 'Grupo de 15 companeros de trabajo. Necesitamos actividades de team building.',
    imagen: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=400&h=300&fit=crop',
    resuelta: false
  },
  {
    id: 4,
    titulo: 'Cotizacion 4',
    plan: 'Catedral de Sal',
    categoria: 'Ciudades',
    cliente: 'Sofia Vargas',
    email: 'sofia@email.com',
    telefono: '+57 315 111 2222',
    presupuesto: '$300,000 - $500,000',
    fechaRequerida: '25 de febrero 2026',
    fechaCreacion: '02 de febrero',
    fechaServicio: '20 de febrero',
    requerimientos: 'Familia con 2 ninos pequenos. Necesitamos guia en espanol.',
    imagen: 'https://images.unsplash.com/photo-1568402102990-bc541580b59f?w=400&h=300&fit=crop',
    resuelta: false
  },
  {
    id: 5,
    titulo: 'Cotizacion 5',
    plan: 'Tour Pacifico',
    categoria: 'Playa',
    cliente: 'Miguel Angel',
    email: 'miguel@email.com',
    telefono: '+57 301 333 4444',
    presupuesto: '$3,000,000 - $4,000,000',
    fechaRequerida: '1 de agosto 2026',
    fechaCreacion: '02 de febrero',
    fechaServicio: '20 de febrero',
    requerimientos: 'Queremos ver ballenas. Grupo de 4 personas. Fechas flexibles.',
    imagen: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    resuelta: true
  },
  {
    id: 6,
    titulo: 'Cotizacion 6',
    plan: 'Ipiales Tour',
    categoria: 'Ciudades',
    cliente: 'Carmen Ruiz',
    email: 'carmen@email.com',
    telefono: '+57 318 555 6666',
    presupuesto: '$400,000 - $600,000',
    fechaRequerida: '5 de marzo 2026',
    fechaCreacion: '02 de febrero',
    fechaServicio: '20 de febrero',
    requerimientos: 'Tour religioso para grupo de la iglesia. 20 personas mayores.',
    imagen: 'https://images.unsplash.com/photo-1583531172705-9b3b5d8e6e9b?w=400&h=300&fit=crop',
    resuelta: false
  }
]

// Equipo del proveedor
export const mockEquipo = [
  {
    id: 1,
    nombre: 'Josh Homme',
    email: 'j.homme@company.io',
    celular: '+57 300 111 2222',
    fechaNacimiento: '15/03/1985',
    direccion: 'Calle 50, Bogota',
    rol: 'Operaciones',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
  },
  {
    id: 2,
    nombre: 'Jeanette Horse',
    email: 'j.horse@company.io',
    celular: '+57 310 222 3333',
    fechaNacimiento: '22/07/1990',
    direccion: 'Carrera 15, Medellin',
    rol: 'Atencion al cliente',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
  },
  {
    id: 3,
    nombre: 'Donatella Ruler',
    email: 'd.ruler@company.io',
    celular: '+57 320 333 4444',
    fechaNacimiento: '10/11/1988',
    direccion: 'Av 68, Cali',
    rol: 'Producto',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
  },
  {
    id: 4,
    nombre: 'Steve Smith',
    email: 's.smith@company.io',
    celular: '+57 315 444 5555',
    fechaNacimiento: '05/01/1992',
    direccion: 'Calle 100, Bogota',
    rol: 'Ventas',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
  },
  {
    id: 5,
    nombre: 'Charles Cash',
    email: 'ch.cash@company.io',
    celular: '+57 301 555 6666',
    fechaNacimiento: '18/09/1987',
    direccion: 'Carrera 7, Bogota',
    rol: 'Contabilidad',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
  },
  {
    id: 6,
    nombre: 'Veronica Python',
    email: 'v.python@company.io',
    celular: '+57 318 666 7777',
    fechaNacimiento: '30/04/1991',
    direccion: 'Calle 72, Barranquilla',
    rol: 'Administrador',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
  },
  {
    id: 7,
    nombre: 'Brittany Shrimp',
    email: 'b.shrymp@company.io',
    celular: '+57 320 777 8888',
    fechaNacimiento: '12/12/1993',
    direccion: 'Av El Dorado, Bogota',
    rol: 'Ventas',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop'
  },
  {
    id: 8,
    nombre: 'Arnold Barbell',
    email: 'a.barbell@company.io',
    celular: '+57 310 888 9999',
    fechaNacimiento: '25/06/1989',
    direccion: 'Calle 80, Medellin',
    rol: 'Atencion al cliente',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop'
  }
]

// Roles disponibles
export const roles = [
  'Operaciones',
  'Producto',
  'Atencion al cliente',
  'Administrador',
  'Contabilidad',
  'Ventas'
]

// Colores por rol
export const roleColors = {
  'Operaciones': 'terracotta',
  'Producto': 'sage',
  'Atencion al cliente': 'slate',
  'Administrador': 'olive',
  'Contabilidad': 'warning',
  'Ventas': 'sage'
}
