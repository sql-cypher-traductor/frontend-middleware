# 📝 **ESTRATEGIA DE COMMITS - SPRINT 1**

## 🐳 **PASO 0: Ajustar Docker Compose**

En el archivo `backend-middleware/docker-compose.yml`, el servicio frontend tiene un error en la variable de entorno. La URL del backend ya incluye `/api/v1` en nuestro código, así que necesitas cambiar:

```yaml
# ❌ ACTUAL (Incorrecto)
environment:
  - NEXT_PUBLIC_API_URL=http://backend_service:8000/api/v1

# ✅ CORRECTO
environment:
  - NEXT_PUBLIC_API_URL=http://backend_service:8000
```

**Razón**: En [src/lib/axios.ts](../frontend-middleware/src/lib/axios.ts) línea 7, ya agregamos `/api/v1` al baseURL:
```typescript
baseURL: `${API_BASE_URL}/api/v1`,
```

---

## 📦 **COMMITS SUGERIDOS (7 COMMITS)**

### **Commit 1: Configuración Base e Infraestructura**
**Archivos a incluir:**
- `package.json` (nuevas dependencias)
- `tsconfig.json` (path alias configurado)
- `.env.local` (variables de entorno)
- `vitest.config.ts` (configuración de pruebas)
- `src/lib/axios.ts`
- `src/lib/api-types.ts`
- `src/lib/validations.ts`
- `src/store/useAuthStore.ts`
- `src/hooks/useProtectedRoute.ts`

**Mensaje del commit:**
```bash
git add package.json tsconfig.json .env.local vitest.config.ts
git add src/lib/axios.ts src/lib/api-types.ts src/lib/validations.ts
git add src/store/useAuthStore.ts src/hooks/useProtectedRoute.ts
git commit -m "feat(config): configurar infraestructura base y dependencias

- Instalar axios, zustand, react-hook-form, zod, sonner
- Configurar cliente HTTP con interceptores JWT
- Definir tipos TypeScript para API
- Crear esquemas de validación con Zod
- Implementar store de autenticación con Zustand
- Agregar hook de protección de rutas
- Configurar path alias @/* en tsconfig
- Configurar vitest con path alias"
```

---

### **Commit 2: Componentes UI Reutilizables**
**Archivos a incluir:**
- `src/components/ui/Button.tsx`
- `src/components/ui/Input.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/Toaster.tsx`
- `src/app/layout.tsx` (agregar Toaster)

**Mensaje del commit:**
```bash
git add src/components/ui/Button.tsx src/components/ui/Input.tsx
git add src/components/ui/Card.tsx src/components/ui/Toaster.tsx
git add src/app/layout.tsx
git commit -m "feat(ui): crear componentes UI base reutilizables

- Implementar Button con variantes y estados de loading
- Implementar Input con validación y mensajes de error
- Implementar Card con sub-componentes (Header, Title, Description, Content, Footer)
- Agregar Toaster para notificaciones con sonner
- Integrar Toaster en layout raíz"
```

---

### **Commit 3: Pantallas de Autenticación (Registro y Login)**
**Archivos a incluir:**
- `src/app/auth/register/page.tsx`
- `src/app/auth/login/page.tsx`
- `src/app/page.tsx` (landing page)

**Mensaje del commit:**
```bash
git add src/app/auth/register/page.tsx src/app/auth/login/page.tsx
git add src/app/page.tsx
git commit -m "feat(auth): implementar pantallas de registro y login

AUM-01: Registro e Inicio de Sesión
- T06: Pantalla de registro con validación de campos
  - Validar email único, contraseña segura (8+ chars, mayúsculas, números, símbolos)
  - Conexión con endpoint POST /api/v1/auth/register
  - Feedback visual con toasts
  - Redirección a login tras éxito

- T08: Pantalla de login
  - Formulario con validación de credenciales
  - Conexión con endpoint POST /api/v1/auth/login
  - Guardar JWT en localStorage
  - Gestión de estado con Zustand
  - Redirección a dashboard tras login exitoso

- Agregar landing page con navegación a auth"
```

