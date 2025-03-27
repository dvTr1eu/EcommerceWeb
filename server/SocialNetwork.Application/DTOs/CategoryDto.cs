namespace Ecommerce.Application.DTOs
{
    public class CategoryDto
    {
        public string? CategoryName { get; set; }
        public int? ParentID { get; set; } = null;
        public int? OrderNumber { get; set; }
        public bool Published { get; set; }
    }
}
