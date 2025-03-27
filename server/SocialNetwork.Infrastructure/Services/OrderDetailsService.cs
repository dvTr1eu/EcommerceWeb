using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecommerce.Application.ServicesInterfaces;
using Ecommerce.Core.Entities;
using Ecommerce.Core.Repositories;
using Ecommerce.Infrastructure.Repositories;

namespace Ecommerce.Infrastructure.Services
{
    public class OrderDetailsService(IOrderDetailsRepository orderDetailsRepository) : IOrderDetailsService
    {
        public async Task<IEnumerable<OrderDetail>> GetAll()
        {
            var results = await orderDetailsRepository.GetAll();
            return results;
        }

        public async Task<OrderDetail?> FindById(int id)
        {
            var result = await orderDetailsRepository.FindByCondition(od => od.ID == id, new []{"Product"});
            return result;
        }

        public async Task<IList<OrderDetail>> GetOrderDetailsByOrderId(int orderId)
        {
            var results = await orderDetailsRepository.GetOrderDetailsByOrderId(orderId);
            return results;
        }

        public async Task<OrderDetail> Create(OrderDetail entity)
        {
            await orderDetailsRepository.Add(entity);
            return entity;
        }

        public async Task<OrderDetail> Edit(OrderDetail entity, int id)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> Delete(int id)
        {
            throw new NotImplementedException();
        }

    }
}
