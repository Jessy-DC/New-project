using Budget.Application.DTOs.Transactions;
using FluentValidation;

namespace Budget.Application.Validators;

public class CreateTransactionDtoValidator : AbstractValidator<CreateTransactionDto>
{
    public CreateTransactionDtoValidator()
    {
        RuleFor(x => x.Montant)
            .GreaterThan(0).WithMessage("Le montant doit être supérieur à 0.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("La description est obligatoire.")
            .MaximumLength(200).WithMessage("La description ne peut pas dépasser 200 caractères.");

        RuleFor(x => x.Date)
            .NotEmpty().WithMessage("La date de la transaction est obligatoire.");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Le type de transaction est invalide.");

        RuleFor(x => x.Importance)
            .IsInEnum().WithMessage("L'importance est invalide.");

        RuleFor(x => x.CategorieId)
            .NotEmpty().WithMessage("La catégorie est obligatoire.");

        RuleFor(x => x.Notes)
            .MaximumLength(1000).WithMessage("Les notes ne peuvent pas dépasser 1000 caractères.")
            .When(x => !string.IsNullOrWhiteSpace(x.Notes));
    }
}

public class UpdateTransactionDtoValidator : AbstractValidator<UpdateTransactionDto>
{
    public UpdateTransactionDtoValidator()
    {
        RuleFor(x => x.Montant)
            .GreaterThan(0).WithMessage("Le montant doit être supérieur à 0.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("La description est obligatoire.")
            .MaximumLength(200).WithMessage("La description ne peut pas dépasser 200 caractères.");

        RuleFor(x => x.Date)
            .NotEmpty().WithMessage("La date de la transaction est obligatoire.");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Le type de transaction est invalide.");

        RuleFor(x => x.Importance)
            .IsInEnum().WithMessage("L'importance est invalide.");

        RuleFor(x => x.CategorieId)
            .NotEmpty().WithMessage("La catégorie est obligatoire.");

        RuleFor(x => x.Notes)
            .MaximumLength(1000).WithMessage("Les notes ne peuvent pas dépasser 1000 caractères.")
            .When(x => !string.IsNullOrWhiteSpace(x.Notes));
    }
}
