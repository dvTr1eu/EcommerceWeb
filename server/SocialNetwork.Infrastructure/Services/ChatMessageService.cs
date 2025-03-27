using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecommerce.Application.ServicesInterfaces;
using Ecommerce.Core.Entities;
using Ecommerce.Core.Repositories;

namespace Ecommerce.Infrastructure.Services
{
    public class ChatMessageService(IChatMessageRepository chatMessageRepository) : IChatMessageService
    {
        public async Task SaveMessageAsync(ChatMessage message)
        {
            await chatMessageRepository.AddMessageAsync(message);
        }

        public async Task<List<ChatMessage>> GetChatHistoryAsync(int userId)
        {
            return await chatMessageRepository.GetMessagesAsync(userId);
        }

        public async Task<int> GetOrCreateConversationAsync(int adminId, int userId)
        {
            return await chatMessageRepository.GetOrCreateConversationAsync(adminId, userId);
        }

        public async Task<IEnumerable<object>> GetUsersMessagedByAdmin(int adminId)
        {
            return await chatMessageRepository.GetUsersMessagedByAdmin(adminId);
        }
    }
}
