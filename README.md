# LedgerKit

> Open-source transaction-to-ledger system with double-entry accounting

LedgerKit transforms raw financial transactions into a strict double-entry accounting ledger using a rule engine. Built with TypeScript and PostgreSQL for developer-friendly, extensible financial applications.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 8+
- Docker and Docker Compose
- PostgreSQL 15+ (if running without Docker)

### Development Setup

1. **Clone and install dependencies**
   ```bash
   git clone https://github.com/prageeth/ledgerkit.git
   cd ledgerkit
   npm install
   ```

2. **Start development environment**
   ```bash
   # Start only PostgreSQL and Redis with Docker
   npm run docker:up
   
   # Copy environment file and customize if needed
   cp .env.example .env
   
   # Run database migrations
   npm run db:migrate
   
   # Seed with sample data
   npm run db:seed
   
   # Start development server (runs locally, connects to Docker databases)
   npm run dev
   ```

3. **Verify setup**
   ```bash
   # Run tests
   npm test
   
   # Check code quality
   npm run lint
   ```

### Production Deployment

```bash
# Build production image
docker build -t ledgerkit .

# Deploy with production compose
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 Core Features

- **Transaction Ingestion**: CSV import + JSON API with deduplication
- **Classification**: YAML-based rule engine with confidence scoring  
- **Ledger Posting**: Immutable double-entry journal entries
- **Chart of Accounts**: Standard accounting structure
- **Reports**: Trial balance and account balances
- **Developer Experience**: REST API, CLI, Docker setup, comprehensive tests

## 🏗️ Architecture

```
ledgerkit/
├── src/
│   ├── core/               # Core business logic
│   │   ├── ledger/        # Double-entry ledger engine
│   │   ├── rules/         # Classification rule engine  
│   │   ├── interfaces/    # TypeScript interfaces/types
│   │   └── services/      # Business logic services
│   ├── adapters/          # External integrations
│   │   ├── csv/           # CSV import/export
│   │   ├── database/      # Database adapters (PostgreSQL)
│   │   └── external/      # Future: bank APIs, etc.
│   ├── api/               # REST API routes & handlers
│   ├── cli/               # Command-line interface
│   ├── config/            # Configuration management
│   └── utils/             # Shared utilities
├── examples/              # Sample data & configurations
├── tests/                 # Test suites (unit, integration, e2e)
├── migrations/            # Database migrations
└── docker/                # Docker configurations
```

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run build:watch      # Build in watch mode

# Database
npm run db:migrate       # Run database migrations
npm run db:seed          # Load sample data
npm run db:reset         # Reset database (development only)

# Testing  
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format with Prettier

# Docker
npm run docker:up        # Start databases only (recommended for local dev)
npm run docker:up:full   # Start everything including app in containers
npm run docker:up:test   # Start test database
npm run docker:up:tools  # Start with pgAdmin
npm run docker:down      # Stop containers
npm run docker:logs      # View container logs
```

## 📋 Usage Examples

### Import Transactions
```bash
# CSV import (when CLI is implemented)
ledgerkit import examples/sample_transactions.csv

# API import (when API is implemented)
curl -X POST http://localhost:3000/api/transactions/import \
  -F "file=@examples/sample_transactions.csv"
```

### Classification Rules
Rules are defined in YAML format (see `examples/rules.yaml`):

```yaml
rules:
  - name: "Office Supplies"
    priority: 70
    conditions:
      description: "(?i)(office|supplies|stationery)"
      amount: { max: 5000 }
    accounts:
      debit: "6100"  # Office Supplies Expense
      credit: "1100" # Cash in Bank
    confidence: 0.80
```

## 🧪 Testing

```bash
# Unit tests
npm run test tests/unit

# Integration tests  
npm run test tests/integration

# End-to-end tests
npm run test tests/e2e

# Test coverage
npm run test:coverage
```

## 📈 Development Roadmap

### Phase 1: Foundation ✅
- [x] Project structure and TypeScript setup
- [x] Database schema and migrations
- [x] Docker development environment
- [x] Basic configuration management

### Phase 2: Rule Engine (In Progress)
- [ ] YAML rule parser
- [ ] Classification service
- [ ] Rule evaluation engine

### Phase 3: Ledger Engine
- [ ] Double-entry logic
- [ ] Journal entry generation
- [ ] Immutable posting

### Phase 4: APIs & CLI
- [ ] REST API endpoints
- [ ] CLI commands
- [ ] Report generation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the coding standards
4. Add tests for new functionality
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📚 [Documentation](./docs/)
- 🐛 [Issue Tracker](https://github.com/prageeth/ledgerkit/issues)
- 💬 [Discussions](https://github.com/prageeth/ledgerkit/discussions)

---

**Built with ❤️ for the open-source community**