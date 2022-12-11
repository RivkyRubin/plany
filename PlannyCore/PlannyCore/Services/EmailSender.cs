using System.Net.Mail;
using System.Net;
using Microsoft.Extensions.Configuration;

namespace PlannyCore.Services
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string email, string subject, string message);
    }
    public class EmailSender: IEmailSender
    {
        IConfiguration _configuration;
        public EmailSender(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task SendEmailAsync(string email, string subject, string body)
        {
            var message = new MailMessage();
            message.To.Add(new MailAddress(email));
            message.From = new MailAddress(_configuration["EmailConfiguration:From"]);
            message.Subject = subject;
            message.Body = body;
            message.IsBodyHtml = true;

            using (var smtp = new SmtpClient())
            {
                var credential = new NetworkCredential
                {
                    UserName = _configuration["EmailConfiguration:From"],
                    Password = _configuration["EmailConfiguration:Password"]
                };
                smtp.Credentials = credential;
                smtp.Host = _configuration["EmailConfiguration:SmtpServer"];
                smtp.Port = int.Parse(_configuration["EmailConfiguration:Port"]);
                smtp.EnableSsl = true;
//                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls |
//SecurityProtocolType.Tls11 |
//SecurityProtocolType.Tls12;
                await smtp.SendMailAsync(message);
            }
        }
    }
}
