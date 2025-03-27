using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Ecommerce.Core.Entities;
using Ecommerce.Core.Repositories;
using Ecommerce.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Repositories
{
    public class OrderDetailsRepository(EcommerceDbContext dbContext) : IOrderDetailsRepository
    {
        public async Task<IEnumerable<OrderDetail>> GetAll()
        {
            var results = await dbContext.OrderDetails
                .Include(od => od.Order)
                .Include(od => od.Product)
                .ToListAsync();
            return results;
        }

        public async Task<OrderDetail?> FindByCondition(Expression<Func<OrderDetail, bool>> condition, string[]? includes = null)
        {
            var dataset = dbContext.OrderDetails.AsQueryable();
            if (includes != null)
            {
                foreach (var include in includes)
                {
                    dataset = dataset.Include(include);
                }
            }

            return await dataset.FirstOrDefaultAsync(condition);
        }

        public async Task<IList<OrderDetail>> GetOrderDetailsByOrderId(int orderId)
        {
            var results = await dbContext.OrderDetails
                .AsNoTracking()
                .Include(od => od.Product)
                .Where(od => od.OrderID == orderId)
                .ToListAsync();
            return results;
        }

        public async Task<OrderDetail> Add(OrderDetail entity)
        {
            try
            {
                await dbContext.OrderDetails.AddAsync(entity);
                await dbContext.SaveChangesAsync();
                return entity;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<OrderDetail> Update(OrderDetail entity, int id)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> Delete(int id)
        {
            throw new NotImplementedException();
        }

    }
}
