using Microsoft.Extensions.DependencyInjection;
using FluentValidation;
using System.Reflection;
using Budget.Application.Interfaces.Services;
using Budget.Application.Services;

namespace Budget.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        services.AddScoped<ICategorieService, CategorieService>();
        services.AddScoped<ITransactionService, TransactionService>();
        services.AddScoped<IObjectifService, ObjectifService>();
        services.AddScoped<IContributionService, ContributionService>();
        services.AddScoped<IAbonnementService, AbonnementService>();

        return services;
    }
}
