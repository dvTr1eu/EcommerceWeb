using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecommerce.Core.Entities;

namespace Ecommerce.Application.ServicesInterfaces
{
    public interface IAccountService : IServiceBase<Account, int>
    {
        Task<bool> UpdateAddressShip(string address, int id);
        Task<bool> ChangePassword(string newPassword,string oldPassword, int id);

    }
}
