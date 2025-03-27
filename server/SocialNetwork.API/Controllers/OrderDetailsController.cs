using Ecommerce.Application.ServicesInterfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;
using System.Text.Json;

namespace Ecommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailsController(IOrderDetailsService orderDetailsService) : ControllerBase
    {
        [HttpGet]
        [Route("GetOrderDetailsByOrderId")]
        public async Task<IActionResult> GetOrderDetailsByOrderId(int orderId)
        {
            try
            {
                var orderDetailList = await orderDetailsService.GetOrderDetailsByOrderId(orderId);
                var options = new JsonSerializerOptions
                {
                    ReferenceHandler = ReferenceHandler.IgnoreCycles,
                    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
                    WriteIndented = true,
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
                };
                var jsonResult = JsonSerializer.Serialize(orderDetailList, options);

                return Content(jsonResult, "application/json; charset=utf-8");
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
    }
}
