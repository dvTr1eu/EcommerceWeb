using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecommerce.Core.Entities;

namespace Ecommerce.Application.ServicesInterfaces
{
    public interface IOrderDetailsService : IServiceBase<OrderDetail, int>
    {
        Task<IList<OrderDetail>> GetOrderDetailsByOrderId(int customerId);

    }
}
