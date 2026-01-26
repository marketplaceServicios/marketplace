# Documentacion del Panel Administrativo Vive Silver

## Tabla de Contenidos
1. [Resumen del Proyecto](#resumen-del-proyecto)
2. [Stack Tecnologico](#stack-tecnologico)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Componentes Creados](#componentes-creados)
5. [Paginas Implementadas](#paginas-implementadas)
6. [Decisiones de Diseno](#decisiones-de-diseno)
7. [Paleta de Colores Vive Silver](#paleta-de-colores-vive-silver)
8. [Diseno Responsive](#diseno-responsive)
9. [Como Ejecutar](#como-ejecutar)

---

## Resumen del Proyecto

Este proyecto es un **Panel Administrativo** para "Vive Silver", un marketplace de servicios y eventos. El panel permite gestionar proveedores, empresas, usuarios y tipos de servicios.

### Caracteristicas Principales:
- Sistema de autenticacion (simulado)
- Dashboard con graficos de metricas
- CRUD de empresas y representantes legales
- Gestion de documentos de proveedores
- Listado y filtrado de empresas por tipo de servicio
- Gestion de equipos de trabajo
- Configuracion de perfil de administrador
- **Diseno 100% responsive** (mobile-first)

---

## Stack Tecnologico

| Tecnologia | Version | Proposito |
|------------|---------|-----------|
| **React** | 18.2.0 | Framework UI |
| **Vite** | 5.0.0 | Build tool y servidor de desarrollo |
| **Tailwind CSS** | 3.3.6 | Framework de estilos utilitarios |
| **React Router** | 6.20.0 | Enrutamiento SPA |
| **Recharts** | 2.10.0 | Graficos interactivos |
| **Zustand** | 4.4.7 | Manejo de estado global |
| **Lucide React** | 0.294.0 | Iconos |
| **Radix UI** | Varios | Componentes accesibles (Select, Avatar, etc.) |

### Por que estas tecnologias?

1. **Vite**: Elegido sobre Create React App por su velocidad de desarrollo superior y mejor rendimiento en HMR (Hot Module Replacement).

2. **Tailwind CSS**: Permite desarrollo rapido con clases utilitarias, excelente para mantener consistencia visual y reducir CSS personalizado.

3. **Zustand**: Mas ligero que Redux, facil de configurar, perfecto para aplicaciones de tamano mediano sin boilerplate excesivo.

4. **Recharts**: Libreria de graficos basada en React con buena integracion y facil personalizacion.

5. **Radix UI**: Componentes primitivos accesibles que se pueden estilizar completamente con Tailwind.

---

## Estructura del Proyecto

```
admin/
├── public/
│   └── logo.png            # Logo de Vive Silver
├── src/
│   ├── components/
│   │   ├── ui/              # Componentes base (Button, Input, Select, etc.)
│   │   ├── layout/          # Sidebar, MainLayout, PageHeader
│   │   ├── shared/          # Componentes reutilizables de negocio
│   │   ├── charts/          # Graficos (PieChart, BarChart)
│   │   └── forms/           # Componentes de formulario
│   ├── pages/               # 11 paginas de la aplicacion
│   ├── store/               # Estados globales con Zustand
│   ├── data/                # Datos mock
│   ├── lib/                 # Utilidades
│   ├── App.jsx              # Configuracion de rutas
│   ├── main.jsx             # Punto de entrada
│   └── index.css            # Estilos globales y Tailwind
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## Componentes Creados

### Componentes UI (src/components/ui/)

| Componente | Descripcion | Uso Principal |
|------------|-------------|---------------|
| `Button` | Boton con variantes (default, secondary, outline, ghost, danger) | Acciones en toda la app |
| `Input` | Campo de texto con estilos consistentes | Formularios |
| `Textarea` | Area de texto multilinea | Descripciones largas |
| `Select` | Dropdown con Radix UI | Filtros y selecciones |
| `Card` | Contenedor con borde y sombra | Dashboard, informacion |
| `Avatar` | Imagen circular con fallback (color sage) | Usuarios, empresas |
| `Table` | Tabla con headers y filas estilizadas | Listados |

### Componentes de Layout (src/components/layout/)

| Componente | Descripcion |
|------------|-------------|
| `Sidebar` | Navegacion lateral con menu hamburguesa mobile y logo Vive Silver |
| `MainLayout` | Wrapper responsive con Sidebar y proteccion de rutas |
| `PageHeader` | Encabezado de pagina responsive con titulo y accion opcional |

### Componentes Compartidos (src/components/shared/)

| Componente | Descripcion | Donde se usa |
|------------|-------------|--------------|
| `InfoRow` | Fila de informacion responsive con icono, label y valor | Detalles de empresa/representante |
| `CompanyCard` | Card de empresa responsive con avatar y acciones | Lista de empresas |
| `DocumentCard` | Card de documento responsive con preview y descarga | Documentos del proveedor |
| `StatsCard` | Contenedor para graficos y estadisticas | Dashboard |
| `ActivityPanel` | Panel lateral con metricas de actividad | Dashboard |
| `FileUpload` | Componente de carga de archivos con preview | Formularios de creacion |

### Componentes de Formulario (src/components/forms/)

| Componente | Descripcion |
|------------|-------------|
| `FormField` | Campo de formulario responsive con icono y label integrado |
| `FormSelect` | Select de formulario responsive con icono y label integrado |

### Componentes de Graficos (src/components/charts/)

| Componente | Descripcion |
|------------|-------------|
| `PieChart` | Grafico de pie con colores Vive Silver |
| `BarChart` | Grafico de barras con colores Vive Silver |

---

## Paginas Implementadas

### 1. LoginPage (`/login`)
- Formulario de inicio de sesion con email y contrasena
- Toggle para mostrar/ocultar contrasena
- Branding Vive Silver con logo
- Diseno responsive (stack vertical en mobile)
- Elementos decorativos con nueva paleta de colores

---

### 2. DashboardPage (`/`)
- Mensaje de bienvenida
- Grafico de pie: Tipos de servicios activos
- Grafico de barras: Empresas por tipo de servicio
- Panel lateral con metricas de actividad
- Layout responsive (graficos en columna en mobile)

---

### 3. EmpresasPorServiciosPage (`/empresas-por-servicios`)
- Dropdown para filtrar por tipo de servicio
- Lista de empresas responsive con:
  - Avatar
  - Nombre
  - Botones de accion (stack en mobile)

---

### 4. InfoProveedorPage (`/proveedor/:id`)
- Informacion completa de la empresa
- Navegacion a representante legal y documentos
- Layout responsive con botones full-width en mobile

---

### 5. InfoRepresentantePage (`/proveedor/:id/representante`)
- Datos del representante legal
- Navegacion bidireccional responsive

---

### 6. DocumentosProveedorPage (`/proveedor/:id/documentos`)
- Grid de documentos responsive (1 col mobile, 2 cols tablet, 4 cols desktop)
- Preview y descarga de documentos

---

### 7. UsuariosRegistradosPage (`/usuarios-registrados`)
- Filtro por empresa
- **Desktop**: Tabla con columnas
- **Mobile**: Cards apiladas con informacion del usuario

---

### 8. CrearEmpresaPage (`/crear-empresa`)
- Formulario paso 1 responsive
- Todos los campos adaptados a mobile

---

### 9. CrearRepresentantePage (`/crear-empresa/representante`)
- Formulario paso 2 responsive
- Boton full-width en mobile

---

### 10. CrearServicioPage (`/crear-tipo-servicio`)
- Formulario responsive con upload de imagen

---

### 11. PerfilPage (`/perfil`)
- Avatar centrado en mobile, alineado a la izquierda en desktop
- Campos de perfil editables

---

## Decisiones de Diseno

### 1. Rebranding a Vive Silver
El proyecto fue rebrandeado de "Companio" a "Vive Silver" con:
- Nuevo logo en el sidebar y login
- Nueva paleta de colores naturales/terrosos
- Nombre "Vive Silver" en todas las referencias

### 2. Componentizacion
Cada elemento visual repetido se convirtio en un componente reutilizable:
- `InfoRow` para filas de informacion
- `CompanyCard` para listados de empresas
- `FormField` para campos de formulario consistentes

### 3. Estado Global con Zustand
Tres stores separados por dominio:
- `authStore`: Usuario y autenticacion
- `empresasStore`: Empresas, usuarios, filtros
- `serviciosStore`: Tipos de servicio

### 4. Rutas Protegidas
MainLayout verifica autenticacion y redirige a login si es necesario.

### 5. Datos Mock
Todos los datos estan en `mockData.js` para facilitar el desarrollo.

---

## Paleta de Colores Vive Silver

La nueva paleta de colores esta basada en tonos naturales y terrosos:

| Color | Hex | Uso |
|-------|-----|-----|
| **Primary** | `#3D4A3A` | Verde bosque oscuro - Sidebar, textos principales |
| **Primary Light** | `#747F64` | Olive Green - Variante clara |
| **Accent** | `#CB7A5B` | Terracotta - Botones primarios, highlights |
| **Accent Hover** | `#984A16` | Burnt Sienna - Estados hover |
| **Sage** | `#889B76` | Sage Green - Avatares, elementos secundarios |
| **Slate** | `#5C757A` | Slate Blue - Textos secundarios |
| **Cream** | `#E8E2D8` | Almond Cream - Bordes, fondos suaves |
| **Ivory** | `#E3D6C5` | Ivory Sand - Backgrounds de inputs |
| **Background** | `#F5F3EF` | Fondo principal de la aplicacion |
| **Danger** | `#B94A3D` | Rojo terroso - Acciones destructivas |

### Aplicacion de colores en graficos:
```javascript
const COLORS = ['#CB7A5B', '#889B76', '#5C757A', '#3D4A3A', '#984A16', '#747F64']
```

---

## Diseno Responsive

### Breakpoints utilizados (Tailwind CSS):
- `sm`: 640px - Telefonos grandes
- `md`: 768px - Tablets
- `lg`: 1024px - Laptops
- `xl`: 1280px - Escritorios

### Patrones responsive implementados:

#### Sidebar
- **Desktop (lg+)**: Sidebar fijo a la izquierda, siempre visible
- **Mobile/Tablet**: Menu hamburguesa con overlay, sidebar deslizable

#### Tablas
- **Desktop (md+)**: Tabla tradicional con columnas
- **Mobile**: Cards apiladas con la informacion

#### Formularios
- **Desktop**: Campos con labels e inputs en linea
- **Mobile**: Stack vertical, botones full-width

#### Grids
- **Desktop**: Multiple columnas (3-4)
- **Tablet**: 2 columnas
- **Mobile**: 1 columna

#### Botones de accion
- **Desktop**: Botones inline
- **Mobile**: Botones full-width apilados

---

## Como Ejecutar

```bash
# 1. Navegar al directorio
cd admin

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Abrir en navegador
# http://localhost:5173
```

### Credenciales de prueba
Cualquier email y contrasena funcionan para el login (es simulado).

### Comandos adicionales
```bash
# Build de produccion
npm run build

# Preview del build
npm run preview
```

---

## Resumen Final

Este proyecto implementa fielmente los 12 mockups proporcionados (11 paginas unicas) con las siguientes mejoras:

1. **Rebranding completo**: De "Companio" a "Vive Silver" con nueva identidad visual
2. **Nueva paleta de colores**: Tonos naturales y terrosos extraidos del PDF de paleta de colores
3. **Diseno 100% responsive**: Adaptado para mobile, tablet y desktop
4. **Reutilizacion de codigo**: Componentes modulares y reutilizables
5. **Buenas practicas**: Separacion de concerns, estado global organizado, rutas protegidas
6. **Experiencia de desarrollo**: Vite para velocidad, Tailwind para productividad

El proyecto esta listo para conectarse a un backend real reemplazando los datos mock por llamadas a API.
