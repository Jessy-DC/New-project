# Budget Backend

Squelette backend du projet Budget développé avec ASP.NET Core 9 et Clean Architecture.

## Structure

```
backend/
├── Budget.Api/              # Couche de présentation (API REST)
├── Budget.Application/      # Couche application (cas d'usage, DTO, validation)
├── Budget.Domain/          # Couche domaine (entités, règles métier)
└── Budget.Infrastructure/  # Couche infrastructure (persistance, EF Core)
```

## Technologies

- **ASP.NET Core 9**
- **Entity Framework Core 9.0.0**
- **PostgreSQL** (via Npgsql.EntityFrameworkCore.PostgreSQL 9.0.0)
- **FluentValidation 12.1.1**
- **Swagger** (via Swashbuckle.AspNetCore 10.2.3)

## Architecture Clean Architecture

### Budget.Domain
- Contient les entités métier et les règles business
- Aucune dépendance vers les autres couches
- Classe de base : `BaseEntity`

### Budget.Application
- Contient les cas d'usage et les DTOs
- Interfaces : `IRepository<T>`, `IUnitOfWork`
- Validation avec FluentValidation
- Dépend uniquement de Domain

### Budget.Infrastructure
- Implémentation de la persistance avec EF Core
- Configuration PostgreSQL
- `BudgetDbContext` : contexte de base de données
- `Repository<T>` : implémentation générique du pattern Repository
- `UnitOfWork` : gestion des transactions
- Dépend de Domain et Application

### Budget.Api
- Endpoints REST
- Configuration Swagger
- Injection de dépendances
- Contrôleur de base : `BaseController`
- Endpoint de santé : `/health`
- Dépend de Application et Infrastructure

## Configuration

### Base de données

La configuration PostgreSQL se trouve dans `appsettings.json` :

**Development** (`appsettings.Development.json`) :
```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=budget_dev;Username=postgres;Password=postgres"
}
```

**Production** (`appsettings.json`) :
```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=budget;Username=postgres;Password=postgres"
}
```

## Démarrage

### Prérequis

- .NET 9 SDK
- PostgreSQL 12+

### Compilation

```bash
cd backend
dotnet build Budget.slnx
```

### Exécution

```bash
cd backend/Budget.Api
dotnet run
```

L'API sera disponible sur :
- HTTP : `http://localhost:5000`
- HTTPS : `https://localhost:5001`
- Swagger : `https://localhost:5001/swagger`

### Endpoint de santé

```
GET /health
```

Retourne :
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Injection de dépendances

L'injection de dépendances est configurée dans `Program.cs` :

```csharp
builder.Services.AddApplication();          // Application layer
builder.Services.AddInfrastructure(builder.Configuration); // Infrastructure layer
```

### Services enregistrés

**Application** :
- FluentValidation (tous les validators de l'assembly)

**Infrastructure** :
- `BudgetDbContext` : contexte EF Core avec PostgreSQL
- `IRepository<T>` : implémentation générique du Repository
- `IUnitOfWork` : gestion des transactions

## Prochaines étapes

Le squelette est prêt pour l'implémentation des fonctionnalités métier :

1. Créer les entités dans `Budget.Domain`
2. Créer les DTOs et cas d'usage dans `Budget.Application`
3. Créer les configurations EF Core dans `Budget.Infrastructure`
4. Créer les contrôleurs dans `Budget.Api`
5. Créer et appliquer les migrations EF Core

### Exemple de commande pour les migrations

```bash
cd backend
dotnet ef migrations add InitialCreate --project Budget.Infrastructure --startup-project Budget.Api
dotnet ef database update --project Budget.Infrastructure --startup-project Budget.Api
```

## Contraintes respectées

✅ ASP.NET Core 9  
✅ Clean Architecture  
✅ PostgreSQL  
✅ Entity Framework Core  
✅ Swagger  
✅ FluentValidation  
✅ Pas de MediatR  
✅ Pas de CQRS  
✅ Pas d'authentification (MVP)  
✅ Projet compilable  

## Notes

- Aucune entité métier n'a été créée (selon les contraintes)
- Aucun endpoint fonctionnel n'a été créé (sauf `/health` pour les tests)
- La structure est prête pour l'ajout des fonctionnalités selon le domaine défini dans `docs/04_DOMAIN.md`
