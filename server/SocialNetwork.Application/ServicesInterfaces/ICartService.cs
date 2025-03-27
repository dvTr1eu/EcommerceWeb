using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecommerce.Core.Entities;

namespace Ecommerce.Application.ServicesInterfaces
{
    public interface ICartService : IServiceBase<CartItem, int>
    {
        public Task<IList<CartItem>> GetCartByCustomerId(int customerId);
        public Task<bool> RemoveAllCartItemOfCustomer(int customerId);
    }
}
