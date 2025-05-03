# KJS-Buddy

KJS-Buddy is a card management application that allows users to create, store, and manage cards across devices. The application includes authentication features, card templates, and user-specific card management.

![countdown](./docs/countdown.gif)

## Features

- User authentication (email/password and social login)
- Card creation and management
- Card templates
- Cross-device synchronization for registered users
- Role-based access control (admin, user)

## Project Structure

The project is organized as a monorepo using Turborepo with the following structure:

- `apps/frontend`: React application built with Vite
- `apps/backend`: NestJS API server
- `docs`: Project documentation

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [pnpm](https://pnpm.io/) (v10.9.0 or newer)
- Git

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/devchew/kjs-buddy.git
   cd kjs-buddy
   ```

2. Install dependencies:
   ```
   pnpm install
   ```

## Development

To start both frontend and backend in development mode:

```
pnpm dev
```

### Frontend Only

```
cd apps/frontend
pnpm dev
```

The frontend development server will start at [http://localhost:7777](http://localhost:7777)

### Backend Only

```
cd apps/backend
pnpm dev
```

The backend API server will start at [http://localhost:3000](http://localhost:3000)

## Building for Production

To build both frontend and backend:

```
pnpm build
```

### Frontend Only

```
cd apps/frontend
pnpm build
```

### Backend Only

```
cd apps/backend
pnpm build
```

## API Documentation

The API documentation is available at `/api/docs` when the backend server is running.
Additional documentation can be found in [docs/backend-api.md](docs/backend-api.md).

## Testing

### Backend

```
cd apps/backend
pnpm test        # Run unit tests
pnpm test:e2e    # Run end-to-end tests
pnpm test:cov    # Run tests with coverage
```

### Frontend

```
cd apps/frontend
pnpm lint        # Run ESLint
pnpm check-types # Run TypeScript type checking
```

## Deployment

tbd
