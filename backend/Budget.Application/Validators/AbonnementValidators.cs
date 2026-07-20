using Budget.Application.DTOs.Abonnements;
using FluentValidation;

namespace Budget.Application.Validators;

public class CreateAbonnementDtoValidator : AbstractValidator<CreateAbonnementDto>
{
    public CreateAbonnementDtoValidator()
    {
        RuleFor(x => x.Nom)
            .NotEmpty().WithMessage("Le nom de l'abonnement est obligatoire.")
            .MaximumLength(200).WithMessage("Le nom ne peut pas dépasser 200 caractères.");

        RuleFor(x => x.Montant)
            .GreaterThan(0).WithMessage("Le montant doit être supérieur à 0.");

        RuleFor(x => x.Recurrence)
            .IsInEnum().WithMessage("La récurrence est invalide.");

        RuleFor(x => x.DateDebut)
            .NotEmpty().WithMessage("La date de début est obligatoire.");

        RuleFor(x => x.Notes)
            .MaximumLength(1000).WithMessage("Les notes ne peuvent pas dépasser 1000 caractères.")
            .When(x => !string.IsNullOrWhiteSpace(x.Notes));
    }
}

public class UpdateAbonnementDtoValidator : AbstractValidator<UpdateAbonnementDto>
{
    public UpdateAbonnementDtoValidator()
    {
        RuleFor(x => x.Nom)
            .NotEmpty().WithMessage("Le nom de l'abonnement est obligatoire.")
            .MaximumLength(200).WithMessage("Le nom ne peut pas dépasser 200 caractères.");

        RuleFor(x => x.Montant)
            .GreaterThan(0).WithMessage("Le montant doit être supérieur à 0.");

        RuleFor(x => x.Recurrence)
            .IsInEnum().WithMessage("La récurrence est invalide.");

        RuleFor(x => x.DateDebut)
            .NotEmpty().WithMessage("La date de début est obligatoire.");

        RuleFor(x => x.DateFin)
            .GreaterThan(x => x.DateDebut)
            .WithMessage("La date de fin doit être postérieure à la date de début.")
            .When(x => x.DateFin.HasValue);

        RuleFor(x => x.Notes)
            .MaximumLength(1000).WithMessage("Les notes ne peuvent pas dépasser 1000 caractères.")
            .When(x => !string.IsNullOrWhiteSpace(x.Notes));
    }
}
