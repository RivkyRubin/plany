using AutoMapper;
using Elasticsearch.Net.Specification.RollupApi;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using PlannyCore.Data;
using PlannyCore.Data.Entities;
using PlannyCore.Data.Entities.Identity;
using PlannyCore.Enums;
using PlannyCore.Models;
using PlannyCore.Models.Account;
using PlannyCore.Services;
using System.Collections;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using System.Web;
using System.Xml.Linq;
using IHostingEnvironment = Microsoft.AspNetCore.Hosting.IHostingEnvironment;

namespace PlannyCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly ILogger<AccountController> _logger;
        private readonly IConfiguration _config;
        private readonly ApplicationDbContext _context;
        private readonly IPasswordHasher _passwordHasher;
        private readonly ITokenService _tokenService;
        private readonly IAccountService _accountService;
        private readonly IMapper _mapper;
        private readonly RoleManager<ApplicationRole> _roleManager;
        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IEmailSender emailSender,
            ILogger<AccountController> logger,
            IConfiguration config,
            ApplicationDbContext context,
            IPasswordHasher passwordHasher,
            ITokenService tokenService,
            IAccountService accountService,
            IMapper mapper,
                RoleManager<ApplicationRole> roleManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _emailSender = emailSender;
            _logger = logger;
            _config = config;
            _context = context;
            _passwordHasher = passwordHasher;
            _tokenService = tokenService;
            _accountService = accountService;
            _mapper = mapper;
            _roleManager = roleManager;
        }

        [HttpPost("Register")]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        [AllowAnonymous]
        public async Task<IActionResult> Register(RegisterRequest request)
        {

            var user = new ApplicationUser { UserName = request.Name, Email = request.Email };
            var result = await _userManager.CreateAsync(user, request.Password);
            if (result.Succeeded)
            {
                var res = await _accountService.SendEmailConfirmation(user);
                if (res.StatusCode != 200)
                {
                    return new OkObjectResult(res);
                }      
                // add user 
                //var refreshUser = _context.UserRefreshTokens.SingleOrDefault(u => u.UserName == request.Email);
                //if (refreshUser != null) return new OkObjectResult(ApiResponse<Object>.ErrorResult(System.Net.HttpStatusCode.Conflict, message: "User name already exists."));

                //_context.UserRefreshTokens.Add(new UserRefreshToken
                //{
                //    UserName = request.Email,
                //    Password = _passwordHasher.GenerateIdentityV3Hash(request.Password)
                //});

                //await _context.SaveChangesAsync();
                //var refreshUser = _context.UserRefreshTokens.SingleOrDefault(u => u.UserName == request.Email);
                return new OkObjectResult(ApiResponse<bool>.SuccessResult(true));
            }
            var message = "Could not register user.";
            if (result.Errors.Any())
                message = result.Errors.First().Description;
            return new OkObjectResult(ApiResponse<bool>.ErrorResult(message: message));
        }

        [HttpPost("RefreshToken")]
        [AllowAnonymous]
        public async Task<IActionResult> RefreshToken(string authenticationToken, string refreshToken)
        {
            var principal = _tokenService.GetPrincipalFromExpiredToken(authenticationToken);
            var username = principal.Identity.Name; //this is mapped to the Name claim by default

            var user = _context.UserRefreshTokens.SingleOrDefault(u => u.UserName == username);
            if (user == null || user.RefreshToken != refreshToken) return BadRequest();

            var newJwtToken = _tokenService.GenerateAccessToken(principal.Claims);
            var newRefreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            await _context.SaveChangesAsync();

            return new ObjectResult(new
            {
                authenticationToken = newJwtToken,
                refreshToken = newRefreshToken
            });
        }

        [AllowAnonymous]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        [HttpGet, Route("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail(string userId, string code)
        {
            var result = await _accountService.ConfirmEmail(userId, code);
            return new OkObjectResult(result);
        }

        [AllowAnonymous]
        [ProducesResponseType(typeof(ApiResponse<LoginResponse>), 200)]
        [HttpPost("SignIn")]
        public async Task<IActionResult> SignIn(LoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user != null)
            {
                if (!string.IsNullOrEmpty(user.ExternalLoginProvider))
                {
                    return new OkObjectResult(ApiResponse<EventModel>.ErrorResult("user doesn't exist or the user is an external provider", ApiResponseCodeEnum.UserLogedInWithExternalProvider));
                }
                var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
                if (result.Succeeded)
                {
                    var roles = await _userManager.GetRolesAsync(user);
                    var claims = new List<Claim>
                    {
                            new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                            new Claim(JwtRegisteredClaimNames.Email, user.Email),
                            new Claim(ClaimTypes.Name, user.Email),
                            //new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                            new Claim("UserId",user.Id.ToString())
                        };
                    foreach (var userRole in roles)
                    {
                        claims.Add(new Claim(ClaimTypes.Role, userRole));
                    }

                    var token = _tokenService.GenerateAccessToken(claims);
                    var newRefreshToken = _tokenService.GenerateRefreshToken();

                    //var userRefreshToken = _context.UserRefreshTokens.Where(urt => urt.UserName == user.Email).FirstOrDefault();
                    //if (userRefreshToken == null)
                    //    return BadRequest("refresh token is null");
                    //userRefreshToken.RefreshToken = newRefreshToken;
                    //await _context.SaveChangesAsync();
                    return new OkObjectResult(ApiResponse<LoginResponse>.SuccessResult(new LoginResponse
                    {
                        Token = token,
                        ID = user.Id,
                        Roles = roles.ToList()
                    }));
                }
                else if (result.IsNotAllowed)
                    return new OkObjectResult(ApiResponse<EventModel>.ErrorResult("please confirm your account", ApiResponseCodeEnum.EmailNotConfirmed));
                else return new OkObjectResult(ApiResponse<EventModel>.ErrorResult("User name or password are incorrect", ApiResponseCodeEnum.InvalidUserNameOrPassword));

            }
            else return new OkObjectResult(ApiResponse<EventModel>.ErrorResult("user doesn't exist", ApiResponseCodeEnum.UserNowFound));
        }

        [HttpGet("UserProfile")]
        public async Task<IActionResult> UserProfile()
        {

            var name = _userManager.GetUserName(HttpContext.User);
            var user = await _userManager.FindByEmailAsync(name);
            //var user = await _userManager.GetUserAsync(HttpContext.User);
            var userProfile = _mapper.Map<UserProfile>(user);
            return Ok(userProfile);

        }

        [AllowAnonymous]
        [ProducesResponseType(typeof(ApiResponse<LoginResponse>), 200)]
        [HttpPost("ExternalLogin")]
        public async Task<IActionResult> ExternalLogin([FromBody] ExternalAuthRequest externalAuth)
        {
            var payload = await _tokenService.VerifyGoogleToken(externalAuth);
            if (payload == null)
                return BadRequest("Invalid External Authentication.");
            var info = new UserLoginInfo(externalAuth.Provider, payload.Subject, externalAuth.Provider);
            var user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
            if (user == null)
            {
                user = await _userManager.FindByEmailAsync(payload.Email);
                if (user == null)
                {
                    user = new ApplicationUser { Email = payload.Email, UserName = payload.Name, ExternalLoginProvider = externalAuth.Provider };
                    var res = await _userManager.CreateAsync(user);
                    if (!res.Succeeded)
                    {
                        return new OkObjectResult(ApiResponse<bool>.ErrorResult(message: "User create failed"));
                    }
                    await _userManager.AddLoginAsync(user, info);
                }
                else
                {
                    await _userManager.AddLoginAsync(user, info);
                }
            }
            if (user == null)
                return new OkObjectResult(ApiResponse<bool>.ErrorResult("Invalid External Authentication", ApiResponseCodeEnum.UserNowFound, HttpStatusCode.BadRequest));
            //check for the Locked out account
            //var token = await _tokenService.GenerateToken(user);
            //return Ok(new AuthResponseDto { Token = token, IsAuthSuccessful = true });
            var roles = await _userManager.GetRolesAsync(user) ?? new List<string>();
            var claims = new List<Claim>()
                       {
                            new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                            new Claim(JwtRegisteredClaimNames.Email, user.Email),
                            new Claim(ClaimTypes.Name, user.Email),
                            //new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                            new Claim("UserId",user.Id.ToString()),

                        };
            foreach (var userRole in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            var token = _tokenService.GenerateAccessToken(claims);
            var newRefreshToken = _tokenService.GenerateRefreshToken();

            //var userRefreshToken = _context.UserRefreshTokens.Where(urt => urt.UserName == user.Email).FirstOrDefault();
            //if (userRefreshToken == null)
            //    return BadRequest("refresh token is null");
            //userRefreshToken.RefreshToken = newRefreshToken;
            //await _context.SaveChangesAsync();
            return new OkObjectResult(ApiResponse<LoginResponse>.SuccessResult(new LoginResponse
            {
                Token = token,
                //RefreshToken = newRefreshToken,
                ID = user.Id,
                Roles = roles.ToList()
            }));
        }

        [AllowAnonymous]
        [HttpGet("ForgotPassword")]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        public async Task<IActionResult> ForgotPassword(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return new OkObjectResult(ApiResponse<bool>.ErrorResult("user not found", ApiResponseCodeEnum.UserNowFound, HttpStatusCode.BadRequest));

            var res = await _accountService.ResendPassword(user, email);
            return new OkObjectResult(res);
        }

        [AllowAnonymous]
        [HttpPost("ResetPassword")]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        public async Task<ActionResult> ResetPassword(ResetPasswordModel model)
        {
            var res = await _accountService.ResetPassword(model);
            return new OkObjectResult(res);
        }

        [AllowAnonymous]
        [HttpGet("SendEmailConfirmation/{email}")]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        public async Task<IActionResult> SendEmailConfirmation(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return new OkObjectResult(ApiResponse<bool>.ErrorResult(message: "user not found", ApiResponseCodeEnum.UserNowFound));

            var res = await _accountService.SendEmailConfirmation(user);
            return new OkObjectResult(res);
        }
    }
}
