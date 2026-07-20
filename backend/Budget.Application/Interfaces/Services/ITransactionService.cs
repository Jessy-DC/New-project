using Budget.Application.DTOs.Common;
using Budget.Application.DTOs.Transactions;

namespace Budget.Application.Interfaces.Services;

public interface ITransactionService
{
    Task<PagedResponse<TransactionDto>> GetAllAsync(PaginationParams paginationParams, TransactionFilterDto? filter = null);
    Task<ApiResponse<TransactionDto>> GetByIdAsync(Guid id);
    Task<ApiResponse<TransactionDto>> CreateAsync(CreateTransactionDto createDto);
    Task<ApiResponse<TransactionDto>> UpdateAsync(Guid id, UpdateTransactionDto updateDto);
    Task<ApiResponse<bool>> DeleteAsync(Guid id);
}
