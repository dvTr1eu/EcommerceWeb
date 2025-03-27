using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecommerce.Core.Entities;

namespace Ecommerce.Core.Repositories
{
    public interface IOrderDetailsRepository : IRepositoryBase<OrderDetail, int>
    {
        Task<IList<OrderDetail>> GetOrderDetailsByOrderId(int orderId);
    }
}
