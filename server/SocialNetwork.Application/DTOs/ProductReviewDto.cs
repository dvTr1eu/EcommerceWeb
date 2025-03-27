using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Application.DTOs
{
    public class ProductReviewDto
    {
        public int ProductId { get; set; }
        public int AccountId { get; set; }
        public string FullName { get; set; }
        public string ReviewMessage { get; set; }
        public int ReviewNumber { get; set; }
    }
}
