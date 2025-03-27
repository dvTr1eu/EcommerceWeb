using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Application.DTOs
{
    public class BuyProductDto
    {
        public int CustomerId { get; set; }
        public string FullName { get; set; }
        public string Address { get; set; }
        public int TotalMoney { get; set; }
        public string PaymentMethod { get; set; }
        public string? Note { get; set; }
    }
}
