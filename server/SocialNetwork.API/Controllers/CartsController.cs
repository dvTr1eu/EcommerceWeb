using Ecommerce.Application.DTOs;
using Ecommerce.Application.ServicesInterfaces;
using Ecommerce.Core.Entities;
using Ecommerce.Infrastructure.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartsController(ICartService cartService) : ControllerBase
    {
        [HttpGet]
        [Route("GetCartItem")]
        public async Task<IActionResult> GetCartItemByCustomerId(int customerId)
        {
            var cartItem = await cartService.GetCartByCustomerId(customerId);
            var results = cartItem.Select(
                ci => new
                {
                    ci.ID,
                    ci.CustomerID,
                    ci.Product.ProductName,
                    ci.ImageUrl,
                    ci.Quantity,
                    ci.Product.Price,
                    ci.Product.DiscountPrice,
                    ci.SizeName,
                    ci.ProductID,
                    ci.SizeId
                });
            return Ok(results);
        }

        [HttpPost]
        [Route("AddToCart")]
        public async Task<IActionResult> AddToCart([FromBody] CartItemDto cartItemDto)
        {
            try
            {
                var cartItem = new CartItem
                {
                    CustomerID = cartItemDto.CustomerID,
                    ProductID = cartItemDto.ProductID,
                    Quantity = cartItemDto.Quantity,
                    ImageUrl = cartItemDto.ImageUrl,
                    SizeId = cartItemDto.SizeId,
                    SizeName = cartItemDto.SizeName
                };
                await cartService.Create(cartItem);
                return Ok(new { success = true, message = "Add Product Successfully" });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut]
        [Route("UpdateCartItem")]
        public async Task<IActionResult> UpdateCartItem([FromBody] CartItemDto cartItemDto, int id)
        {
            try
            {
                var cartItemUpdate = new CartItem
                {
                    Quantity = cartItemDto.Quantity
                };
                await cartService.Edit(cartItemUpdate, id);
                return Ok(new { success = true, message = "Update CartItem Successfully" });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete]
        [Route("RemoveCartItem")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var result = await cartService.Delete(id);
                if (!result)
                {
                    return NotFound();
                }

                return Ok(new { success = true, message = "Remove Successfully" });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete]
        [Route("RemoveAllCartItem")]
        public async Task<IActionResult> RemoveAll(int customerId)
        {
            try
            {
                var result = await cartService.RemoveAllCartItemOfCustomer(customerId);
                if (!result)
                {
                    return NotFound();
                }

                return Ok(new { success = true, message = "Remove Successfully" });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
