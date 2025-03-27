using Ecommerce.Core.Entities;

namespace Ecommerce.Core.Repositories
{
    public interface IAccountRepository : IRepositoryBase<Account, int>
    {
        Task<bool> CheckRole(string email);
        Task<bool> CheckEmail(string email);
        Task<bool> UpdateAddressShip(string address, int id);
        Task<bool> ChangePassword(string newPassword, int id);
    }
}
