# Contributing Guide

## Development Setup

1. Prerequisites: Node 18+, PostgreSQL 14+, pnpm/npm, Git
2. Install deps:
   - Backend: `cd lms-backend && npm install`
   - Frontend: `cd .. && npm install`
3. Environment:
   - Copy `.env.example` to `.env` and fill values
   - Copy `lms-backend/config/config.env` from example values and fill
4. Start dev:
   - Backend: `cd lms-backend && npm run dev`
   - Frontend: `npm run dev`

## Branching & Commits

- Create feature branches: `feat/<short-name>` or `fix/<short-name>`
- Write conventional commits: `feat: add course approval endpoint`

## Code Style

- Typescript: enable strict mode, no `any`
- JavaScript (backend): prefer meaningful names, guard clauses, no deep nesting
- Run lints/formatters if configured

## Testing

- Backend tests: `cd lms-backend && npx jest`
  - Uses sqlite in-memory under `NODE_ENV=test`
- Frontend tests: `npx jest`
- Add tests for new endpoints and components

## API Changes

- Update `lms-backend/README.md` endpoint docs
- If new env vars are introduced, update `.env.example` and `DEPLOYMENT.md`

## Pull Requests

- Link issue, describe changes, screenshots for UI
- Ensure all tests pass (CI will run)
- Request review from maintainers

## Security

- Never commit secrets
- Report vulnerabilities privately to maintainers