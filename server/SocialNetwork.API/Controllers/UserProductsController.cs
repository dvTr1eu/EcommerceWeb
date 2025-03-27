using Ecommerce.Application.ServicesInterfaces;
using Microsoft.AspNetCore.Mvc;
using System.Drawing.Printing;

namespace Ecommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserProductsController(IProductService productService) : ControllerBase
    {
        [HttpGet]
        [Route("GetAllProduct")]
        public async Task<IActionResult> GetAll()
        {
            var allProduct = await productService.GetAll();
            return Ok(allProduct);
        }

        [HttpGet]
        [Route("GetById")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await productService.FindById(id);
            return Ok(product);
        }

        [HttpGet]
        [Route("GetByCondition")]
        public async Task<IActionResult> GetByCondition(int? categoryId, string? sortOrder, int pageNumber = 1, int pageSize = 12)
        {
            var products = await productService.GetByCondition(categoryId, sortOrder, pageNumber, pageSize);
            var totalItems = await productService.GetTotalCount(categoryId);
            return Ok(new { products, totalItems });
        }

        [HttpGet]
        [Route("FindBySearchKey")]
        public async Task<IActionResult> FindBySearchKey(string? searchKey, string? sortOrder, int pageNumber = 1, int pageSize = 12)
        {
            var products = await productService.FindBySearchKey(searchKey, sortOrder, pageNumber, pageSize);
            return Ok(products);
        }
    }
}
