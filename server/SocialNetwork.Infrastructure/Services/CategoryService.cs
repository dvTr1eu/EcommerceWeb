using Ecommerce.Application.ServicesInterfaces;
using Ecommerce.Core.Entities;
using Ecommerce.Core.Repositories;

namespace Ecommerce.Infrastructure.Services
{
    public class CategoryService(ICategoryRepository categoryRepository) : ICategoryService
    {
        public async Task<IEnumerable<Category>> GetAll()
        {
            var results = await categoryRepository.GetAll();
            return results;
        }

        public async Task<Category?> FindById(int id)
        {
            var result = await categoryRepository.FindByCondition(p => p.ID == id);
            return result;
        }

        public async Task<Category> Create(Category entity)
        {
            await categoryRepository.Add(entity);
            return entity;
        }

        public async Task<Category> Edit(Category entity, int id)
        {
            await categoryRepository.Update(entity, id);
            return entity;
        }

        public async Task<bool> Delete(int id)
        {
            var result = await categoryRepository.Delete(id);
            return result;
        }
    }
}
