# Panel del Proveedor - Vive Silver

## Descripcion General

El Panel del Proveedor es una aplicacion web desarrollada en React que permite a los proveedores del marketplace Vive Silver gestionar sus planes turisticos, categorias, reservas, cotizaciones y equipo de trabajo.

---

## Stack Tecnologico

| Tecnologia | Version | Uso |
|------------|---------|-----|
| React | 18.2.0 | Framework principal |
| Vite | 5.0.0 | Build tool y servidor de desarrollo |
| Tailwind CSS | 3.3.6 | Estilos utilitarios |
| React Router | 6.20.0 | Navegacion SPA |
| Zustand | 4.4.7 | Gestion de estado global |
| Recharts | 2.10.0 | Graficos y visualizaciones |
| Lucide React | 0.294.0 | Iconos |
| date-fns | 2.30.0 | Manejo de fechas |
| Radix UI | 2.0.0+ | Componentes accesibles |

---

## Estructura del Proyecto

```
proveedor/
├── public/
│   └── logo.png
├── src/
│   ├── components/
│   │   ├── ui/                    # Componentes base (shadcn/ui pattern)
│   │   │   ├── button.jsx
│   │   │   ├── input.jsx
│   │   │   ├── select.jsx
│   │   │   ├── card.jsx
│   │   │   ├── avatar.jsx
│   │   │   ├── badge.jsx
│   │   │   └── tabs.jsx
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx        # Navegacion lateral responsive
│   │   │   ├── MainLayout.jsx     # Layout principal con Outlet
│   │   │   └── PageHeader.jsx     # Encabezado de paginas
│   │   ├── shared/
│   │   │   ├── PlanCard.jsx       # Card de plan con acciones
│   │   │   ├── CategoryCard.jsx   # Card de categoria
│   │   │   ├── CotizacionCard.jsx # Card de cotizacion
│   │   │   ├── TeamMemberCard.jsx # Card de miembro del equipo
│   │   │   ├── ActivityPanel.jsx  # Panel de KPIs
│   │   │   ├── FileUpload.jsx     # Carga de archivos
│   │   │   ├── PhotoGallery.jsx   # Galeria con seleccion principal
│   │   │   ├── DynamicFieldList.jsx # Campos dinamicos
│   │   │   └── ReservationDetail.jsx # Detalle de reserva
│   │   ├── charts/
│   │   │   ├── PieChart.jsx       # Grafica circular
│   │   │   └── BarChart.jsx       # Grafica de barras
│   │   └── forms/
│   │       ├── FormField.jsx      # Input con label
│   │       ├── FormSelect.jsx     # Select con label
│   │       └── FormTextarea.jsx   # Textarea estilizado
│   ├── pages/
│   │   ├── LoginPage.jsx          # Inicio de sesion
│   │   ├── DashboardPage.jsx      # Panel principal
│   │   ├── PlanesPage.jsx         # Lista de planes
│   │   ├── CrearPlanPage.jsx      # Crear/editar plan
│   │   ├── CategoriasPage.jsx     # Lista de categorias
│   │   ├── CrearCategoriaPage.jsx # Crear/editar categoria
│   │   ├── ReservasPage.jsx       # Calendario de reservas
│   │   ├── CotizacionesPage.jsx   # Lista de cotizaciones
│   │   ├── DetalleCotizacionPage.jsx # Detalle de cotizacion
│   │   ├── EquipoPage.jsx         # Gestion de equipo
│   │   ├── CrearUsuarioPage.jsx   # Crear/editar usuario
│   │   └── PerfilPage.jsx         # Configuracion de perfil
│   ├── store/
│   │   ├── authStore.js           # Estado de autenticacion
│   │   ├── planesStore.js         # Estado de planes
│   │   ├── categoriasStore.js     # Estado de categorias
│   │   ├── reservasStore.js       # Estado de reservas
│   │   ├── cotizacionesStore.js   # Estado de cotizaciones
│   │   └── equipoStore.js         # Estado del equipo
│   ├── data/
│   │   └── mockData.js            # Datos de prueba
│   ├── lib/
│   │   └── utils.js               # Utilidades (cn)
│   ├── App.jsx                    # Rutas principales
│   ├── main.jsx                   # Punto de entrada
│   └── index.css                  # Estilos globales
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## Paleta de Colores

La paleta utiliza tonos naturales y terrosos de la marca Vive Silver:

| Color | Hex | CSS Variable | Uso |
|-------|-----|--------------|-----|
| Primary | #3D4A3A | `--primary` | Verde bosque - Sidebar, textos principales |
| Primary Light | #747F64 | `--primary-light` | Olive green - Variante clara |
| Accent | #CB7A5B | `--accent` | Terracotta - Botones primarios, CTAs |
| Accent Hover | #984A16 | `--accent-hover` | Burnt Sienna - Estados hover |
| Sage | #889B76 | `--sage` | Sage green - Elementos secundarios |
| Slate | #5C757A | `--slate` | Slate blue - Textos secundarios |
| Cream | #E8E2D8 | `--cream` | Almond cream - Bordes, fondos claros |
| Ivory | #E3D6C5 | `--ivory` | Ivory sand - Inputs, fondos |
| Background | #F5F3EF | `--background` | Fondo principal |
| Warning | #D4A039 | `--warning` | Amarillo - Alertas, badges |
| Danger | #B94A3D | `--danger` | Rojo terroso - Errores, eliminar |

---

## Rutas de la Aplicacion

| Ruta | Pagina | Descripcion |
|------|--------|-------------|
| `/login` | LoginPage | Inicio de sesion |
| `/` | DashboardPage | Panel principal con KPIs y graficos |
| `/planes` | PlanesPage | Lista de planes agrupados por categoria |
| `/crear-plan` | CrearPlanPage | Formulario para crear nuevo plan |
| `/categorias` | CategoriasPage | Grid de categorias |
| `/crear-categoria` | CrearCategoriaPage | Formulario para crear categoria |
| `/reservas` | ReservasPage | Calendario interactivo de reservas |
| `/cotizaciones` | CotizacionesPage | Lista de cotizaciones pendientes |
| `/cotizaciones/:id` | DetalleCotizacionPage | Detalle de una cotizacion |
| `/equipo` | EquipoPage | Grid de miembros del equipo |
| `/equipo/crear` | CrearUsuarioPage | Formulario para crear usuario |
| `/perfil` | PerfilPage | Configuracion del perfil |

---

## Stores (Zustand)

### authStore
Maneja el estado de autenticacion y perfil del usuario.

```javascript
{
  user: { id, nombre, email, avatar, rol, ... },
  isAuthenticated: boolean,
  login: (email, password) => void,
  logout: () => void,
  updateProfile: (data) => void
}
```

### planesStore
Gestiona los planes turisticos del proveedor.

```javascript
{
  planes: [],
  addPlan: (plan) => void,
  setPlanPrincipal: (id) => void,
  setPlanOferta: (id) => void,
  getPlanesByCategoria: () => {}
}
```

### categoriasStore
Administra las categorias de planes.

```javascript
{
  categorias: [],
  addCategoria: (categoria) => void,
  updateCategoria: (id, data) => void,
  deleteCategoria: (id) => void
}
```

### reservasStore
Controla las reservas y el calendario.

```javascript
{
  reservas: [],
  selectedDate: null,
  fechasBloqueadas: [],
  setSelectedDate: (date) => void,
  getReservasByDate: (date) => [],
  getReservasByMonth: (year, month) => [],
  bloquearFecha: (date) => void,
  addReserva: (reserva) => void
}
```

### cotizacionesStore
Gestiona las cotizaciones de clientes.

```javascript
{
  cotizaciones: [],
  filtroCategoria: 'todas',
  setFiltroCategoria: (cat) => void,
  getCotizacionesFiltradas: () => [],
  getCotizacionById: (id) => {},
  marcarResuelta: (id) => void,
  getCotizacionesSinResponder: () => number
}
```

### equipoStore
Administra el equipo del proveedor.

```javascript
{
  miembros: [],
  filtroRol: 'todos',
  busqueda: '',
  setFiltroRol: (rol) => void,
  setBusqueda: (texto) => void,
  getMiembrosFiltrados: () => [],
  addMiembro: (miembro) => void,
  updateMiembro: (id, data) => void,
  deleteMiembro: (id) => void
}
```

---

## Componentes Principales

### Layout Components

#### Sidebar
Navegacion lateral responsive con soporte para submenu (cotizaciones).
- Mobile: Menu hamburguesa con overlay
- Desktop: Sidebar fijo a la izquierda

#### MainLayout
Layout principal que envuelve todas las paginas protegidas.
- Incluye Sidebar
- Usa React Router Outlet para renderizar paginas

#### PageHeader
Encabezado reutilizable para paginas con titulo, subtitulo y acciones.

### Shared Components

#### PlanCard
Muestra un plan con imagen, informacion y botones para seleccionar como principal u oferta.

#### CategoryCard
Card de categoria con imagen, nombre y descripcion.

#### CotizacionCard
Muestra una cotizacion pendiente con imagen, fechas y boton de ver.

#### TeamMemberCard
Card de miembro del equipo con avatar, rol (badge coloreado) y acciones.

#### ActivityPanel
Panel lateral con KPIs: planes, cotizaciones resueltas, reservas activas.

#### ReservationDetail
Panel de detalle de reserva seleccionada con toda la informacion.

#### PhotoGallery
Galeria de fotos con seleccion de foto principal.

#### DynamicFieldList
Lista de campos dinamicos (titulo + descripcion) para detalles de planes.

### Chart Components

#### PieChart
Grafica circular usando Recharts con colores de la paleta Vive Silver.

#### BarChart
Grafica de barras con tooltips personalizados.

---

## Instalacion y Ejecucion

### Requisitos
- Node.js 18+
- npm o yarn

### Pasos

1. Navegar al directorio del proyecto:
```bash
cd proveedor
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar servidor de desarrollo:
```bash
npm run dev
```

