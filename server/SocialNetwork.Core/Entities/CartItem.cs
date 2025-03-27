using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Ecommerce.Core.Entities
{
    public class CartItem
    {
        public int ID { get; set; }
        public int CustomerID { get; set; }
        public int ProductID { get; set; }
        public int Quantity { get; set; }
        public string ImageUrl { get; set; }
        public int SizeId { get; set; }
        public string SizeName { get; set; } 

        [JsonIgnore]
        public virtual Account Customer { get; set; }
        [JsonIgnore]
        public virtual Product Product { get; set; }
        [JsonIgnore]
        public virtual Size Size { get; set; }
    }
}