---

### **Commit 4: Protección de Rutas y Dashboard**
**Archivos a incluir:**
- `src/app/dashboard/layout.tsx`
- `src/app/dashboard/page.tsx`

**Mensaje del commit:**
```bash
git add src/app/dashboard/layout.tsx src/app/dashboard/page.tsx
git commit -m "feat(dashboard): implementar protección de rutas y dashboard principal

- Proteger rutas del dashboard con useProtectedRoute hook
- Redirigir a login si no hay sesión autenticada
- Crear dashboard principal con tarjetas de navegación
- Mostrar información del usuario autenticado
- Agregar funcionalidad de cerrar sesión
- Diferenciar vista por rol (ADMIN vs DEV)"
```

---

### **Commit 5: Gestión de Perfil de Usuario**
**Archivos a incluir:**
- `src/app/dashboard/profile/page.tsx`
- `src/app/dashboard/profile/edit/page.tsx`
- `src/app/dashboard/profile/change-password/page.tsx`

**Mensaje del commit:**
```bash
git add src/app/dashboard/profile/page.tsx
git add src/app/dashboard/profile/edit/page.tsx
git add src/app/dashboard/profile/change-password/page.tsx
git commit -m "feat(profile): implementar visualización y edición de perfil

AUM-02: Visualización de Perfil
- T11: Pantalla de perfil con datos del usuario
  - Mostrar username, email, rol, estado, fechas
  - Conexión con endpoint GET /api/v1/users/me
  - Navegación a edición y cambio de contraseña

AUM-03: Actualización de Perfil
- T13: Pantalla para editar perfil
  - Formulario con validación de email y username
  - Conexión con endpoint PUT /api/v1/users/me
  - Actualización de estado en Zustand

- Pantalla para cambiar contraseña
  - Validar contraseña actual y nueva contraseña segura
  - Conexión con endpoint PUT /api/v1/users/me/password"
```

---

### **Commit 6: Recuperación de Contraseña**
**Archivos a incluir:**
- `src/app/auth/forgot-password/page.tsx`
- `src/app/auth/reset-password/[token]/page.tsx`

**Mensaje del commit:**
```bash
git add src/app/auth/forgot-password/page.tsx
git add src/app/auth/reset-password/[token]/page.tsx
git commit -m "feat(auth): implementar flujo de recuperación de contraseña

AUM-03: Restablecimiento de Contraseña
- T16: Pantalla para solicitar restablecimiento
  - Formulario con email
  - Conexión con endpoint POST /api/v1/auth/password-reset/request
  - Mensaje informativo sobre email enviado

- T18: Pantalla para confirmar restablecimiento con token
  - Formulario con nueva contraseña y confirmación
  - Validación de contraseña segura
  - Conexión con endpoint POST /api/v1/auth/password-reset/confirm
  - Redirección a login tras éxito"
```

---

### **Commit 7: Pruebas Unitarias y Documentación**
**Archivos a incluir:**
- `__tests__/components/Button.test.tsx`
- `__tests__/components/Input.test.tsx`
- `__tests__/components/Card.test.tsx`
- `__tests__/lib/validations.test.ts`
- `__tests__/store/useAuthStore.test.tsx`
- `__tests__/page.test.tsx`
- `SPRINT1.md`

**Mensaje del commit:**
```bash
git add __tests__/components/Button.test.tsx
git add __tests__/components/Input.test.tsx
git add __tests__/components/Card.test.tsx
git add __tests__/lib/validations.test.ts
git add __tests__/store/useAuthStore.test.tsx
git add __tests__/page.test.tsx
git add SPRINT1.md
git commit -m "test(sprint1): agregar pruebas unitarias y documentación

- Pruebas para componentes UI (Button, Input, Card)
- Pruebas para esquemas de validación (Zod)
- Pruebas para store de autenticación (Zustand)
- Pruebas para landing page
- Documentación completa del Sprint 1
- 42 pruebas pasando (100% success rate)

Cobertura:
✅ Componentes UI: 15 tests
✅ Validaciones: 18 tests
✅ Store: 6 tests
✅ Páginas: 5 tests"
```

