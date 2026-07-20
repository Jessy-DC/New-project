using Budget.Application.DTOs.Contributions;
using FluentValidation;

namespace Budget.Application.Validators;

public class CreateContributionDtoValidator : AbstractValidator<CreateContributionDto>
{
    public CreateContributionDtoValidator()
    {
        RuleFor(x => x.ObjectifId)
            .NotEmpty().WithMessage("L'objectif est obligatoire.");

        RuleFor(x => x.Montant)
            .GreaterThan(0).WithMessage("Le montant de la contribution doit être supérieur à 0.");

        RuleFor(x => x.Date)
            .NotEmpty().WithMessage("La date de la contribution est obligatoire.");
    }
}
