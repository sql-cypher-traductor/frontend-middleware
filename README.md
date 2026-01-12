# Frontend Middleware - SQL to Cypher Translator

## 📋 Descripción

Frontend Middleware es una aplicación web moderna construida con Next.js que proporciona una interfaz intuitiva para la traducción de consultas SQL a Cypher (Neo4j). El sistema está diseñado con una arquitectura modular y escalable, implementando las mejores prácticas de desarrollo frontend.

## 🛠️ Stack Tecnológico

### Core

- **[Next.js 16.1.1](https://nextjs.org)** - Framework React con App Router
- **[React 19.2.3](https://react.dev)** - Biblioteca UI
- **[TypeScript 5](https://www.typescriptlang.org)** - Tipado estático

### Styling

- **[Tailwind CSS 4](https://tailwindcss.com)** - Framework CSS utility-first
- **PostCSS** - Procesamiento CSS

### Quality & Testing

- **[ESLint 9](https://eslint.org)** - Linter de código
- **[Prettier 3.7.4](https://prettier.io)** - Formateador de código
- **[Vitest 4.0.16](https://vitest.dev)** - Framework de testing
- **[Testing Library](https://testing-library.com)** - Testing de componentes React

### Development Tools

- **[@trivago/prettier-plugin-sort-imports](https://github.com/trivago/prettier-plugin-sort-imports)** - Ordenamiento automático de imports

## 📁 Estructura del Proyecto

```
frontend-middleware/
├── public/                    # Archivos estáticos
├── src/
│   ├── app/                   # App Router de Next.js
│   │   ├── auth/             # Módulo de autenticación
│   │   │   ├── login/        # Página de login
│   │   │   └── register/     # Página de registro
│   │   ├── dashboard/        # Panel principal
│   │   │   ├── admin/        # Sección administrativa
│   │   │   ├── connections/  # Gestión de conexiones
│   │   │   └── history/      # Historial de consultas
│   │   ├── layout.tsx        # Layout raíz
│   │   └── globals.css       # Estilos globales
│   ├── components/           # Componentes reutilizables
│   │   ├── editor/          # Componentes del editor SQL
│   │   ├── layout/          # Componentes de layout
│   │   ├── ui/              # Componentes UI base
│   │   └── visualizer/      # Visualización de datos
│   ├── hooks/               # Custom React Hooks
│   ├── lib/                 # Utilidades y configuraciones
│   │   ├── api-types.ts    # Tipos de API
│   │   ├── axios.ts        # Cliente HTTP
│   │   └── utils.ts        # Funciones auxiliares
│   └── store/              # State management
│       ├── useAuthStore.ts        # Store de autenticación
│       └── useConnectionStore.ts  # Store de conexiones
├── .github/
│   └── workflows/
│       └── ci.yml          # Pipeline CI/CD
├── Dockerfile              # Configuración Docker
├── next.config.ts          # Configuración Next.js
├── tsconfig.json           # Configuración TypeScript
├── eslint.config.mjs       # Configuración ESLint
└── package.json            # Dependencies & scripts
```

## 🚀 Inicio Rápido

### Requisitos Previos

- **Node.js** >= 20.x
- **npm** >= 10.x (o yarn/pnpm/bun)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/sql-cypher-traductor/frontend-middleware.git
cd frontend-middleware

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus configuraciones
```

### Variables de Entorno

Crear un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_TIMEOUT=30000

# Environment
NODE_ENV=development
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### Build para Producción

```bash
# Generar build optimizado
npm run build

# Iniciar servidor de producción
npm start
```

## 📜 Scripts Disponibles

| Script            | Descripción                                         |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Inicia el servidor de desarrollo en modo hot-reload |
| `npm run build`   | Genera build optimizado para producción             |
| `npm start`       | Inicia el servidor de producción                    |
| `npm run lint`    | Ejecuta ESLint para análisis de código              |
| `npm run test`    | Ejecuta suite de tests con Vitest                   |
| `npm run test:ui` | Ejecuta tests con interfaz gráfica                  |
| `npm run format`  | Formatea código con Prettier                        |

## 🧪 Testing

El proyecto utiliza **Vitest** y **Testing Library** para testing:

```bash
# Ejecutar todos los tests
npm run test

# Modo watch
npm run test:watch

# Con UI interactiva
npm run test:ui

# Con coverage
npm run test:coverage
```

### Convenciones de Testing

- Tests unitarios: `*.test.ts` o `*.test.tsx`
- Tests de integración: `*.integration.test.tsx`
- Ubicación: junto al archivo que testean o en carpeta `__tests__`

## 🎨 Code Style

El proyecto sigue estándares estrictos de código:

### ESLint

```bash
npm run lint
```

### Prettier

```bash
npm run format
```

### Configuración de Imports

Los imports se ordenan automáticamente en el siguiente orden:

1. Módulos core (`@core/`)
2. Módulos server (`@server/`)
3. Módulos UI (`@ui/`)
4. Imports relativos

## 🐳 Docker

### Build de la imagen

```bash
docker build -t frontend-middleware .
```

### Ejecutar contenedor

```bash
docker run -p 3000:3000 frontend-middleware
```

### Docker Compose

```bash
docker-compose up -d
```

## 🌐 Deployment

### Vercel (Recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sql-cypher-traductor/frontend-middleware)

### Standalone Build

El proyecto está configurado con `output: 'standalone'` para deployments optimizados:

```bash
npm run build
node .next/standalone/server.js
```

## 🏗️ Arquitectura

### Patrón de Diseño

- **App Router**: Utiliza el nuevo sistema de routing de Next.js 13+
- **Server Components**: Por defecto, con Client Components cuando sea necesario
- **State Management**: Stores modulares con Zustand
- **API Integration**: Cliente HTTP centralizado con Axios
- **Type Safety**: TypeScript estricto en toda la aplicación

### Flujo de Datos

```
User Input → Component → Hook → Store/API → Backend → Response → Store → Component → UI Update
```

## 🤝 Contribución

### Workflow

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

### Convenciones de Commits

Usar [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: cambios de formato (no afectan código)
refactor: refactorización de código
test: agregar o modificar tests
chore: cambios en build o herramientas
```

## 📝 Licencia

Este proyecto es privado y confidencial.

## 👥 Equipo

Desarrollado por el equipo de **sql-cypher-traductor**.

## 📞 Soporte

Para reportar issues o solicitar features, usar el [sistema de issues de GitHub](https://github.com/sql-cypher-traductor/frontend-middleware/issues).

---

**Construido con ❤️ usando Next.js**
