// Integration tests for database operations
import { TestDatabase } from '../helpers/database';

describe('Database Integration', () => {
  beforeAll(async () => {
    // Ensure test database is available
    await TestDatabase.getPool();
  });

  beforeEach(async () => {
    await TestDatabase.clearTables();
    await TestDatabase.seedAccounts();
  });

  afterAll(async () => {
    await TestDatabase.close();
  });

  describe('Accounts', () => {
    it('should insert and query accounts', async () => {
      const pool = await TestDatabase.getPool();
      
      const { rows } = await pool.query('SELECT * FROM accounts WHERE code = $1', ['1000']);
      
      expect(rows).toHaveLength(1);
      expect(rows[0].name).toBe('Cash on Hand');
      expect(rows[0].type).toBe('Asset');
    });

    it('should enforce unique account codes', async () => {
      const pool = await TestDatabase.getPool();
      
      await expect(
        pool.query(`
          INSERT INTO accounts (code, name, type) 
          VALUES ('1000', 'Duplicate', 'Asset')
        `)
      ).rejects.toThrow();
    });
  });

  describe('Transactions', () => {
    it('should insert transactions with hash deduplication', async () => {
      const pool = await TestDatabase.getPool();
      const hash = 'test-hash-123';
      
      // First insertion should succeed
      await pool.query(`
        INSERT INTO transactions (hash, date, amount, description, source)
        VALUES ($1, $2, $3, $4, $5)
      `, [hash, '2024-01-01', 100.00, 'Test transaction', 'manual']);

      // Second insertion with same hash should fail
      await expect(
        pool.query(`
          INSERT INTO transactions (hash, date, amount, description, source)
          VALUES ($1, $2, $3, $4, $5)
        `, [hash, '2024-01-01', 100.00, 'Duplicate', 'manual'])
      ).rejects.toThrow();
    });

    it('should auto-update timestamps', async () => {
      const pool = await TestDatabase.getPool();
      
      // Insert transaction
      const { rows: insertRows } = await pool.query(`
        INSERT INTO transactions (hash, date, amount, description, source)
        VALUES ($1, $2, $3, $4, $5) RETURNING created_at, updated_at
      `, ['hash123', '2024-01-01', 100.00, 'Test', 'manual']);

      const createdAt = insertRows[0].created_at;
      const originalUpdatedAt = insertRows[0].updated_at;

      // Wait a moment then update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await pool.query(`
        UPDATE transactions 
        SET description = $1 
        WHERE hash = $2
      `, ['Updated description', 'hash123']);

      // Check that updated_at changed
      const { rows: updateRows } = await pool.query(`
        SELECT created_at, updated_at 
        FROM transactions 
        WHERE hash = $1
      `, ['hash123']);

      expect(updateRows[0].created_at).toEqual(createdAt);
      expect(updateRows[0].updated_at).not.toEqual(originalUpdatedAt);
    });
  });
});