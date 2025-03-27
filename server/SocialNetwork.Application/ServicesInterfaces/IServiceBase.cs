namespace Ecommerce.Application.ServicesInterfaces
{
    public interface IServiceBase<T, TId> where T : class
    {
        public Task<IEnumerable<T>> GetAll();
        public Task<T?> FindById(int id);
        public Task<T> Create(T entity);
        public Task<T> Edit(T entity, TId id);
        public Task<bool> Delete(TId id);
    }
}
