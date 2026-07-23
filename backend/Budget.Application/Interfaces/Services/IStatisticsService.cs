using Budget.Application.DTOs.Statistics;

namespace Budget.Application.Interfaces.Services;

public interface IStatisticsService
{
    Task<StatisticsDto> GetStatisticsAsync(int? year = null, int? month = null, int? monthsBack = 1);
}
