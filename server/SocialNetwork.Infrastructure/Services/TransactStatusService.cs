using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ecommerce.Application.ServicesInterfaces;
using Ecommerce.Core.Entities;
using Ecommerce.Core.Repositories;

namespace Ecommerce.Infrastructure.Services
{
    public class TransactStatusService(ITransactStatusRepository transactStatusRepository) : ITransactStatusService
    {
        public async Task<IEnumerable<TransactionStatus>> GetTransactStatus()
        {
            var results = await transactStatusRepository.GetAllStatus();
            return results;
        }
    }
}