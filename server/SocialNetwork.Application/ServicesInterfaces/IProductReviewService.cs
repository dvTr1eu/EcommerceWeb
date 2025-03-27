using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecommerce.Core.Entities;

namespace Ecommerce.Application.ServicesInterfaces
{
    public interface IProductReviewService : IServiceBase<ProductReview, int>
    {
        Task<IEnumerable<ProductReview>> GetProductReviews(int productId);
        Task<ProductReview> GetReviewByUserAndProduct(int accountId, int productId);
    }
}
