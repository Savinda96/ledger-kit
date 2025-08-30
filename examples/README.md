# LedgerKit Examples

This directory contains sample configurations and data files for LedgerKit development and testing.

## Files

### `rules.yaml`
Sample classification rules that demonstrate the rule engine capabilities:
- **High Priority Rules**: Specific transaction patterns (GCash fees, ATM withdrawals, salary payments)
- **Medium Priority Rules**: Category-based matching (office supplies, utilities)
- **Fallback Rule**: Catches all unmatched transactions

### `sample_transactions.csv`
Sample transaction data for testing imports and classifications:
- Various transaction types (fees, withdrawals, expenses, revenue)
- Different sources (bank_import, payroll, manual)
- Realistic amounts and descriptions for Philippines business context

### `sample_chart_of_accounts.sql`
Standard chart of accounts structure included in database migrations.

## Usage

### Import Sample Transactions
```bash
# Via CLI (when implemented)
ledgerkit import examples/sample_transactions.csv

# Via API (when implemented)
curl -X POST http://localhost:3000/api/transactions/import \
  -F "file=@examples/sample_transactions.csv"
```

### Test Classification Rules
```bash
# Test rules against sample data (when implemented)
ledgerkit rules test --file examples/sample_transactions.csv
```

### Customize for Your Business
1. Copy `rules.yaml` to your preferred location
2. Modify account codes to match your chart of accounts  
3. Add/remove rules based on your transaction patterns
4. Update the `RULES_PATH` environment variable to point to your rules file