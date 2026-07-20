using Budget.Application.DTOs.Abonnements;
using Budget.Application.DTOs.Common;
using Budget.Application.Interfaces;
using Budget.Application.Interfaces.Services;
using Budget.Domain.Entities;

namespace Budget.Application.Services;

public class AbonnementService : IAbonnementService
{
    private readonly IRepository<Abonnement> _abonnementRepository;
    private readonly IRepository<Categorie> _categorieRepository;
    private readonly IUnitOfWork _unitOfWork;

    public AbonnementService(
        IRepository<Abonnement> abonnementRepository,
        IRepository<Categorie> categorieRepository,
        IUnitOfWork unitOfWork)
    {
        _abonnementRepository = abonnementRepository;
        _categorieRepository = categorieRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<IEnumerable<AbonnementDto>>> GetAllAsync(bool activeOnly = false)
    {
        var abonnements = await _abonnementRepository.GetAllAsync();

        if (activeOnly)
        {
            abonnements = abonnements.Where(a => a.EstActif);
        }

        var abonnementDtos = abonnements.Select(a => new AbonnementDto
        {
            Id = a.Id,
            Nom = a.Nom,
            Montant = a.Montant,
            Recurrence = a.Recurrence,
            DateDebut = a.DateDebut,
            DateFin = a.DateFin,
            EstActif = a.EstActif,
            Notes = a.Notes,
            CategorieId = a.CategorieId,
            CategorieName = a.Categorie?.Nom,
            CoutMensuel = a.CalculerCoutMensuel(),
            CoutAnnuel = a.CalculerCoutAnnuel(),
            CreatedAt = a.CreatedAt
        });

        return ApiResponse<IEnumerable<AbonnementDto>>.SuccessResponse(abonnementDtos);
    }

    public async Task<ApiResponse<AbonnementDto>> GetByIdAsync(Guid id)
    {
        var abonnement = await _abonnementRepository.GetByIdAsync(id);
        if (abonnement == null)
        {
            return ApiResponse<AbonnementDto>.ErrorResponse("Abonnement non trouvé.");
        }

        var abonnementDto = new AbonnementDto
        {
            Id = abonnement.Id,
            Nom = abonnement.Nom,
            Montant = abonnement.Montant,
            Recurrence = abonnement.Recurrence,
            DateDebut = abonnement.DateDebut,
            DateFin = abonnement.DateFin,
            EstActif = abonnement.EstActif,
            Notes = abonnement.Notes,
            CategorieId = abonnement.CategorieId,
            CategorieName = abonnement.Categorie?.Nom,
            CoutMensuel = abonnement.CalculerCoutMensuel(),
            CoutAnnuel = abonnement.CalculerCoutAnnuel(),
            CreatedAt = abonnement.CreatedAt
        };

        return ApiResponse<AbonnementDto>.SuccessResponse(abonnementDto);
    }

    public async Task<ApiResponse<AbonnementDto>> CreateAsync(CreateAbonnementDto createDto)
    {
        if (createDto.CategorieId.HasValue)
        {
            var categorie = await _categorieRepository.GetByIdAsync(createDto.CategorieId.Value);
            if (categorie == null)
            {
                return ApiResponse<AbonnementDto>.ErrorResponse("Catégorie non trouvée.");
            }
        }

        var abonnement = new Abonnement
        {
            Nom = createDto.Nom,
            Montant = createDto.Montant,
            Recurrence = createDto.Recurrence,
            DateDebut = createDto.DateDebut,
            Notes = createDto.Notes,
            CategorieId = createDto.CategorieId
        };

        await _abonnementRepository.AddAsync(abonnement);
        await _unitOfWork.SaveChangesAsync();

        var abonnementDto = new AbonnementDto
        {
            Id = abonnement.Id,
            Nom = abonnement.Nom,
            Montant = abonnement.Montant,
            Recurrence = abonnement.Recurrence,
            DateDebut = abonnement.DateDebut,
            DateFin = abonnement.DateFin,
            EstActif = abonnement.EstActif,
            Notes = abonnement.Notes,
            CategorieId = abonnement.CategorieId,
            CategorieName = abonnement.Categorie?.Nom,
            CoutMensuel = abonnement.CalculerCoutMensuel(),
            CoutAnnuel = abonnement.CalculerCoutAnnuel(),
            CreatedAt = abonnement.CreatedAt
        };

        return ApiResponse<AbonnementDto>.SuccessResponse(abonnementDto, "Abonnement créé avec succès.");
    }

    public async Task<ApiResponse<AbonnementDto>> UpdateAsync(Guid id, UpdateAbonnementDto updateDto)
    {
        var abonnement = await _abonnementRepository.GetByIdAsync(id);
        if (abonnement == null)
        {
            return ApiResponse<AbonnementDto>.ErrorResponse("Abonnement non trouvé.");
        }

        if (updateDto.CategorieId.HasValue)
        {
            var categorie = await _categorieRepository.GetByIdAsync(updateDto.CategorieId.Value);
            if (categorie == null)
            {
                return ApiResponse<AbonnementDto>.ErrorResponse("Catégorie non trouvée.");
            }
        }

        abonnement.Nom = updateDto.Nom;
        abonnement.Montant = updateDto.Montant;
        abonnement.Recurrence = updateDto.Recurrence;
        abonnement.DateDebut = updateDto.DateDebut;
        abonnement.DateFin = updateDto.DateFin;
        abonnement.EstActif = updateDto.EstActif;
        abonnement.Notes = updateDto.Notes;
        abonnement.CategorieId = updateDto.CategorieId;

        await _abonnementRepository.UpdateAsync(abonnement);
        await _unitOfWork.SaveChangesAsync();

        var abonnementDto = new AbonnementDto
        {
            Id = abonnement.Id,
            Nom = abonnement.Nom,
            Montant = abonnement.Montant,
            Recurrence = abonnement.Recurrence,
            DateDebut = abonnement.DateDebut,
            DateFin = abonnement.DateFin,
            EstActif = abonnement.EstActif,
            Notes = abonnement.Notes,
            CategorieId = abonnement.CategorieId,
            CategorieName = abonnement.Categorie?.Nom,
            CoutMensuel = abonnement.CalculerCoutMensuel(),
            CoutAnnuel = abonnement.CalculerCoutAnnuel(),
            CreatedAt = abonnement.CreatedAt
        };

        return ApiResponse<AbonnementDto>.SuccessResponse(abonnementDto, "Abonnement mis à jour avec succès.");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(Guid id)
    {
        var abonnement = await _abonnementRepository.GetByIdAsync(id);
        if (abonnement == null)
        {
            return ApiResponse<bool>.ErrorResponse("Abonnement non trouvé.");
        }

        await _abonnementRepository.DeleteAsync(abonnement);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResponse(true, "Abonnement supprimé avec succès.");
    }
}
