import { z } from 'zod'

// Validación de contraseña segura según criterios de aceptación
// Mínimo 8 caracteres, mayúsculas, minúsculas, números y símbolos
const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .max(72, 'La contraseña no puede exceder 72 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
  .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .regex(/[!@#$%^&*(),.?":{}|<>+=\-_\[\]~`;/\\]/, 'Debe contener al menos un símbolo especial')

// Schema de registro - HU AUM-01 T01
// Campos: nombre, apellido, email, contraseña y confirmación
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'El nombre es requerido')
      .max(100, 'El nombre no puede exceder 100 caracteres')
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'El nombre solo puede contener letras'),
    last_name: z
      .string()
      .min(1, 'El apellido es requerido')
      .max(100, 'El apellido no puede exceder 100 caracteres')
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'El apellido solo puede contener letras'),
    email: z.string().min(1, 'El email es requerido').email('Ingresa un email válido'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

// Schema de login - HU AUM-01 T02
export const loginSchema = z.object({
  email: z.string().min(1, 'El email es requerido').email('Ingresa un email válido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

// Schema de actualización de perfil
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'El nombre solo puede contener letras'),
  last_name: z
    .string()
    .min(1, 'El apellido es requerido')
    .max(100, 'El apellido no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'El apellido solo puede contener letras'),
  email: z.string().email('Email inválido'),
})

// Schema de cambio de contraseña
export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'La contraseña actual es requerida'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

// Schema de solicitud de restablecimiento
export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
})

// Schema de confirmación de restablecimiento
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

// Schema de conexión base
const baseConnectionSchema = z.object({
  conn_name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(
      /^[a-zA-Z0-9\s_-]+$/,
      'Solo se permiten letras, números, espacios, guiones y guiones bajos'
    ),
  db_type: z.enum(['sql_server', 'neo4j'], {
    message: 'Tipo de base de datos inválido',
  }),
  host: z
    .string()
    .min(1, 'El host es requerido')
    .max(255, 'El host no puede exceder 255 caracteres')
    .regex(
      /^[a-zA-Z0-9.:/_-]+$/,
      'El host solo puede contener letras, números, puntos, guiones, guiones bajos, dos puntos y barras'
    ),
  port: z
    .number()
    .int('El puerto debe ser un número entero')
    .min(1, 'El puerto debe ser mayor a 0')
    .max(65535, 'El puerto debe ser menor a 65535'),
  db_user: z
    .string()
    .min(1, 'El usuario es requerido')
    .max(100, 'El usuario no puede exceder 100 caracteres'),
  db_password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .max(255, 'La contraseña no puede exceder 255 caracteres'),
  database_name: z
    .string()
    .max(100, 'El nombre de la base de datos no puede exceder 100 caracteres')
    .optional(),
})

// Schema para crear conexión con validación condicional de database_name
export const createConnectionSchema = baseConnectionSchema.refine(
  (data) => {
    // Si es SQL Server, database_name es requerido
    if (data.db_type === 'sql_server') {
      return data.database_name && data.database_name.trim().length > 0
    }
    return true
  },
  {
    message: 'El nombre de la base de datos es requerido para SQL Server',
    path: ['database_name'],
  }
)

// Schema para actualizar conexión (todos los campos opcionales excepto conn_name)
export const updateConnectionSchema = z.object({
  conn_name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(
      /^[a-zA-Z0-9\s_-]+$/,
      'Solo se permiten letras, números, espacios, guiones y guiones bajos'
    )
    .optional(),
  host: z
    .string()
    .min(1, 'El host es requerido')
    .max(255, 'El host no puede exceder 255 caracteres')
    .regex(/^[a-zA-Z0-9.-]+$/, 'El host solo puede contener letras, números, puntos y guiones')
    .optional(),
  port: z
    .number()
    .int('El puerto debe ser un número entero')
    .min(1, 'El puerto debe ser mayor a 0')
    .max(65535, 'El puerto debe ser menor a 65535')
    .optional(),
  db_user: z
    .string()
    .min(1, 'El usuario es requerido')
    .max(100, 'El usuario no puede exceder 100 caracteres')
    .optional(),
  db_password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .max(255, 'La contraseña no puede exceder 255 caracteres')
    .optional(),
  database_name: z
    .string()
    .max(100, 'El nombre de la base de datos no puede exceder 100 caracteres')
    .optional(),
})

// Schema para probar conexión (sin guardar - no requiere conn_name)
export const testConnectionSchema = z.object({
  db_type: z.enum(['sql_server', 'neo4j'], {
    message: 'Tipo de base de datos inválido',
  }),
  host: z
    .string()
    .min(1, 'El host es requerido')
    .max(255, 'El host no puede exceder 255 caracteres')
    .regex(
      /^[a-zA-Z0-9.:/_-]+$/,
      'El host solo puede contener letras, números, puntos, guiones, guiones bajos, dos puntos y barras'
    ),
  port: z
    .number()
    .int('El puerto debe ser un número entero')
    .min(1, 'El puerto debe ser mayor a 0')
    .max(65535, 'El puerto debe ser menor a 65535'),
  db_user: z
    .string()
    .min(1, 'El usuario es requerido')
    .max(100, 'El usuario no puede exceder 100 caracteres'),
  db_password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .max(255, 'La contraseña no puede exceder 255 caracteres'),
  database_name: z
    .string()
    .max(100, 'El nombre de la base de datos no puede exceder 100 caracteres')
    .optional(),
})

// Schema de traducción SQL -> Cypher
export const translateQuerySchema = z.object({
  sql_query: z
    .string()
    .min(1, 'La consulta SQL no puede estar vacía')
    .max(10000, 'La consulta SQL no puede exceder 10000 caracteres')
    .refine(
      (query) => {
        // Sanitización básica: detectar caracteres peligrosos para XSS
        const dangerousPatterns = [
          /<script/i,
          /<iframe/i,
          /javascript:/i,
          /on\w+\s*=/i, // onclick=, onload=, etc.
          /<img[^>]+src/i,
        ]
        return !dangerousPatterns.some((pattern) => pattern.test(query))
      },
      { message: 'La consulta contiene caracteres potencialmente peligrosos' }
    )
    .refine(
      (query) => {
        // Validar que sea una consulta SQL válida (muy básica)
        const sqlKeywords = /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TRUNCATE)\b/i
        return sqlKeywords.test(query)
      },
      { message: 'No se detectó una sentencia SQL válida' }
    )
    .refine(
      (query) => {
        // Prevenir queries excesivamente complejas o sospechosas
        const suspiciousPatterns = [
          /;\s*(DROP|DELETE|TRUNCATE|ALTER)/i, // Múltiples comandos peligrosos
          /UNION\s+ALL\s+SELECT/i, // SQL injection típico
        ]

        // Verificar patrones peligrosos
        if (suspiciousPatterns.some((pattern) => pattern.test(query))) {
          return false
        }

        // Verificar comentarios excesivos
        const commentCount = (query.match(/--/g) || []).length
        if (commentCount > 2) {
          return false
        }

        return true
      },
      { message: 'La consulta contiene patrones sospechosos' }
    ),
  neo4j_connection_id: z
    .number()
    .int('El ID de conexión debe ser un número entero')
    .positive('Debe seleccionar una conexión Neo4j válida'),
})

// Schema para ejecutar una query traducida
export const executeQuerySchema = z.object({
  query_id: z.number().int().positive(),
})
