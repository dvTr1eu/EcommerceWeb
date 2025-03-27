namespace Ecommerce.Core.Entities
{
    public class Size
    {
        public int ID { get; set; }
        public int ProductID { get; set; }
        public string? SizeName { get; set; }
        public int? Quantity { get; set; }
        public virtual Product Product { get; set; } = null!;
        public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    }
}
