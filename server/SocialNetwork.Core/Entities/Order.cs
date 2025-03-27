using System.Text.Json.Serialization;

namespace Ecommerce.Core.Entities
{
    public class Order
    {
        public int ID { get; set; }
        public int CustomerID { get; set; }
        public DateTime? OrderDate { get; set; }
        public DateTime? ShipDate { get; set; }
        public int TransactionStatusID { get; set; }
        public bool? Deleted { get; set; }
        public bool? Paid { get; set; }
        public DateTime? PaymentDate { get; set; }
        public int PaymentID { get; set; }
        public int? TotalMoney { get; set; }
        public bool? IsHistory { get; set; }
        public string? Note { get; set; }
        public virtual Account Customer { get; set; } = null!;
        [JsonIgnore]
        public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
        public virtual Payment Payment { get; set; } = null!;
        public virtual TransactionStatus TransactionStatus { get; set; } = null!;
    }
}
