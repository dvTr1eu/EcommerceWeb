using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Ecommerce.Core.Entities;

namespace Ecommerce.Core.Repositories
{
    public interface IOrderRepository : IRepositoryBase<Order, int>
    {
        Task<IEnumerable<Order>> GetOrdersByCustomerId(int customerId);
        Task<bool> UpdateStatusOrder(int statusId, int orderId, bool isPaid, bool isDeleted, bool isHistory);
        Task<IEnumerable<Order>> GetListByCondition(Expression<Func<Order, bool>> condition, string[]? includes = null);
    }
}
