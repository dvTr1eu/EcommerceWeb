using Ecommerce.Application.ServicesInterfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;
using System.Text.Json;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Authorization;

namespace Ecommerce.API.Areas.Admin.Controllers
{
    [Authorize(Policy = "RequireAdminRole")]
    [Route("api/Admin/[controller]")]
    [ApiController]
    public class AdminOrdersController(IOrderService orderService, ITransactStatusService transactStatusService, IAccountService accountService, IOrderDetailsService orderDetailsService) : ControllerBase
    {
        [HttpGet]
        [Route("GetAllOrderUser")]
        public async Task<IActionResult> GetAllOrderUser()
        {
            try
            {
                var results = await orderService.GetAll();
                return Ok(results);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Route("GetOrderById")]
        public async Task<IActionResult> GetOrderById(int orderId)
        {
            try
            {
                var order = await orderService.FindById(orderId);
                var transactStatus = await transactStatusService.GetTransactStatus();
                var options = new JsonSerializerOptions
                {
                    ReferenceHandler = ReferenceHandler.IgnoreCycles,
                    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
                    WriteIndented = true,
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
                };
                var jsonResult = JsonSerializer.Serialize(new { order, transactStatus}, options);

                return Content(jsonResult, "application/json; charset=utf-8");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Route("GetAdminOrderDetailsUser")]
        public async Task<IActionResult> GetAdminOrderDetailsUser(int customerId)
        {
            try
            {
                var results = await orderService.GetOrdersByCustomerId(customerId);
                var options = new JsonSerializerOptions
                {
                    ReferenceHandler = ReferenceHandler.IgnoreCycles,
                    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
                    WriteIndented = true,
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
                };
                var jsonResult = JsonSerializer.Serialize(results, options);

                return Content(jsonResult, "application/json; charset=utf-8");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
}