4. Abrir en el navegador:
```
http://localhost:5173
```

### Scripts Disponibles

| Script | Descripcion |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Genera build de produccion |
| `npm run preview` | Previsualiza build de produccion |

---

## Responsive Design

La aplicacion es completamente responsive con breakpoints:

- **Mobile** (< 640px): Menu hamburguesa, grids de 1 columna
- **Tablet** (640px - 1024px): Grids de 2 columnas
- **Desktop** (> 1024px): Sidebar fijo, grids de 3-4 columnas

---

## Caracteristicas Principales

1. **Dashboard**: Graficos de reservas, KPIs, cotizaciones pendientes
2. **Planes**: CRUD completo con galeria de fotos y campos dinamicos
3. **Categorias**: Gestion de categorias con imagenes
4. **Reservas**: Calendario interactivo con detalle de reservas
5. **Cotizaciones**: Lista filtrable con detalle y accion de resolver
6. **Equipo**: Gestion de miembros con filtros por rol
7. **Perfil**: Configuracion de datos personales

---

## Notas Adicionales

- Todos los datos son mock/estaticos (sin backend)
- Los formularios incluyen validacion basica
- Los componentes UI siguen el patron shadcn/ui
- Los iconos provienen de Lucide React
- El calendario usa date-fns para manejo de fechas
