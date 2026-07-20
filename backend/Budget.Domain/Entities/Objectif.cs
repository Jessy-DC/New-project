using Budget.Domain.Common;

namespace Budget.Domain.Entities;

/// <summary>
/// Représente un projet personnel (voyage, achat immobilier, etc.).
/// Le montant actuel n'est jamais stocké, il est calculé à partir des contributions.
/// </summary>
public class Objectif : BaseEntity
{
    public string Nom { get; set; } = string.Empty;
    public decimal MontantCible { get; set; }
    public DateTime? DateCible { get; set; }
    public string? ImageUrl { get; set; }

    // Navigation
    public ICollection<Contribution> Contributions { get; set; } = new List<Contribution>();

    // Méthodes métier (calculées, pas stockées)
    public decimal CalculerMontantActuel()
    {
        return Contributions.Sum(c => c.Montant);
    }

    public decimal CalculerMontantRestant()
    {
        return MontantCible - CalculerMontantActuel();
    }

    public decimal CalculerPourcentageProgression()
    {
        if (MontantCible <= 0)
        {
            return 0;
        }

        var montantActuel = CalculerMontantActuel();
        var pourcentage = (montantActuel / MontantCible) * 100;
        return Math.Min(pourcentage, 100);
    }

    public bool EstAtteint()
    {
        return CalculerMontantActuel() >= MontantCible;
    }

    public int? CalculerJoursRestants()
    {
        if (!DateCible.HasValue)
        {
            return null;
        }

        var jours = (DateCible.Value.Date - DateTime.UtcNow.Date).Days;
        return Math.Max(jours, 0);
    }

    public void ValiderMontantCible()
    {
        if (MontantCible <= 0)
        {
            throw new InvalidOperationException("Le montant cible doit être positif.");
        }
    }
}
