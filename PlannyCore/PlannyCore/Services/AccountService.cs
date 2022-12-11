using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PlannyCore.Data.Entities.Identity;
using PlannyCore.Models;
using System.Net;
using System.Text.Encodings.Web;
using System.Web;

namespace PlannyCore.Services
{
    public interface IAccountService
    {
        Task<ApiResponse<bool>> ConfirmEmail(string userId, string code);
        Task<ApiResponse<bool>> ResendPassword(ApplicationUser user, string email);
        Task<ApiResponse<bool>> SendEmailConfirmation(ApplicationUser user);

        Task GenerateConfirmationEmail(ApplicationUser user);
    }
    public class AccountService : IAccountService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly IEmailSender _emailSender;
        private readonly ISystemParameterService _systemParameterService;
        public AccountService(UserManager<ApplicationUser> userManager,
            IConfiguration configuration, IEmailSender emailSender,
                        ISystemParameterService systemParameterService)
        {
            _userManager = userManager;
            _configuration = configuration;
            _emailSender = emailSender;
            _systemParameterService = systemParameterService;
        }

        public async Task GenerateConfirmationEmail(ApplicationUser user)
        {
            var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var url = _configuration["ApplicationURL:EmailConfirmationURL"];
            url = url + "?userId=" + user.Id + "&code=" + HttpUtility.UrlEncode(code);
            var body = $"Please click on the link to activate your account: \n {url}";
            await _emailSender.SendEmailAsync(user.Email, "Email Confirmation", body);

        }
        public async Task<ApiResponse<bool>> ConfirmEmail(string userId, string code)
        {

            var appUser = await _userManager.FindByIdAsync(userId);
            IdentityOptions options = new IdentityOptions();
            if (userId == null || code == null)
            {
                return ApiResponse<bool>.ErrorResult( "invalid url",statusCode:HttpStatusCode.BadRequest);
            }
            var proivder = options.Tokens.EmailConfirmationTokenProvider;

            bool isValid = await _userManager.VerifyUserTokenAsync(appUser, proivder, UserManager<IdentityUser>.ConfirmEmailTokenPurpose, code);

            if (isValid)
            {
                var data = await _userManager.ConfirmEmailAsync(appUser, code);
                if (data.Succeeded)
                {
                    return ApiResponse<bool>.SuccessResult(true);
                }
                else
                {
                    return ApiResponse<bool>.ErrorResult(message: "Your account confirmation link has been expired or invalid link, Please contact to administrator.");
                }
            }
            else
            {
                return ApiResponse<bool>.ErrorResult(message: "Your account confirmation link has been expired or invalid link, Please contact to administrator.");
            }
        }

        public async Task<ApiResponse<bool>> ResendPassword(ApplicationUser user, string email)
        {
            try
            {
                if (!string.IsNullOrEmpty(user.ExternalLoginProvider))
                {
                    return ApiResponse<bool>.ErrorResult(message: "couldn't reset a password, external provider");
                }
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);

                var emailTemplate = _systemParameterService.GetSystemParameterValue("ForgotPasswordHtmlTemplate");
                if (string.IsNullOrEmpty(emailTemplate))
                    return ApiResponse<bool>.ErrorResult(message: "email template is empty");
                var url = _configuration["ApplicationURL:PasswordResetURL"];
                url = url + "?userId=" + user.Id + "&code=" + HttpUtility.UrlEncode(token);
                emailTemplate = emailTemplate.Replace("{Param1}", url);
                await _emailSender.SendEmailAsync(user.Email, "Reset Password", emailTemplate);
                // await _emailSender.SendEmailAsync(user.Email, "Reset Password", HtmlEncoder.Default.Encode(emailTemplate));

                return ApiResponse<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResult(message: ex.Message);

            }
        }

        public async Task<ApiResponse<bool>> SendEmailConfirmation(ApplicationUser user)
        {
            try
            {
                await GenerateConfirmationEmail(user);
                return ApiResponse<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResult(message: ex.Message);
            }
        }
    }
}
