using Budget.Application.DTOs.Categories;
using FluentValidation;

namespace Budget.Application.Validators;

public class CreateCategorieDtoValidator : AbstractValidator<CreateCategorieDto>
{
    public CreateCategorieDtoValidator()
    {
        RuleFor(x => x.Nom)
            .NotEmpty().WithMessage("Le nom de la catégorie est obligatoire.")
            .MaximumLength(100).WithMessage("Le nom ne peut pas dépasser 100 caractères.");
    }
}

public class UpdateCategorieDtoValidator : AbstractValidator<UpdateCategorieDto>
{
    public UpdateCategorieDtoValidator()
    {
        RuleFor(x => x.Nom)
            .NotEmpty().WithMessage("Le nom de la catégorie est obligatoire.")
            .MaximumLength(100).WithMessage("Le nom ne peut pas dépasser 100 caractères.");
    }
}