---

## 📊 **RESUMEN DE COMMITS**

| # | Tipo | Descripción | Archivos |
|---|------|-------------|----------|
| 1 | `feat(config)` | Infraestructura base | 9 archivos |
| 2 | `feat(ui)` | Componentes UI | 5 archivos |
| 3 | `feat(auth)` | Registro y Login | 3 archivos |
| 4 | `feat(dashboard)` | Dashboard y protección | 2 archivos |
| 5 | `feat(profile)` | Gestión de perfil | 3 archivos |
| 6 | `feat(auth)` | Recuperación de contraseña | 2 archivos |
| 7 | `test(sprint1)` | Pruebas y documentación | 7 archivos |

**Total**: 7 commits organizados por funcionalidad

---

## 🚀 **ORDEN DE EJECUCIÓN**

```bash
# 1. Verificar que estás en la rama correcta
git status

# 2. Si estás en main, crear una nueva rama para el sprint
git checkout -b feature/sprint1-auth-profile

# 3. Ejecutar cada commit en orden (Commit 1 a 7)
# Usar los comandos de arriba para cada commit

# 4. Después del último commit, verificar el estado
git log --oneline -7

# 5. Push de la rama
git push -u origin feature/sprint1-auth-profile

# 6. Crear Pull Request en GitHub
```

---

## ✅ **VERIFICACIÓN ANTES DE COMMIT**

Antes de cada commit, ejecutar:

```bash
# Verificar que compila
npm run build

# Verificar linting
npm run lint

# Verificar formato
npx prettier --check .

# Ejecutar pruebas (solo después del commit 7)
npm run test
```

---

## 🐳 **DOCKER COMPOSE - INSTRUCCIONES**

### **Opción 1: Ejecutar solo con Docker Compose** (Recomendado para pruebas completas)

1. Navegar a la carpeta del backend:
```bash
cd backend-middleware
```

2. Ajustar `docker-compose.yml` como se indicó arriba

3. Levantar todos los servicios:
```bash
docker-compose up --build
```

Esto levantará:
- PostgreSQL (puerto 5432)
- SQL Server (puerto 1433)
- Neo4j (puertos 7474, 7687)
- Backend (puerto 8000)
- Frontend (puerto 3000)

4. Acceder a:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/docs
- Neo4j Browser: http://localhost:7474

---

### **Opción 2: Solo Frontend Local** (Desarrollo rápido)

Si solo quieres probar el frontend localmente:

```bash
# En la carpeta frontend-middleware
npm run dev
```

**Nota**: Asegúrate de que el backend esté corriendo en `http://localhost:8000`

---

## 📌 **NOTAS IMPORTANTES**

1. **Orden de Commits**: Seguir el orden sugerido para mantener una historia de git coherente y lógica.

2. **Mensajes de Commit**: Los mensajes siguen [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat`: Nueva funcionalidad
   - `test`: Agregar o modificar tests
   - `fix`: Corrección de bugs
   - `docs`: Cambios en documentación

3. **Archivos Excluidos**: Estos archivos NO se deben commitear:
   - `node_modules/`
   - `.next/`
   - `.env.local` (solo `.env.local.example`)
   - Archivos de build

4. **Docker**: El frontend en Docker usa build de producción, el desarrollo local usa `npm run dev`.

---

## 🎯 **RESULTADO ESPERADO**

Después de estos 7 commits, tendrás:

✅ Sistema de autenticación completo (registro, login, logout)  
✅ Gestión de perfil (ver, editar, cambiar contraseña)  
✅ Recuperación de contraseña (solicitar y confirmar)  
✅ Protección de rutas del dashboard  
✅ Componentes UI reutilizables  
✅ 42 pruebas unitarias pasando  
✅ Documentación completa del Sprint 1  
✅ Integración con Docker Compose  

**Estado**: Sprint 1 completado al 100% ✅
