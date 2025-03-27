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
    public class CartRepository(EcommerceDbContext dbContext) : ICartRepository
    {
        public async Task<IEnumerable<CartItem>> GetAll()
        {
            var results = await dbContext.CartItems
                .Include(ct => ct.Size)
                .Include(ct => ct.Product)
                .ToListAsync();
            return results;
        }


        public async Task<IList<CartItem>> GetCartByCustomerId(int customerId)
        {
            var results = await dbContext.CartItems
                .Include(ct => ct.Size)
                .Include(ct => ct.Product)
                .Where(ci => ci.CustomerID == customerId)
                .ToListAsync();
            return results;
        }

        public async Task<bool> RemoveAllItemInCartOfCustomer(int customerId)
        {
            try
            {
                var allCartItems = await dbContext.CartItems
                    .Where(c => c.CustomerID == customerId)
                    .ToListAsync();

                if (allCartItems.Any())
                {
                    dbContext.CartItems.RemoveRange(allCartItems); 
                    await dbContext.SaveChangesAsync(); 
                }

                return true; 
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<CartItem?> FindByCondition(Expression<Func<CartItem, bool>> condition, string[]? includes = null)
        {
            var dataset = dbContext.CartItems.AsQueryable();
            if (includes != null)
            {
                foreach (var include in includes)
                {
                    dataset = dataset.Include(include);
                }
            }
            return await dataset.FirstOrDefaultAsync(condition);
        }

        public async Task<CartItem> Add(CartItem entity)
        {
            try
            {
                await dbContext.CartItems.AddAsync(entity);
                await dbContext.SaveChangesAsync();
                return entity;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<CartItem> Update(CartItem entity, int id)
        {
            try
            {
                var existingEntity = await dbContext.CartItems.FindAsync(id);
                if (existingEntity == null)
                {
                    throw new ArgumentException("Entity not found");
                }

                existingEntity.Quantity = entity.Quantity;

                await dbContext.SaveChangesAsync();
                return entity;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<bool> Delete(int id)
        {
            try
            {
                var existingEntity = await dbContext.CartItems.FindAsync(id);
                if (existingEntity == null)
                {
                    throw new ArgumentException("Entity not found");
                }
                dbContext.CartItems.Remove(existingEntity);
                await dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

    }
}
