using Ecommerce.Core.Entities;
using System.Linq.Expressions;

namespace Ecommerce.Core.Repositories
{
    public interface IProductRepository : IRepositoryBase<Product, int>
    {
        Task<IEnumerable<Product>> GetListByCondition(Expression<Func<Product, bool>>? condition, string? sortOrder, string[]? includes = null, int pageNumber = 1, int pageSize = 12);
        Task<int> GetTotalCount(int? categoryId);
        Task UpdateAverageReview(int productId, double? averageReview);
    }
}
