using System.Net.Mail;
using System.Net;
using Microsoft.Extensions.Configuration;

namespace PlannyCore.Services
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string email, string subject, string message, string param = "");
    }
    public class EmailSender : IEmailSender
    {
        IConfiguration _configuration;
        private readonly ILogger<EmailSender> _logger;
        public EmailSender(IConfiguration configuration, ILogger<EmailSender> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }
        public async Task SendEmailAsync(string email, string subject, string body, string param = "")
        {
            var message = new MailMessage();
            message.To.Add(new MailAddress(email));
            message.From = new MailAddress(_configuration[$"EmailConfiguration:From{param}"]);
            message.Subject = subject;
            message.Body = body;
            message.IsBodyHtml = true;

            using (var smtp = new SmtpClient())
            {
                var credential = new NetworkCredential
                {
                    UserName = _configuration[$"EmailConfiguration:From{param}"],
                    Password = _configuration[$"EmailConfiguration:Password{param}"]
                };
                smtp.Credentials = credential;
                smtp.Host = _configuration["EmailConfiguration:SmtpServer"];
                smtp.Port = int.Parse(_configuration["EmailConfiguration:Port"]);
                smtp.EnableSsl = true;
                //                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls |
                //SecurityProtocolType.Tls11 |
                //SecurityProtocolType.Tls12;
                try
                {
                    _logger.LogDebug($"Sending Email. Subject:{subject}, From: {credential.UserName}, To: {email}.");
                    await smtp.SendMailAsync(message);
                    _logger.LogDebug("Email was sent successfully.");
                }
                catch (Exception ex)
                {
                    _logger.LogError($"SendMailAsync error. Email Address:{credential.UserName}",ex);
                    if (string.IsNullOrEmpty(param))
                        await SendEmailAsync(email, subject, body, "2");
                }
            }
        }
    }
}
