# DOMAIN

## Objectif

Ce document décrit le domaine métier de Budget.

Il constitue la référence fonctionnelle du backend.

Le domaine doit rester indépendant de toute technologie (ASP.NET, Entity Framework, PostgreSQL...).

---

# Les concepts métier

Budget repose sur cinq concepts principaux.

```
Utilisateur
│
├── Transactions
│
├── Catégories
│
├── Objectifs
│     └── Contributions
│
└── Abonnements
```

Le Dashboard et les Statistiques ne sont jamais persistés.

Ils sont toujours calculés à partir des données métier.

---

# Transaction

Une transaction représente un mouvement d'argent.

Elle peut être :

- une dépense
- un revenu

Une transaction appartient toujours à une catégorie.

## Attributs

- Date
- Montant
- Type
- Description
- Catégorie
- Importance
- Notes

## Règles métier

- Le montant est toujours positif.
- Le type indique s'il s'agit d'un revenu ou d'une dépense.
- Une catégorie est obligatoire.
- Une transaction peut être modifiée ou supprimée.
- Une transaction n'est jamais liée directement à un objectif.

---

# Catégorie

Une catégorie permet de classer les transactions.

Exemples :

- Courses
- Restaurant
- Transport
- Santé
- Shopping

## Règles métier

Une catégorie peut être désactivée.

Elle ne peut pas être supprimée si des transactions l'utilisent.

---

# Objectif

Un objectif représente un projet personnel.

Exemples :

- Voyage
- Achat immobilier
- Voiture
- Appareil photo

## Attributs

- Nom
- Montant cible
- Date cible
- Image (optionnelle)

Le montant actuel n'est jamais stocké.

Il est calculé à partir des Contributions.

---

# Contribution

Une contribution représente une somme volontairement affectée à un objectif.

Exemple :

Salaire

↓

Je décide d'affecter

200 €

↓

Objectif Japon

Une contribution n'est pas une dépense.

Elle représente un transfert d'épargne.

## Attributs

- Date
- Montant
- Objectif

## Règles métier

Une contribution appartient toujours à un objectif.

Elle peut être supprimée.

Le montant actuel d'un objectif est la somme de toutes ses contributions.

---

# Abonnement

Un abonnement représente une dépense récurrente.

Exemples :

- Netflix
- Spotify
- Salle de sport

L'abonnement ne crée pas automatiquement une transaction dans le MVP.

Cette fonctionnalité pourra être ajoutée ultérieurement.

---

# Dashboard

Le Dashboard est une vue calculée.

Il contient :

- Disponible
- Revenus du mois
- Dépenses du mois
- Épargne
- Objectif principal
- Insight

Aucune donnée du Dashboard n'est persistée.

---

# Statistiques

Les statistiques sont calculées.

Elles ne sont jamais enregistrées.

Exemples :

- Répartition par catégorie
- Évolution mensuelle
- Essentiel vs Plaisir
- Comparaison avec le mois précédent

---

# Insights

Les insights sont générés à partir des statistiques.

Exemples :

- Tu dépenses moins qu'en mai.
- Les restaurants représentent 24 % de tes dépenses.
- Tu pourrais atteindre ton objectif un mois plus tôt.

Ils ne sont jamais persistés.

---

# Cas d'utilisation

## Transactions

- Ajouter une transaction
- Modifier une transaction
- Supprimer une transaction
- Consulter les transactions

## Objectifs

- Créer un objectif
- Modifier un objectif
- Supprimer un objectif
- Ajouter une contribution
- Supprimer une contribution

## Dashboard

- Consulter le Dashboard

## Statistiques

- Consulter les statistiques

---

# Règles métier importantes

✓ Les statistiques sont toujours calculées.

✓ Le Dashboard est toujours calculé.

✓ Les insights sont toujours calculés.

✓ Une contribution n'est jamais une transaction.

✓ Le montant actuel d'un objectif est calculé.

✓ Une transaction possède toujours une catégorie.

✓ Le domaine ne dépend d'aucun framework.

---

# Hors périmètre du MVP

Le domaine ne prévoit pas encore :

- Comptes bancaires
- Multi-utilisateurs
- Devises
- Synchronisation bancaire
- OCR
- Intelligence artificielle
- Budgets mensuels par catégorie

Ces fonctionnalités pourront être ajoutées ultérieurement si elles apportent une réelle valeur au produit.