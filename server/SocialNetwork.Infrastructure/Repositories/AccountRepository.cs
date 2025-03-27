using System.Linq.Expressions;
using Ecommerce.Core.Entities;
using Ecommerce.Core.Repositories;
using Ecommerce.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Repositories
{
    public class AccountRepository(EcommerceDbContext dbContext) : IAccountRepository
    {
        public async Task<bool> CheckEmail(string email)
        {
            return await dbContext.Accounts.AnyAsync(u => u.Email == email);
        }


        public async Task<bool> CheckRole(string email)
        {
            var accountCheck = await FindByCondition(a => a.Email == email);
            
            return false;
        }

        public async Task<IEnumerable<Account>> GetAll()
        {
            var resutls = await dbContext.Accounts.ToListAsync();
            return resutls;
        }

        public async Task<Account?> FindByCondition(Expression<Func<Account, bool>> condition, string[]? includes = null)
        {
            var dataset = dbContext.Accounts.AsQueryable();
            if (includes != null)
            {
                foreach (var include in includes)
                {
                    dataset = dataset.Include(include);
                }
            }
            return await dataset.FirstOrDefaultAsync(condition);
        }

        public async Task<Account> Add(Account entity)
        {
            try
            {
                await dbContext.Accounts.AddAsync(entity);
                await dbContext.SaveChangesAsync();
                return entity;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<Account> Update(Account entity, int id)
        {
            try
            {
                var existingEntity = await dbContext.Accounts.FindAsync(id);
                if (existingEntity == null)
                {
                    throw new ArgumentException("Entity not found");
                }

                existingEntity.FullName = entity.FullName;
                existingEntity.Phone = entity.Phone;
                existingEntity.Address = entity.Address;
                existingEntity.Password = entity.Password;
                existingEntity.UpdatedAt = DateTime.Now;

                await dbContext.SaveChangesAsync();
                return entity;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }


        public async Task<bool> UpdateAddressShip(string address, int id)
        {
            try
            {
                var existingEntity = await dbContext.Accounts.FindAsync(id);
                if (existingEntity == null)
                {
                    throw new ArgumentException("Entity not found");
                }

                existingEntity.Address = address;
                existingEntity.UpdatedAt = DateTime.Now;

                await dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<bool> ChangePassword(string newPassword, int id)
        {
            try
            {
                var existingEntity = await dbContext.Accounts.FindAsync(id);
                if (existingEntity == null)
                {
                    throw new ArgumentException("Entity not found");
                }

                existingEntity.Password = newPassword;

                await dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<bool> Delete(int id)
        {
            try
            {
                var existingEntity = await dbContext.Accounts.FindAsync(id);
                if (existingEntity == null)
                {
                    throw new ArgumentException("Entity not found");
                }

                dbContext.Accounts.Remove(existingEntity);
                await dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
