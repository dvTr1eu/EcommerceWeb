using System.Text.Json.Serialization;

namespace Ecommerce.Core.Entities
{
    public class Payment
    {
        public int ID { get; set; }

        public string? PaymentName { get; set; }
        [JsonIgnore]
        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
