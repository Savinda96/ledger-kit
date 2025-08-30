-- LedgerKit Sample Chart of Accounts
-- Migration 002: Insert standard accounting chart of accounts

INSERT INTO accounts (code, name, type) VALUES
-- Assets (1000-1999)
('1000', 'Cash on Hand', 'Asset'),
('1100', 'Cash in Bank - Operating', 'Asset'),
('1110', 'Cash in Bank - Payroll', 'Asset'),  
('1200', 'Accounts Receivable', 'Asset'),
('1210', 'Allowance for Bad Debts', 'Asset'),
('1300', 'Inventory', 'Asset'),
('1400', 'Prepaid Expenses', 'Asset'),
('1500', 'Equipment', 'Asset'),
('1510', 'Accumulated Depreciation - Equipment', 'Asset'),

-- Liabilities (2000-2999)
('2000', 'Accounts Payable', 'Liability'),
('2100', 'Credit Card Payable', 'Liability'),
('2200', 'Short-term Loans', 'Liability'),
('2300', 'Accrued Expenses', 'Liability'),
('2400', 'Taxes Payable', 'Liability'),

-- Equity (3000-3999)
('3000', 'Owner Equity', 'Equity'),
('3100', 'Retained Earnings', 'Equity'),
('3200', 'Current Year Earnings', 'Equity'),

-- Income (4000-4999)
('4000', 'Sales Revenue', 'Income'),
('4100', 'Service Revenue', 'Income'),
('4200', 'Interest Income', 'Income'),
('4300', 'Other Income', 'Income'),

-- Expenses (5000-9999)
('5000', 'Cost of Goods Sold', 'Expense'),
('6100', 'Office Supplies', 'Expense'),
('6200', 'Salaries and Wages', 'Expense'),
('6300', 'Bank Fees', 'Expense'),
('6400', 'Utilities', 'Expense'),
('6500', 'Rent Expense', 'Expense'),
('6600', 'Marketing Expenses', 'Expense'),
('6700', 'Travel Expenses', 'Expense'),
('6800', 'Professional Services', 'Expense'),
('6900', 'Depreciation Expense', 'Expense'),
('9999', 'Uncategorized', 'Expense');