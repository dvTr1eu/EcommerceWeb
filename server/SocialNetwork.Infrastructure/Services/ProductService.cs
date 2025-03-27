using Ecommerce.Application.ServicesInterfaces;
using Ecommerce.Core.Entities;
using Ecommerce.Core.Repositories;
using System.Linq.Expressions;
using Ecommerce.Infrastructure.Helper;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Services
{
    public class ProductService(IProductRepository productRepository) : IProductService
    {
        public async Task<IEnumerable<Product>> GetAll()
        {
            var results = await productRepository.GetAll();
            return results;
        }

        public async Task<Product?> FindById(int id)
        {
            var result = await productRepository.FindByCondition(p => p.ID == id, new []{"Category", "Sizes"});
            return result;
        }
        public async Task<IEnumerable<Product>> GetByCondition(int? categoryId, string? sortOrder, int pageNumber, int pageSize)
        {
            Expression<Func<Product, bool>>? condition = null;
            if (categoryId.HasValue)
            {
                condition = p => p.CategoryID == categoryId.Value;
            }

            var results = await productRepository.GetListByCondition(condition, sortOrder, new[] { "Category", "Sizes" },pageNumber, pageSize);
            return results;
        }

        public async Task<int> GetTotalCount(int? categoryId)
        {
            return await productRepository.GetTotalCount(categoryId);
        }

        public async Task<IEnumerable<Product>> FindBySearchKey(string searchKey, string? sortOrder, int pageNumber, int pageSize)
        {

            var results = await productRepository
                .GetListByCondition(p => EF.Functions.Like(EF.Functions.Collate(p.ProductName, "Latin1_General_CI_AI"), $"%{searchKey.ToLower()}%"),
                    sortOrder, new[] { "Category", "Sizes" }, pageNumber, pageSize);
            return results;
        }

        public async Task UpdateAverageReview(int productId, double averageReview)
        {
            try
            {
                await productRepository.UpdateAverageReview(productId, averageReview);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<Product> Create(Product entity)
        {
            await productRepository.Add(entity);
            return entity;
        }

        public async Task<Product> Edit(Product entity, int id)
        {
            await productRepository.Update(entity, id);
            return entity;
        }

        public async Task<bool> Delete(int id)
        {
            var result = await productRepository.Delete(id);
            return result;
        }

    }
}
