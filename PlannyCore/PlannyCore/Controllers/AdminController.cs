using AutoMapper;
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
    //[Authorize(Roles = "Role1")]
    [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]

    public class AdminController : ControllerBase
    {
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly ILogger<AccountController> _logger;
        private readonly IConfiguration _config;
        private readonly ApplicationDbContext _context;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IAdminService _adminService;
        private readonly IAccountService _accountService;
        private readonly IMapper _mapper;
        public AdminController(
            RoleManager<ApplicationRole> roleManager,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IEmailSender emailSender,
            ILogger<AccountController> logger,
            IConfiguration config,
            ApplicationDbContext context,
            IPasswordHasher passwordHasher,
            IAdminService adminService,
            IAccountService accountService,
            IMapper mapper
              )
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _signInManager = signInManager;
            _emailSender = emailSender;
            _logger = logger;
            _config = config;
            _context = context;
            _passwordHasher = passwordHasher;
            _adminService = adminService;
            _accountService = accountService;
            _mapper = mapper;
        }


        [HttpGet("UpdateDatabase")]
        public async Task<ActionResult<ApiResponse<Boolean>>> UpdateDatabase()
        {
            var res = _adminService.UpdateDatabase();
            return new OkObjectResult(res);
        }


    }
}
