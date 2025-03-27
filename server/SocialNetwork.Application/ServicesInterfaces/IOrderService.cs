using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecommerce.Core.Entities;

namespace Ecommerce.Application.ServicesInterfaces
{
    public interface IOrderService : IServiceBase<Order,int>
    {
        Task<IEnumerable<Order>> GetOrdersByCustomerId(int customerId);
        Task<Order> GetOrderByUserAndProduct(int accountId, int productId);
        Task<bool> UpdateStatusOrder(int statusId, int orderId, bool isPaid, bool isDeleted, bool isHistory);
        Task<IEnumerable<Order>> GetAllOrderSuccessInDay(DateTime dateNow);
        Task<IEnumerable<Order>> GetAllOrderDeleteInDay(DateTime dateNow);
        Task<IEnumerable<Order>> GetAllOrderProcessInDay(DateTime dateNow);
    }
}
