using Microsoft.AspNetCore.Http;

namespace Ecommerce.Application.DTOs
{
    public class ProductDto
    {
        public string? ProductName { get; set; }
        public string? Description { get; set; }
        public int? Price { get; set; }
        public int? DiscountPrice { get; set; }
        public int CategoryID { get; set; }
        public bool BestSeller { get; set; }
        public bool HomeFlag { get; set; }
        public List<string> Images { get; set; }
        public List<SizeDto> Sizes { get; set; }
    }

    public class SizeDto
    {
        public int ID { get; set; }
        public string? SizeName { get; set; }
        public int? Quantity { get; set; }
    }
}
