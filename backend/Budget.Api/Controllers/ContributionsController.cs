using Budget.Application.DTOs.Contributions;
using Budget.Application.Interfaces.Services;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace Budget.Api.Controllers;

public class ContributionsController : BaseController
{
    private readonly IContributionService _contributionService;
    private readonly IValidator<CreateContributionDto> _createValidator;

    public ContributionsController(
        IContributionService contributionService,
        IValidator<CreateContributionDto> createValidator)
    {
        _contributionService = contributionService;
        _createValidator = createValidator;
    }

    [HttpGet("objectif/{objectifId}")]
    public async Task<IActionResult> GetByObjectifId(Guid objectifId)
    {
        var result = await _contributionService.GetByObjectifIdAsync(objectifId);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _contributionService.GetByIdAsync(id);
        if (!result.Success)
        {
            return NotFound(result);
        }
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateContributionDto createDto)
    {
        var validationResult = await _createValidator.ValidateAsync(createDto);
        if (!validationResult.IsValid)
        {
            return BadRequest(validationResult.Errors);
        }

        var result = await _contributionService.CreateAsync(createDto);
        if (!result.Success)
        {
            return BadRequest(result);
        }
        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _contributionService.DeleteAsync(id);
        if (!result.Success)
        {
            return NotFound(result);
        }
        return Ok(result);
    }
}
