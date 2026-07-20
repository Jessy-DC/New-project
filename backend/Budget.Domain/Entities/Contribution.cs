using Budget.Domain.Common;

namespace Budget.Domain.Entities;

/// <summary>
/// Représente une somme volontairement affectée à un objectif.
/// Une contribution n'est PAS une transaction. Elle représente un transfert d'épargne.
/// </summary>
public class Contribution : BaseEntity
{
    public DateTime Date { get; set; }
    public decimal Montant { get; set; }

    // Relations
    public Guid ObjectifId { get; set; }
    public Objectif Objectif { get; set; } = null!;

    // Règles métier
    public void ValiderMontant()
    {
        if (Montant <= 0)
        {
            throw new InvalidOperationException("Le montant de la contribution doit être positif.");
        }
    }
}
