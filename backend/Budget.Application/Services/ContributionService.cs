using Budget.Application.DTOs.Common;
using Budget.Application.DTOs.Contributions;
using Budget.Application.Interfaces;
using Budget.Application.Interfaces.Services;
using Budget.Domain.Entities;

namespace Budget.Application.Services;

public class ContributionService : IContributionService
{
    private readonly IRepository<Contribution> _contributionRepository;
    private readonly IRepository<Objectif> _objectifRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ContributionService(
        IRepository<Contribution> contributionRepository,
        IRepository<Objectif> objectifRepository,
        IUnitOfWork unitOfWork)
    {
        _contributionRepository = contributionRepository;
        _objectifRepository = objectifRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<IEnumerable<ContributionDto>>> GetByObjectifIdAsync(Guid objectifId)
    {
        var contributions = (await _contributionRepository.GetAllAsync())
            .Where(c => c.ObjectifId == objectifId)
            .OrderByDescending(c => c.Date);

        var contributionDtos = contributions.Select(c => new ContributionDto
        {
            Id = c.Id,
            Date = c.Date,
            Montant = c.Montant,
            ObjectifId = c.ObjectifId,
            CreatedAt = c.CreatedAt
        });

        return ApiResponse<IEnumerable<ContributionDto>>.SuccessResponse(contributionDtos);
    }

    public async Task<ApiResponse<ContributionDto>> GetByIdAsync(Guid id)
    {
        var contribution = await _contributionRepository.GetByIdAsync(id);
        if (contribution == null)
        {
            return ApiResponse<ContributionDto>.ErrorResponse("Contribution non trouvée.");
        }

        var contributionDto = new ContributionDto
        {
            Id = contribution.Id,
            Date = contribution.Date,
            Montant = contribution.Montant,
            ObjectifId = contribution.ObjectifId,
            CreatedAt = contribution.CreatedAt
        };

        return ApiResponse<ContributionDto>.SuccessResponse(contributionDto);
    }

    public async Task<ApiResponse<ContributionDto>> CreateAsync(CreateContributionDto createDto)
    {
        var objectif = await _objectifRepository.GetByIdAsync(createDto.ObjectifId);
        if (objectif == null)
        {
            return ApiResponse<ContributionDto>.ErrorResponse("Objectif non trouvé.");
        }

        var contribution = new Contribution
        {
            Date = createDto.Date,
            Montant = createDto.Montant,
            ObjectifId = createDto.ObjectifId
        };

        await _contributionRepository.AddAsync(contribution);
        await _unitOfWork.SaveChangesAsync();

        var contributionDto = new ContributionDto
        {
            Id = contribution.Id,
            Date = contribution.Date,
            Montant = contribution.Montant,
            ObjectifId = contribution.ObjectifId,
            CreatedAt = contribution.CreatedAt
        };

        return ApiResponse<ContributionDto>.SuccessResponse(contributionDto, "Contribution créée avec succès.");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(Guid id)
    {
        var contribution = await _contributionRepository.GetByIdAsync(id);
        if (contribution == null)
        {
            return ApiResponse<bool>.ErrorResponse("Contribution non trouvée.");
        }

        await _contributionRepository.DeleteAsync(contribution);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResponse(true, "Contribution supprimée avec succès.");
    }
}
