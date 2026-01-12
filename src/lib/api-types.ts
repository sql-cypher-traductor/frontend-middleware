// Tipos de Usuario
export interface User {
  id: string
  email: string
  username: string
  role: 'DEV' | 'ADMIN'
  is_active: boolean
  created_at: string
  updated_at: string
}

// Requests de Autenticación
export interface RegisterRequest {
  email: string
  username: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

// Requests de Usuario
export interface UpdateUserRequest {
  email?: string
  username?: string
}

export interface ChangePasswordRequest {
  old_password: string
  new_password: string
}

// Requests de Restablecimiento de Contraseña
export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirm {
  token: string
  new_password: string
}

// Respuestas genéricas
export interface ApiError {
  detail: string
}

export interface ApiSuccess {
  message: string
}

// Tipo para errores de Axios
export interface AxiosErrorResponse {
  response?: {
    data?: {
      detail?: string
    }
  }
}

// Tipos de Conexiones
export type DbType = 'sql_server' | 'neo4j'

export interface Connection {
  connection_id: number
  user_id: number
  conn_name: string
  db_type: DbType
  host: string
  port: number
  db_user: string
  db_password?: string // No se devuelve en GET por seguridad
  created_at: string
  updated_at?: string
  is_active?: boolean // Estado de la última prueba de conexión
}

export interface CreateConnectionRequest {
  conn_name: string
  db_type: DbType
  host: string
  port: number
  db_user: string
  db_password: string
  database?: string // Para SQL Server
}

export interface UpdateConnectionRequest {
  conn_name?: string
  host?: string
  port?: number
  db_user?: string
  db_password?: string // Opcional al editar
  database?: string
}

export interface TestConnectionRequest {
  db_type: DbType
  host: string
  port: number
  db_user: string
  db_password: string
  database?: string
}

export interface TestConnectionResponse {
  success: boolean
  message: string
  latency_ms?: number
}
