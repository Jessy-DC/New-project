using Budget.Domain.Entities;
using Budget.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Budget.Infrastructure.Persistence.Configurations;

public class AbonnementConfiguration : IEntityTypeConfiguration<Abonnement>
{
    public void Configure(EntityTypeBuilder<Abonnement> builder)
    {
        builder.ToTable("Abonnements");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.Nom)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(a => a.Montant)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.Property(a => a.Recurrence)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(a => a.DateDebut)
            .IsRequired();

        builder.Property(a => a.DateFin);

        builder.Property(a => a.EstActif)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(a => a.Notes)
            .HasMaxLength(1000);

        builder.Property(a => a.CreatedAt)
            .IsRequired();

        builder.Property(a => a.UpdatedAt);

        builder.HasOne(a => a.Categorie)
            .WithMany()
            .HasForeignKey(a => a.CategorieId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(a => a.EstActif);
        builder.HasIndex(a => a.DateDebut);
    }
}
