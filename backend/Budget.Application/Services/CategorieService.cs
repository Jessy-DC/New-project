using Budget.Application.DTOs.Categories;
using Budget.Application.DTOs.Common;
using Budget.Application.Interfaces;
using Budget.Application.Interfaces.Services;
using Budget.Domain.Entities;

namespace Budget.Application.Services;

public class CategorieService : ICategorieService
{
    private readonly IRepository<Categorie> _categorieRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CategorieService(IRepository<Categorie> categorieRepository, IUnitOfWork unitOfWork)
    {
        _categorieRepository = categorieRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<IEnumerable<CategorieDto>>> GetAllAsync()
    {
        var categories = await _categorieRepository.GetAllAsync();
        var categorieDtos = categories.Select(c => new CategorieDto
        {
            Id = c.Id,
            Nom = c.Nom,
            CreatedAt = c.CreatedAt
        });

        return ApiResponse<IEnumerable<CategorieDto>>.SuccessResponse(categorieDtos);
    }

    public async Task<ApiResponse<CategorieDto>> GetByIdAsync(Guid id)
    {
        var categorie = await _categorieRepository.GetByIdAsync(id);
        if (categorie == null)
        {
            return ApiResponse<CategorieDto>.ErrorResponse("Catégorie non trouvée.");
        }

        var categorieDto = new CategorieDto
        {
            Id = categorie.Id,
            Nom = categorie.Nom,
            CreatedAt = categorie.CreatedAt
        };

        return ApiResponse<CategorieDto>.SuccessResponse(categorieDto);
    }

    public async Task<ApiResponse<CategorieDto>> CreateAsync(CreateCategorieDto createDto)
    {
        var categorie = new Categorie
        {
            Nom = createDto.Nom
        };

        await _categorieRepository.AddAsync(categorie);
        await _unitOfWork.SaveChangesAsync();

        var categorieDto = new CategorieDto
        {
            Id = categorie.Id,
            Nom = categorie.Nom,
            CreatedAt = categorie.CreatedAt
        };

        return ApiResponse<CategorieDto>.SuccessResponse(categorieDto, "Catégorie créée avec succès.");
    }

    public async Task<ApiResponse<CategorieDto>> UpdateAsync(Guid id, UpdateCategorieDto updateDto)
    {
        var categorie = await _categorieRepository.GetByIdAsync(id);
        if (categorie == null)
        {
            return ApiResponse<CategorieDto>.ErrorResponse("Catégorie non trouvée.");
        }

        categorie.Nom = updateDto.Nom;
        await _categorieRepository.UpdateAsync(categorie);
        await _unitOfWork.SaveChangesAsync();

        var categorieDto = new CategorieDto
        {
            Id = categorie.Id,
            Nom = categorie.Nom,
            CreatedAt = categorie.CreatedAt
        };

        return ApiResponse<CategorieDto>.SuccessResponse(categorieDto, "Catégorie mise à jour avec succès.");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(Guid id)
    {
        var categorie = await _categorieRepository.GetByIdAsync(id);
        if (categorie == null)
        {
            return ApiResponse<bool>.ErrorResponse("Catégorie non trouvée.");
        }

        await _categorieRepository.DeleteAsync(categorie);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResponse(true, "Catégorie supprimée avec succès.");
    }
}
