export const servicios = [
  { id: 1, nombre: 'Catering', descripcion: 'Servicios de alimentacion para eventos' },
  { id: 2, nombre: 'Wedding planner', descripcion: 'Organizacion de bodas' },
  { id: 3, nombre: 'Decoracion y ambientacion', descripcion: 'Decoracion para eventos' },
  { id: 4, nombre: 'Montaje y produccion', descripcion: 'Montaje tecnico de eventos' },
  { id: 5, nombre: 'Musica y entretenimiento', descripcion: 'DJs, bandas y entretenimiento' },
  { id: 6, nombre: 'Turismo y hospedaje', descripcion: 'Hoteles y turismo' },
  { id: 7, nombre: 'Transporte', descripcion: 'Transporte para eventos' },
]

export const empresas = [
  {
    id: 1,
    nombre: 'Empresa Turistran',
    nombreLegal: 'Turistran S.A.S',
    tipoServicio: 'Transporte',
    nit: '900123456-1',
    direccion: 'Calle 45 #23-15, Bogota',
    telefonoFijo: '(1) 234 5678',
    celular: '+57 311 234 5678',
    correo: 'contacto@turistran.com',
    planesActivos: 15,
    planesPausados: 3,
    cotizacionesResueltas: 115,
    cotizacionesPendientes: 5,
    reservasConcretadas: 200,
    avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
    representante: {
      nombre: 'Carlos Rodriguez',
      tipoDocumento: 'Cedula de ciudadania',
      documento: '1234567890',
      direccion: 'Carrera 15 #45-30, Bogota',
      telefonoFijo: '(1) 234 5679',
      celular: '+57 312 345 6789',
      correo: 'carlos.rodriguez@turistran.com'
    },
    documentos: [
      { id: 1, nombre: 'RUT', url: '/docs/rut.pdf' },
      { id: 2, nombre: 'Registro mercantil', url: '/docs/registro.pdf' },
      { id: 3, nombre: 'Certificacion bancaria', url: '/docs/banco.pdf' },
      { id: 4, nombre: 'Cedula representante legal', url: '/docs/cedula.pdf' },
    ]
  },
  {
    id: 2,
    nombre: 'Empresa Bodas',
    nombreLegal: 'Bodas Perfectas Ltda',
    tipoServicio: 'Wedding planner',
    nit: '900234567-2',
    direccion: 'Avenida 68 #12-45, Medellin',
    telefonoFijo: '(4) 345 6789',
    celular: '+57 313 456 7890',
    correo: 'info@bodasperfectas.com',
    planesActivos: 8,
    planesPausados: 1,
    cotizacionesResueltas: 87,
    cotizacionesPendientes: 12,
    reservasConcretadas: 156,
    avatar: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=100&h=100&fit=crop',
    representante: {
      nombre: 'Maria Lopez',
      tipoDocumento: 'Cedula de ciudadania',
      documento: '9876543210',
      direccion: 'Calle 10 #20-30, Medellin',
      telefonoFijo: '(4) 345 6780',
      celular: '+57 314 567 8901',
      correo: 'maria.lopez@bodasperfectas.com'
    },
    documentos: [
      { id: 1, nombre: 'RUT', url: '/docs/rut.pdf' },
      { id: 2, nombre: 'Registro mercantil', url: '/docs/registro.pdf' },
      { id: 3, nombre: 'Certificacion bancaria', url: '/docs/banco.pdf' },
      { id: 4, nombre: 'Cedula representante legal', url: '/docs/cedula.pdf' },
    ]
  },
  {
    id: 3,
    nombre: 'Empresa Catering',
    nombreLegal: 'Catering Gourmet S.A',
    tipoServicio: 'Catering',
    nit: '900345678-3',
    direccion: 'Carrera 7 #45-67, Cali',
    telefonoFijo: '(2) 456 7890',
    celular: '+57 315 678 9012',
    correo: 'contacto@cateringgourmet.com',
    planesActivos: 22,
    planesPausados: 5,
    cotizacionesResueltas: 234,
    cotizacionesPendientes: 8,
    reservasConcretadas: 312,
    avatar: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=100&h=100&fit=crop',
    representante: {
      nombre: 'Pedro Sanchez',
      tipoDocumento: 'Cedula de ciudadania',
      documento: '5678901234',
      direccion: 'Avenida 5 #15-25, Cali',
      telefonoFijo: '(2) 456 7891',
      celular: '+57 316 789 0123',
      correo: 'pedro.sanchez@cateringgourmet.com'
    },
    documentos: [
      { id: 1, nombre: 'RUT', url: '/docs/rut.pdf' },
      { id: 2, nombre: 'Registro mercantil', url: '/docs/registro.pdf' },
      { id: 3, nombre: 'Certificacion bancaria', url: '/docs/banco.pdf' },
      { id: 4, nombre: 'Cedula representante legal', url: '/docs/cedula.pdf' },
    ]
  },
  {
    id: 4,
    nombre: 'Empresa Turistran',
    nombreLegal: 'Turistran Norte S.A.S',
    tipoServicio: 'Turismo y hospedaje',
    nit: '900456789-4',
    direccion: 'Calle 80 #45-30, Barranquilla',
    telefonoFijo: '(5) 567 8901',
    celular: '+57 317 890 1234',
    correo: 'info@turistrannorte.com',
    planesActivos: 10,
    planesPausados: 2,
    cotizacionesResueltas: 156,
    cotizacionesPendientes: 4,
    reservasConcretadas: 189,
    avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
    representante: {
      nombre: 'Ana Martinez',
      tipoDocumento: 'Cedula de ciudadania',
      documento: '3456789012',
      direccion: 'Carrera 50 #60-70, Barranquilla',
      telefonoFijo: '(5) 567 8902',
      celular: '+57 318 901 2345',
      correo: 'ana.martinez@turistrannorte.com'
    },
    documentos: [
      { id: 1, nombre: 'RUT', url: '/docs/rut.pdf' },
      { id: 2, nombre: 'Registro mercantil', url: '/docs/registro.pdf' },
      { id: 3, nombre: 'Certificacion bancaria', url: '/docs/banco.pdf' },
      { id: 4, nombre: 'Cedula representante legal', url: '/docs/cedula.pdf' },
    ]
  },
  {
    id: 5,
    nombre: 'Empresa Turistran',
    nombreLegal: 'Turistran Sur Ltda',
    tipoServicio: 'Transporte',
    nit: '900567890-5',
    direccion: 'Avenida 30 #15-45, Cartagena',
    telefonoFijo: '(5) 678 9012',
    celular: '+57 319 012 3456',
    correo: 'contacto@turistransur.com',
    planesActivos: 6,
    planesPausados: 1,
    cotizacionesResueltas: 78,
    cotizacionesPendientes: 3,
    reservasConcretadas: 95,
    avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
    representante: {
      nombre: 'Luis Gomez',
      tipoDocumento: 'Cedula de ciudadania',
      documento: '2345678901',
      direccion: 'Calle 25 #30-40, Cartagena',
      telefonoFijo: '(5) 678 9013',
      celular: '+57 320 123 4567',
      correo: 'luis.gomez@turistransur.com'
    },
    documentos: [
      { id: 1, nombre: 'RUT', url: '/docs/rut.pdf' },
      { id: 2, nombre: 'Registro mercantil', url: '/docs/registro.pdf' },
      { id: 3, nombre: 'Certificacion bancaria', url: '/docs/banco.pdf' },
      { id: 4, nombre: 'Cedula representante legal', url: '/docs/cedula.pdf' },
    ]
  },
]

