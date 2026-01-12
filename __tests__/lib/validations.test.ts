import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from '@/lib/validations'
import { describe, expect, test } from 'vitest'

describe('Validation Schemas', () => {
  describe('registerSchema', () => {
    test('validates correct registration data', () => {
      const validData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      }
      expect(() => registerSchema.parse(validData)).not.toThrow()
    })

    test('rejects invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        username: 'testuser',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      }
      expect(() => registerSchema.parse(invalidData)).toThrow()
    })

    test('rejects short username', () => {
      const invalidData = {
        email: 'test@example.com',
        username: 'ab',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      }
      expect(() => registerSchema.parse(invalidData)).toThrow()
    })

    test('rejects weak password without uppercase', () => {
      const invalidData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123!',
        confirmPassword: 'password123!',
      }
      expect(() => registerSchema.parse(invalidData)).toThrow()
    })

    test('rejects weak password without number', () => {
      const invalidData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password!',
        confirmPassword: 'Password!',
      }
      expect(() => registerSchema.parse(invalidData)).toThrow()
    })

    test('rejects weak password without special character', () => {
      const invalidData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123',
        confirmPassword: 'Password123',
      }
      expect(() => registerSchema.parse(invalidData)).toThrow()
    })

    test('rejects mismatched passwords', () => {
      const invalidData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123!',
        confirmPassword: 'DifferentPassword123!',
      }
      expect(() => registerSchema.parse(invalidData)).toThrow()
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
  })

  describe('updateProfileSchema', () => {
    test('validates correct profile data', () => {
      const validData = {
        email: 'newemail@example.com',
        username: 'newusername',
      }
      expect(() => updateProfileSchema.parse(validData)).not.toThrow()
    })

    test('rejects invalid email', () => {
      const invalidData = {
        email: 'invalid',
        username: 'username',
      }
      expect(() => updateProfileSchema.parse(invalidData)).toThrow()
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
  })
})
