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
  database_name?: string // Para SQL Server
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
  database_name?: string // Para SQL Server
}

export interface UpdateConnectionRequest {
  conn_name?: string
  host?: string
  port?: number
  db_user?: string
  db_password?: string // Opcional al editar
  database_name?: string
}

export interface TestConnectionRequest {
  db_type: DbType
  host: string
  port: number
  db_user: string
  db_password: string
  database_name?: string
}

export interface TestConnectionResponse {
  success: boolean
  message: string
  connection_time_ms?: number
}

// Tipos de Traducción SQL -> Cypher
export type QueryStatus = 'traducido' | 'ejecutado' | 'fallido'

export interface TranslateRequest {
  sql_query: string
  neo4j_connection_id: number // Conexión Neo4j donde se ejecutará
}

export interface TranslateResponse {
  query_id: number
  cypher_query: string
  status: QueryStatus
  traduction_time: number // Tiempo de traducción en ms
  error_message?: string
  metadata?: {
    query_type: string // 'SELECT', 'INSERT', 'UPDATE', etc.
    tables_detected: string[]
    complexity_score?: number
  }
  warnings?: string[]
}

export interface QueryHistory {
  query_id: number
  user_id: number
  neo4j_connection_id: number
  sql_query: string
  cypher_query: string
  status: QueryStatus
  error_message?: string
  traduction_time: number // En ms
  execution_time?: number // En ms (opcional si no se ejecutó)
  nodes_affected?: number // Nodos afectados en la ejecución
  created_at: string
}

// Para actualizar el estado después de ejecutar
export interface ExecuteQueryRequest {
  query_id: number
}

export interface ExecuteQueryResponse {
  query_id: number
  status: QueryStatus
  execution_time: number // En ms
  nodes_affected: number
  results?: unknown[] // Resultados de la ejecución
  error_message?: string
}
