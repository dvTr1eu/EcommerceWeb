using System.IdentityModel.Tokens.Jwt;
using Ecommerce.Application.DTOs;
using Ecommerce.Application.ServicesInterfaces;
using Ecommerce.Core.Entities;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Application.DTOs;
using SameSiteMode = Microsoft.AspNetCore.Http.SameSiteMode;

namespace SocialNetwork.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthService authService, IAccountService accountService) : ControllerBase
    {
        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterUserDto registerUserDto)
        {
            try
            {
                var registerUser = new Account
                {
                    FullName = registerUserDto.FullName,
                    Email = registerUserDto.Email,
                    Phone = registerUserDto.Phone,
                    Password = registerUserDto.Password,
                    Salt = DateOnly.FromDateTime(DateTime.Now).ToString().Insert(0,new Random().Next(1,9).ToString()),
                    Role = "Customer",
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };
                var result = await authService.RegisterAsync(registerUser);

                if (!result)
                {
                    return Unauthorized(new { success = result, message = "Đăng ký thất bại" });
                }
                return Ok(new { success = result, message = "Đăng ký thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> LoginUser([FromBody] LoginUserDto loginUserDto)
        {
            try
            {
                var (user, token, error) = await authService.LoginAsync(loginUserDto.Email, loginUserDto.Password);
                if (user == null || token == null || error != null)
                    return Ok(new {success = false, message = error });

                var cookieOptions = new CookieOptions
                {
                    HttpOnly = false,
                    Secure = true,
                    SameSite = SameSiteMode.None
                };

                HttpContext.Response.Cookies.Append("token", token, cookieOptions);

                return Ok(new { success = true, message = "Đăng nhập thành công", User = user });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        [Route("Logout")]
        public async Task<IActionResult> LogoutUser()
        {
            HttpContext.Response.Cookies.Delete("token", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None
            });
            return Ok(new { success = true, message = "Đăng xuất thành công" });
        }

        [HttpGet]
        [Route("CheckAuth")]
        public async Task<IActionResult> CheckAuth()
        {
            try
            {
                var token = HttpContext.Request.Cookies["token"];
                if (string.IsNullOrEmpty(token))
                {
                    return Unauthorized(new { success = false, message = "Not logged in" });
                }

                var jwtToken = new JwtSecurityTokenHandler().ReadJwtToken(token);
                var expiration = jwtToken.ValidTo;

                if (DateTime.UtcNow > expiration)
                {
                    return Unauthorized(new { success = false, message = "Token expired" });
                }

                var idClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "ID")?.Value;
                int ID = 0;
                if (idClaim != null && int.TryParse(idClaim, out ID))
                {
                    
                }
                else
                {
                    return BadRequest("Invalid token: ID is missing or invalid.");
                }
                
                var fullName = jwtToken.Claims.FirstOrDefault(c => c.Type == "FullName")?.Value;
                var email = jwtToken.Claims.FirstOrDefault(c => c.Type == "Email")?.Value;

                var roleName = jwtToken.Claims.FirstOrDefault(c => c.Type == "Role")?.Value;
                var phone = jwtToken.Claims.FirstOrDefault(c => c.Type == "Phone")?.Value;
                var address = jwtToken.Claims.FirstOrDefault(c => c.Type == "Address")?.Value;

                var userInfo = new
                {
                    ID = ID,
                    FullName = fullName,
                    Email = email,
                    Role = roleName,
                    Phone = phone,
                    Address = address
                };

                return Ok(new { success = true, user = userInfo });
            }
            catch (Exception ex)
            {
                return Unauthorized(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        [Route("ChangePassword")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto model)
        {
            try
            {
                var result = await accountService.ChangePassword(model.NewPassword, model.OldPassword, model.Id);
                return Ok(new { success = result });
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}
