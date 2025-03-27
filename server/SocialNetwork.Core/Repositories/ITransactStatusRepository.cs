using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecommerce.Core.Entities;

namespace Ecommerce.Core.Repositories
{
    public interface ITransactStatusRepository
    {
        Task<IEnumerable<TransactionStatus>> GetAllStatus();
    }
}
