# Development Guide

## Development Environment Options

LedgerKit supports multiple development setups to fit different preferences and workflows.

### Option 1: Local App + Docker Databases (Recommended)

This is the most flexible setup for active development:

```bash
# Start only databases
npm run docker:up

# App runs locally
npm run dev
```

**Benefits:**
- Fastest development cycle (no container rebuilds)
- Direct file watching and hot reload
- Better IDE integration and debugging
- Easy access to logs and console output

**How it works:**
- PostgreSQL runs in Docker on `localhost:5432`
- Redis runs in Docker on `localhost:6379`
- App connects to databases via localhost
- Perfect for active development

### Option 2: Fully Containerized

Everything runs in Docker containers:

```bash
# Start everything in containers
npm run docker:up:full
```

**Benefits:**
- Consistent environment across team members
- Closer to production setup
- Isolated from host system

**Trade-offs:**
- Slower development cycle (container rebuilds)
- More complex debugging
- File watching through volume mounts

### Option 3: Hybrid Testing

Separate test database for isolated testing:

```bash
# Start test database on port 5433
npm run docker:up:test

# Run tests
npm test
```

## Connection Details

### Local Development (.env)
```bash
DB_HOST=localhost    # Connects to Docker PostgreSQL
DB_PORT=5434         # Mapped from container port 5432
DB_NAME=ledgerkit_dev

REDIS_HOST=localhost # Connects to Docker Redis
REDIS_PORT=6379
```

### Testing (.env.test)
```bash
DB_HOST=localhost    # Connects to test PostgreSQL
DB_PORT=5433         # Different port for test isolation
DB_NAME=ledgerkit_test
```

### Containerized App (docker-compose.yml)
```bash
DB_HOST=postgres     # Docker service name resolution
DB_PORT=5432
REDIS_HOST=redis     # Docker service name resolution
```

## Database Management

### Migrations
```bash
# Run against development database
npm run db:migrate

# Run against test database (ensure test container is running)
DB_PORT=5433 npm run db:migrate
```

### Seeding
```bash
# Seed development data
npm run db:seed

# Reset and reseed
npm run db:reset
npm run db:migrate
npm run db:seed
```

### Database Access

**Via CLI:**
```bash
# Development database
psql -h localhost -p 5434 -U ledgerkit -d ledgerkit_dev

# Test database  
psql -h localhost -p 5433 -U ledgerkit -d ledgerkit_test
```

**Via pgAdmin:**
```bash
npm run docker:up:tools
# Visit http://localhost:8080
# Email: admin@ledgerkit.local
# Password: admin
```

## Debugging

### Local App Debugging
When running locally, you get full debugging capabilities:
- Console.log output directly in terminal
- Debugger statements work
- VS Code debugging
- Direct file access

### Container Debugging
```bash
# View app logs
npm run docker:logs

# Access running container
docker exec -it ledgerkit-app bash

# Debug specific service
docker-compose -f docker-compose.yml logs -f app
```

## Common Workflows

### Daily Development
```bash
# Start databases (only need to do this once)
npm run docker:up

# Start development
npm run dev

# In another terminal - run tests
npm test

# Check database directly
npm run docker:up:tools  # pgAdmin
```

### Team Consistency
```bash
# Everyone runs the same containerized setup
npm run docker:up:full
```

### CI/CD Pipeline
```bash
# Start test database
npm run docker:up:test

# Run full test suite
npm run test:coverage

# Build production image
npm run docker:build
```

## Troubleshooting

### Port Conflicts
If ports 5434, 5433, or 6379 are already in use:

1. Stop conflicting services
2. Or modify ports in `docker-compose.dev.yml`
3. Update `.env` files accordingly

Example: Change PostgreSQL to port 5435:
```yaml
# In docker-compose.dev.yml
ports:
  - "5435:5432"  # local:container
```

### Database Connection Issues
```bash
# Check if containers are running
docker ps

# Check container logs
npm run docker:logs

# Test direct connection
psql -h localhost -p 5434 -U ledgerkit -d ledgerkit_dev
```

### Container Issues
```bash
# Stop everything and restart clean
npm run docker:down
docker system prune -f
npm run docker:up
```

## Performance Tips

1. **Use local development** for active coding
2. **Use volumes properly** if you need containers
3. **Separate test database** prevents data contamination
4. **Clean up unused containers** regularly