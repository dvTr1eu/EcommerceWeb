using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Core.Entities
{
     public class Conversation
    {
        public int Id { get; set; }
        public int AdminId { get; set; }
        public int UserId { get; set; }
        public DateTime LastMessageTime { get; set; }

        public Account Admin { get; set; }
        public Account User { get; set; }
    }
}
