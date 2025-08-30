#!/usr/bin/env tsx
// Database reset script for LedgerKit development

import { Pool } from 'pg';
import config from '../src/config';

const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.database,
  user: config.database.username,
  password: config.database.password,
  ssl: config.database.ssl,
});

async function resetDatabase(): Promise<void> {
  try {
    console.log('🔄 Resetting database...');
    
    // Drop all tables in correct order (reverse dependency order)
    const dropQueries = [
      'DROP TABLE IF EXISTS journal_lines CASCADE',
      'DROP TABLE IF EXISTS journal_entries CASCADE',
      'DROP TABLE IF EXISTS transaction_classifications CASCADE',
      'DROP TABLE IF EXISTS transactions CASCADE',
      'DROP TABLE IF EXISTS accounts CASCADE',
      'DROP TABLE IF EXISTS migrations CASCADE',
      'DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE',
    ];

    for (const query of dropQueries) {
      await pool.query(query);
    }

    console.log('✅ All tables dropped');
    console.log('🎉 Database reset completed!');
    console.log('💡 Run "npm run db:migrate" to recreate the schema');
  } catch (error) {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  resetDatabase();
}