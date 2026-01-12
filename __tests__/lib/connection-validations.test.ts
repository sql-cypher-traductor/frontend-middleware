import {
  createConnectionSchema,
  testConnectionSchema,
  updateConnectionSchema,
} from '@/lib/validations'
import { describe, expect, test } from 'vitest'

describe('Connection Validation Schemas', () => {
  describe('createConnectionSchema', () => {
    test('validates correct SQL Server connection data', () => {
      const validData = {
        conn_name: 'Production SQL Server',
        db_type: 'sql_server' as const,
        host: 'localhost',
        port: 1433,
        db_user: 'sa',
        db_password: 'SecurePass123!',
        database_name: 'master',
      }
      expect(() => createConnectionSchema.parse(validData)).not.toThrow()
    })

    test('validates correct Neo4j connection data', () => {
      const validData = {
        conn_name: 'Neo4j Graph DB',
        db_type: 'neo4j' as const,
        host: 'bolt://localhost',
        port: 7687,
        db_user: 'neo4j',
        db_password: 'password',
      }
      expect(() => createConnectionSchema.parse(validData)).not.toThrow()
    })

    test('rejects invalid connection name', () => {
      const invalidData = {
        conn_name: 'ab', // Muy corto
        db_type: 'sql_server' as const,
        host: 'localhost',
        port: 1433,
        db_user: 'sa',
        db_password: 'password',
      }
      expect(() => createConnectionSchema.parse(invalidData)).toThrow()
    })

    test('rejects invalid db_type', () => {
      const invalidData = {
        conn_name: 'Test Connection',
        db_type: 'invalid_type',
        host: 'localhost',
        port: 1433,
        db_user: 'sa',
        db_password: 'password',
      }
      expect(() => createConnectionSchema.parse(invalidData)).toThrow()
    })

    test('rejects invalid port numbers', () => {
      const invalidData1 = {
        conn_name: 'Test Connection',
        db_type: 'sql_server' as const,
        host: 'localhost',
        port: 0, // Puerto inválido
        db_user: 'sa',
        db_password: 'password',
      }
      expect(() => createConnectionSchema.parse(invalidData1)).toThrow()

      const invalidData2 = {
        conn_name: 'Test Connection',
        db_type: 'sql_server' as const,
        host: 'localhost',
        port: 70000, // Puerto muy alto
        db_user: 'sa',
        db_password: 'password',
      }
      expect(() => createConnectionSchema.parse(invalidData2)).toThrow()
    })

    test('rejects empty required fields', () => {
      const invalidData = {
        conn_name: 'Test Connection',
        db_type: 'sql_server' as const,
        host: '',
        port: 1433,
        db_user: '',
        db_password: '',
      }
      expect(() => createConnectionSchema.parse(invalidData)).toThrow()
    })

    test('validates connection name with allowed special characters', () => {
      const validData = {
        conn_name: 'Prod_DB-01',
        db_type: 'sql_server' as const,
        host: 'localhost',
        port: 1433,
        db_user: 'sa',
        db_password: 'password',
      }
      expect(() => createConnectionSchema.parse(validData)).not.toThrow()
    })

    test('rejects connection name with invalid characters', () => {
      const invalidData = {
        conn_name: 'Test@Connection!',
        db_type: 'sql_server' as const,
        host: 'localhost',
        port: 1433,
        db_user: 'sa',
        db_password: 'password',
      }
      expect(() => createConnectionSchema.parse(invalidData)).toThrow()
    })
  })

  describe('updateConnectionSchema', () => {
    test('allows partial updates', () => {
      const validData = {
        conn_name: 'Updated Name',
      }
      expect(() => updateConnectionSchema.parse(validData)).not.toThrow()
    })

    test('validates optional port number', () => {
      const validData = {
        port: 3306,
      }
      expect(() => updateConnectionSchema.parse(validData)).not.toThrow()
    })

    test('rejects invalid optional port', () => {
      const invalidData = {
        port: -1,
      }
      expect(() => updateConnectionSchema.parse(invalidData)).toThrow()
    })

    test('allows empty update object', () => {
      const emptyData = {}
      expect(() => updateConnectionSchema.parse(emptyData)).not.toThrow()
    })
  })

  describe('testConnectionSchema', () => {
    test('validates complete test connection data', () => {
      const validData = {
        db_type: 'sql_server' as const,
        host: 'localhost',
        port: 1433,
        db_user: 'sa',
        db_password: 'password',
        database_name: 'testdb',
      }
      expect(() => testConnectionSchema.parse(validData)).not.toThrow()
    })

    test('validates test without optional database', () => {
      const validData = {
        db_type: 'neo4j' as const,
        host: 'bolt://localhost',
        port: 7687,
        db_user: 'neo4j',
        db_password: 'password',
      }
      expect(() => testConnectionSchema.parse(validData)).not.toThrow()
    })
  })
})
