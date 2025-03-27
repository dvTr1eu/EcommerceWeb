using Ecommerce.Application.DTOs;
using Ecommerce.Application.ServicesInterfaces;
using Ecommerce.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.API.Areas.Admin.Controllers
{
    //[Authorize(Policy = "RequireAdminRole")]
    [Route("api/Admin/[controller]")]
    [ApiController]
    public class AdminCategoryController(ICategoryService categoryService) : ControllerBase
    {
        [HttpGet]
        [Route("GetAllCategory")]
        public async Task<IActionResult> GetAllCategory()
        {
            var allCategory = await categoryService.GetAll();
            return Ok(allCategory);
        }

        [HttpPost]
        [Route("Add")]
        public async Task<IActionResult> Add([FromBody] CategoryDto categoryDto)
        {
            try
            {
                var category = new Category
                {
                    CategoryName = categoryDto.CategoryName,
                    OrderNumber = categoryDto.OrderNumber,
                    ParentID = categoryDto.ParentID,
                    Published = categoryDto.Published
                };
                await categoryService.Create(category);
                return Ok(new { success = true, message = "Thêm mới thành công" });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update([FromBody] CategoryDto categoryDto, int id)
        {
            try
            {
                var categoryUpdate = new Category
                {
                    CategoryName = categoryDto.CategoryName,
                    OrderNumber = categoryDto.OrderNumber,
                    ParentID = categoryDto.ParentID,
                    Published = categoryDto.Published
                };
                await categoryService.Edit(categoryUpdate, id);
                return Ok(new {success = true, message = "Cập nhật thành công" });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var result = await categoryService.Delete(id);
                if (!result)
                {
                    return NotFound();
                }
                return Ok(new { success = true, message = "Xóa thành công" });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
