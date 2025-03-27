using Ecommerce.Core.Entities;

namespace Ecommerce.Application.ServicesInterfaces
{
    public interface IProductService : IServiceBase<Product, int>
    {
        Task<IEnumerable<Product>> GetByCondition(int? categoryId, string? sortOrder, int pageNumber, int pageSize);
        Task<int> GetTotalCount(int? categoryId);
        Task<IEnumerable<Product>> FindBySearchKey(string searchKey, string? sortOrder, int pageNumber, int pageSize);
        Task UpdateAverageReview(int productId, double  averageReview);
    }
}
