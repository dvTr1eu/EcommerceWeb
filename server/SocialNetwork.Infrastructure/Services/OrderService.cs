using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.JavaScript;
using System.Text;
using System.Threading.Tasks;
using Ecommerce.Application.ServicesInterfaces;
using Ecommerce.Core.Entities;
using Ecommerce.Core.Repositories;
using Ecommerce.Infrastructure.Repositories;

namespace Ecommerce.Infrastructure.Services
{
    public class OrderService(IOrderRepository orderRepository) : IOrderService
    {
        private IOrderService _orderServiceImplementation;

        public async Task<IEnumerable<Order>> GetAll()
        {
            var resulst =  await orderRepository.GetAll();
            return resulst;
        }

        public async Task<Order?> FindById(int id)
        {
            var result = await orderRepository.FindByCondition(p => p.ID == id, new []{"OrderDetails", "Customer", "TransactionStatus", "Payment"});
            return result;
        }

        public async Task<Order> Create(Order entity)
        {
            await orderRepository.Add(entity);
            return entity;
        }

        public async Task<Order> Edit(Order entity, int id)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> Delete(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Order>> GetOrdersByCustomerId(int customerId)
        {
            var results = await orderRepository.GetOrdersByCustomerId(customerId);
            return results;
        }

        public async Task<Order> GetOrderByUserAndProduct(int accountId, int productId)
        {
            try
            {
                var result = await orderRepository
                    .FindByCondition(o => o.CustomerID == accountId 
                                          && o.OrderDetails.Any(od => od.ProductID == productId), new []{"OrderDetails", "Customer", "TransactionStatus", "Payment" });
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<bool> UpdateStatusOrder(int statusId, int orderId, bool isPaid, bool isDeleted,bool isHistory)
        {
            var result = await orderRepository.UpdateStatusOrder(statusId, orderId, isPaid, isDeleted, isHistory);
            return result;
        }

        public async Task<IEnumerable<Order>> GetAllOrderSuccessInDay(DateTime dateNow)
        {
            var result = await orderRepository.GetListByCondition(o => o.OrderDate.HasValue && o.OrderDate.Value.Date == dateNow.Date && o.Paid == true,
                new[] { "OrderDetails.Product", "Customer", "TransactionStatus", "Payment" });
            return result;
        }

        public async Task<IEnumerable<Order>> GetAllOrderDeleteInDay(DateTime dateNow)
        {
            var result = await orderRepository.GetListByCondition(o => o.OrderDate.HasValue && o.OrderDate.Value.Date == dateNow.Date && o.Deleted == true,
                new[] { "OrderDetails.Product", "Customer", "TransactionStatus", "Payment" });
            return result;
        }

        public async Task<IEnumerable<Order>> GetAllOrderProcessInDay(DateTime dateNow)
        {
            var result = await orderRepository.GetListByCondition(o => o.OrderDate.HasValue && o.OrderDate.Value.Date == dateNow.Date && o.TransactionStatus.ID == 1,
                new[] { "OrderDetails.Product", "Customer", "TransactionStatus", "Payment" });
            return result;
        }
    }
}
