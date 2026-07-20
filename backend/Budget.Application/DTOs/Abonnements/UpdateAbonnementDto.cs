using Budget.Domain.Enums;

namespace Budget.Application.DTOs.Abonnements;

public class UpdateAbonnementDto
{
    public string Nom { get; set; } = string.Empty;
    public decimal Montant { get; set; }
    public RecurrenceType Recurrence { get; set; }
    public DateTime DateDebut { get; set; }
    public DateTime? DateFin { get; set; }
    public bool EstActif { get; set; }
    public string? Notes { get; set; }
    public Guid? CategorieId { get; set; }
}
