# KJS-Buddy

[try it here](https://rajdex.pl/)
> it might not work sometimes because of the server being cheap or down

KJS-Buddy is a card management application that allows users to create, store, and manage cards across devices. The application includes authentication features, card templates, and user-specific card management.

![countdown](./docs/countdown.gif)

## Features

- [User Authentication](./docs/features/authentication-system.md) (email/password and social login)
- [Card Management](./docs/features/card-management.md) (creation, templates, synchronization)
- [Offline Capabilities](./docs/features/offline-capabilities.md)
- [Real-time Countdown Timer](./docs/features/countdown-feature.md)
- [Web Worker Implementation](./docs/features/web-worker-implementation.md)
- [Version Management](./docs/features/version-management.md)
- [API Integration](./docs/features/api-integration.md)
- Role-based access control (admin, user)

## Project Structure

The project is organized as a monorepo using Turborepo with the following structure:

- `apps/frontend`: React application built with Vite
- `apps/backend`: NestJS API server
- `docs`: Project documentation
  - [Application Overview](./docs/app.md)
  - [Feature Documentation](./docs/features/)
  - [Backend API Documentation](./docs/backend-api.md)

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [pnpm](https://pnpm.io/) (v10.9.0 or newer)
- Git

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/devchew/kjs-buddy.git
   cd kjs-buddy
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

## Development

To start both frontend and backend in development mode:

```bash
pnpm dev
```

### Frontend Only

```bash
cd apps/frontend
pnpm dev
```

The frontend development server will start at [http://localhost:7777](http://localhost:7777)

### Backend Only

```bash
cd apps/backend
pnpm dev
```

The backend API server will start at [http://localhost:3000](http://localhost:3000)

## Building for Production

To build both frontend and backend:

```bash
pnpm build
```

### Frontend Only

```bash
cd apps/frontend
pnpm build
```

### Backend Only

```bash
cd apps/backend
pnpm build
```

## API Documentation

The API documentation is available at `/api/docs` when the backend server is running.
Additional documentation can be found in [docs/backend-api.md](docs/backend-api.md).

## Configuration

The backend application can be configured using environment variables:

### CORS Configuration

To configure CORS (Cross-Origin Resource Sharing), set the `CORS_ORIGINS` environment variable with a comma-separated list of allowed domains:

```bash
CORS_ORIGINS=http://localhost:7777,https://rajdex.pl
```

By default, `http://localhost:7777` is allowed if `CORS_ORIGINS` is not set.

## Testing

### Backend

```bash
cd apps/backend
pnpm test        # Run unit tests
pnpm test:e2e    # Run end-to-end tests
pnpm test:cov    # Run tests with coverage
```

### Frontend

```bash
cd apps/frontend
pnpm lint        # Run ESLint
pnpm check-types # Run TypeScript type checking
```

## Deployment

### Test Locally

Run the following commands:

```bash
# Install dependencies
pnpm install --frozen-lockfile

# Build all packages
pnpm build

# Deploy backend
pnpm deploy --filter=./apps/backend --prod ./dist/backend

# Deploy frontend
pnpm deploy --filter=./apps/frontend --prod ./dist/frontend

# Start the application
docker compose up
```
