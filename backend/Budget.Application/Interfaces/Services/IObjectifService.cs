using Budget.Application.DTOs.Common;
using Budget.Application.DTOs.Objectifs;

namespace Budget.Application.Interfaces.Services;

public interface IObjectifService
{
    Task<ApiResponse<IEnumerable<ObjectifWithProgressDto>>> GetAllAsync();
    Task<ApiResponse<ObjectifWithProgressDto>> GetByIdAsync(Guid id);
    Task<ApiResponse<ObjectifDto>> CreateAsync(CreateObjectifDto createDto);
    Task<ApiResponse<ObjectifDto>> UpdateAsync(Guid id, UpdateObjectifDto updateDto);
    Task<ApiResponse<bool>> DeleteAsync(Guid id);
}
