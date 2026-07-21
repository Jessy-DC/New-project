namespace Budget.Application.DTOs.Dashboard;

public class MainGoalDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public decimal CurrentAmount { get; set; }
    public decimal TargetAmount { get; set; }
    public int ProgressPercentage { get; set; }
}
