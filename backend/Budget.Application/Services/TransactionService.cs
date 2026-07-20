using Budget.Application.DTOs.Common;
using Budget.Application.DTOs.Transactions;
using Budget.Application.Interfaces;
using Budget.Application.Interfaces.Services;
using Budget.Domain.Entities;

namespace Budget.Application.Services;

public class TransactionService : ITransactionService
{
    private readonly IRepository<Transaction> _transactionRepository;
    private readonly IRepository<Categorie> _categorieRepository;
    private readonly IUnitOfWork _unitOfWork;

    public TransactionService(
        IRepository<Transaction> transactionRepository,
        IRepository<Categorie> categorieRepository,
        IUnitOfWork unitOfWork)
    {
        _transactionRepository = transactionRepository;
        _categorieRepository = categorieRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<PagedResponse<TransactionDto>> GetAllAsync(PaginationParams paginationParams, TransactionFilterDto? filter = null)
    {
        var query = _transactionRepository.GetAllAsync().Result.AsQueryable();

        if (filter != null)
        {
            if (filter.Type.HasValue)
            {
                query = query.Where(t => t.Type == filter.Type.Value);
            }

            if (filter.CategorieId.HasValue)
            {
                query = query.Where(t => t.CategorieId == filter.CategorieId.Value);
            }

            if (filter.DateDebut.HasValue)
            {
                query = query.Where(t => t.Date >= filter.DateDebut.Value);
            }

            if (filter.DateFin.HasValue)
            {
                query = query.Where(t => t.Date <= filter.DateFin.Value);
            }

            if (filter.MontantMin.HasValue)
            {
                query = query.Where(t => t.Montant >= filter.MontantMin.Value);
            }

            if (filter.MontantMax.HasValue)
            {
                query = query.Where(t => t.Montant <= filter.MontantMax.Value);
            }

            if (filter.Importance.HasValue)
            {
                query = query.Where(t => t.Importance == filter.Importance.Value);
            }
        }

        var totalCount = query.Count();
        var transactions = query
            .OrderByDescending(t => t.Date)
            .Skip((paginationParams.Page - 1) * paginationParams.PageSize)
            .Take(paginationParams.PageSize)
            .ToList();

        var transactionDtos = transactions.Select(t => new TransactionDto
        {
            Id = t.Id,
            Date = t.Date,
            Montant = t.Montant,
            Type = t.Type,
            Description = t.Description,
            Importance = t.Importance,
            Notes = t.Notes,
            CategorieId = t.CategorieId,
            CategorieName = t.Categorie?.Nom ?? string.Empty,
            CreatedAt = t.CreatedAt
        }).ToList();

        return new PagedResponse<TransactionDto>(
            transactionDtos,
            paginationParams.Page,
            paginationParams.PageSize,
            totalCount);
    }

    public async Task<ApiResponse<TransactionDto>> GetByIdAsync(Guid id)
    {
        var transaction = await _transactionRepository.GetByIdAsync(id);
        if (transaction == null)
        {
            return ApiResponse<TransactionDto>.ErrorResponse("Transaction non trouvée.");
        }

        var transactionDto = new TransactionDto
        {
            Id = transaction.Id,
            Date = transaction.Date,
            Montant = transaction.Montant,
            Type = transaction.Type,
            Description = transaction.Description,
            Importance = transaction.Importance,
            Notes = transaction.Notes,
            CategorieId = transaction.CategorieId,
            CategorieName = transaction.Categorie?.Nom ?? string.Empty,
            CreatedAt = transaction.CreatedAt
        };

        return ApiResponse<TransactionDto>.SuccessResponse(transactionDto);
    }

    public async Task<ApiResponse<TransactionDto>> CreateAsync(CreateTransactionDto createDto)
    {
        var categorie = await _categorieRepository.GetByIdAsync(createDto.CategorieId);
        if (categorie == null)
        {
            return ApiResponse<TransactionDto>.ErrorResponse("Catégorie non trouvée.");
        }

        var transaction = new Transaction
        {
            Date = createDto.Date,
            Montant = createDto.Montant,
            Type = createDto.Type,
            Description = createDto.Description,
            Importance = createDto.Importance,
            Notes = createDto.Notes,
            CategorieId = createDto.CategorieId
        };

        await _transactionRepository.AddAsync(transaction);
        await _unitOfWork.SaveChangesAsync();

        var transactionDto = new TransactionDto
        {
            Id = transaction.Id,
            Date = transaction.Date,
            Montant = transaction.Montant,
            Type = transaction.Type,
            Description = transaction.Description,
            Importance = transaction.Importance,
            Notes = transaction.Notes,
            CategorieId = transaction.CategorieId,
            CategorieName = categorie.Nom,
            CreatedAt = transaction.CreatedAt
        };

        return ApiResponse<TransactionDto>.SuccessResponse(transactionDto, "Transaction créée avec succès.");
    }

    public async Task<ApiResponse<TransactionDto>> UpdateAsync(Guid id, UpdateTransactionDto updateDto)
    {
        var transaction = await _transactionRepository.GetByIdAsync(id);
        if (transaction == null)
        {
            return ApiResponse<TransactionDto>.ErrorResponse("Transaction non trouvée.");
        }

        var categorie = await _categorieRepository.GetByIdAsync(updateDto.CategorieId);
        if (categorie == null)
        {
            return ApiResponse<TransactionDto>.ErrorResponse("Catégorie non trouvée.");
        }

        transaction.Date = updateDto.Date;
        transaction.Montant = updateDto.Montant;
        transaction.Type = updateDto.Type;
        transaction.Description = updateDto.Description;
        transaction.Importance = updateDto.Importance;
        transaction.Notes = updateDto.Notes;
        transaction.CategorieId = updateDto.CategorieId;

        await _transactionRepository.UpdateAsync(transaction);
        await _unitOfWork.SaveChangesAsync();

        var transactionDto = new TransactionDto
        {
            Id = transaction.Id,
            Date = transaction.Date,
            Montant = transaction.Montant,
            Type = transaction.Type,
            Description = transaction.Description,
            Importance = transaction.Importance,
            Notes = transaction.Notes,
            CategorieId = transaction.CategorieId,
            CategorieName = categorie.Nom,
            CreatedAt = transaction.CreatedAt
        };

        return ApiResponse<TransactionDto>.SuccessResponse(transactionDto, "Transaction mise à jour avec succès.");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(Guid id)
    {
        var transaction = await _transactionRepository.GetByIdAsync(id);
        if (transaction == null)
        {
            return ApiResponse<bool>.ErrorResponse("Transaction non trouvée.");
        }

        await _transactionRepository.DeleteAsync(transaction);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResponse(true, "Transaction supprimée avec succès.");
    }
}
