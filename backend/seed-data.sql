-- Script de seed de données de test pour Budget
-- Ce script crée des catégories, transactions, objectifs, contributions et abonnements

-- =====================================================
-- 1. CATÉGORIES (11 catégories par défaut)
-- =====================================================

INSERT INTO "Categories" ("Id", "Nom", "EstActive", "CreatedAt", "UpdatedAt")
VALUES 
	('11111111-1111-1111-1111-111111111111', 'Courses', true, NOW(), NOW()),
	('22222222-2222-2222-2222-222222222222', 'Restaurant', true, NOW(), NOW()),
	('33333333-3333-3333-3333-333333333333', 'Transport', true, NOW(), NOW()),
	('44444444-4444-4444-4444-444444444444', 'Santé', true, NOW(), NOW()),
	('55555555-5555-5555-5555-555555555555', 'Shopping', true, NOW(), NOW()),
	('66666666-6666-6666-6666-666666666666', 'Logement', true, NOW(), NOW()),
	('77777777-7777-7777-7777-777777777777', 'Loisirs', true, NOW(), NOW()),
	('88888888-8888-8888-8888-888888888888', 'Éducation', true, NOW(), NOW()),
	('99999999-9999-9999-9999-999999999999', 'Abonnements', true, NOW(), NOW()),
	('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Salaire', true, NOW(), NOW()),
	('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Autre', true, NOW(), NOW());

-- =====================================================
-- 2. TRANSACTIONS - Juin 2026 (mois précédent)
-- =====================================================

-- REVENUS Juin 2026
INSERT INTO "Transactions" ("Id", "Date", "Montant", "Type", "Description", "Importance", "CategorieId", "CreatedAt", "UpdatedAt")
VALUES 
	(gen_random_uuid(), '2026-06-01', 2800.00, 1, 'Salaire juin', 0, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW(), NOW());

