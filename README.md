# RolnoPol Test Framework

A comprehensive Playwright-based test automation framework for the RolnoPol website, built with best testing practices, clean code architecture, and scalable design.

## Technology Stack

- **Playwright**: End-to-end testing framework for web applications
- **TypeScript**: Type-safe development with static analysis
- **Node.js**: Runtime environment
- **ESLint**: Code linting with TypeScript and Playwright plugins
- **Biome**: Fast code formatting and linting
- **Prettier**: Code formatting
- **Dotenv**: Environment variable management

## Architectural Decisions

### Testing Framework Architecture
- **Page Object Model (POM)**: Encapsulates page elements and actions in reusable classes
- **Test Fixtures**: Centralized setup and teardown with Playwright fixtures
- **Environment Configuration**: Dynamic loading of environment-specific settings
- **Test Data Management**: Separated test data from test logic
- **Constants and Enums**: Centralized static values for maintainability

### Code Quality and Standards
- TypeScript strict mode for type safety
- ESLint and Biome for consistent code style
- Prettier for automated formatting
- Modular project structure with clear separation of concerns

### Test Execution
- Parallel test execution (configurable)
- Environment-based test runs (local, dev, UAT, prod)
- CI-ready configuration with retry logic
- Comprehensive reporting with HTML reports

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Install Playwright browser binaries:
   ```bash
   npx playwright install
   ```

## Running Tests

Run the full test suite:
```bash
npm test
```

Run tests for specific environments:
```bash
npm run test:local  # Local environment (default: http://localhost:3000)
npm run test:dev    # Development environment
npm run test:uat    # UAT environment
npm run test:prod   # Production environment
```

Open the HTML report after a run:
```bash
npm run report
```

## Code Quality

Lint and format code:
```bash
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run lint:biome   # Biome check
npm run lint:biome:fix  # Biome auto-fix
npm run format       # Prettier format
npm run format:check # Prettier check
```

## Environment Configuration

The framework supports multiple test environments through `.env` files:
- `.env.local` - Local development (BASE_URL: http://localhost:3000)
- `.env.dev` - Development environment
- `.env.uat` - User Acceptance Testing
- `.env.prod` - Production environment

Set `TEST_ENV` variable to select the target environment.

## Project Structure

```
├── const/                 # Static constants and assertions
│   ├── assertions.ts      # Test assertion constants
│   └── enums/
│       └── timeouts.ts    # Timeout enumerations
├── fixtures/              # Playwright test fixtures
│   └── fixtures.ts        # Shared test setup
├── helpers/               # Utility helpers
│   ├── api-helper.ts      # API testing utilities
│   └── mock-helper.ts     # Mock data helpers
├── pages/                 # Page Object Model classes
│   ├── BasePage.ts        # Base page class
│   ├── HomePage.ts        # Home page interactions
│   ├── LoginPage.ts       # Login page interactions
│   └── ProfilePage.ts     # Profile page interactions
├── test-data/             # Test data files
│   └── users.ts           # Demo user credentials
├── tests/                 # Test specifications
│   ├── local-api.spec.ts  # API tests
│   ├── local-home.spec.ts # Home page tests
│   ├── local-login.spec.ts # Login flow tests
│   ├── local-mock.spec.ts # Mock integration tests
│   └── local-profile.spec.ts # Profile page tests
├── playwright.config.ts   # Playwright configuration
├── tsconfig.json          # TypeScript configuration
├── biome.json             # Biome configuration
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## Test Coverage

The framework implements comprehensive test scenarios:

- **UI Tests**: Key user experience validation (home page, login, profile)
- **API Tests**: Backend endpoint testing (OpenAPI schema, healthcheck, authentication)
- **Integration Tests**: Frontend-backend interaction with mocks
- **Critical Business Scenarios**: Login flows, user sessions, navigation

## Demo Credentials

For testing and demonstration, the application includes pre-configured demo users:

| Email | Password |
|-------|----------|
| demo@example.com | demo123 |
| test@example.com | brownPass123 |
| john.doe@example.com | johndoe123 |
| jane.smith@example.com | janesmith456 |
| developer@example.com | dev123456 |
| emptyuser@rolnopol.demo.pl | demoPass123 |

## Assumptions and Constraints

- **Local URL**: Tests assume the application runs on `http://localhost:3000` for local execution
- **Demo Users**: Pre-configured users are available for authentication testing
- **Browser Support**: Tests run on Chromium by default, with mobile Chrome support
- **API Schema**: OpenAPI 3.0.0 specification is expected for API documentation
- **Session Management**: Authentication via `rolnopolToken` cookie
- **CI Environment**: `CI` environment variable controls retry behavior and headless mode

## Automation Features

- **Parallel Execution**: Tests run in parallel for faster execution
- **Data Mocking**: Frontend API mocking for isolated testing
- **Test Data Management**: Centralized user credentials and test constants
- **Cross-Environment**: Configurable for local, dev, UAT, and prod environments
- **Reporting**: Detailed HTML reports with screenshots and videos on failure
