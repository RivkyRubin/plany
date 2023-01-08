using AutoMapper;
using PlannyCore.Dal;
using PlannyCore.Data.Entities;
using PlannyCore.Enums;
using PlannyCore.Models;

namespace PlannyCore.Services
{
    public interface ISystemParameterService : IBaseCRUDService<SystemParameter, SystemParameterModel>
    {
        string GetSystemParameterValue(SystemParameterEnum name);
    }
    public class SystemParameterService : BaseCRUDService<SystemParameter, SystemParameterModel>, ISystemParameterService
    {
        private readonly ISystemParameterRepository _systemParameterRepository;
        private readonly IMapper mapper;

        public SystemParameterService(ISystemParameterRepository systemParameterRepository, IMapper mapper) : base(systemParameterRepository, mapper)
        {
            this._systemParameterRepository = systemParameterRepository;
            this.mapper = mapper;
        }

        public string GetSystemParameterValue(SystemParameterEnum name)
        {
            return _systemParameterRepository.GetSystemParameterValue(name);
        }
    }
}
