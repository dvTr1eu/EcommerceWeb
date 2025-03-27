using Ecommerce.Application.DTOs;
using Ecommerce.Application.ServicesInterfaces;
using Ecommerce.Infrastructure.Helper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using static Ecommerce.Application.DTOs.VnPayModel;

namespace Ecommerce.Application.Services
{
    public class VnPayService(IConfiguration configuration) : IVnPayService
    {
        public string CreatePaymentUrl(HttpContext context, VnPayModel.VnPaymentRequestVM model)
        {
            var tick = DateTime.Now.Ticks.ToString();

            var vnpay = new VnPayLibrary();

            vnpay.AddRequestData("vnp_Version", configuration["VnPay:Version"]);
            vnpay.AddRequestData("vnp_Command", configuration["VnPay:Command"]);
            vnpay.AddRequestData("vnp_TmnCode", configuration["VnPay:TmnCode"]);
            vnpay.AddRequestData("vnp_Amount", (model.Amount * 100).ToString());
            vnpay.AddRequestData("vnp_CreateDate", model.CreatedDate.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_CurrCode", configuration["VnPay:CurrCode"]);
            vnpay.AddRequestData("vnp_IpAddr", Utils.GetIpAddress(context));
            vnpay.AddRequestData("vnp_Locale", configuration["VnPay:Locale"]);
            vnpay.AddRequestData("vnp_OrderInfo", "Thanh toan cho don hang:" + model.OrderId);
            vnpay.AddRequestData("vnp_OrderType", "onl");
            vnpay.AddRequestData("vnp_ReturnUrl", configuration["VnPay:PaymentBackUrl"]);
            vnpay.AddRequestData("vnp_TxnRef", tick); 

            var paymentUrl = vnpay.CreateRequestUrl(configuration["VnPay:BaseUrl"], configuration["VnPay:HashSecret"]);

            return paymentUrl;
        }

        public VnPayModel.VnPayResponseVM PaymentExecute(IQueryCollection collection)
        {
            var vnpay = new VnPayLibrary();
            foreach (var (key, value) in collection)
            {
                if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_")) ;
                {
                    vnpay.AddResponseData(key, value.ToString());
                }
            }

            var vnp_orderId = Convert.ToInt64(vnpay.GetResponseData("vnp_TxnRef"));
            var vnp_TransactionId = Convert.ToInt64(vnpay.GetResponseData("vnp_TransactionNo"));
            var vnp_SecureHash = collection.FirstOrDefault(p => p.Key == "vnp_SecureHash").Value;
            var vnp_ResponseCode = vnpay.GetResponseData("vnp_ResponseCode");
            var vnp_OrderInfo = vnpay.GetResponseData("vnp_OrderInfo");

            bool checkSignature = vnpay.ValidateSignature(vnp_SecureHash, configuration["VnPay:HashSecret"]);
            if (!checkSignature)
            {
                return new VnPayResponseVM
                {
                    Success = false
                };
            }

            return new VnPayResponseVM
            {
                Success = true,
                PaymentMethod = "VnPay",
                OrderDescription = vnp_OrderInfo,
                OrderId = vnp_orderId.ToString(),
                TransactionId = vnp_TransactionId.ToString(),
                Token = vnp_SecureHash,
                VnPayResponseCode = vnp_ResponseCode,
            };
        }
    }
}
