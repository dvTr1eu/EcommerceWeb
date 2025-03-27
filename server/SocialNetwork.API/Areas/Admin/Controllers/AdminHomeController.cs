using Ecommerce.Application.ServicesInterfaces;
using Ecommerce.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.API.Areas.Admin.Controllers
{
    [Authorize(Policy = "RequireAdminRole")]
    [Route("api/Admin/[controller]")]
    [ApiController]
    public class AdminHomeController(IOrderService orderService, ITransactStatusService transactStatusService, IAccountService accountService, IOrderDetailsService orderDetailsService) : ControllerBase
    {

        [HttpGet]
        [Route("GetTotalCustomer")]
        public async Task<IActionResult> GetTotalCustomer()
        {
            try
            {
                var result = await accountService.GetAll();
                return Ok(result.Count());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Route("GetTotalOrderStatusInDay")]
        public async Task<IActionResult> GetTotalOrderSuccess(DateTime date)
        {
            try
            {
                var success = await orderService.GetAllOrderSuccessInDay(date);
                var delete = await orderService.GetAllOrderDeleteInDay(date);
                var process = await orderService.GetAllOrderProcessInDay(date);

                return Ok(new {OrderSuccess = success, OrderDelete = delete, OrderProcess = process});
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [HttpGet]
        [Route("GetTotalProductSellInDay")]
        public async Task<IActionResult> GetTotalProductSell(DateTime date)
        {
            try
            {
                var result = await orderService.GetAllOrderSuccessInDay(date);
                int totalProductSell = result.Sum(o => o.OrderDetails?.Sum(od => od.Quantity) ?? 0);
                int? doanhThu = result.Sum(o => o.TotalMoney);
                var listProduct = result.SelectMany(o => o.OrderDetails ?? new List<OrderDetail>())
                        .GroupBy(od => new { od.ProductID })
                    .Select(g => new
                    {
                        ProductID = g.Key.ProductID,
                        OrderID = g.First().OrderID,
                        ProductName = g.First().Product.ProductName,
                        Price = g.First().Product.DiscountPrice > 0 ? g.First().Product.DiscountPrice : g.First().Product.Price,
                        SizeName = g.First().SizeName,
                        TotalSold = g.Sum(od => od.Quantity)
                    })
                    .Distinct()
                    .ToList();
                return Ok(new {TotalProductSold = totalProductSell, listProduct, DoanhThu = doanhThu });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
