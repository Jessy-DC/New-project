using System.Globalization;
using Budget.Application.DTOs.Statistics;
using Budget.Application.Interfaces;
using Budget.Application.Interfaces.Services;
using Budget.Domain.Entities;
using Budget.Domain.Enums;

namespace Budget.Application.Services;

public class StatisticsService : IStatisticsService
{
    private readonly IRepository<Transaction> _transactionRepository;

    public StatisticsService(IRepository<Transaction> transactionRepository)
    {
        _transactionRepository = transactionRepository;
    }

    public async Task<StatisticsDto> GetStatisticsAsync(int? year = null, int? month = null, int? monthsBack = 1)
    {
        var targetYear = year ?? DateTime.Now.Year;
        var targetMonth = month ?? DateTime.Now.Month;
        var periodMonths = monthsBack ?? 1;

        var endDate = new DateTime(targetYear, targetMonth, 1).AddMonths(1).AddDays(-1);
        var startDate = endDate.AddMonths(-periodMonths + 1);
        startDate = new DateTime(startDate.Year, startDate.Month, 1);

        // Période précédente pour comparaison
        var previousEndDate = startDate.AddDays(-1);
        var previousStartDate = previousEndDate.AddMonths(-periodMonths + 1);
        previousStartDate = new DateTime(previousStartDate.Year, previousStartDate.Month, 1);

        // Récupérer toutes les transactions
        var allTransactions = await _transactionRepository.GetAllAsync();

        // Transactions de la période actuelle
        var currentTransactions = allTransactions
            .Where(t => t.Date >= startDate && t.Date <= endDate)
            .ToList();

        // Transactions de la période précédente
        var previousTransactions = allTransactions
            .Where(t => t.Date >= previousStartDate && t.Date <= previousEndDate)
            .ToList();

        // Calculs pour la période actuelle
        var currentExpenses = currentTransactions
            .Where(t => t.Type == TransactionType.Depense)
            .ToList();

        var currentIncome = currentTransactions
            .Where(t => t.Type == TransactionType.Revenu)
            .Sum(t => t.Montant);

        var totalCurrentExpenses = currentExpenses.Sum(t => t.Montant);

        // Calculs pour la période précédente
        var previousExpenses = previousTransactions
            .Where(t => t.Type == TransactionType.Depense)
            .ToList();

        var previousIncome = previousTransactions
            .Where(t => t.Type == TransactionType.Revenu)
            .Sum(t => t.Montant);

        var totalPreviousExpenses = previousExpenses.Sum(t => t.Montant);

        // Montant économisé = (Revenus - Dépenses) actuels - (Revenus - Dépenses) précédents
        var currentSavings = currentIncome - totalCurrentExpenses;
        var previousSavings = previousIncome - totalPreviousExpenses;
        var savedAmount = currentSavings - previousSavings;

        // Répartition par catégorie (désactivé temporairement - nécessite Include pour charger Categorie)
        // TODO: Activer une fois que le repository supporte Include
        var categoryGroups = new List<ExpenseCategorySplitDto>();
        /*
        var categoryGroups = currentExpenses
            .Where(t => t.Categorie != null)
            .GroupBy(t => new { t.Categorie.Id, t.Categorie.Nom })
            .Select(g => new ExpenseCategorySplitDto
            {
                CategorieId = g.Key.Id,
                CategorieNom = g.Key.Nom,
                Montant = g.Sum(t => t.Montant),
                Pourcentage = totalCurrentExpenses > 0 
                    ? Math.Round((g.Sum(t => t.Montant) / totalCurrentExpenses) * 100, 1)
                    : 0
            })
            .OrderByDescending(c => c.Montant)
            .ToList();
        */

        // Répartition Essentiel vs Plaisir
        var essentialExpenses = currentExpenses
            .Where(t => t.Importance == Importance.Essentiel)
            .Sum(t => t.Montant);

        var pleasureExpenses = currentExpenses
            .Where(t => t.Importance == Importance.Plaisir)
            .Sum(t => t.Montant);

        var importanceSplit = new ImportanceSplitDto
        {
            EssentielMontant = essentialExpenses,
            EssentielPourcentage = totalCurrentExpenses > 0
                ? Math.Round((essentialExpenses / totalCurrentExpenses) * 100, 1)
                : 0,
            PlaisirMontant = pleasureExpenses,
            PlaisirPourcentage = totalCurrentExpenses > 0
                ? Math.Round((pleasureExpenses / totalCurrentExpenses) * 100, 1)
                : 0
        };

        // Évolution par catégorie (désactivé temporairement - nécessite Include pour charger Categorie)
        // TODO: Activer une fois que le repository supporte Include
        var trends = new List<CategoryTrendDto>();
        /*
        var currentCategoryExpenses = currentExpenses
            .Where(t => t.Categorie != null)
            .GroupBy(t => new { t.Categorie.Id, t.Categorie.Nom })
            .ToDictionary(g => g.Key.Id, g => new { g.Key.Nom, Montant = g.Sum(t => t.Montant) });

        var previousCategoryExpenses = previousExpenses
            .Where(t => t.Categorie != null)
            .GroupBy(t => new { t.Categorie.Id, t.Categorie.Nom })
            .ToDictionary(g => g.Key.Id, g => new { g.Key.Nom, Montant = g.Sum(t => t.Montant) });

        var trends = new List<CategoryTrendDto>();

        foreach (var current in currentCategoryExpenses)
        {
            var previousAmount = previousCategoryExpenses.ContainsKey(current.Key)
                ? previousCategoryExpenses[current.Key].Montant
                : 0;

            var delta = current.Value.Montant - previousAmount;
            var deltaPercent = previousAmount > 0
                ? Math.Round((delta / previousAmount) * 100, 1)
                : (current.Value.Montant > 0 ? 100 : 0);

            trends.Add(new CategoryTrendDto
            {
                CategorieId = current.Key,
                CategorieNom = current.Value.Nom,
                MontantActuel = current.Value.Montant,
                MontantPrecedent = previousAmount,
                DeltaMontant = delta,
                DeltaPourcentage = deltaPercent
            });
        }

        // Ajouter les catégories présentes uniquement dans la période précédente
        foreach (var previous in previousCategoryExpenses.Where(p => !currentCategoryExpenses.ContainsKey(p.Key)))
        {
            trends.Add(new CategoryTrendDto
            {
                CategorieId = previous.Key,
                CategorieNom = previous.Value.Nom,
                MontantActuel = 0,
                MontantPrecedent = previous.Value.Montant,
                DeltaMontant = -previous.Value.Montant,
                DeltaPourcentage = -100
            });
        }

        // Trier par delta montant (les plus économisés en premier)
        trends = trends.OrderBy(t => t.DeltaMontant).ToList();
        */

        // Meilleure catégorie (celle qui a le plus baissé en pourcentage)
        BestCategoryDto? bestCategory = null;
        var bestTrend = trends
            .Where(t => t.DeltaMontant < 0 && t.MontantPrecedent > 0)
            .OrderBy(t => t.DeltaPourcentage)
            .FirstOrDefault();

        if (bestTrend != null)
        {
            var cultureInfo = new CultureInfo("fr-FR");
            var previousMonthName = previousEndDate.ToString("MMMM", cultureInfo);

            bestCategory = new BestCategoryDto
            {
                CategorieNom = bestTrend.CategorieNom,
                Description = $"Tu dépenses moins qu'en {previousMonthName}. Bravo !",
                DeltaPourcentage = Math.Abs(bestTrend.DeltaPourcentage)
            };
        }

        // Créer le label de période
        var periodLabel = GetPeriodLabel(startDate, endDate, periodMonths);

        return new StatisticsDto
        {
            PeriodLabel = periodLabel,
            MontantEconomise = savedAmount,
            RepartitionParCategorie = categoryGroups,
            RepartitionParImportance = importanceSplit,
            EvolutionCategories = trends,
            MeilleureCategorie = bestCategory
        };
    }

    private string GetPeriodLabel(DateTime startDate, DateTime endDate, int periodMonths)
    {
        var cultureInfo = new CultureInfo("fr-FR");

        if (periodMonths == 1)
        {
            var monthName = startDate.ToString("MMMM yyyy", cultureInfo);
            return char.ToUpper(monthName[0]) + monthName.Substring(1);
        }
        else if (periodMonths == 3)
        {
            return $"{startDate:MMM} - {endDate:MMM yyyy}";
        }
        else if (periodMonths == 12)
        {
            return $"Année {startDate.Year}";
        }
        else
        {
            return $"{startDate:MMM yyyy} - {endDate:MMM yyyy}";
        }
    }
}
