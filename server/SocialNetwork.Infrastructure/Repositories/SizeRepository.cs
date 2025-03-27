using System.Linq.Expressions;
using Ecommerce.Core.Entities;
using Ecommerce.Core.Repositories;
using Ecommerce.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Repositories
{
    public class SizeRepository(EcommerceDbContext dbContext) : ISizeRepository
    {
        public async Task<IEnumerable<Size>> GetAll()
        {
            var results = await dbContext.Sizes.ToListAsync();
            return results;
        }

        public async Task<Size?> FindByCondition(Expression<Func<Size, bool>> condition, string[]? includes = null)
        {
            var dataset = dbContext.Sizes.AsQueryable();
            if (includes != null)
            {
                foreach (var include in includes)
                {
                    dataset = dataset.Include(include);
                }
            }

            return await dbContext.Sizes.FirstOrDefaultAsync(condition);
        }

        public async Task<Size> Add(Size entity)
        {
            try
            {
                await dbContext.Sizes.AddAsync(entity);
                await dbContext.SaveChangesAsync();
                return entity;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public Task<Size> Update(Size entity, int id)
        {
            throw new NotImplementedException();
        }

        public async Task<Size> Update(Size entity, int productId, string sizeName)
        {
            try
            {
                var existingEntity = await dbContext.Sizes.FirstOrDefaultAsync(s => s.ProductID == productId && s.SizeName == sizeName);
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

        public async Task<bool> ReduceSizeQuantity(int productId, string sizeName, int quantity)
        {
            try
            {
                var existingSize = await dbContext.Sizes
                    .FirstOrDefaultAsync(s => s.ProductID == productId && s.SizeName == sizeName);

                if (existingSize == null)
                {
                    throw new ArgumentException("Size không tồn tại.");
                }

                if (existingSize.Quantity < quantity)
                {
                    throw new InvalidOperationException("Không đủ hàng trong kho.");
                }

                existingSize.Quantity -= quantity;
                await dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public Task<bool> Delete(int id)
        {
            throw new Exception();
        }
    }
}
