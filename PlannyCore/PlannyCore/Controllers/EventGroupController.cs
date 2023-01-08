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
    public class EventGroupController : BaseApiController<EventGroup, EventGroupModel>
    {
        private readonly IEventGroupService _service;

        public EventGroupController(IEventGroupService service, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager) : base(service, userManager, signInManager)
        {
            this._service = service;
        }

        public override async Task<ActionResult> Post([FromBody] EventGroupModel model)
        {
            if (!model.Order.HasValue)
            {
                var maxOrder = _service.GetMaxGroupOrder(model.EventId);
                model.Order = (maxOrder ?? 0) + 1;
            }
            return await base.Post(model);
        }

        [HttpGet("GetMaxGroupOrder/{eventId}")]
        public async Task<ActionResult<ApiResponse<int?>>> GetMaxGroupOrder(int eventId)
        {
            var maxOrder = _service.GetMaxGroupOrder(eventId);
            var result = ApiResponse<int?>.SuccessResult(maxOrder);
            return new OkObjectResult(result);
        }
    }
}
