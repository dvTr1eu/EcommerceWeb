using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CloudinaryDotNet;
using Ecommerce.Application.ServicesInterfaces;
using Ecommerce.Core.Entities;
using Ecommerce.Core.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Account = Ecommerce.Core.Entities.Account;

namespace Ecommerce.Application.Services
{
    public class AuthService(IAccountRepository accountRepository, IConfiguration configuration) : IAuthService
    {
        public async Task<Account?> FindByEmail(string email)
        {
            return await accountRepository.FindByCondition(a => a.Email == email);
        }

        public async Task<bool> RegisterAsync(Account model)
        {
            if (await accountRepository.CheckEmail(model.Email!))
            {
                return false;
            }

            model.Password = HashPassword(model.Password!);
            await accountRepository.Add(model);

            return true;
        }

        public async Task<(Account?, string? token, string? error)> LoginAsync(string email, string password)
        {
            var account = await accountRepository.FindByCondition(a => a.Email == email);

            if (account == null)
            {
                return (null, null, "Người dùng không tồn tại"); 
            }

            if (!VerifyPassword(password, account.Password))
            {
                return (null, null, "Mật khẩu không chính xác"); 
            }


            var info = new Account
            {
                ID = account.ID,
                Email = account.Email,
                Role = account.Role,
                FullName = account.FullName,
                Avatar = account.Avatar,
                Phone = account.Phone,
                Address = account.Address
            };

            var token = GenerateToken(info);

            return (info, token, null);
        }

        private bool VerifyPassword(string password, string? hashedPassword)
        {
            bool isValidPassword = BCrypt.Net.BCrypt.Verify(password, hashedPassword);
            return isValidPassword;
        }

        private string HashPassword(string password)
        {
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(password);
            return passwordHash;
        }

        private string GenerateToken(Account account)
        {
            
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, configuration["JWT:Subject"]!),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("ID", account.ID.ToString()),
                new Claim("FullName", account.FullName!),
                new Claim("Email", account.Email!),
                new Claim("Role", account.Role),
                new Claim("Phone", account.Phone!),
                new Claim("Address", account.Address ?? "")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:SecretKey"]!));
            var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                configuration["JWT:ValidIssuer"],
                configuration["JWT:ValidAudience"],
                claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: signIn
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
