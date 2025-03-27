using System.Text.Json.Serialization;

namespace Ecommerce.Core.Entities
{
    public class Account
    {
        public int ID { get; set; }
        public string? FullName { get; set; }
        public string? Avatar { get; set; }
        public string? Address { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Password { get; set; }
        public string? Salt { get; set; }
        public string Role { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        [JsonIgnore]
        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
        public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    }
}
