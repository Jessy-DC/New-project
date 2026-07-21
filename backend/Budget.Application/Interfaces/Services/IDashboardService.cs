using Budget.Application.DTOs.Dashboard;

namespace Budget.Application.Interfaces.Services;

public interface IDashboardService
{
    Task<DashboardDto> GetDashboardAsync(int? year = null, int? month = null);
}
