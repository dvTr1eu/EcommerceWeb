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
    public class ChatMessageRepository(EcommerceDbContext dbContext) : IChatMessageRepository
    {
        public async Task<List<ChatMessage>> GetMessagesAsync(int userId)
        {
            return await dbContext.ChatMessages
                .Where(m => m.SenderId == userId || m.ReceiverId == userId)
                .OrderBy(m => m.SendAt)
                .ToListAsync();
        }

        public async Task AddMessageAsync(ChatMessage message)
        {
            await dbContext.ChatMessages.AddAsync(message);
            await dbContext.SaveChangesAsync();
        }

        public async Task<int> GetOrCreateConversationAsync(int adminId, int userId)
        {
            var conversation = await dbContext.Conversations
                .FirstOrDefaultAsync(c => c.AdminId == adminId && c.UserId == userId);

            if (conversation == null)
            {
                conversation = new Conversation
                {
                    AdminId = adminId,
                    UserId = userId,
                    LastMessageTime = DateTime.Now
                };

                dbContext.Conversations.Add(conversation);
                await dbContext.SaveChangesAsync();
            }

            return conversation.Id;
        }

        public async Task<IEnumerable<object>> GetUsersMessagedByAdmin(int adminId)
        {
            var usersWithLastMessage = await dbContext.Conversations
                .Where(c => c.AdminId == adminId)
                .Select(c => new
                {
                    User = c.User,
                    LastMessage = dbContext.ChatMessages
                        .Where(m => (m.SenderId == adminId && m.ReceiverId == c.UserId) ||
                                    (m.SenderId == c.UserId && m.ReceiverId == adminId))
                        .OrderByDescending(m => m.SendAt)
                        .Select(m => m.Message)
                        .FirstOrDefault()
                })
                .Distinct()
                .ToListAsync();

            return usersWithLastMessage;
        }
    }
}
