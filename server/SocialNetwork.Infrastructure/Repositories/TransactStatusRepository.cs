using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecommerce.Core.Entities;
using Ecommerce.Core.Repositories;
using Ecommerce.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Repositories
{
    public class TransactStatusRepository(EcommerceDbContext dbContext) : ITransactStatusRepository
    {
        public async Task<IEnumerable<TransactionStatus>> GetAllStatus()
        {
            var results = await dbContext.TransactionStatus.ToListAsync();
            return results;
        }
    }
}
