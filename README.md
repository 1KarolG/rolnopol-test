# rolnopol-test

Playwright test framework for the RolnoPol website.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Install Playwright browser binaries:
   ```bash
   npx playwright install
   ```

## Running tests

Run the full test suite:
```bash
npm test
```

Run tests for the local environment:
```bash
npm run test:local
```

Run tests for a different environment:
```bash
npm run test:dev
npm run test:uat
npm run test:prod
```

Open the HTML report after a run:
```bash
npm run report
```

## Environment configuration

The Playwright config loads environment variables from `.env.<TEST_ENV>`.
- Local: `.env.local`
- Dev: `.env.dev`
- UAT: `.env.uat`
- Prod: `.env.prod`

Each file contains `BASE_URL`, which defaults to `http://localhost:3000` for local execution.

## Project structure

- `playwright.config.ts` — Playwright runner configuration and environment loading.
- `tests/pages/` — Page Object Model classes for reusable page interactions.
- `tests/test-data/` — Static test data such as demo credentials.
- `tests/specs/` — End-to-end tests targeting local URL behavior and API interactions.
- `.env.*` — Environment definitions for local, dev, UAT, and prod test targets.

## Test coverage

Implemented test categories:
- Local UI smoke tests
- Login flow validation
- API health check
- Frontend mock integration

## Notes

The suite is designed for local and CI execution, with `TEST_ENV` selecting the target environment and `CI` controlling retry behavior.
