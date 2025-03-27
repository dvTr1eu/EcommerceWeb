using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Ecommerce.Infrastructure.Helper
{
    public class SendMailHelper
    {
        MailSettings _mailSettings { set; get; }

        public SendMailHelper(IOptions<MailSettings> mailSettings)
        {
            _mailSettings = mailSettings.Value;
        }

        public async Task<string> SendMail(MailContent message)
        {
            var mailSettings = new MailSettings();
            var email = new MimeMessage();
            email.Sender = new MailboxAddress(_mailSettings.DisplayName, _mailSettings.Mail);
            email.From.Add(new MailboxAddress(_mailSettings.DisplayName, _mailSettings.Mail));
            email.To.Add(MailboxAddress.Parse(message.ToEmail));
            email.Subject = message.Subject;

            var builder = new BodyBuilder
            {
                HtmlBody = message.Body
            };
            email.Body = builder.ToMessageBody();

            using var smtp = new MailKit.Net.Smtp.SmtpClient();

            try
            {
                await smtp.ConnectAsync(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(_mailSettings.Mail, _mailSettings.Password);
                await smtp.SendAsync(email);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return "Thất bại";
            }

            smtp.Disconnect(true);
            return "Thành công";
        }

        public class MailContent
        {
            public string Subject { get; set; }
            public string Body { get; set; }
            public string ToEmail { get; set; }
        }
    }
}
