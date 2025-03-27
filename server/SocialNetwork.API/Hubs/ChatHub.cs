using Ecommerce.Application.DTOs;
using Ecommerce.Application.ServicesInterfaces;
using Ecommerce.Core.Entities;
using Ecommerce.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Ecommerce.API.Hubs
{
    public class ChatHub(IChatMessageService chatMessageService) : Hub
    {
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await base.OnDisconnectedAsync(exception); 
        }

        public async Task SendMessage(string userName,int userId, string message)
        {
            int adminId = 9;
            int conversationId = await chatMessageService.GetOrCreateConversationAsync(adminId, userId);
            var chatMessage = new ChatMessage
            {
                SenderId = userId,
                Message = message,
                ReceiverId = adminId,
                SendAt = DateTime.Now,
                ConversationId = conversationId,
            };

            await chatMessageService.SaveMessageAsync(chatMessage);
            string groupName = $"Chat_{conversationId}";
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await Groups.AddToGroupAsync(Context.ConnectionId, adminId.ToString());
            await Clients.Group(groupName).SendAsync("ReceiveMessage", userName, userId, message);
        }

        public async Task AdminJoinConversation(int userId)
        {
            int adminId = 9;
            int conversationId = await chatMessageService.GetOrCreateConversationAsync(adminId, userId);
            string groupName = $"Chat_{conversationId}";

            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            Console.WriteLine($"Admin joined {groupName}");
        }

        public async Task UserJoin(string userName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userName);
        }

        public async Task SendMessageToUser(string userName,int userId, string message)
        {
            int adminId = 9;
            int conversationId = await chatMessageService.GetOrCreateConversationAsync(adminId, userId);
            string groupName = $"Chat_{conversationId}";
            var chatMessage = new ChatMessage
            {
                SenderId = adminId,
                Message = message,
                ReceiverId = userId,
                SendAt = DateTime.Now,
                ConversationId = conversationId
            };

            try
            {
                await chatMessageService.SaveMessageAsync(chatMessage);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi lưu tin nhắn: {ex.Message}");
                throw;
            }

            await Clients.Group(groupName).SendAsync("ReceiveMessage", "admin", message);
        }
    }
}
