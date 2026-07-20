using Budget.Application.Interfaces;
using Budget.Infrastructure.Persistence;

namespace Budget.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly BudgetDbContext _context;

    public UnitOfWork(BudgetDbContext context)
    {
        _context = context;
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }
}
