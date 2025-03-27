using System.Text;
using CloudinaryDotNet;
using Ecommerce.API.Hubs;
using Ecommerce.Application.Services;
using Ecommerce.Application.ServicesInterfaces;
using Ecommerce.Core.Repositories;
using Ecommerce.Infrastructure.Helper;
using Ecommerce.Infrastructure.Persistence;
using Ecommerce.Infrastructure.Repositories;
using Ecommerce.Infrastructure.Services;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;

namespace Ecommerce.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            var services = builder.Services;


            //SignalR
            services.AddSignalR();

            var connectionString = builder.Configuration.GetConnectionString("Ecommerce");
            services.AddDbContext<EcommerceDbContext>(options => options.UseSqlServer(connectionString));

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidAudience = builder.Configuration["JWT:ValidAudience"],
                    ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:SecretKey"])),
                    RoleClaimType = "Role"
                };
            });

            services.AddAuthorization(o =>
            {
                o.AddPolicy("RequireAdminRole", p => p.RequireRole("Admin"));
            });

            services.AddMemoryCache();

            services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));

            services.AddSingleton(sp =>
            {
                var config = sp.GetRequiredService<IOptions<CloudinarySettings>>().Value;
                return new Cloudinary(new Account(config.CloudName, config.ApiKey, config.ApiSecret));
            });

            services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));
            services.AddScoped<SendMailHelper>();
            //Service
            services.AddScoped<IVnPayService, VnPayService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ISizeService, SizeService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<ICartService, CartService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IOrderDetailsService, OrderDetailsService>();
            services.AddScoped<ITransactStatusService, TransactStatusService>();
            services.AddScoped<IChatMessageService, ChatMessageService>();
            services.AddScoped<IProductReviewService, ProductReviewService>();
            //Repository
            services.AddScoped<IAccountRepository, AccountRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<ISizeRepository, SizeRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<ICartRepository, CartRepository>();
            services.AddScoped<IOrderRepository, OrderRepository>();
            services.AddScoped<IOrderDetailsRepository, OrderDetailsRepository>();
            services.AddScoped<ITransactStatusRepository, TransactStatusRepository>();
            services.AddScoped<IChatMessageRepository, ChatMessageRepository>();
            services.AddScoped<IProductReviewRepository, ProductReviewRepository>();

            services.AddControllersWithViews().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
                options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
            });

            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Ecommerce.API", Version = "v1" });

                // Thêm cấu hình xác thực JWT
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Nhập token của bạn ở đây"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] {}
                    }
                });
            });

            services.AddCors(option =>
            {
                option.AddPolicy("Ecommerce", builder =>
                {  //localhost react app
                    builder.WithOrigins("http://localhost:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();

                });
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            var hubConfiguration = new HubConfiguration();
            hubConfiguration.EnableDetailedErrors = true;
            hubConfiguration.EnableJavaScriptProxies = false;

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseCors("Ecommerce");

            app.UseRouting();

            app.Use(async (context, next) =>
            {
                var authHeader = context.Request.Headers["Authorization"].ToString();

                if (!string.IsNullOrEmpty(authHeader) && !authHeader.StartsWith("Bearer "))
                {
                    context.Request.Headers["Authorization"] = $"Bearer {authHeader}"; 
                }

                await next();
            });

            app.MapHub<ChatHub>("/chatHub");

            app.UseAuthentication();
            app.UseAuthorization();


            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.Run();
        }
    }
}
