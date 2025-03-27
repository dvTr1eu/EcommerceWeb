using Ecommerce.Application.DTOs;
using Ecommerce.Application.ServicesInterfaces;
using Ecommerce.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductReviewController(IProductReviewService productReviewService, IOrderService orderService, IProductService productService) : ControllerBase
    {
        [HttpPost]
        [Route("AddProductReview")]
        public async Task<IActionResult> AddReview([FromBody] ProductReviewDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { success = false, message = "Invalid data" });
            }

            var order = await orderService.GetOrderByUserAndProduct(model.AccountId, model.ProductId);
            if (order == null)
            {
                return Ok(new { success = false, message = "Bạn cần mua đơn hàng để đánh giá." });
            }

            var existingReview = await productReviewService.GetReviewByUserAndProduct(model.AccountId, model.ProductId);
            if (existingReview != null)
            {
                return Ok(new { success = false, message = "Bạn đã đánh giá sản phẩm này" });
            }

            var review = new ProductReview
            {
                FullName = model.FullName,
                AccountId = model.AccountId,
                ProductId = model.ProductId,
                ReviewMessage = model.ReviewMessage,
                ReviewNumber = model.ReviewNumber,
                ReviewTime = DateTime.Now
            };
            var newReview = await productReviewService.Create(review);
            var reviews = await productReviewService.GetProductReviews(newReview.ProductId);
            var averageReview = reviews.Any() ? reviews.Average(r => r.ReviewNumber) : 0;
            await productService.UpdateAverageReview(newReview.ProductId, averageReview);

            return Ok(new { success = true, newReview, reviews });
        }

        [HttpGet]
        [Route("GetAllProductReview")]
        public async Task<IActionResult> GetListProductReview(int productId)
        {
            try
            {
                if (productId != null)
                {
                    var listReview = await productReviewService.GetProductReviews(productId);
                    return Ok(new { success = true, listReview });
                }

                return NotFound();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
