using Ecommerce.Application.DTOs;
using Ecommerce.Application.Services;
using Ecommerce.Application.ServicesInterfaces;
using Ecommerce.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Ecommerce.API.Areas.Admin.Controllers
{
    [Authorize(Policy = "RequireAdminRole")]
    [Route("api/Admin/[controller]")]
    [ApiController]
    public class AdminProductsController(IProductService productService, ISizeService sizeService) : ControllerBase
    {
        [HttpGet]
        [Route("GetAllProducts")]
        public async Task<IActionResult> GetAllProducts()
        {
            var allProducts = await productService.GetAll();
            var totalItems = allProducts.Count();
            return Ok(new { allProducts ,totalItems});
        }

        [HttpPost]
        [Route("UploadProductImage")]
        public async Task<IActionResult> UploadImage([FromForm] List<IFormFile> fImages)
        {
            try
            {
                var imageUrls = new List<string>();

                foreach (var imageFile in fImages)
                {
                    var cloudinaryService = new CloudinaryService();
                    var base64File = cloudinaryService.ConvertToBase64(imageFile);
                    var uploadResult = await cloudinaryService.UploadImageAsync(base64File);

                    if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
                    {
                        imageUrls.Add(uploadResult.SecureUrl.AbsoluteUri);
                    }
                }

                return Ok(new { imageUrls }); 
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [HttpPost]
        [Route("AddProduct")]
        public async Task<IActionResult> AddProduct([FromBody] ProductDto productDto)
        {
            try
            {
                var product = new Product
                {
                    ProductName = productDto.ProductName,
                    Description = productDto.Description,
                    BestSeller = productDto.BestSeller,
                    CategoryID = productDto.CategoryID,
                    DiscountPrice = productDto.DiscountPrice,
                    HomeFlag = productDto.HomeFlag,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    Price = productDto.Price,
                    ImageUrl1 = productDto.Images.ElementAtOrDefault(0),
                    ImageUrl2 = productDto.Images.ElementAtOrDefault(1),
                };
                await productService.Create(product);
                foreach (var sizeDto in productDto.Sizes)
                {
                    var size = new Size
                    {
                        ProductID = product.ID,
                        SizeName = sizeDto.SizeName,
                        Quantity = sizeDto.Quantity
                    };

                    await sizeService.Create(size);
                }

                return Ok(new { success = true, message = "Add Product Successfully" });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut]
        [Route("UpdateProduct")]
        public async Task<IActionResult> UpdateProduct([FromBody] ProductDto productDto, int id)
        {
            try
            {
                var productUpdate = new Product
                {
                    ProductName = productDto.ProductName,
                    Description = productDto.Description,
                    BestSeller = productDto.BestSeller,
                    CategoryID = productDto.CategoryID,
                    DiscountPrice = productDto.DiscountPrice,
                    HomeFlag = productDto.HomeFlag,
                    UpdatedAt = DateTime.Now,
                    Price = productDto.Price,
                    ImageUrl1 = productDto.Images.ElementAtOrDefault(0),
                    ImageUrl2 = productDto.Images.ElementAtOrDefault(1),
                };
                await productService.Edit(productUpdate, id);
                foreach (var sizeDto in productDto.Sizes)
                {
                    var sizeQty = new Size
                    {
                        Quantity = sizeDto.Quantity
                    };

                    await sizeService.Edit(sizeQty, id, sizeDto.SizeName);
                }

                return Ok(new { success = true, message = "Update Product Successfully" });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete]
        [Route("DeleteProduct")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var result = await productService.Delete(id);
                if (!result)
                {
                    return NotFound();
                }

                return Ok(new { success = true, message = "Delete Successfully" });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
