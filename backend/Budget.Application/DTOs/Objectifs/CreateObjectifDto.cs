namespace Budget.Application.DTOs.Objectifs;

public class CreateObjectifDto
{
    public string Nom { get; set; } = string.Empty;
    public decimal MontantCible { get; set; }
    public DateTime? DateCible { get; set; }
    public string? ImageUrl { get; set; }
}