-- DÉPENSES Juin 2026
INSERT INTO "Transactions" ("Id", "Date", "Montant", "Type", "Description", "Importance", "Notes", "CategorieId", "CreatedAt", "UpdatedAt")
VALUES 
	-- Courses (Essentiel)
	(gen_random_uuid(), '2026-06-02', 85.50, 0, 'Supermarché Carrefour', 0, NULL, '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
	(gen_random_uuid(), '2026-06-09', 92.30, 0, 'Supermarché Leclerc', 0, NULL, '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
	(gen_random_uuid(), '2026-06-16', 78.20, 0, 'Marché local', 0, NULL, '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
	(gen_random_uuid(), '2026-06-23', 88.90, 0, 'Supermarché Auchan', 0, NULL, '11111111-1111-1111-1111-111111111111', NOW(), NOW()),

	-- Restaurant (Plaisir)
	(gen_random_uuid(), '2026-06-05', 45.00, 0, 'Restaurant italien', 1, 'Soirée entre amis', '22222222-2222-2222-2222-222222222222', NOW(), NOW()),
	(gen_random_uuid(), '2026-06-12', 32.50, 0, 'Sushi bar', 1, NULL, '22222222-2222-2222-2222-222222222222', NOW(), NOW()),
	(gen_random_uuid(), '2026-06-19', 28.00, 0, 'Burger King', 1, NULL, '22222222-2222-2222-2222-222222222222', NOW(), NOW()),
	(gen_random_uuid(), '2026-06-26', 52.00, 0, 'Restaurant français', 1, 'Anniversaire', '22222222-2222-2222-2222-222222222222', NOW(), NOW()),

	-- Transport (Essentiel)
	(gen_random_uuid(), '2026-06-03', 75.00, 0, 'Essence', 0, NULL, '33333333-3333-3333-3333-333333333333', NOW(), NOW()),
	(gen_random_uuid(), '2026-06-17', 70.00, 0, 'Essence', 0, NULL, '33333333-3333-3333-3333-333333333333', NOW(), NOW()),

	-- Logement (Essentiel)
	(gen_random_uuid(), '2026-06-01', 650.00, 0, 'Loyer juin', 0, NULL, '66666666-6666-6666-6666-666666666666', NOW(), NOW()),
	(gen_random_uuid(), '2026-06-05', 120.00, 0, 'Électricité et gaz', 0, NULL, '66666666-6666-6666-6666-666666666666', NOW(), NOW()),

	-- Loisirs (Plaisir)
	(gen_random_uuid(), '2026-06-14', 15.00, 0, 'Cinéma', 1, NULL, '77777777-7777-7777-7777-777777777777', NOW(), NOW()),
	(gen_random_uuid(), '2026-06-21', 45.00, 0, 'Concert', 1, NULL, '77777777-7777-7777-7777-777777777777', NOW(), NOW()),

	-- Shopping (Plaisir)
	(gen_random_uuid(), '2026-06-08', 89.00, 0, 'Vêtements Zara', 1, NULL, '55555555-5555-5555-5555-555555555555', NOW(), NOW()),
	(gen_random_uuid(), '2026-06-22', 125.00, 0, 'Chaussures Nike', 1, NULL, '55555555-5555-5555-5555-555555555555', NOW(), NOW());

-- =====================================================
-- 3. TRANSACTIONS - Juillet 2026 (mois actuel)
-- =====================================================

-- REVENUS Juillet 2026
INSERT INTO "Transactions" ("Id", "Date", "Montant", "Type", "Description", "Importance", "CategorieId", "CreatedAt", "UpdatedAt")
VALUES 
	(gen_random_uuid(), '2026-07-01', 2850.00, 1, 'Salaire juillet', 0, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW(), NOW()),
	(gen_random_uuid(), '2026-07-15', 150.00, 1, 'Freelance projet web', 0, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW(), NOW());

-- DÉPENSES Juillet 2026 (moins de dépenses qu'en juin)
INSERT INTO "Transactions" ("Id", "Date", "Montant", "Type", "Description", "Importance", "Notes", "CategorieId", "CreatedAt", "UpdatedAt")
VALUES 
	-- Courses (Essentiel)
	(gen_random_uuid(), '2026-07-03', 82.00, 0, 'Supermarché Carrefour', 0, NULL, '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
	(gen_random_uuid(), '2026-07-10', 87.50, 0, 'Supermarché Leclerc', 0, NULL, '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
	(gen_random_uuid(), '2026-07-17', 75.30, 0, 'Marché local', 0, NULL, '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
	(gen_random_uuid(), '2026-07-24', 90.20, 0, 'Supermarché Auchan', 0, NULL, '11111111-1111-1111-1111-111111111111', NOW(), NOW()),

	-- Restaurant (Plaisir) - MOINS qu'en juin
	(gen_random_uuid(), '2026-07-06', 28.00, 0, 'Pizza à emporter', 1, NULL, '22222222-2222-2222-2222-222222222222', NOW(), NOW()),
	(gen_random_uuid(), '2026-07-13', 35.00, 0, 'Restaurant chinois', 1, NULL, '22222222-2222-2222-2222-222222222222', NOW(), NOW()),
	(gen_random_uuid(), '2026-07-27', 42.00, 0, 'Bistrot', 1, 'Déjeuner famille', '22222222-2222-2222-2222-222222222222', NOW(), NOW()),

	-- Transport (Essentiel)
	(gen_random_uuid(), '2026-07-04', 72.00, 0, 'Essence', 0, NULL, '33333333-3333-3333-3333-333333333333', NOW(), NOW()),
	(gen_random_uuid(), '2026-07-18', 68.00, 0, 'Essence', 0, NULL, '33333333-3333-3333-3333-333333333333', NOW(), NOW()),
	(gen_random_uuid(), '2026-07-25', 35.00, 0, 'Lavage auto', 0, NULL, '33333333-3333-3333-3333-333333333333', NOW(), NOW()),

	-- Logement (Essentiel)
	(gen_random_uuid(), '2026-07-01', 650.00, 0, 'Loyer juillet', 0, NULL, '66666666-6666-6666-6666-666666666666', NOW(), NOW()),
	(gen_random_uuid(), '2026-07-05', 115.00, 0, 'Électricité et gaz', 0, NULL, '66666666-6666-6666-6666-666666666666', NOW(), NOW()),

	-- Santé (Essentiel)
	(gen_random_uuid(), '2026-07-08', 45.00, 0, 'Médecin généraliste', 0, NULL, '44444444-4444-4444-4444-444444444444', NOW(), NOW()),
	(gen_random_uuid(), '2026-07-20', 28.50, 0, 'Pharmacie', 0, NULL, '44444444-4444-4444-4444-444444444444', NOW(), NOW()),

	-- Loisirs (Plaisir)
	(gen_random_uuid(), '2026-07-12', 12.00, 0, 'Cinéma', 1, NULL, '77777777-7777-7777-7777-777777777777', NOW(), NOW()),
	(gen_random_uuid(), '2026-07-19', 25.00, 0, 'Bowling', 1, NULL, '77777777-7777-7777-7777-777777777777', NOW(), NOW()),

	-- Shopping (Plaisir) - MOINS qu'en juin
	(gen_random_uuid(), '2026-07-07', 55.00, 0, 'T-shirt H&M', 1, NULL, '55555555-5555-5555-5555-555555555555', NOW(), NOW());

-- =====================================================
-- 4. OBJECTIFS
-- =====================================================

INSERT INTO "Objectifs" ("Id", "Nom", "MontantCible", "DateCible", "ImageUrl", "CreatedAt", "UpdatedAt")
VALUES 
	('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Voyage au Japon', 4500.00, '2027-04-01', NULL, NOW(), NOW()),
	('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Nouvelle voiture', 15000.00, '2028-01-01', NULL, NOW(), NOW()),
	('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Ordinateur portable', 1200.00, '2026-12-01', NULL, NOW(), NOW());

-- =====================================================
-- 5. CONTRIBUTIONS
-- =====================================================

-- Contributions Juin 2026
INSERT INTO "Contributions" ("Id", "Date", "Montant", "ObjectifId", "CreatedAt", "UpdatedAt")
VALUES 
	(gen_random_uuid(), '2026-06-01', 300.00, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', NOW(), NOW()),
	(gen_random_uuid(), '2026-06-01', 200.00, 'ffffffff-ffff-ffff-ffff-ffffffffffff', NOW(), NOW()),
	(gen_random_uuid(), '2026-06-15', 100.00, 'dddddddd-dddd-dddd-dddd-dddddddddddd', NOW(), NOW());

-- Contributions Juillet 2026
INSERT INTO "Contributions" ("Id", "Date", "Montant", "ObjectifId", "CreatedAt", "UpdatedAt")
VALUES 
	(gen_random_uuid(), '2026-07-01', 350.00, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', NOW(), NOW()),
	(gen_random_uuid(), '2026-07-01', 250.00, 'ffffffff-ffff-ffff-ffff-ffffffffffff', NOW(), NOW()),
	(gen_random_uuid(), '2026-07-15', 150.00, 'dddddddd-dddd-dddd-dddd-dddddddddddd', NOW(), NOW()),
	(gen_random_uuid(), '2026-07-22', 100.00, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', NOW(), NOW());

-- =====================================================
-- 6. ABONNEMENTS
-- =====================================================

INSERT INTO "Abonnements" ("Id", "Nom", "Montant", "Recurrence", "DateDebut", "DateFin", "EstActif", "Notes", "CategorieId", "CreatedAt", "UpdatedAt")
VALUES 
	(gen_random_uuid(), 'Netflix', 13.99, 0, '2026-01-01', NULL, true, 'Abonnement standard', '99999999-9999-9999-9999-999999999999', NOW(), NOW()),
	(gen_random_uuid(), 'Spotify Premium', 9.99, 0, '2026-01-01', NULL, true, NULL, '99999999-9999-9999-9999-999999999999', NOW(), NOW()),
	(gen_random_uuid(), 'Salle de sport', 29.90, 0, '2026-03-01', NULL, true, 'BasicFit', '77777777-7777-7777-7777-777777777777', NOW(), NOW()),
	(gen_random_uuid(), 'Internet Fibre', 39.99, 0, '2025-06-01', NULL, true, 'Orange Fibre 1Gb', '66666666-6666-6666-6666-666666666666', NOW(), NOW()),
	(gen_random_uuid(), 'Téléphone mobile', 19.99, 0, '2025-06-01', NULL, true, 'Forfait illimité', '66666666-6666-6666-6666-666666666666', NOW(), NOW());

-- =====================================================
-- RÉSUMÉ DES DONNÉES CRÉÉES
-- =====================================================

-- 11 Catégories
-- Juin 2026:  1 revenu (2800€), 16 dépenses (1690.40€), 3 contributions (600€)
-- Juillet 2026: 2 revenus (3000€), 17 dépenses (1477.50€), 4 contributions (850€)
-- 3 Objectifs avec progression
-- 5 Abonnements actifs
