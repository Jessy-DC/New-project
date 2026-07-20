using Budget.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Budget.Infrastructure.Persistence.Configurations;

public class ContributionConfiguration : IEntityTypeConfiguration<Contribution>
{
    public void Configure(EntityTypeBuilder<Contribution> builder)
    {
        builder.ToTable("Contributions");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Date)
            .IsRequired();

        builder.Property(c => c.Montant)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.Property(c => c.CreatedAt)
            .IsRequired();

        builder.Property(c => c.UpdatedAt);

        builder.HasOne(c => c.Objectif)
            .WithMany(o => o.Contributions)
            .HasForeignKey(c => c.ObjectifId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(c => c.Date);
        builder.HasIndex(c => c.ObjectifId);
    }
}
