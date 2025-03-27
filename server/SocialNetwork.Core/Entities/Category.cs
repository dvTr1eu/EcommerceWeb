using System.Text.Json.Serialization;

namespace Ecommerce.Core.Entities
{
    public class Category
    {
        public int ID { get; set; }
        public string? CategoryName { get; set; }
        public int? ParentID { get; set; } = null;
        public int? OrderNumber { get; set; }
        public bool Published { get; set; }
        [JsonIgnore]
        public virtual ICollection<Product> Products { get; set; } = new List<Product>();

    }
}
