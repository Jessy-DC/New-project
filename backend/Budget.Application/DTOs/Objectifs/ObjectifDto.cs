namespace Budget.Application.DTOs.Objectifs;

public class ObjectifDto
{
    public Guid Id { get; set; }
    public string Nom { get; set; } = string.Empty;
    public decimal MontantCible { get; set; }
    public DateTime? DateCible { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
