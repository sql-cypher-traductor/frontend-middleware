import { translateQuerySchema } from '@/lib/validations'
import { describe, expect, test } from 'vitest'

describe('Translation Validation Schema', () => {
  describe('translateQuerySchema', () => {
    test('validates correct SELECT query with neo4j_connection_id', () => {
      const validData = {
        sql_query: 'SELECT * FROM users WHERE age > 25',
        neo4j_connection_id: 1,
      }
      expect(() => translateQuerySchema.parse(validData)).not.toThrow()
    })

    test('validates INSERT query', () => {
      const validData = {
        sql_query: "INSERT INTO users (name, email) VALUES ('John', 'john@example.com')",
        neo4j_connection_id: 2,
      }
      expect(() => translateQuerySchema.parse(validData)).not.toThrow()
    })

    test('validates UPDATE query', () => {
      const validData = {
        sql_query: "UPDATE users SET status = 'active' WHERE id = 1",
        neo4j_connection_id: 3,
      }
      expect(() => translateQuerySchema.parse(validData)).not.toThrow()
    })

    test('validates DELETE query', () => {
      const validData = {
        sql_query: 'DELETE FROM users WHERE inactive = true',
        neo4j_connection_id: 1,
      }
      expect(() => translateQuerySchema.parse(validData)).not.toThrow()
    })

    test('rejects query without neo4j_connection_id', () => {
      const invalidData = {
        sql_query: 'SELECT * FROM products',
      }
      expect(() => translateQuerySchema.parse(invalidData)).toThrow()
    })

    test('rejects query with invalid neo4j_connection_id', () => {
      const invalidData = {
        sql_query: 'SELECT * FROM products',
        neo4j_connection_id: -1,
      }
      expect(() => translateQuerySchema.parse(invalidData)).toThrow(
        'Debe seleccionar una conexión Neo4j válida'
      )
    })

    test('rejects empty query', () => {
      const invalidData = {
        sql_query: '',
        neo4j_connection_id: 1,
      }
      expect(() => translateQuerySchema.parse(invalidData)).toThrow(
        'La consulta SQL no puede estar vacía'
      )
    })

    test('rejects query exceeding max length', () => {
      const invalidData = {
        sql_query: 'SELECT * FROM users WHERE '.repeat(500), // > 10000 chars
        neo4j_connection_id: 1,
      }
      expect(() => translateQuerySchema.parse(invalidData)).toThrow(
        'La consulta SQL no puede exceder 10000 caracteres'
      )
    })

    // Tests de seguridad XSS
    test('rejects query with <script> tag', () => {
      const invalidData = {
        sql_query: 'SELECT * FROM users WHERE name = "<script>alert(1)</script>"',
        neo4j_connection_id: 1,
      }
      expect(() => translateQuerySchema.parse(invalidData)).toThrow(
        'La consulta contiene caracteres potencialmente peligrosos'
      )
    })

    test('rejects query with <iframe> tag', () => {
      const invalidData = {
        sql_query: 'SELECT * FROM users WHERE description = "<iframe src=x>"',
        neo4j_connection_id: 1,
      }
      expect(() => translateQuerySchema.parse(invalidData)).toThrow(
        'La consulta contiene caracteres potencialmente peligrosos'
      )
    })

    test('rejects query with javascript: protocol', () => {
      const invalidData = {
        sql_query: 'SELECT * FROM users WHERE url = "javascript:alert(1)"',
        neo4j_connection_id: 1,
      }
      expect(() => translateQuerySchema.parse(invalidData)).toThrow(
        'La consulta contiene caracteres potencialmente peligrosos'
      )
    })

    test('rejects query with onclick handler', () => {
      const invalidData = {
        sql_query: 'SELECT * FROM users WHERE html = "<div onclick=alert(1)>"',
        neo4j_connection_id: 1,
      }
      expect(() => translateQuerySchema.parse(invalidData)).toThrow(
        'La consulta contiene caracteres potencialmente peligrosos'
      )
    })

    test('rejects query with img tag', () => {
      const invalidData = {
        sql_query: 'SELECT * FROM users WHERE content = "<img src=x onerror=alert(1)>"',
        neo4j_connection_id: 1,
      }
      expect(() => translateQuerySchema.parse(invalidData)).toThrow(
        'La consulta contiene caracteres potencialmente peligrosos'
      )
    })

    // Tests de seguridad SQL Injection
    test('rejects query with DROP after semicolon', () => {
      const invalidData = {
        sql_query: 'SELECT * FROM users; DROP TABLE users',
        neo4j_connection_id: 1,
      }
      expect(() => translateQuerySchema.parse(invalidData)).toThrow(
        'La consulta contiene patrones sospechosos'
      )
    })

    test('rejects query with DELETE after semicolon', () => {
      const invalidData = {
        sql_query: 'SELECT * FROM users; DELETE FROM users WHERE 1=1',
        neo4j_connection_id: 1,
      }
      expect(() => translateQuerySchema.parse(invalidData)).toThrow(
        'La consulta contiene patrones sospechosos'
      )
    })

    test('rejects query with TRUNCATE after semicolon', () => {
      const invalidData = {
        sql_query: 'SELECT * FROM users; TRUNCATE TABLE users',
        neo4j_connection_id: 1,
      }
      expect(() => translateQuerySchema.parse(invalidData)).toThrow(
        'La consulta contiene patrones sospechosos'
      )
    })

    test('rejects UNION-based SQL injection', () => {
      const invalidData = {
        sql_query: 'SELECT * FROM users WHERE id = 1 UNION ALL SELECT password FROM admins--',
        neo4j_connection_id: 1,
      }
      expect(() => translateQuerySchema.parse(invalidData)).toThrow(
        'La consulta contiene patrones sospechosos'
      )
    })

    test('allows up to 2 SQL comments', () => {
      const validData = {
        sql_query: `-- This is a comment
SELECT * FROM users
-- Another comment
WHERE age > 25`,
        neo4j_connection_id: 1,
      }
      expect(() => translateQuerySchema.parse(validData)).not.toThrow()
    })

    test('rejects queries with excessive SQL comments', () => {
      const invalidData = {
        sql_query: `-- Comment 1
-- Comment 2
SELECT * FROM users
-- Comment 3`,
        neo4j_connection_id: 1,
      }
      expect(() => translateQuerySchema.parse(invalidData)).toThrow(
        'La consulta contiene patrones sospechosos'
      )
    })

    test('rejects non-SQL text', () => {
      const invalidData = {
        sql_query: 'This is just plain text without SQL keywords',
        neo4j_connection_id: 1,
      }
      expect(() => translateQuerySchema.parse(invalidData)).toThrow(
        'No se detectó una sentencia SQL válida'
      )
    })

    test('accepts complex valid query', () => {
      const validData = {
        sql_query: `SELECT u.name, u.email, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
  AND o.created_at > '2024-01-01'
ORDER BY o.total DESC
LIMIT 10`,
        neo4j_connection_id: 1,
      }
      expect(() => translateQuerySchema.parse(validData)).not.toThrow()
    })

    test('accepts query with subquery', () => {
      const validData = {
        sql_query: `SELECT * FROM users WHERE id IN (SELECT user_id FROM orders WHERE total > 100)`,
        neo4j_connection_id: 1,
      }
      expect(() => translateQuerySchema.parse(validData)).not.toThrow()
    })
  })
})
