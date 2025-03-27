using Ecommerce.Application.DTOs;
using Ecommerce.Application.ServicesInterfaces;
using Ecommerce.Core.Entities;
using Ecommerce.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.API.Areas.Admin.Controllers
{
    [Authorize(Policy = "RequireAdminRole")]
    [Route("api/Admin/[controller]")]
    [ApiController]
    public class AdminAccountController(IAccountService accountService) : ControllerBase
    {
        [HttpGet]
        [Route("GetAllAccount")]
        public async Task<IActionResult> GetAllAccount()
        {
            var allCategory = await accountService.GetAll();
            return Ok(allCategory);
        }

        [HttpGet]
        [Route("GetAccountById")]
        public async Task<IActionResult> GetAccountById(int id)
        {
            var allCategory = await accountService.FindById(id);
            return Ok(allCategory);
        }
    }
}
