using Ecommerce.Core.Entities;
using System.Linq.Expressions;

namespace Ecommerce.Core.Repositories
{
    public interface IRepositoryBase<T, TId> where T : class
    {
        public Task<IEnumerable<T>> GetAll();
        public Task<T?> FindByCondition(Expression<Func<T, bool>> condition, string[]? includes = null);
        public Task<T> Add(T entity);
        public Task<T> Update(T entity, TId id);
        public Task<bool> Delete(TId id);

    }
}
