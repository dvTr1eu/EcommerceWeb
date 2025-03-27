using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Application.DTOs
{
    public class CartItemDto
    {
        public int CustomerID { get; set; }
        public int ProductID { get; set; }
        public int Quantity { get; set; }
        public string ImageUrl { get; set; }
        public int SizeId { get; set; }
        public string SizeName { get; set; }
    }
}
