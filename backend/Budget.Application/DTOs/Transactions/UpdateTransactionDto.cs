using Budget.Domain.Enums;

namespace Budget.Application.DTOs.Transactions;

public class UpdateTransactionDto
{
    public DateTime Date { get; set; }
    public decimal Montant { get; set; }
    public TransactionType Type { get; set; }
    public string Description { get; set; } = string.Empty;
    public Importance Importance { get; set; }
    public string? Notes { get; set; }
    public Guid CategorieId { get; set; }
}
