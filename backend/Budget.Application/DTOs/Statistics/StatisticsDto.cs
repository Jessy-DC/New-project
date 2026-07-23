namespace Budget.Application.DTOs.Statistics;

public class StatisticsDto
{
    public string PeriodLabel { get; set; } = string.Empty;
    public decimal MontantEconomise { get; set; }
    public List<ExpenseCategorySplitDto> RepartitionParCategorie { get; set; } = new();
    public ImportanceSplitDto RepartitionParImportance { get; set; } = new();
    public List<CategoryTrendDto> EvolutionCategories { get; set; } = new();
    public BestCategoryDto? MeilleureCategorie { get; set; }
}
