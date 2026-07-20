using Budget.Domain.Enums;

namespace Budget.Application.DTOs.Abonnements;

public class CreateAbonnementDto
{
    public string Nom { get; set; } = string.Empty;
    public decimal Montant { get; set; }
    public RecurrenceType Recurrence { get; set; }
    public DateTime DateDebut { get; set; }
    public string? Notes { get; set; }
    public Guid? CategorieId { get; set; }
}
