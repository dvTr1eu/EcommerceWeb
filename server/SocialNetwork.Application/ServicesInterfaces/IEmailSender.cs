namespace Ecommerce.Application.ServicesInterfaces
{
    public interface IEmailSender
    {
        Task SendMailAsync(string toEmail, string subject, string message);
    }
}
