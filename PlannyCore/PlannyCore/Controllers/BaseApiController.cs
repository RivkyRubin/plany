using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PlannyCore.Data.Entities.Identity;
using PlannyCore.DomainModel;
using PlannyCore.Models;
using PlannyCore.Services;
using System.Security.Claims;

namespace PlannyCore.Controllers
{
    public abstract class BaseApiController<T, TModel> : ControllerBase
         where T : class, IEntityBase, new()
    {
        private readonly IBaseCRUDService<T, TModel> _service;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;


        public BaseApiController(IBaseCRUDService<T, TModel> service, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
        {
            this._service = service;
            this._userManager = userManager;
            this._signInManager = signInManager;
        }

        //[SwaggerResponse(400, type: null, description: "Bad Request")]
        //[SwaggerResponse(500, type: null, description: "Internal Server Error")]
        //[ProducesResponseType(typeof(ApiResponse<List<TModel>>), 200)]
        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<TModel>>>> Get()
        {
            var result = await _service.GetAllAsync();
            return new OkObjectResult(result);
        }


        //[SwaggerResponse(400, type: null, description: "Bad Request")]
        //[SwaggerResponse(500, type: null, description: "Internal Server Error")]
        //[ProducesResponseType(typeof(ApiResponse<EventModel>), 200)]
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<TModel>>> Get(int id)
        {
            var result = await _service.GetByIdAsync(id);
            return new OkObjectResult(result);
        }

        [HttpPut("{id}")]
        //[SwaggerResponse(400, type: null, description: "Bad Request")]
        //[SwaggerResponse(500, type: null, description: "Internal Server Error")]
        [ProducesResponseType(typeof(ApiResponse<int?>), 200)]
        public async Task<ActionResult> Put(int id,[FromBody] TModel model)
        {
            var result = await _service.UpdateAsync(model);
            return new OkObjectResult(result);
        }

        [HttpPost]
        //[SwaggerResponse(400, type: null, description: "Bad Request")]
        //[SwaggerResponse(500, type: null, description: "Internal Server Error")]
        [ProducesResponseType(typeof(ApiResponse<int?>), 200)]
        public async Task<ActionResult> Post([FromBody] TModel model)
        {
            var userId = HttpContext.User.FindFirstValue("UserId");
            if (model is IUserIdModel) 
            {
                (model as IUserIdModel)!.UserId = int.Parse(userId);
            }
            var result = await _service.AddAsync(model);
            return new OkObjectResult(result);
        }

        [HttpDelete("{id}")]
        //[SwaggerResponse(400, type: null, description: "Bad Request")]
        //[SwaggerResponse(500, type: null, description: "Internal Server Error")]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _service.DeleteAsync(id);
            return new OkObjectResult(entity.Data);
        }
    }
}
