namespace Budget.Application.DTOs.Categories;

public class CategorieDto
{
    public Guid Id { get; set; }
    public string Nom { get; set; } = string.Empty;
    public bool EstActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
