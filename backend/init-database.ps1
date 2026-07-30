# Script d'initialisation de la base de données Budget
# Prérequis : PostgreSQL doit être installé et en cours d'exécution

Write-Host "=== Initialisation de la base de données Budget ===" -ForegroundColor Cyan
Write-Host ""

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "Budget.Api/Budget.Api.csproj")) {
	Write-Host "ERREUR : Ce script doit être exécuté depuis le dossier backend/" -ForegroundColor Red
	exit 1
}

# Vérifier que dotnet-ef est installé
Write-Host "Vérification de dotnet-ef..." -ForegroundColor Yellow
$efVersion = dotnet ef --version 2>&1
if ($LASTEXITCODE -ne 0) {
	Write-Host "Installation de dotnet-ef..." -ForegroundColor Yellow
	dotnet tool install --global dotnet-ef
	if ($LASTEXITCODE -ne 0) {
		Write-Host "ERREUR : Impossible d'installer dotnet-ef" -ForegroundColor Red
		exit 1
	}
} else {
	Write-Host "✓ dotnet-ef est installé : $efVersion" -ForegroundColor Green
}

Write-Host ""
Write-Host "Application de la migration à la base de données..." -ForegroundColor Yellow

# Appliquer les migrations
dotnet ef database update --project Budget.Infrastructure --startup-project Budget.Api

if ($LASTEXITCODE -eq 0) {
	Write-Host ""
	Write-Host "✓ Base de données initialisée avec succès !" -ForegroundColor Green
	Write-Host ""
	Write-Host "La base de données 'budget_dev' a été créée avec les tables suivantes :" -ForegroundColor Cyan
	Write-Host "  - Categories" -ForegroundColor White
	Write-Host "  - Transactions" -ForegroundColor White
	Write-Host "  - Objectifs" -ForegroundColor White
	Write-Host "  - Contributions" -ForegroundColor White
	Write-Host "  - Abonnements" -ForegroundColor White
	Write-Host ""
	Write-Host "Vous pouvez maintenant démarrer l'API avec : dotnet run --project Budget.Api" -ForegroundColor Cyan
} else {
	Write-Host ""
	Write-Host "ERREUR : Échec de l'initialisation de la base de données" -ForegroundColor Red
	Write-Host ""
	Write-Host "Vérifiez que :" -ForegroundColor Yellow
	Write-Host "  1. PostgreSQL est installé et en cours d'exécution" -ForegroundColor White
	Write-Host "  2. Le service écoute sur le port 5432" -ForegroundColor White
	Write-Host "  3. L'utilisateur 'postgres' existe avec le mot de passe 'postgres'" -ForegroundColor White
	Write-Host "  4. L'utilisateur a les droits de créer des bases de données" -ForegroundColor White
	Write-Host ""
	Write-Host "Connexion configurée dans appsettings.Development.json :" -ForegroundColor Yellow
	Write-Host "  Host=localhost;Port=5432;Database=budget_dev;Username=postgres;Password=postgres" -ForegroundColor White
	exit 1
}
