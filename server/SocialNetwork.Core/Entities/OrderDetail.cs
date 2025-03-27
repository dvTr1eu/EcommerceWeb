namespace Ecommerce.Core.Entities
{
    public class OrderDetail
    {
        public int ID { get; set; }

        public int OrderID { get; set; }

        public int ProductID { get; set; }

        public int? OrderNumber { get; set; }

        public int? Quantity { get; set; }

        public int? DiscountCoupon { get; set; }

        public string? ImageUrl { get; set; }

        public int? Total { get; set; }

        public string? SizeName { get; set; }

        public DateTime? ShipDate { get; set; }

        public virtual Order Order { get; set; } = null!;

        public virtual Product Product { get; set; } = null!;
    }
}
