using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Ecommerce.Core.Entities;

namespace Ecommerce.Core.Repositories
{
    public interface IProductReviewRepository : IRepositoryBase<ProductReview, int>
    {
        Task<IEnumerable<ProductReview>> GetListByCondition(Expression<Func<ProductReview, bool>>? condition,
            string[] includes = null);
    }
}
