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
    public class OrderRepository(EcommerceDbContext dbContext) : IOrderRepository
    {
        public async Task<IEnumerable<Order>> GetAll()
        {
            var results = await dbContext.Orders
                .AsNoTracking()
                .Include(o => o.OrderDetails)
                .Include(o => o.Customer)
                .Include(o => o.Payment)
                .Include(o => o.TransactionStatus)
                .ToListAsync();
            return results;
        }

        public async Task<Order?> FindByCondition(Expression<Func<Order, bool>> condition, string[]? includes = null)
        {
            var dataset = dbContext.Orders.AsQueryable();
            if (includes != null)
            {
                foreach (var include in includes)
                {
                    dataset = dataset.Include(include);
                }
            }
            return await dataset.FirstOrDefaultAsync(condition);
        }

        public async Task<Order> Add(Order entity)
        {
            try
            {
                await dbContext.Orders.AddAsync(entity);
                await dbContext.SaveChangesAsync();
                return entity;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<Order> Update(Order entity, int id)
        {
            throw new NotImplementedException();
            //try
            //{
            //    var existingOrder = await dbContext.Orders.FindAsync(id);
            //    if (existingOrder == null)
            //    {
            //        throw new ArgumentException("Entity not found");
            //    }

            //    existingOrder.TransactionStatus.Status = entity.TransactionStatus.Status;

            //    await dbContext.SaveChangesAsync();
            //    return entity;
            //}
            //catch (Exception e)
            //{
            //    throw new Exception(e.Message);
            //}
        }

        public async Task<bool> Delete(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Order>> GetOrdersByCustomerId(int customerId)
        {
            var results = await dbContext.Orders
                .Include(o => o.TransactionStatus)
                .Include(o => o.Payment)
                .Include(o => o.OrderDetails)
                .Include(o => o.Customer)
                .Where(o => o.CustomerID == customerId)
                .ToListAsync();
            return results;
        }

        public async Task<bool> UpdateStatusOrder(int statusId, int orderId, bool isPaid, bool isDeleted, bool isHistory)
        {
            try
            {
                var existingOrder = await dbContext.Orders.FirstOrDefaultAsync(o => o.ID == orderId);
                if (existingOrder == null)
                {
                    return false;
                }

                existingOrder.TransactionStatusID = statusId;
                existingOrder.Paid = isPaid;
                existingOrder.Deleted = isDeleted;
                existingOrder.IsHistory = isHistory;
                if (existingOrder.Paid == true)
                {
                    existingOrder.PaymentDate = DateTime.Now;
                }

                if (existingOrder.TransactionStatusID == 5)
                {
                    existingOrder.Deleted = true;
                }
                if (existingOrder.TransactionStatusID == 4)
                {
                    existingOrder.ShipDate = DateTime.Now;
                }
                await dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<IEnumerable<Order>> GetListByCondition(Expression<Func<Order, bool>> condition, string[]? includes = null)
        {
            var dataset = dbContext.Orders.AsNoTracking().AsQueryable();
            if (includes != null)
            {
                foreach (var include in includes)
                {
                    dataset = dataset.Include(include);
                }
            }

            return await dataset.Where(condition).ToListAsync();
        }
    }
}
