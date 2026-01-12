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
