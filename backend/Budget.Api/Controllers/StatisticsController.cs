using Budget.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace Budget.Api.Controllers;

public class StatisticsController : BaseController
{
    private readonly IStatisticsService _statisticsService;

    public StatisticsController(IStatisticsService statisticsService)
    {
        _statisticsService = statisticsService;
    }

    /// <summary>
    /// Récupère les statistiques pour une période donnée
    /// </summary>
    /// <param name="year">Année (optionnel, par défaut l'année en cours)</param>
    /// <param name="month">Mois (optionnel, par défaut le mois en cours)</param>
    /// <param name="monthsBack">Nombre de mois en arrière (1 = mois actuel, 3 = trimestre, 12 = année)</param>
    /// <returns>Les statistiques calculées</returns>
    [HttpGet]
    public async Task<IActionResult> GetStatistics(
        [FromQuery] int? year,
        [FromQuery] int? month,
        [FromQuery] int? monthsBack = 1)
    {
        var statistics = await _statisticsService.GetStatisticsAsync(year, month, monthsBack);
        return Ok(statistics);
    }
}
