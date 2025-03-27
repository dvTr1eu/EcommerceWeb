using System.Globalization;
using System.Linq.Expressions;
using System.Text;
using CloudinaryDotNet;
using Ecommerce.Core.Entities;
using Ecommerce.Core.Repositories;
using Ecommerce.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Ecommerce.Infrastructure.Repositories
{
    public class ProductRepository(EcommerceDbContext dbContext) : IProductRepository
    {

        public async Task<IEnumerable<Product>> GetListByCondition(Expression<Func<Product, bool>>? condition,string? sortOrder, string[]? includes = null, int pageNumber = 1, int pageSize = 12)
        {
            var dataset = dbContext.Products.AsQueryable();
            if (includes != null)
            {
                foreach (var include in includes)
                {
                    dataset = dataset.Include(include);
                }
            }

            if (condition != null)
            {
                dataset = dataset.Where(condition);
            }

            switch (sortOrder)
            {
                case "lowToHigh":
                    dataset = dataset.OrderBy(p => p.Price);
                    break;
                case "highToLow":
                    dataset = dataset.OrderByDescending(p => p.Price);
                    break;
                case "default":
                    break;
            }
            dataset = dataset.Skip((pageNumber - 1) * pageSize).Take(pageSize);
            return await dataset.ToListAsync();
        }

        public async Task<int> GetTotalCount(int? categoryId)
        {
            var query = dbContext.Products.AsQueryable();
            if (categoryId.HasValue)
            {
                query = query.Where(p => p.CategoryID == categoryId.Value);
            }
            return await query.CountAsync();
        }

        public async Task UpdateAverageReview(int productId, double? averageReview)
        {
            var updateProduct = await dbContext.Products.FindAsync(productId);
            if (updateProduct != null)
            {
                updateProduct.AverageReview = averageReview;
                await dbContext.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Product>> GetAll()
        {
            var results = await dbContext.Products
                .Include(p => p.Sizes)
                .Include(p => p.Category)
                .ToListAsync();
            return results;
        }

        public async Task<Product?> FindByCondition(Expression<Func<Product, bool>> condition, string[]? includes = null)
        {
            var dataset = dbContext.Products.AsQueryable();
            if (includes != null)
            {
                foreach (var include in includes)
                {
                    dataset = dataset.Include(include);
                }
            }
            return await dataset.FirstOrDefaultAsync(condition);
        }

        public async Task<Product> Add(Product entity)
        {
            try
            {
                await dbContext.Products.AddAsync(entity);
                await dbContext.SaveChangesAsync();
                return entity;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<Product> Update(Product entity, int id)
        {
            try
            {
                var existingEntity = await dbContext.Products.FindAsync(id);
                if (existingEntity == null)
                {
                    throw new ArgumentException("Entity not found");
                }

                existingEntity.ProductName = entity.ProductName;
                existingEntity.Description = entity.Description;
                existingEntity.Price = entity.Price;
                existingEntity.BestSeller = entity.BestSeller;
                existingEntity.HomeFlag = entity.HomeFlag;
                existingEntity.UpdatedAt = entity.UpdatedAt;
                existingEntity.DiscountPrice = entity.DiscountPrice;
                existingEntity.CategoryID = entity.CategoryID;

                if (entity.ImageUrl1 != null && entity.ImageUrl2 != null)
                {
                    existingEntity.ImageUrl1 = entity.ImageUrl1;
                    existingEntity.ImageUrl2 = entity.ImageUrl2;
                }

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
                var existingEntity = await dbContext.Products.FindAsync(id);
                if (existingEntity == null)
                {
                    throw new ArgumentException("Entity not found");
                }
                var existingSize = await dbContext.Sizes.Where(s => s.ProductID == id).ToListAsync();

                dbContext.RemoveRange(existingSize);
                dbContext.Products.Remove(existingEntity);
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
