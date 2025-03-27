using Ecommerce.Core.Entities;
using System.Security.Cryptography;

namespace Ecommerce.Application.ServicesInterfaces
{
    public interface ISizeService : IServiceBase<Size,int>
    {
        Task<Size> Edit(Size entity, int id, string sizeName);
        Task<bool> ReduceQuantity(int quantity, string sizeName, int productId);
    }
}
