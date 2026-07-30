# Script pour charger les données de test dans la base de données Budget

Write-Host "=== Chargement des données de test ===" -ForegroundColor Cyan
Write-Host ""

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "seed-data.sql")) {
	Write-Host "ERREUR : Fichier seed-data.sql introuvable" -ForegroundColor Red
	Write-Host "Ce script doit être exécuté depuis le dossier backend/" -ForegroundColor Red
	exit 1
}

Write-Host "Chargement des données dans la base budget_dev..." -ForegroundColor Yellow
Write-Host ""

# Exécuter le script SQL
psql -U postgres -d budget_dev -f seed-data.sql

if ($LASTEXITCODE -eq 0) {
	Write-Host ""
	Write-Host "✓ Données de test chargées avec succès !" -ForegroundColor Green
	Write-Host ""
	Write-Host "Données créées :" -ForegroundColor Cyan
	Write-Host "  - 11 catégories (Courses, Restaurant, Transport, etc.)" -ForegroundColor White
	Write-Host "  - ~35 transactions (juin et juillet 2026)" -ForegroundColor White
	Write-Host "  - 3 objectifs d'épargne (Japon, Voiture, Ordinateur)" -ForegroundColor White
	Write-Host "  - 7 contributions aux objectifs" -ForegroundColor White
	Write-Host "  - 5 abonnements actifs (Netflix, Spotify, etc.)" -ForegroundColor White
	Write-Host ""
	Write-Host "Statistiques :" -ForegroundColor Cyan
	Write-Host "  Juin 2026  : Revenus 2800€, Dépenses 1690€, Épargne 600€" -ForegroundColor White
	Write-Host "  Juillet 2026 : Revenus 3000€, Dépenses 1477€, Épargne 850€" -ForegroundColor White
	Write-Host "  → Économie de ~363€ en juillet vs juin ! 🎉" -ForegroundColor Green
	Write-Host ""
	Write-Host "Vous pouvez maintenant :" -ForegroundColor Cyan
	Write-Host "  1. Démarrer l'API : dotnet run --project Budget.Api" -ForegroundColor White
	Write-Host "  2. Ouvrir Swagger : http://localhost:5007/swagger" -ForegroundColor White
	Write-Host "  3. Consulter le Dashboard et les Statistiques !" -ForegroundColor White
	Write-Host ""
} else {
	Write-Host ""
	Write-Host "ERREUR : Échec du chargement des données" -ForegroundColor Red
	Write-Host ""
	Write-Host "Vérifiez que :" -ForegroundColor Yellow
	Write-Host "  1. PostgreSQL est en cours d'exécution" -ForegroundColor White
	Write-Host "  2. La base budget_dev existe (exécutez .\init-database.ps1)" -ForegroundColor White
	Write-Host "  3. Le mot de passe postgres est correct (admin404)" -ForegroundColor White
	exit 1
}
