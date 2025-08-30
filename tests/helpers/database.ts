// Database test helpers
import { Pool } from 'pg';
import config from '../../src/config';

export class TestDatabase {
  private static pool: Pool;

  static async getPool(): Promise<Pool> {
    if (!this.pool) {
      this.pool = new Pool({
        host: config.database.host,
        port: config.database.port,
        database: `${config.database.database}_test`,
        user: config.database.username,
        password: config.database.password,
        ssl: config.database.ssl,
      });
    }
    return this.pool;
  }

  static async clearTables(): Promise<void> {
    const pool = await this.getPool();
    const tables = [
      'journal_lines',
      'journal_entries', 
      'transaction_classifications',
      'transactions',
      'accounts'
    ];

    for (const table of tables) {
      await pool.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
    }
  }

  static async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
    }
  }

  static async seedAccounts(): Promise<void> {
    const pool = await this.getPool();
    await pool.query(`
      INSERT INTO accounts (code, name, type) VALUES
      ('1000', 'Cash on Hand', 'Asset'),
      ('1100', 'Cash in Bank', 'Asset'),
      ('6100', 'Office Supplies', 'Expense'),
      ('6200', 'Salaries', 'Expense'),
      ('6300', 'Bank Fees', 'Expense'),
      ('9999', 'Uncategorized', 'Expense')
      ON CONFLICT (code) DO NOTHING
    `);
  }
}