export const usuarios = [
  { id: 1, nombre: 'Juan Perez', rol: 'Coordinador', celular: '+57 300 111 2222', correo: 'juan@empresa.com', empresaId: 1 },
  { id: 2, nombre: 'Maria Garcia', rol: 'Asistente', celular: '+57 300 222 3333', correo: 'maria@empresa.com', empresaId: 1 },
  { id: 3, nombre: 'Carlos Lopez', rol: 'Conductor', celular: '+57 300 333 4444', correo: 'carlos@empresa.com', empresaId: 1 },
  { id: 4, nombre: 'Ana Rodriguez', rol: 'Administradora', celular: '+57 300 444 5555', correo: 'ana@empresa.com', empresaId: 2 },
  { id: 5, nombre: 'Pedro Martinez', rol: 'Chef', celular: '+57 300 555 6666', correo: 'pedro@empresa.com', empresaId: 3 },
  { id: 6, nombre: 'Laura Sanchez', rol: 'Mesera', celular: '+57 300 666 7777', correo: 'laura@empresa.com', empresaId: 3 },
]

export const dashboardData = {
  serviciosActivos: [
    { name: 'Catering', value: 25, color: '#F5A524' },
    { name: 'Wedding planner', value: 15, color: '#EF4444' },
    { name: 'Decoracion', value: 20, color: '#10B981' },
    { name: 'Transporte', value: 18, color: '#6366F1' },
    { name: 'Otros', value: 22, color: '#8B5CF6' },
  ],
  empresasPorServicio: [
    { name: 'Catering', empresas: 12 },
    { name: 'Wedding', empresas: 8 },
    { name: 'Decoracion', empresas: 15 },
    { name: 'Montaje', empresas: 6 },
    { name: 'Musica', empresas: 10 },
    { name: 'Turismo', empresas: 9 },
  ],
  actividad: {
    empresasUltimoMes: 3,
    empresasActivas: 10,
    serviciosAsociados: 12,
  }
}

export const adminUser = {
  id: 1,
  nombre: 'Sandra Bones',
  email: 'sandra.bones@company.io',
  celular: '+57 111 222 3334',
  fechaNacimiento: '1987-11-10',
  direccion: '12/ A Street Name, Manizales, Colombia',
  rol: 'Administrador',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  username: '@Sandra.Bones'
}
