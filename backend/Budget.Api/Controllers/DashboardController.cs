using Budget.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace Budget.Api.Controllers;

public class DashboardController : BaseController
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    /// <summary>
    /// Récupère le tableau de bord pour un mois donné
    /// </summary>
    /// <param name="year">Année (optionnel, par défaut l'année en cours)</param>
    /// <param name="month">Mois (optionnel, par défaut le mois en cours)</param>
    /// <returns>Le tableau de bord calculé</returns>
    [HttpGet]
    public async Task<IActionResult> GetDashboard([FromQuery] int? year, [FromQuery] int? month)
    {
        var dashboard = await _dashboardService.GetDashboardAsync(year, month);
        return Ok(dashboard);
    }
}
