using Budget.Domain.Entities;
using Budget.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Budget.Infrastructure.Persistence.Configurations;

public class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
{
    public void Configure(EntityTypeBuilder<Transaction> builder)
    {
        builder.ToTable("Transactions");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Date)
            .IsRequired();

        builder.Property(t => t.Montant)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.Property(t => t.Type)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(t => t.Description)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(t => t.Importance)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(t => t.Notes)
            .HasMaxLength(1000);

        builder.Property(t => t.CreatedAt)
            .IsRequired();

        builder.Property(t => t.UpdatedAt);

        builder.HasOne(t => t.Categorie)
            .WithMany(c => c.Transactions)
            .HasForeignKey(t => t.CategorieId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(t => t.Date);
        builder.HasIndex(t => t.Type);
        builder.HasIndex(t => t.CategorieId);
    }
}
