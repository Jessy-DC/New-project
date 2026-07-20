namespace Budget.Application.DTOs.Contributions;

public class CreateContributionDto
{
    public DateTime Date { get; set; }
    public decimal Montant { get; set; }
    public Guid ObjectifId { get; set; }
}
