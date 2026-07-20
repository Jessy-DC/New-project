using Budget.Domain.Common;
using Budget.Domain.Enums;

namespace Budget.Domain.Entities;

/// <summary>
/// Représente un mouvement d'argent (dépense ou revenu).
/// </summary>
public class Transaction : BaseEntity
{
    public DateTime Date { get; set; }
    public decimal Montant { get; set; }
    public TransactionType Type { get; set; }
    public string Description { get; set; } = string.Empty;
    public Importance Importance { get; set; }
    public string? Notes { get; set; }

    // Relations
    public Guid CategorieId { get; set; }
    public Categorie Categorie { get; set; } = null!;

    // Règles métier
    public void ValiderMontant()
    {
        if (Montant <= 0)
        {
            throw new InvalidOperationException("Le montant doit être positif.");
        }
    }

    public bool EstDepense()
    {
        return Type == TransactionType.Depense;
    }

    public bool EstRevenu()
    {
        return Type == TransactionType.Revenu;
    }

    public bool EstEssentiel()
    {
        return Importance == Importance.Essentiel;
    }

    public bool EstPlaisir()
    {
        return Importance == Importance.Plaisir;
    }
}
