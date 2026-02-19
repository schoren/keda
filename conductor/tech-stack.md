# Technology Stack: Keda

## Core Platforms
- **Web Frontend:** Next.js (React) with TypeScript, configured as a strictly client-side Progressive Web App (PWA).
- **Mobile Frontend:** React Native (TypeScript) for native Android and iOS experiences.
- **Backend API:** Go (Gin) providing a high-performance, secure RESTful API.

## Shared Architecture
- **Shared Logic Library:** A shared TypeScript package used by both Web and Mobile apps for business logic, validation, and API client integration, ensuring consistency across platforms.
- **UI Focus:** The React and React Native applications focus primarily on platform-specific UI/UX, leveraging the shared library for core functionality.

## Data & Storage
- **Database:** PostgreSQL for persistent storage.
- **ORM:** GORM (Go Object Relational Mapper) for secure and idiomatic database interactions.
- **Local Development:** SQLite is supported for easy local development and testing.

## Engineering Standards
- **Test-Driven Development (TDD):** A strong commitment to TDD to ensure reliability and maintainability.
- **High Test Coverage:** Rigorous testing requirements across all layers (Backend, Shared Logic, UI).
- **Security First:** Focused on data encryption, secure authentication (JWT), and regular security scanning (gosec, Trivy).
- **Self-Hosting & Transparency:** Designed for easy self-hosting (Docker/Docker Compose) with transparent data handling to ensure user privacy and data ownership.

## Tooling & Infrastructure
- **Monorepo Management:** Turbo for efficient management of the client-side packages.
- **Containerization:** Docker for consistent environments across development and production.
- **Automation:** Makefile-driven workflow for common tasks like building, testing, and linting.
