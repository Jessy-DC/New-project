using Budget.Domain.Enums;

namespace Budget.Application.DTOs.Transactions;

public class TransactionFilterDto
{
    public DateTime? DateDebut { get; set; }
    public DateTime? DateFin { get; set; }
    public TransactionType? Type { get; set; }
    public Guid? CategorieId { get; set; }
    public Importance? Importance { get; set; }
    public decimal? MontantMin { get; set; }
    public decimal? MontantMax { get; set; }
    public string? Recherche { get; set; }
}
