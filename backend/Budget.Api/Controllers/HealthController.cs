using Microsoft.AspNetCore.Mvc;

namespace Budget.Api.Controllers;

public class HealthController : BaseController
{
    [HttpGet("/health")]
    public IActionResult Health()
    {
        return Ok(new { status = "healthy", timestamp = DateTime.UtcNow });
    }
}
