using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Ecommerce.Core.Entities;
using Ecommerce.Core.Repositories;
using Ecommerce.Infrastructure.Persistence;
using FluentValidation.Results;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Repositories
{
    public class ProductReviewRepository(EcommerceDbContext dbContext) : IProductReviewRepository
    {
        public async Task<IEnumerable<ProductReview>> GetAll()
        {
            var results = await dbContext.ProductReviews.ToListAsync();
            return results;
        }

        public async Task<ProductReview?> FindByCondition(Expression<Func<ProductReview, bool>> condition, string[]? includes = null)
        {
            var dataset = dbContext.ProductReviews.AsQueryable();
            if (includes != null)
            {
                foreach (var include in includes)
                {
                    dataset = dataset.Include(include);
                }
            }

            return await dbContext.ProductReviews.FirstOrDefaultAsync(condition);
        }

        public async Task<ProductReview> Add(ProductReview entity)
        {
            await dbContext.ProductReviews.AddAsync(entity);
            await dbContext.SaveChangesAsync();
            return entity;
        }

        public async Task<ProductReview> Update(ProductReview entity, int id)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> Delete(int id)
        {
            var existingEntity = await dbContext.ProductReviews.FindAsync(id);
            if (existingEntity != null)
            {
                dbContext.RemoveRange(existingEntity);
                await dbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<IEnumerable<ProductReview>> GetListByCondition(Expression<Func<ProductReview, bool>>? condition, string[] includes = null)
        {
            var dataset = dbContext.ProductReviews.AsQueryable();
            if (includes != null)
            {
                foreach (var include in includes)
                {
                    dataset = dataset.Include(include);
                }
            }

            return await dbContext.ProductReviews.Where(condition).ToListAsync();
        }
    }
}
