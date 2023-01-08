using PlannyCore.Controllers;
using PlannyCore.Dal;
using PlannyCore.DomainModel.Exceptions;
using PlannyCore.Models;
using System.ComponentModel.DataAnnotations;
using System.Net;

namespace PlannyCore.Services
{
    public interface IAdminService
    {
        ApiResponse<Boolean> UpdateDatabase();
    }
    public class AdminService:IAdminService
    {
        private readonly IAdminRepository _adminRepository;
        private readonly ILogger<AdminService> _logger;
        public AdminService(IAdminRepository adminRepository,
                     ILogger<AdminService> logger)
        {
            _adminRepository = adminRepository;
            _logger = logger;
        }

        public ApiResponse<Boolean> UpdateDatabase()
        {
            try
            {
                _adminRepository.UpdateDatabase();
                return ApiResponse<Boolean>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ApiResponse<Boolean>.ErrorResult(message: ex.Message, statusCode: HttpStatusCode.BadRequest);
            }
        }
    }
}
