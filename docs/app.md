# KJS Buddy

KJS Buddy is a comprehensive card management application designed for rally competitions. It allows users to create, store, and manage time cards across devices with real-time synchronization capabilities.

## Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Technical Architecture](#technical-architecture)
4. [Authentication System](./features/authentication-system.md)
5. [Card Management](./features/card-management.md)
6. [Web Worker Implementation](./features/web-worker-implementation.md)
7. [Offline Capabilities](./features/offline-capabilities.md)
8. [Countdown Feature](./features/countdown-feature.md)
9. [Version Management](./features/version-management.md)
10. [API Integration](./features/api-integration.md)

## Overview

KJS Buddy is a Progressive Web Application (PWA) that facilitates the management of time cards used in rally competitions. The application provides functionality for creating custom cards, managing timing, and synchronizing card data across devices.

## Key Features

### 1. User Authentication

KJS Buddy implements a comprehensive authentication system that supports:
- Email and password authentication
- Role-based access control (user, admin roles)
- Secure token-based sessions
- Cross-device synchronization for registered users

### 2. Card Management

The application provides robust card management capabilities:
- Create new cards with custom information
- Edit existing cards with real-time updates
- Delete unwanted cards
- Organize cards based on last used date
- Synchronize cards between local storage and server

### 3. Offline Functionality

KJS Buddy operates fully offline with:
- Service worker implementation for caching resources
- Local storage for saving card data
- Background synchronization when connection is restored
- PWA installation support for native-like experience

### 4. Real-time Countdown Timer

The application includes a real-time countdown feature that:
- Calculates time to next PKC (Time Control Point)
- Shows notifications at predefined intervals (5 minutes, 1 minute)
- Updates automatically through web worker processes

### 5. Version Management

KJS Buddy includes sophisticated version management to ensure users always have the latest version:
- Periodic version checks (every 5 minutes by default)
- Notification prompts for new versions
- Automatic cache clearing on version updates
- Force refresh mechanism for loading failures

## Technical Architecture

KJS Buddy uses a modular architecture with the following components:

### Frontend (React + Vite)
- React for UI components
- Vite for fast development and optimized builds
- PWA capabilities with service workers
- TypeScript for type safety

### Backend (NestJS)
- RESTful API endpoints for card and user management
- JWT authentication for secure access
- Swagger documentation for API reference
- Cross-origin resource sharing (CORS) support

### Monorepo Structure
- Turborepo for managing multiple packages
- Shared rally-card package for card components
- Consistent build and development processes

## Detailed Feature Documentation

For more detailed information about each feature, please refer to the following documentation:

- [Authentication System](./features/authentication-system.md)
- [Card Management](./features/card-management.md)
- [Web Worker Implementation](./features/web-worker-implementation.md)
- [Offline Capabilities](./features/offline-capabilities.md)
- [Countdown Feature](./features/countdown-feature.md)
- [Version Management](./features/version-management.md)
- [API Integration](./features/api-integration.md)