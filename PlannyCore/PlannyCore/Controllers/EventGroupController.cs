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
    public class EventGroupController : BaseApiController<EventGroup,EventGroupModel>
    {
        private readonly IBaseCRUDService<EventGroup,EventGroupModel> _service;

        public EventGroupController(IBaseCRUDService<EventGroup,EventGroupModel> service, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager):base(service, userManager,signInManager)
        {
            this._service = service;
        }
    }
}
