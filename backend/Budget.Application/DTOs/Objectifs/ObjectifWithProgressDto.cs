namespace Budget.Application.DTOs.Objectifs;

public class ObjectifWithProgressDto
{
    public Guid Id { get; set; }
    public string Nom { get; set; } = string.Empty;
    public decimal MontantCible { get; set; }
    public DateTime? DateCible { get; set; }
    public string? ImageUrl { get; set; }

    // Calculés
    public decimal MontantActuel { get; set; }
    public decimal MontantRestant { get; set; }
    public decimal PourcentageProgression { get; set; }
    public int? JoursRestants { get; set; }
    public bool EstAtteint { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
