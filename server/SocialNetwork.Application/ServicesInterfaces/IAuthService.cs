using Ecommerce.Core.Entities;

namespace Ecommerce.Application.ServicesInterfaces
{
    public interface IAuthService
    {
        Task<Account?> FindByEmail(string email);
        Task<bool> RegisterAsync(Account model);
        Task<(Account?, string? token, string? error)> LoginAsync(string email, string password);
    }
}
