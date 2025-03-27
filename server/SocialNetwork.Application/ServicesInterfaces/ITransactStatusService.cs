using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ecommerce.Core.Entities;

namespace Ecommerce.Application.ServicesInterfaces
{
    public interface ITransactStatusService
    {
        Task<IEnumerable<TransactionStatus>> GetTransactStatus();
    }
}