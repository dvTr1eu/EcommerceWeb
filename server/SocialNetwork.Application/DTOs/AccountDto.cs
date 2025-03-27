using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Application.DTOs
{
    public class AccountDto
    {
        public string? Password { get; set; }
        public string? NewPassword { get; set; }
        public string? Salt { get; set; }
    }
}
