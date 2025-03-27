using Ecommerce.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace Ecommerce.Application.ServicesInterfaces
{
    public interface IChatMessageService
    {
        Task SaveMessageAsync(ChatMessage message);
        Task<List<ChatMessage>> GetChatHistoryAsync(int userId);
        Task<int> GetOrCreateConversationAsync(int adminId, int userId);
        Task<IEnumerable<object>> GetUsersMessagedByAdmin(int adminId);
    }
}
