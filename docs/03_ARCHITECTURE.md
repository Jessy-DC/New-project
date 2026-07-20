# ARCHITECTURE

## Vue d'ensemble

Le projet est organisé sous la forme d'un monorepo.

    Budget/
    ├── backend/
    ├── mobile/
    ├── docs/

## Backend

    Budget.Api
    Budget.Application
    Budget.Domain
    Budget.Infrastructure

### Api

-   Endpoints REST
-   Swagger
-   Configuration
-   Authentification

### Application

-   Cas d'usage
-   DTO
-   Validation

### Domain

-   Entités
-   Value Objects
-   Services métier
-   Interfaces

Aucune dépendance vers les autres couches.

### Infrastructure

-   Entity Framework Core
-   PostgreSQL
-   Repositories
-   Migrations

## Mobile

    src/
    ├── components/
    ├── screens/
    ├── navigation/
    ├── services/
    ├── hooks/
    ├── theme/
    └── types/

Le mobile ne connaît jamais la base de données. Il communique uniquement
avec l'API REST.
