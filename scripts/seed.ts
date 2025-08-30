#!/usr/bin/env tsx
// Database seeding script for LedgerKit development

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

async function seedDatabase(): Promise<void> {
  try {
    console.log('🌱 Seeding development data...');

    // Sample transactions for testing
    const sampleTransactions = [
      {
        date: '2024-01-01',
        amount: -50.00,
        description: 'GCash Service Fee',
        counterparty: 'GCash',
        reference: 'FEE2024001',
        source: 'bank_import'
      },
      {
        date: '2024-01-02',
        amount: -2000.00,
        description: 'ATM Withdrawal',
        counterparty: 'BPI ATM',
        reference: 'ATM240102',
        source: 'bank_import'
      },
      {
        date: '2024-01-03',
        amount: -25000.00,
        description: 'Salary Payment - John Doe',
        counterparty: 'John Doe',
        reference: 'SAL202401',
        source: 'payroll'
      },
      {
        date: '2024-01-04',
        amount: -1500.00,
        description: 'Office Supplies - Stationery',
        counterparty: 'National Bookstore',
        reference: 'OS240104',
        source: 'manual'
      },
      {
        date: '2024-01-05',
        amount: -3200.00,
        description: 'Electric Bill Payment',
        counterparty: 'Meralco',
        reference: 'ELEC202401',
        source: 'manual'
      }
    ];

    for (const transaction of sampleTransactions) {
      // Create hash for deduplication
      const hash = require('crypto')
        .createHash('sha256')
        .update(`${transaction.date}-${transaction.amount}-${transaction.description}`)
        .digest('hex');

      await pool.query(`
        INSERT INTO transactions (hash, date, amount, description, counterparty, reference, source)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (hash) DO NOTHING
      `, [hash, transaction.date, transaction.amount, transaction.description, 
          transaction.counterparty, transaction.reference, transaction.source]);
    }

    console.log(`✅ Inserted ${sampleTransactions.length} sample transactions`);
    console.log('🎉 Database seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  seedDatabase();
}