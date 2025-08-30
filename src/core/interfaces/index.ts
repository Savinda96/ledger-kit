// Core TypeScript Models & Interfaces for LedgerKit
// Based on specifications in CLAUDE.md

export interface Account {
  id: number;
  code: string;
  name: string;
  type: AccountType;
  parentId?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';

export interface Transaction {
  id: number;
  hash: string;
  date: Date;
  amount: number;
  description: string;
  counterparty?: string;
  reference?: string;
  source: string;
  classificationStatus: TransactionStatus;
  rawData?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export type TransactionStatus = 'pending' | 'classified' | 'posted' | 'error';

export interface TransactionClassification {
  id: number;
  transactionId: number;
  debitAccountId: number;
  creditAccountId: number;
  confidence: number;
  ruleName?: string;
  rationale: string;
  status: ClassificationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type ClassificationStatus = 'pending' | 'posted' | 'error';

export interface JournalEntry {
  id: number;
  entryNumber: string;
  date: Date;
  description: string;
  sourceTransactionId?: number;
  reversalOf?: number;
  lines: JournalLine[];
  createdAt: Date;
}

export interface JournalLine {
  id: number;
  journalEntryId: number;
  accountId: number;
  debitAmount: number;
  creditAmount: number;
  description: string;
  lineNumber: number;
  createdAt: Date;
}

// Rule Engine Types
export interface ClassificationRule {
  name: string;
  priority: number;
  conditions: RuleConditions;
  accounts: {
    debit: string;  // Account code
    credit: string; // Account code
  };
  confidence: number;
  rationale: string;
  enabled?: boolean;
}

export interface RuleConditions {
  description?: string | RegExp;
  counterparty?: string | RegExp;
  amount?: {
    min?: number;
    max?: number;
    equals?: number;
  };
  reference?: string | RegExp;
  source?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ImportResult {
  imported: number;
  duplicates: number;
  errors: string[];
  transactions: Transaction[];
}

export interface ClassificationResult {
  transactionId: number;
  classification: {
    debitAccount: Account;
    creditAccount: Account;
    confidence: number;
    ruleName?: string;
    rationale: string;
  };
}

export interface TrialBalance {
  asOf: Date;
  accounts: TrialBalanceAccount[];
  totals: {
    totalDebits: number;
    totalCredits: number;
    balanced: boolean;
  };
}

export interface TrialBalanceAccount {
  code: string;
  name: string;
  type: AccountType;
  debitBalance: number;
  creditBalance: number;
}