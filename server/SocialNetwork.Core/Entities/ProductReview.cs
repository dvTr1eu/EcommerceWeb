using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Core.Entities
{
    public class ProductReview
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int AccountId { get; set; }
        public string FullName { get; set; }
        public string ReviewMessage { get; set; }
        public int ReviewNumber { get; set; }
        public DateTime ReviewTime { get; set; }
    }
}
