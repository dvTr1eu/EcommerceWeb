using System.Linq.Expressions;
using Ecommerce.Core.Entities;
using Ecommerce.Core.Repositories;
using Ecommerce.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Repositories
{
    public class CategoryRepository(EcommerceDbContext dbContext) : ICategoryRepository
    {
        public async Task<IEnumerable<Category>> GetAll()
        {
            var resutls = await dbContext.Categories.ToListAsync();
            return resutls;
        }

        public async Task<Category?> FindByCondition(Expression<Func<Category, bool>> condition, string[]? includes = null)
        {
            var dataset = dbContext.Categories.AsQueryable();
            if (includes != null)
            {
                foreach (var include in includes)
                {
                    dataset = dataset.Include(include);
                }
            }

            return await dataset.FirstOrDefaultAsync(condition);
        }

        public async Task<Category> Add(Category entity)
        {
            try
            {
                await dbContext.Categories.AddAsync(entity);
                await dbContext.SaveChangesAsync();
                return entity;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<Category> Update(Category entity, int id)
        {
            try
            {
                var existingEntity = await dbContext.Categories.FindAsync(id);
                if (existingEntity == null)
                {
                    throw new ArgumentException("Entity not found");
                }

                existingEntity.CategoryName = entity.CategoryName;
                existingEntity.Published = entity.Published;
                existingEntity.OrderNumber = entity.OrderNumber;
                existingEntity.ParentID = entity.ParentID;

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
                var existingEntity = await dbContext.Categories.FindAsync(id);
                if (existingEntity == null)
                {
                    throw new ArgumentException("Entity not found");
                }

                dbContext.Categories.Remove(existingEntity);
                await dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }
    }
}
