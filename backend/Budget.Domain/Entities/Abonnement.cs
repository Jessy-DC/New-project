using Budget.Domain.Common;
using Budget.Domain.Enums;

namespace Budget.Domain.Entities;

/// <summary>
/// Représente une dépense récurrente (Netflix, Spotify, salle de sport, etc.).
/// Dans le MVP, l'abonnement ne crée pas automatiquement une transaction.
/// </summary>
public class Abonnement : BaseEntity
{
    public string Nom { get; set; } = string.Empty;
    public decimal Montant { get; set; }
    public RecurrenceType Recurrence { get; set; }
    public DateTime DateDebut { get; set; }
    public DateTime? DateFin { get; set; }
    public bool EstActif { get; set; } = true;
    public string? Notes { get; set; }

    // Relations
    public Guid? CategorieId { get; set; }
    public Categorie? Categorie { get; set; }

    // Méthodes métier
    public void ValiderMontant()
    {
        if (Montant <= 0)
        {
            throw new InvalidOperationException("Le montant de l'abonnement doit être positif.");
        }
    }

    public void Arreter()
    {
        EstActif = false;
        DateFin = DateTime.UtcNow;
    }

    public void Reactiver()
    {
        EstActif = true;
        DateFin = null;
    }

    public decimal CalculerCoutMensuel()
    {
        return Recurrence switch
        {
            RecurrenceType.Mensuel => Montant,
            RecurrenceType.Hebdomadaire => Montant * 4.33m, // Moyenne de semaines par mois
            RecurrenceType.Annuel => Montant / 12,
            _ => Montant
        };
    }

    public decimal CalculerCoutAnnuel()
    {
        return Recurrence switch
        {
            RecurrenceType.Mensuel => Montant * 12,
            RecurrenceType.Hebdomadaire => Montant * 52,
            RecurrenceType.Annuel => Montant,
            _ => Montant * 12
        };
    }
}
