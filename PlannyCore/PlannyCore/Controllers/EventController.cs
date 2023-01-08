using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PlannyCore.Data.Entities;
using PlannyCore.Data.Entities.Identity;
using PlannyCore.DomainModel.Exceptions;
using PlannyCore.Migrations;
using PlannyCore.Models;
using PlannyCore.Services;
using System.Security.Claims;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace PlannyCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : BaseApiController<Event, EventModel>
    {
        private readonly IEventService _eventService;
        private readonly UserManager<ApplicationUser> _userManager;


        public EventController(IEventService eventService, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager) : base(eventService, userManager, signInManager)
        {
            this._eventService = eventService;
            this._userManager = userManager;
        }

        [HttpGet("GetEventDetails/{id}")]
        public async Task<ActionResult<ApiResponse<EventModel>>> GetEventDetails(int id)
        {
            var result = await _eventService.GetEventWithDetailsByIdAsync(id);
            return new OkObjectResult(result);
        }

        [HttpGet("GetTemplates")]
        public async Task<ActionResult<ApiResponse<List<EventModel>>>> GetTemplates()
        {

            var result = await _eventService.GetTemplates();
            return new OkObjectResult(result);
        }

        [HttpGet("GetUserTemplates")]
        public async Task<ActionResult<ApiResponse<List<EventModel>>>> GetUserTemplates()
        {
            var name = _userManager.GetUserName(HttpContext.User);
            var user = await _userManager.FindByEmailAsync(name);
            var result = await _eventService.GetUserTemplates(user.Id);
            return new OkObjectResult(result);
        }

        public override async Task<ActionResult> Post([FromBody] EventModel model)
        {
            if (model.IsTemplate.HasValue && !await HasRole("Admin"))
            {
                model.IsTemplate = null;
            }
            return await base.Post(model);
        }
        public override async Task<ActionResult> Put(int id,[FromBody] EventModel model)
        {
            if (model.IsTemplate.HasValue && !await HasRole("Admin"))
            {
                model.IsTemplate = null;
            }
            return await base.Put(id,model);
        }
    }

}
