using System.Text.Json.Serialization;

namespace Ecommerce.Core.Entities
{
    public class TransactionStatus
    {
        public int ID { get; set; }

        public string? Status { get; set; }

        public string? Description { get; set; }
        [JsonIgnore]
        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
