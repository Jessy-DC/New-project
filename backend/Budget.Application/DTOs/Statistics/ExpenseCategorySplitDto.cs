namespace Budget.Application.DTOs.Statistics;

public class ExpenseCategorySplitDto
{
    public Guid CategorieId { get; set; }
    public string CategorieNom { get; set; } = string.Empty;
    public decimal Montant { get; set; }
    public decimal Pourcentage { get; set; }
}
