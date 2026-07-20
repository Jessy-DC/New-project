using Budget.Application.DTOs.Common;
using Budget.Application.DTOs.Contributions;

namespace Budget.Application.Interfaces.Services;

public interface IContributionService
{
    Task<ApiResponse<IEnumerable<ContributionDto>>> GetByObjectifIdAsync(Guid objectifId);
    Task<ApiResponse<ContributionDto>> GetByIdAsync(Guid id);
    Task<ApiResponse<ContributionDto>> CreateAsync(CreateContributionDto createDto);
    Task<ApiResponse<bool>> DeleteAsync(Guid id);
}
