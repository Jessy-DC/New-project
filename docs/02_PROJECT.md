# PROJECT.md

## Objectif

Ce document décrit le contexte technique du projet **Budget**. Il sert
de référence pour tous les développements réalisés par les contributeurs
humains et les agents IA.

Ce document complète `01_PRODUCT.md`, qui décrit la vision du produit.

------------------------------------------------------------------------

# Stack technique

## Mobile

-   React Native
-   Expo
-   TypeScript
-   React Navigation
-   TanStack Query

## Backend

-   ASP.NET Core 9
-   Entity Framework Core
-   PostgreSQL
-   Clean Architecture

------------------------------------------------------------------------

# Architecture

## Backend

    Budget.Api
    Budget.Application
    Budget.Domain
    Budget.Infrastructure

### Budget.Api

-   Expose les endpoints REST
-   Configuration de l'application
-   Authentification
-   Swagger

Aucune logique métier.

### Budget.Application

-   Cas d'utilisation
-   DTO
-   Validation
-   Mapping

### Budget.Domain

Le cœur du projet.

Contient uniquement les règles métier et les entités.

Aucune dépendance vers les autres couches.

### Budget.Infrastructure

-   Entity Framework Core
-   PostgreSQL
-   Persistance
-   Configuration

------------------------------------------------------------------------

# Architecture Mobile

    src/
     ├── components/
     ├── screens/
     ├── navigation/
     ├── services/
     ├── hooks/
     ├── theme/
     ├── assets/
     └── types/

Le mobile communique exclusivement avec l'API REST.

------------------------------------------------------------------------

# Domaine

Les principales entités sont :

-   Transaction
-   Objectif
-   Contribution
-   Catégorie
-   Abonnement

Le Dashboard et les Statistiques sont calculés et ne sont jamais
persistés.

------------------------------------------------------------------------

# Principes de développement

-   Privilégier la simplicité.
-   Éviter la sur-ingénierie.
-   Une responsabilité par classe.
-   Une responsabilité par composant React.
-   Les contrôleurs ne contiennent jamais de logique métier.
-   Les statistiques sont toujours calculées.
-   Le domaine ne dépend d'aucun framework.

------------------------------------------------------------------------

# Conventions

## Backend

-   API REST
-   DTO pour tous les échanges
-   Validation avec FluentValidation
-   Injection de dépendances
-   Nommage explicite

## Frontend

-   Composants réutilisables
-   Écrans légers
-   Appels API centralisés
-   UI cohérente avec la charte graphique

------------------------------------------------------------------------

# Workflow

Avant toute nouvelle fonctionnalité :

1.  Vérifier qu'elle respecte `01_PRODUCT.md`.
2.  Vérifier qu'elle respecte l'architecture.
3.  Implémenter la plus petite version fonctionnelle.
4.  Tester avant d'enrichir.

------------------------------------------------------------------------

# Priorité actuelle

Objectif : livrer un MVP rapidement.

Fonctionnalités :

-   Dashboard
-   Transactions
-   Objectifs
-   Statistiques
-   API REST
-   Persistance PostgreSQL
-   Synchronisation entre mobile et backend

Toute fonctionnalité non indispensable au MVP doit être reportée.
