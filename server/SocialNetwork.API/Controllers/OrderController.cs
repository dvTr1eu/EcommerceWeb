using Ecommerce.Application.DTOs;
using Ecommerce.Application.Services;
using Ecommerce.Application.ServicesInterfaces;
using Ecommerce.Core.Entities;
using Ecommerce.Infrastructure.Helper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ecommerce.API.Middlewares;
using Microsoft.Extensions.Caching.Memory;
using MailKit.Search;
using System.Text.Json.Serialization;
using System.Text.Json;

namespace Ecommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController(IOrderService orderService, IAccountService accountService, IOrderDetailsService orderDetailsService, ICartService cartService,ISizeService sizeService, IVnPayService vnPayService, SendMailHelper sendMailHelper,IMemoryCache memoryCache) : ControllerBase
    {
        [HttpPost]
        [Route("CreateNewOrder")]
        public async Task<IActionResult> CreateNewOrder([FromBody] BuyProductDto buyProductDto)
        {
            try
            {
                await accountService.UpdateAddressShip(buyProductDto.Address, buyProductDto.CustomerId);

                var newOrder = new Order
                {
                    CustomerID = buyProductDto.CustomerId,
                    OrderDate = DateTime.Now,
                    TransactionStatusID = 1,
                    Deleted = false,
                    TotalMoney = buyProductDto.TotalMoney,
                    Note = buyProductDto.Note
                };

                if (buyProductDto.PaymentMethod == "cod")
                {
                    newOrder.PaymentID = 1;
                    newOrder.Paid = false;
                    newOrder.IsHistory = false;
                    await orderService.Create(newOrder);

                    await CreateOrderDetails(newOrder);

                    await cartService.RemoveAllCartItemOfCustomer(buyProductDto.CustomerId);
                    await SendOrderConfirmationEmail(buyProductDto.CustomerId, newOrder);
                    return Ok(new { success = true, message = "Đặt hàng thành công" });
                }

                if (buyProductDto.PaymentMethod == "onl")
                {
                    var vnPayModel = new VnPayModel.VnPaymentRequestVM
                    {
                        Amount = buyProductDto.TotalMoney,
                        CreatedDate = DateTime.Now,
                        Description = "Thanh toán qua VnPay",
                        FullName = buyProductDto.FullName
                    };

                    var urlPayment = vnPayService.CreatePaymentUrl(HttpContext, vnPayModel);

                    memoryCache.Set("TempOrder", newOrder, TimeSpan.FromMinutes(30));

                    return Ok(new { success = true, urlPayment });
                }
                return BadRequest(new { success = false, message = "Phương thức thanh toán không hợp lệ." });
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        [HttpGet]
        [Route("PaymentCallBack")]
        public async Task<IActionResult> PaymentCallBack()
        {
            var response = vnPayService.PaymentExecute(Request.Query);

            if (response != null && response.VnPayResponseCode == "00")
            {
                memoryCache.TryGetValue("TempOrder" , out Order order);

                if (order != null)
                {
                    order.PaymentID = 2;
                    order.Paid = true;
                    order.PaymentDate = DateTime.Now;
                    order.IsHistory = false;

                    await orderService.Create(order);
                    await CreateOrderDetails(order);

                    await cartService.RemoveAllCartItemOfCustomer(order.CustomerID);

                    await SendOrderConfirmationEmail(order.CustomerID, order);

                    memoryCache.Remove("TempOrder");

                    return Redirect("http://localhost:5173/shop/payment-success");
                }
            }

            return Redirect("http://localhost:5173/shop/checkout");
        }

        private async Task CreateOrderDetails(Order donHang)
        {
            var cartList = await cartService.GetCartByCustomerId(donHang.CustomerID);
            foreach (var item in cartList)
            {
                var orderDetail = new OrderDetail();
                orderDetail.OrderID = donHang.ID;
                orderDetail.ProductID = item.Product.ID;
                orderDetail.Quantity = item.Quantity;
                orderDetail.Total = donHang.TotalMoney;
                orderDetail.SizeName = item.SizeName;
                orderDetail.ImageUrl = item.ImageUrl;
                orderDetail.ShipDate = donHang.ShipDate;
                await orderDetailsService.Create(orderDetail);

                await sizeService.ReduceQuantity(item.Quantity, item.SizeName, item.Product.ID);
            }
        }

        private async Task SendOrderConfirmationEmail(int customerId, Order order)
        {
            var customer = await accountService.FindById(customerId);
            if (customer == null)
            {
                return;
            }

            var mailContent = new SendMailHelper.MailContent
            {
                ToEmail = customer.Email,
                Subject = "XÁC NHẬN ĐẶT HÀNG THÀNH CÔNG",
                Body = $"<h2>Xin chào, {customer.FullName}</h2><br/>" +
                       $"<p>Đơn hàng #{order.ID} của bạn đã được xác nhận thành công.</p><br/>" +
                       $"<p>Cảm ơn bạn đã mua hàng tại cửa hàng chúng tôi.</p><br/>" +
                       $"<p>Hãy kiểm tra email thường xuyên để nhận thông tin đơn hàng và thông tin khuyến mãi nhé!</p>"
            };

            await sendMailHelper.SendMail(mailContent);
        }

        [HttpGet]
        [Route("GetOrdersByCustomerID")]
        public async Task<IActionResult> GetOrdersByCustomerId(int customerId)
        {
            var orders = await orderService.GetOrdersByCustomerId(customerId);
            var options = new JsonSerializerOptions
            {
                ReferenceHandler = ReferenceHandler.IgnoreCycles,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
                WriteIndented = true,
                Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            var jsonResult = JsonSerializer.Serialize(orders, options);

            return Content(jsonResult, "application/json; charset=utf-8");
        }

        [HttpPut]
        [Route("ChangeStatus")]
        public async Task<IActionResult> ChangeStatus(int orderId, int statusId, bool isPaid, bool isDeleted, bool isHistory)
        {
            try
            {
                var result = await orderService.UpdateStatusOrder(statusId, orderId, isPaid, isDeleted, isHistory);
                if (result)
                {
                    return Ok(new { success = true, message = "Cập nhật trạng thái thành công" });
                }

                return Ok(new { success = false, message = "Cập nhật thất bại" });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
