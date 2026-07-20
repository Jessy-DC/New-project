using Budget.Domain.Common;

namespace Budget.Domain.Entities;

/// <summary>
/// Représente une catégorie permettant de classer les transactions.
/// </summary>
public class Categorie : BaseEntity
{
    public string Nom { get; set; } = string.Empty;
    public bool EstActive { get; set; } = true;

    // Navigation
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();

    // Méthodes métier
    public void Desactiver()
    {
        EstActive = false;
    }

    public void Activer()
    {
        EstActive = true;
    }

    public bool PeutEtreSupprimee()
    {
        return !Transactions.Any();
    }
}
