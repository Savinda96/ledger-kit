-- LedgerKit Initial Database Schema
-- Migration 001: Create core tables for double-entry accounting system

-- Chart of Accounts
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('Asset', 'Liability', 'Equity', 'Income', 'Expense')),
    parent_id INTEGER REFERENCES accounts(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Raw Transactions (mutable for classification status)
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    hash VARCHAR(64) UNIQUE NOT NULL, -- For deduplication
    date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    description TEXT NOT NULL,
    counterparty VARCHAR(255),
    reference VARCHAR(100),
    source VARCHAR(50) DEFAULT 'manual',
    classification_status VARCHAR(20) DEFAULT 'pending', -- pending, classified, posted, error
    raw_data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Transaction Classifications (links transactions to accounts)
CREATE TABLE transaction_classifications (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES transactions(id) UNIQUE,
    debit_account_id INTEGER REFERENCES accounts(id),
    credit_account_id INTEGER REFERENCES accounts(id),
    confidence DECIMAL(3,2) DEFAULT 1.0,
    rule_name VARCHAR(100),
    rationale TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, posted, error
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Journal Entries (immutable)
CREATE TABLE journal_entries (
    id SERIAL PRIMARY KEY,
    entry_number VARCHAR(20) UNIQUE NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    source_transaction_id INTEGER REFERENCES transactions(id),
    reversal_of INTEGER REFERENCES journal_entries(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Journal Lines (immutable) 
CREATE TABLE journal_lines (
    id SERIAL PRIMARY KEY,
    journal_entry_id INTEGER REFERENCES journal_entries(id),
    account_id INTEGER REFERENCES accounts(id),
    debit_amount DECIMAL(15,2) DEFAULT 0.00,
    credit_amount DECIMAL(15,2) DEFAULT 0.00,
    description TEXT,
    line_number INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT balanced_line CHECK ((debit_amount = 0 AND credit_amount > 0) OR (debit_amount > 0 AND credit_amount = 0))
);

-- Indexes for performance
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_hash ON transactions(hash);
CREATE INDEX idx_transactions_status ON transactions(classification_status);
CREATE INDEX idx_journal_entries_date ON journal_entries(date);
CREATE INDEX idx_journal_entries_source ON journal_entries(source_transaction_id);
CREATE INDEX idx_journal_lines_account ON journal_lines(account_id);
CREATE INDEX idx_journal_lines_entry ON journal_lines(journal_entry_id);
CREATE INDEX idx_accounts_type ON accounts(type);
CREATE INDEX idx_accounts_code ON accounts(code);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transaction_classifications_updated_at BEFORE UPDATE ON transaction_classifications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();