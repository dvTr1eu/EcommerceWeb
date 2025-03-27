using Ecommerce.Application.ServicesInterfaces;
using Ecommerce.Core.Entities;
using Ecommerce.Core.Repositories;

namespace Ecommerce.Infrastructure.Services
{
    public class SizeService(ISizeRepository sizeRepository) : ISizeService
    {
        public async Task<IEnumerable<Size>> GetAll()
        {
            var results = await sizeRepository.GetAll();
            return results;
        }

        public async Task<Size?> FindById(int id)
        {
            var result = await sizeRepository.FindByCondition(s => s.ID == id);
            return result;
        }

        public async Task<Size> Create(Size entity)
        {
            await sizeRepository.Add(entity);
            return entity;
        }

        public async Task<Size> Edit(Size entity, int id)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> Delete(int id)
        {
            var result = await sizeRepository.Delete(id);
            return result;
        }

        public async Task<Size> Edit(Size entity, int id, string sizeName)
        {
            await sizeRepository.Update(entity, id,sizeName);
            return entity;
        }

        public async Task<bool> ReduceQuantity(int quantity, string sizeName, int productId)
        {
            var result = await sizeRepository.ReduceSizeQuantity(productId, sizeName, quantity);
            return result;
        }
    }
}
