using Budget.Application.DTOs.Abonnements;
using Budget.Application.DTOs.Common;

namespace Budget.Application.Interfaces.Services;

public interface IAbonnementService
{
    Task<ApiResponse<IEnumerable<AbonnementDto>>> GetAllAsync(bool activeOnly = false);
    Task<ApiResponse<AbonnementDto>> GetByIdAsync(Guid id);
    Task<ApiResponse<AbonnementDto>> CreateAsync(CreateAbonnementDto createDto);
    Task<ApiResponse<AbonnementDto>> UpdateAsync(Guid id, UpdateAbonnementDto updateDto);
    Task<ApiResponse<bool>> DeleteAsync(Guid id);
}
