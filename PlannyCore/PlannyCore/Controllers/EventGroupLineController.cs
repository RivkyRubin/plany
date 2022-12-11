using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using PlannyCore.Data.Entities;
using PlannyCore.Data.Entities.Identity;
using PlannyCore.DomainModel.Exceptions;
using PlannyCore.Models;
using PlannyCore.Services;
using System.Security.Claims;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace PlannyCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventGroupLineController : BaseApiController<EventGroupLine,EventGroupLineModel>
    {
        private readonly IBaseCRUDService<EventGroupLine,EventGroupLineModel> _service;

        public EventGroupLineController(IBaseCRUDService<EventGroupLine,EventGroupLineModel> service, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager):base(service, userManager,signInManager)
        {
            this._service = service;
        }
    }
}
