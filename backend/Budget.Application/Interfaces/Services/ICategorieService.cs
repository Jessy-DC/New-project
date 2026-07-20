using Budget.Application.DTOs.Categories;
using Budget.Application.DTOs.Common;

namespace Budget.Application.Interfaces.Services;

public interface ICategorieService
{
    Task<ApiResponse<IEnumerable<CategorieDto>>> GetAllAsync();
    Task<ApiResponse<CategorieDto>> GetByIdAsync(Guid id);
    Task<ApiResponse<CategorieDto>> CreateAsync(CreateCategorieDto createDto);
    Task<ApiResponse<CategorieDto>> UpdateAsync(Guid id, UpdateCategorieDto updateDto);
    Task<ApiResponse<bool>> DeleteAsync(Guid id);
}
