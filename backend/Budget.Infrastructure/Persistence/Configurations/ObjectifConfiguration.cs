using Budget.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Budget.Infrastructure.Persistence.Configurations;

public class ObjectifConfiguration : IEntityTypeConfiguration<Objectif>
{
    public void Configure(EntityTypeBuilder<Objectif> builder)
    {
        builder.ToTable("Objectifs");

        builder.HasKey(o => o.Id);

        builder.Property(o => o.Nom)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(o => o.MontantCible)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.Property(o => o.DateCible);

        builder.Property(o => o.ImageUrl)
            .HasMaxLength(500);

        builder.Property(o => o.CreatedAt)
            .IsRequired();

        builder.Property(o => o.UpdatedAt);

        builder.HasMany(o => o.Contributions)
            .WithOne(c => c.Objectif)
            .HasForeignKey(c => c.ObjectifId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(o => o.DateCible);
    }
}
