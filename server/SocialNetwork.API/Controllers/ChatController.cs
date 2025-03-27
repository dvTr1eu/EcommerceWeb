using Ecommerce.Application.ServicesInterfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController(IChatMessageService chatMessageService) : ControllerBase
    {
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetChatHistory(int userId)
        {
            var messages = await chatMessageService.GetChatHistoryAsync(userId);
            var result = messages.Select(m => new
            {
                senderId = m.SenderId,
                message = m.Message,
                time = m.SendAt.ToString("HH:mm")
            });
            return Ok(result);
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("Admin/{adminId}")]
        public async Task<IActionResult> GetUsersMessagedByAdmin(int adminId)
        {
            var users = await chatMessageService.GetUsersMessagedByAdmin(adminId);
            return users.Any() ? Ok(users) : NotFound("Admin has not messaged any users.");
        }
    }
}
