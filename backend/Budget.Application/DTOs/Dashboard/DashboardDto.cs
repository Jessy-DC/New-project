namespace Budget.Application.DTOs.Dashboard;

public class DashboardDto
{
    public string PeriodLabel { get; set; } = string.Empty;
    public decimal AvailableAmount { get; set; }
    public decimal AvailableDelta { get; set; }
    public MonthlySummaryDto Summary { get; set; } = new();
    public MainGoalDto? MainGoal { get; set; }
    public InsightDto? Insight { get; set; }
}
