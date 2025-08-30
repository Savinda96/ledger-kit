// Unit tests for TypeScript interfaces
import { 
  Account, 
  Transaction, 
  JournalEntry,
  ClassificationRule,
  AccountType 
} from '../../src/core/interfaces';

describe('Interfaces', () => {
  describe('AccountType', () => {
    it('should accept valid account types', () => {
      const validTypes: AccountType[] = ['Asset', 'Liability', 'Equity', 'Income', 'Expense'];
      
      validTypes.forEach(type => {
        const account: Partial<Account> = {
          type,
          code: '1000',
          name: 'Test Account'
        };
        expect(account.type).toBe(type);
      });
    });
  });

  describe('Transaction', () => {
    it('should create a transaction with required fields', () => {
      const transaction: Partial<Transaction> = {
        hash: 'abc123',
        date: new Date('2024-01-01'),
        amount: 100.50,
        description: 'Test transaction',
        source: 'manual',
        classificationStatus: 'pending'
      };

      expect(transaction.amount).toBe(100.50);
      expect(transaction.classificationStatus).toBe('pending');
      expect(transaction.date).toEqual(new Date('2024-01-01'));
    });
  });

  describe('ClassificationRule', () => {
    it('should create a rule with conditions', () => {
      const rule: ClassificationRule = {
        name: 'Test Rule',
        priority: 100,
        conditions: {
          description: '(?i)test',
          amount: { min: 10, max: 100 }
        },
        accounts: {
          debit: '6100',
          credit: '1100'
        },
        confidence: 0.95,
        rationale: 'Test rule for unit testing'
      };

      expect(rule.confidence).toBe(0.95);
      expect(rule.conditions.amount?.min).toBe(10);
      expect(rule.conditions.amount?.max).toBe(100);
    });
  });

  describe('JournalEntry', () => {
    it('should create a journal entry with lines', () => {
      const entry: Partial<JournalEntry> = {
        entryNumber: 'JE-001',
        date: new Date('2024-01-01'),
        description: 'Test entry',
        lines: [
          {
            id: 1,
            journalEntryId: 1,
            accountId: 1,
            debitAmount: 100,
            creditAmount: 0,
            description: 'Debit line',
            lineNumber: 1,
            createdAt: new Date()
          },
          {
            id: 2,
            journalEntryId: 1,
            accountId: 2,
            debitAmount: 0,
            creditAmount: 100,
            description: 'Credit line',
            lineNumber: 2,
            createdAt: new Date()
          }
        ]
      };

      expect(entry.lines).toHaveLength(2);
      expect(entry.lines![0].debitAmount).toBe(100);
      expect(entry.lines![1].creditAmount).toBe(100);
    });
  });
});