namespace Budget.Application.DTOs.Statistics;

public class CategoryTrendDto
{
    public Guid CategorieId { get; set; }
    public string CategorieNom { get; set; } = string.Empty;
    public decimal MontantActuel { get; set; }
    public decimal MontantPrecedent { get; set; }
    public decimal DeltaMontant { get; set; }
    public decimal DeltaPourcentage { get; set; }
}
