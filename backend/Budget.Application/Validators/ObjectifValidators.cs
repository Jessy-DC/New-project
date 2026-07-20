using Budget.Application.DTOs.Objectifs;
using FluentValidation;

namespace Budget.Application.Validators;

public class CreateObjectifDtoValidator : AbstractValidator<CreateObjectifDto>
{
    public CreateObjectifDtoValidator()
    {
        RuleFor(x => x.Nom)
            .NotEmpty().WithMessage("Le nom de l'objectif est obligatoire.")
            .MaximumLength(200).WithMessage("Le nom ne peut pas dépasser 200 caractères.");

        RuleFor(x => x.MontantCible)
            .GreaterThan(0).WithMessage("Le montant cible doit être supérieur à 0.");

        RuleFor(x => x.ImageUrl)
            .MaximumLength(500).WithMessage("L'URL de l'image ne peut pas dépasser 500 caractères.")
            .When(x => !string.IsNullOrWhiteSpace(x.ImageUrl));
    }
}

public class UpdateObjectifDtoValidator : AbstractValidator<UpdateObjectifDto>
{
    public UpdateObjectifDtoValidator()
    {
        RuleFor(x => x.Nom)
            .NotEmpty().WithMessage("Le nom de l'objectif est obligatoire.")
            .MaximumLength(200).WithMessage("Le nom ne peut pas dépasser 200 caractères.");

        RuleFor(x => x.MontantCible)
            .GreaterThan(0).WithMessage("Le montant cible doit être supérieur à 0.");

        RuleFor(x => x.ImageUrl)
            .MaximumLength(500).WithMessage("L'URL de l'image ne peut pas dépasser 500 caractères.")
            .When(x => !string.IsNullOrWhiteSpace(x.ImageUrl));
    }
}
