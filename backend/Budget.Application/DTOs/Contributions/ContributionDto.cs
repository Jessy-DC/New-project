namespace Budget.Application.DTOs.Contributions;

public class ContributionDto
{
    public Guid Id { get; set; }
    public DateTime Date { get; set; }
    public decimal Montant { get; set; }
    public Guid ObjectifId { get; set; }
    public string ObjectifNom { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
