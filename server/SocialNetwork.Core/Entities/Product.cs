using System.Text.Json.Serialization;

namespace Ecommerce.Core.Entities
{
    public class Product
    {
        public int ID { get; set; }
        public string? ProductName { get; set; }
        public string? Description { get; set; }
        public int? Price { get; set; }
        public int? DiscountPrice { get; set; }
        public int CategoryID { get; set; }
        public bool BestSeller { get; set; }
        public bool HomeFlag { get; set; }
        public string? ImageUrl1 { get; set; }
        public string? ImageUrl2 { get; set; }
        public double? AverageReview { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        //[JsonIgnore]
        public virtual Category? Category { get; set; } = null!;
        public virtual ICollection<Size> Sizes { get; set; } = new List<Size>();
        public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
        public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    }
}
