using Ecommerce.Core.Entities;
using System.Security.Cryptography;

namespace Ecommerce.Core.Repositories
{
    public interface ISizeRepository : IRepositoryBase<Size, int>
    {
        Task<Size> Update(Size entity, int id, string sizeName);
        Task<bool> ReduceSizeQuantity(int productId, string sizeName, int quantity);
    }
}
