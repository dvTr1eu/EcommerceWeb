using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Ecommerce.Core.Entities
{
    public class ChatMessage
    {
        public int Id { get; set; }
        public int SenderId { get; set; }  
        public int ReceiverId { get; set; } 
        public string Message { get; set; }
        public DateTime SendAt { get; set; }

        public int ConversationId { get; set; }
        public Conversation Conversation { get; set; }
    }
}
