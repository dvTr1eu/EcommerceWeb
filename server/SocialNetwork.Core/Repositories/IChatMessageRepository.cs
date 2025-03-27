using Ecommerce.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Core.Repositories
{
    public interface IChatMessageRepository
    {
        Task<List<ChatMessage>> GetMessagesAsync(int userId);
        Task AddMessageAsync(ChatMessage message);
        Task<int> GetOrCreateConversationAsync(int adminId, int userId);
        Task<IEnumerable<object>> GetUsersMessagedByAdmin(int adminId);
    }
}
