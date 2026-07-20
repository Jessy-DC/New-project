using Budget.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Budget.Infrastructure.Persistence;

public static class BudgetDbContextSeed
{
    public static async Task SeedDefaultCategoriesAsync(BudgetDbContext context)
    {
        if (await context.Categories.AnyAsync())
        {
            return;
        }

        var categories = new List<Categorie>
        {
            new() { Id = Guid.NewGuid(), Nom = "Courses", EstActive = true },
            new() { Id = Guid.NewGuid(), Nom = "Restaurant", EstActive = true },
            new() { Id = Guid.NewGuid(), Nom = "Transport", EstActive = true },
            new() { Id = Guid.NewGuid(), Nom = "Santé", EstActive = true },
            new() { Id = Guid.NewGuid(), Nom = "Shopping", EstActive = true },
            new() { Id = Guid.NewGuid(), Nom = "Logement", EstActive = true },
            new() { Id = Guid.NewGuid(), Nom = "Loisirs", EstActive = true },
            new() { Id = Guid.NewGuid(), Nom = "Éducation", EstActive = true },
            new() { Id = Guid.NewGuid(), Nom = "Abonnements", EstActive = true },
            new() { Id = Guid.NewGuid(), Nom = "Salaire", EstActive = true },
            new() { Id = Guid.NewGuid(), Nom = "Autre", EstActive = true }
        };

        await context.Categories.AddRangeAsync(categories);
        await context.SaveChangesAsync();
    }
}
