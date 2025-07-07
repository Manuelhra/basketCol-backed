# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Build and Development
- `npm run tsc` - Compile TypeScript
- `npm run tsc:dev` - Compile TypeScript in watch mode
- `npm run start:dev` - Start development server with ts-node
- `npm run start:prod` - Start production server with PM2

### Code Quality
- Run ESLint for code quality checks (use project's .eslintrc.json config)
- TypeScript compilation should be verified before commits

## Architecture Overview

This is a basketball management backend API built with **Clean Architecture** and **Domain-Driven Design (DDD)** principles.

### Core Architecture Pattern
The codebase follows Clean Architecture with clear layer separation:

```
src/basketCol/[domain]/
├── application/          # Use cases, DTOs, business logic
│   ├── dtos/            # Data Transfer Objects
│   ├── exceptions/      # Domain-specific exceptions
│   ├── services/        # Application services
│   └── use-cases/       # Business use cases
└── infrastructure/      # External concerns
    ├── dependency-injection/  # Awilix DI configuration
    ├── persistence/     # Database repositories (Mongoose)
    ├── server/          # Express controllers and routes
    └── services/        # Infrastructure services
```

### Domain Boundaries
Main bounded contexts include:
- **Authentication** - JWT-based auth with refresh tokens
- **Users** - Player, Host, League Founder, Referee, Team Founder
- **Competitions** - League, Season, Fixture, Game management
- **Teams** - Team and player associations
- **Facilities** - Courts and gyms
- **Shared** - Common utilities and infrastructure

### Key Technologies
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **DI Container**: Awilix for dependency injection
- **Authentication**: JWT with bcrypt password hashing
- **File Storage**: AWS S3 integration
- **File Processing**: XLSX for Excel, Sharp for images

## Important Conventions

### Naming Patterns
- Use Cases: `[Action][Entity]UseCase` (e.g., `CreateLeagueUseCase`)
- DTOs: `[Action][Entity]DTO` (e.g., `CreateLeagueDTO`)
- Controllers: `Express[Action][Entity][Method]Controller`
- Repositories: `Mongoose[Entity]Repository`
- Error Handlers: `Express[Entity]ServerErrorHandler`

### File Organization
- Each domain module has its own dependency injection container
- Domain entities are imported from `@basketcol/domain` package
- Infrastructure concerns are separated from business logic
- API routes use `/api/v1` prefix

### Dependency Injection
- Uses Awilix container for IoC
- Each domain has `I[Domain]Container` interface
- Dependency injectors extend `AwilixDependencyInjector` base class
- Register dependencies in `awilix/[Domain]DependencyInjector.ts`

## Development Guidelines

### Adding New Features
1. Create domain-specific use cases in `application/use-cases/`
2. Define DTOs in `application/dtos/`
3. Implement repository interfaces in `infrastructure/persistence/`
4. Add Express controllers in `infrastructure/server/express/controllers/`
5. Configure routes in `infrastructure/server/express/routes/`
6. Register dependencies in DI container

### Error Handling
- Use domain-specific exceptions in `application/exceptions/`
- Implement error handlers in `infrastructure/server/express/`
- Follow consistent error response format

### Database Operations
- Use Mongoose repositories with clear interfaces
- Implement schemas in `infrastructure/persistence/mongoose/`
- Follow repository pattern with domain interfaces

### Authentication & Authorization
- JWT-based authentication with refresh tokens
- User context available through `IUserContext`
- Role-based access control for different user types

## Configuration
- Environment-based config using Convict
- Supports dev, prod, staging, test environments
- AWS credentials and JWT secrets configured via environment variables
- Database connection strings and other sensitive data handled securely