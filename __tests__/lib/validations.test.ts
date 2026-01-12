import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from '@/lib/validations'
import { describe, expect, test } from 'vitest'

/**
 * Tests para los schemas de validación - HU AUM-01
 * Valida que los schemas de Zod funcionen correctamente
 * para registro, login y actualización de perfil
 */
describe('Validation Schemas', () => {
  describe('registerSchema', () => {
    test('validates correct registration data', () => {
      const validData = {
        email: 'test@example.com',
        name: 'Test',
        last_name: 'User',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      }
      expect(() => registerSchema.parse(validData)).not.toThrow()
    })

    test('rejects invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        name: 'Test',
        last_name: 'User',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      }
      expect(() => registerSchema.parse(invalidData)).toThrow()
    })

    test('rejects empty name', () => {
      const invalidData = {
        email: 'test@example.com',
        name: '',
        last_name: 'User',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      }
      expect(() => registerSchema.parse(invalidData)).toThrow()
    })

    test('rejects empty last_name', () => {
      const invalidData = {
        email: 'test@example.com',
        name: 'Test',
        last_name: '',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      }
      expect(() => registerSchema.parse(invalidData)).toThrow()
    })

    test('rejects weak password without uppercase', () => {
      const invalidData = {
        email: 'test@example.com',
        name: 'Test',
        last_name: 'User',
        password: 'password123!',
        confirmPassword: 'password123!',
      }
      expect(() => registerSchema.parse(invalidData)).toThrow()
    })

    test('rejects weak password without number', () => {
      const invalidData = {
        email: 'test@example.com',
        name: 'Test',
        last_name: 'User',
        password: 'Password!',
        confirmPassword: 'Password!',
      }
      expect(() => registerSchema.parse(invalidData)).toThrow()
    })

    test('rejects weak password without special character', () => {
      const invalidData = {
        email: 'test@example.com',
        name: 'Test',
        last_name: 'User',
        password: 'Password123',
        confirmPassword: 'Password123',
      }
      expect(() => registerSchema.parse(invalidData)).toThrow()
    })

    test('rejects mismatched passwords', () => {
      const invalidData = {
        email: 'test@example.com',
        name: 'Test',
        last_name: 'User',
        password: 'Password123!',
        confirmPassword: 'DifferentPassword123!',
      }
      expect(() => registerSchema.parse(invalidData)).toThrow()
    })

    test('rejects name with invalid characters', () => {
      const invalidData = {
        email: 'test@example.com',
        name: 'Test123',
        last_name: 'User',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      }
      expect(() => registerSchema.parse(invalidData)).toThrow()
    })

    test('accepts name with accents', () => {
      const validData = {
        email: 'test@example.com',
        name: 'José María',
        last_name: 'García Pérez',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      }
      expect(() => registerSchema.parse(validData)).not.toThrow()
    })
  })

  describe('loginSchema', () => {
    test('validates correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'anypassword',
      }
      expect(() => loginSchema.parse(validData)).not.toThrow()
    })

    test('rejects invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password',
      }
      expect(() => loginSchema.parse(invalidData)).toThrow()
    })

    test('rejects empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      }
      expect(() => loginSchema.parse(invalidData)).toThrow()
    })

    test('rejects empty email', () => {
      const invalidData = {
        email: '',
        password: 'password',
      }
      expect(() => loginSchema.parse(invalidData)).toThrow()
    })
  })

  describe('updateProfileSchema', () => {
    test('validates correct profile data', () => {
      const validData = {
        email: 'newemail@example.com',
        name: 'NewName',
        last_name: 'NewLastName',
      }
      expect(() => updateProfileSchema.parse(validData)).not.toThrow()
    })

    test('rejects invalid email', () => {
      const invalidData = {
        email: 'invalid',
        name: 'Name',
        last_name: 'LastName',
      }
      expect(() => updateProfileSchema.parse(invalidData)).toThrow()
    })

    test('rejects empty name', () => {
      const invalidData = {
        email: 'test@example.com',
        name: '',
        last_name: 'LastName',
      }
      expect(() => updateProfileSchema.parse(invalidData)).toThrow()
    })

    test('accepts names with spanish characters', () => {
      const validData = {
        email: 'test@example.com',
        name: 'María Ñoño',
        last_name: 'Muñoz',
      }
      expect(() => updateProfileSchema.parse(validData)).not.toThrow()
    })
  })

  describe('changePasswordSchema', () => {
    test('validates correct password change data', () => {
      const validData = {
        oldPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!',
        confirmPassword: 'NewPassword123!',
      }
      expect(() => changePasswordSchema.parse(validData)).not.toThrow()
    })

    test('rejects mismatched new passwords', () => {
      const invalidData = {
        oldPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!',
        confirmPassword: 'DifferentPassword123!',
      }
      expect(() => changePasswordSchema.parse(invalidData)).toThrow()
    })

    test('rejects weak new password', () => {
      const invalidData = {
        oldPassword: 'OldPassword123!',
        newPassword: 'weak',
        confirmPassword: 'weak',
      }
      expect(() => changePasswordSchema.parse(invalidData)).toThrow()
    })
  })

  describe('forgotPasswordSchema', () => {
    test('validates correct email', () => {
      const validData = {
        email: 'test@example.com',
      }
      expect(() => forgotPasswordSchema.parse(validData)).not.toThrow()
    })

    test('rejects invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
      }
      expect(() => forgotPasswordSchema.parse(invalidData)).toThrow()
    })
  })

  describe('resetPasswordSchema', () => {
    test('validates correct reset password data', () => {
      const validData = {
        password: 'NewPassword123!',
        confirmPassword: 'NewPassword123!',
      }
      expect(() => resetPasswordSchema.parse(validData)).not.toThrow()
    })

    test('rejects mismatched passwords', () => {
      const invalidData = {
        password: 'NewPassword123!',
        confirmPassword: 'DifferentPassword123!',
      }
      expect(() => resetPasswordSchema.parse(invalidData)).toThrow()
    })

    test('rejects weak password', () => {
      const invalidData = {
        password: 'weak',
        confirmPassword: 'weak',
      }
      expect(() => resetPasswordSchema.parse(invalidData)).toThrow()
    })
  })
})
