using Budget.Application.DTOs.Common;
using Budget.Application.DTOs.Objectifs;
using Budget.Application.Interfaces;
using Budget.Application.Interfaces.Services;
using Budget.Domain.Entities;

namespace Budget.Application.Services;

public class ObjectifService : IObjectifService
{
    private readonly IRepository<Objectif> _objectifRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ObjectifService(IRepository<Objectif> objectifRepository, IUnitOfWork unitOfWork)
    {
        _objectifRepository = objectifRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<IEnumerable<ObjectifWithProgressDto>>> GetAllAsync()
    {
        var objectifs = await _objectifRepository.GetAllAsync();
        var objectifDtos = objectifs.Select(o => new ObjectifWithProgressDto
        {
            Id = o.Id,
            Nom = o.Nom,
            MontantCible = o.MontantCible,
            MontantActuel = o.CalculerMontantActuel(),
            MontantRestant = o.CalculerMontantRestant(),
            PourcentageProgression = o.CalculerPourcentageProgression(),
            DateCible = o.DateCible,
            JoursRestants = o.CalculerJoursRestants(),
            ImageUrl = o.ImageUrl,
            EstAtteint = o.EstAtteint(),
            CreatedAt = o.CreatedAt
        });

        return ApiResponse<IEnumerable<ObjectifWithProgressDto>>.SuccessResponse(objectifDtos);
    }

    public async Task<ApiResponse<ObjectifWithProgressDto>> GetByIdAsync(Guid id)
    {
        var objectif = await _objectifRepository.GetByIdAsync(id);
        if (objectif == null)
        {
            return ApiResponse<ObjectifWithProgressDto>.ErrorResponse("Objectif non trouvé.");
        }

        var objectifDto = new ObjectifWithProgressDto
        {
            Id = objectif.Id,
            Nom = objectif.Nom,
            MontantCible = objectif.MontantCible,
            MontantActuel = objectif.CalculerMontantActuel(),
            MontantRestant = objectif.CalculerMontantRestant(),
            PourcentageProgression = objectif.CalculerPourcentageProgression(),
            DateCible = objectif.DateCible,
            JoursRestants = objectif.CalculerJoursRestants(),
            ImageUrl = objectif.ImageUrl,
            EstAtteint = objectif.EstAtteint(),
            CreatedAt = objectif.CreatedAt
        };

        return ApiResponse<ObjectifWithProgressDto>.SuccessResponse(objectifDto);
    }

    public async Task<ApiResponse<ObjectifDto>> CreateAsync(CreateObjectifDto createDto)
    {
        var objectif = new Objectif
        {
            Nom = createDto.Nom,
            MontantCible = createDto.MontantCible,
            DateCible = createDto.DateCible,
            ImageUrl = createDto.ImageUrl
        };

        await _objectifRepository.AddAsync(objectif);
        await _unitOfWork.SaveChangesAsync();

        var objectifDto = new ObjectifDto
        {
            Id = objectif.Id,
            Nom = objectif.Nom,
            MontantCible = objectif.MontantCible,
            DateCible = objectif.DateCible,
            ImageUrl = objectif.ImageUrl,
            CreatedAt = objectif.CreatedAt
        };

        return ApiResponse<ObjectifDto>.SuccessResponse(objectifDto, "Objectif créé avec succès.");
    }

    public async Task<ApiResponse<ObjectifDto>> UpdateAsync(Guid id, UpdateObjectifDto updateDto)
    {
        var objectif = await _objectifRepository.GetByIdAsync(id);
        if (objectif == null)
        {
            return ApiResponse<ObjectifDto>.ErrorResponse("Objectif non trouvé.");
        }

        objectif.Nom = updateDto.Nom;
        objectif.MontantCible = updateDto.MontantCible;
        objectif.DateCible = updateDto.DateCible;
        objectif.ImageUrl = updateDto.ImageUrl;

        await _objectifRepository.UpdateAsync(objectif);
        await _unitOfWork.SaveChangesAsync();

        var objectifDto = new ObjectifDto
        {
            Id = objectif.Id,
            Nom = objectif.Nom,
            MontantCible = objectif.MontantCible,
            DateCible = objectif.DateCible,
            ImageUrl = objectif.ImageUrl,
            CreatedAt = objectif.CreatedAt
        };

        return ApiResponse<ObjectifDto>.SuccessResponse(objectifDto, "Objectif mis à jour avec succès.");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(Guid id)
    {
        var objectif = await _objectifRepository.GetByIdAsync(id);
        if (objectif == null)
        {
            return ApiResponse<bool>.ErrorResponse("Objectif non trouvé.");
        }

        await _objectifRepository.DeleteAsync(objectif);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResponse(true, "Objectif supprimé avec succès.");
    }
}
