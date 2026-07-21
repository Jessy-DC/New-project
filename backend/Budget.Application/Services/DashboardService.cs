using System.Globalization;
using Budget.Application.DTOs.Dashboard;
using Budget.Application.Interfaces;
using Budget.Application.Interfaces.Services;
using Budget.Domain.Entities;
using Budget.Domain.Enums;

namespace Budget.Application.Services;

public class DashboardService : IDashboardService
{
    private readonly IRepository<Transaction> _transactionRepository;
    private readonly IRepository<Objectif> _objectifRepository;
    private readonly IRepository<Contribution> _contributionRepository;

    public DashboardService(
        IRepository<Transaction> transactionRepository,
        IRepository<Objectif> objectifRepository,
        IRepository<Contribution> contributionRepository)
    {
        _transactionRepository = transactionRepository;
        _objectifRepository = objectifRepository;
        _contributionRepository = contributionRepository;
    }

    public async Task<DashboardDto> GetDashboardAsync(int? year = null, int? month = null)
    {
        var targetYear = year ?? DateTime.Now.Year;
        var targetMonth = month ?? DateTime.Now.Month;

        var startDate = new DateTime(targetYear, targetMonth, 1);
        var endDate = startDate.AddMonths(1).AddDays(-1);

        // Récupérer toutes les transactions du mois
        var allTransactions = await _transactionRepository.GetAllAsync();
        var monthTransactions = allTransactions
            .Where(t => t.Date >= startDate && t.Date <= endDate)
            .ToList();

        // Calculer revenus et dépenses
        var income = monthTransactions
            .Where(t => t.Type == TransactionType.Revenu)
            .Sum(t => t.Montant);

        var expenses = monthTransactions
            .Where(t => t.Type == TransactionType.Depense)
            .Sum(t => t.Montant);

        // Récupérer toutes les contributions du mois
        var allContributions = await _contributionRepository.GetAllAsync();
        var monthContributions = allContributions
            .Where(c => c.Date >= startDate && c.Date <= endDate)
            .ToList();

        var savings = monthContributions.Sum(c => c.Montant);

        // Calculer le disponible
        var available = income - expenses - savings;

        // Calculer le delta (comparaison avec le mois précédent)
        var previousMonthStart = startDate.AddMonths(-1);
        var previousMonthEnd = startDate.AddDays(-1);

        var previousMonthTransactions = allTransactions
            .Where(t => t.Date >= previousMonthStart && t.Date <= previousMonthEnd)
            .ToList();

        var previousMonthContributions = allContributions
            .Where(c => c.Date >= previousMonthStart && c.Date <= previousMonthEnd)
            .ToList();

        var previousIncome = previousMonthTransactions
            .Where(t => t.Type == TransactionType.Revenu)
            .Sum(t => t.Montant);

        var previousExpenses = previousMonthTransactions
            .Where(t => t.Type == TransactionType.Depense)
            .Sum(t => t.Montant);

        var previousSavings = previousMonthContributions.Sum(c => c.Montant);

        var previousAvailable = previousIncome - previousExpenses - previousSavings;
        var availableDelta = available - previousAvailable;

        // Récupérer l'objectif principal (celui avec le montant cible le plus élevé)
        var allObjectifs = await _objectifRepository.GetAllAsync();
        var mainObjectif = allObjectifs
            .OrderByDescending(o => o.MontantCible)
            .FirstOrDefault();

        MainGoalDto? mainGoal = null;
        if (mainObjectif != null)
        {
            mainGoal = new MainGoalDto
            {
                Id = mainObjectif.Id,
                Title = mainObjectif.Nom,
                CurrentAmount = mainObjectif.CalculerMontantActuel(),
                TargetAmount = mainObjectif.MontantCible,
                ProgressPercentage = (int)Math.Round(mainObjectif.CalculerPourcentageProgression())
            };
        }

        // Générer un insight
        var insight = GenerateInsight(
            expenses,
            previousExpenses,
            monthTransactions,
            previousMonthTransactions,
            mainObjectif);

        // Créer le label de période
        var cultureInfo = new CultureInfo("fr-FR");
        var periodLabel = startDate.ToString("MMMM yyyy", cultureInfo);
        periodLabel = char.ToUpper(periodLabel[0]) + periodLabel.Substring(1);

        return new DashboardDto
        {
            PeriodLabel = periodLabel,
            AvailableAmount = available,
            AvailableDelta = availableDelta,
            Summary = new MonthlySummaryDto
            {
                Income = income,
                Expenses = expenses,
                Savings = savings
            },
            MainGoal = mainGoal,
            Insight = insight
        };
    }

    private InsightDto? GenerateInsight(
        decimal expenses,
        decimal previousExpenses,
        List<Transaction> monthTransactions,
        List<Transaction> previousMonthTransactions,
        Objectif? mainObjectif)
    {
        // Prioriser les insights par ordre d'importance

        // 1. Comparaison des dépenses avec le mois précédent
        if (previousExpenses > 0)
        {
            var expensesDiff = previousExpenses - expenses;
            var percentageDiff = Math.Round((expensesDiff / previousExpenses) * 100);

            if (Math.Abs(percentageDiff) >= 10)
            {
                var highlight = $"{Math.Abs(percentageDiff)} % {(percentageDiff > 0 ? "de moins" : "de plus")}";
                var description = "qu'en " + GetPreviousMonthName();
                return new InsightDto
                {
                    Highlight = highlight,
                    Description = description
                };
            }
        }

        // 2. Catégorie dominante
        if (monthTransactions.Any(t => t.Type == TransactionType.Depense))
        {
            var categoryExpenses = monthTransactions
                .Where(t => t.Type == TransactionType.Depense)
                .GroupBy(t => t.Categorie.Nom)
                .Select(g => new { Category = g.Key, Total = g.Sum(t => t.Montant) })
                .OrderByDescending(x => x.Total)
                .FirstOrDefault();

            if (categoryExpenses != null && expenses > 0)
            {
                var percentage = Math.Round((categoryExpenses.Total / expenses) * 100);
                if (percentage >= 20)
                {
                    return new InsightDto
                    {
                        Highlight = $"{percentage} %",
                        Description = $"de dépenses en {categoryExpenses.Category}."
                    };
                }
            }
        }

        // 3. Progression vers l'objectif principal
        if (mainObjectif != null && !mainObjectif.EstAtteint())
        {
            var currentAmount = mainObjectif.CalculerMontantActuel();
            var remaining = mainObjectif.CalculerMontantRestant();
            var currentDate = DateTime.Now;

            if (mainObjectif.DateCible.HasValue && mainObjectif.DateCible > currentDate)
            {
                var monthsRemaining = ((mainObjectif.DateCible.Value.Year - currentDate.Year) * 12) +
                                     mainObjectif.DateCible.Value.Month - currentDate.Month;

                if (monthsRemaining > 0)
                {
                    var averageMonthlyNeeded = Math.Round(remaining / monthsRemaining);
                    return new InsightDto
                    {
                        Highlight = $"{averageMonthlyNeeded} € / mois",
                        Description = $"pour atteindre {mainObjectif.Nom}."
                    };
                }
            }
        }

        // Pas d'insight pertinent
        return null;
    }

    private string GetPreviousMonthName()
    {
        var previousMonth = DateTime.Now.AddMonths(-1);
        var cultureInfo = new CultureInfo("fr-FR");
        var monthName = previousMonth.ToString("MMMM", cultureInfo);
        return char.ToLower(monthName[0]) + monthName.Substring(1);
    }
}
