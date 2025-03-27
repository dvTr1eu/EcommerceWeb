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
    public class AccountService(IAccountRepository accountRepository) : IAccountService
    {
        public async Task<IEnumerable<Account>> GetAll()
        {
            var results = await accountRepository.GetAll();
            return results;
        }

        public async Task<Account?> FindById(int id)
        {
            var result = await accountRepository.FindByCondition(p => p.ID == id);
            return result;
        }

        public async Task<Account> Create(Account entity)
        {
            await accountRepository.Add(entity);
            return entity;
        }

        public async Task<Account> Edit(Account entity, int id)
        {
            await accountRepository.Update(entity, id);
            return entity;
        }

        public async Task<bool> Delete(int id)
        {
            var result = await accountRepository.Delete(id);
            return result;
        }

        public async Task<bool> UpdateAddressShip(string address, int id)
        {
            var result = await accountRepository.UpdateAddressShip(address,id);
            return result;
        }

        public async Task<bool> ChangePassword(string newPassword,string oldPassword, int id)
        {
            var account = await accountRepository.FindByCondition(a => a.ID == id);
            if (!VerifyPassword(oldPassword, account.Password))
            {
                return false;
            }

            var passwordHashed = HashPassword(newPassword);
            var result = await accountRepository.ChangePassword(passwordHashed, id);
            return result;
        }

        private bool VerifyPassword(string password, string? hashedPassword)
        {
            bool isValidPassword = BCrypt.Net.BCrypt.Verify(password, hashedPassword);
            return isValidPassword;
        }

        private string HashPassword(string password)
        {
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(password);
            return passwordHash;
        }
    }
}
