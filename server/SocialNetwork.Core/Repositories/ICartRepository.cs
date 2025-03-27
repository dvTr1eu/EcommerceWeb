using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecommerce.Core.Entities;

namespace Ecommerce.Core.Repositories
{
    public interface ICartRepository : IRepositoryBase<CartItem, int>
    {
        public Task<IList<CartItem>> GetCartByCustomerId(int customerId);
        public Task<bool> RemoveAllItemInCartOfCustomer(int customerId);
    }
}
