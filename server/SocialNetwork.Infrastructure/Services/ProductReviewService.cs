using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecommerce.Application.ServicesInterfaces;
using Ecommerce.Core.Entities;
using Ecommerce.Core.Repositories;

namespace Ecommerce.Infrastructure.Services
{
    public class ProductReviewService(IProductReviewRepository productReviewRepository) : IProductReviewService
    {
        public async Task<IEnumerable<ProductReview>> GetAll()
        {
            try
            {
                var resutls = await productReviewRepository.GetAll();
                return resutls;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<ProductReview?> FindById(int id)
        {
            try
            {
                var result = await productReviewRepository.FindByCondition(pr => pr.Id == id);
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<ProductReview> Create(ProductReview entity)
        {
            try
            {
                await productReviewRepository.Add(entity);
                return entity;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<ProductReview> Edit(ProductReview entity, int id)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> Delete(int id)
        {
            try
            {
                await productReviewRepository.Delete(id);
                return true;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<IEnumerable<ProductReview>> GetProductReviews(int productId)
        {
            try
            {
                var results = await productReviewRepository.GetListByCondition(pr => pr.ProductId == productId);
                return results;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public Task<ProductReview> GetReviewByUserAndProduct(int accountId, int productId)
        {
            try
            {
                var result =
                    productReviewRepository.FindByCondition(
                        pr => pr.AccountId == accountId && pr.ProductId == productId);
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}
