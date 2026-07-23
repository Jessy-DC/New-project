namespace Budget.Application.DTOs.Statistics;

public class BestCategoryDto
{
    public string CategorieNom { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal DeltaPourcentage { get; set; }
}
