using Microsoft.AspNetCore.Http;
using Ecommerce.Application.DTOs;

namespace Ecommerce.Application.ServicesInterfaces
{
    public interface IVnPayService
    {
        string CreatePaymentUrl(HttpContext context, VnPayModel.VnPaymentRequestVM model);
        VnPayModel.VnPayResponseVM PaymentExecute(IQueryCollection collection);
    }
}
