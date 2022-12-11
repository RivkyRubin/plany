using AutoMapper;
using PlannyCore.Dal;
using PlannyCore.DomainModel;
using PlannyCore.DomainModel.Exceptions;
using PlannyCore.Models;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Security.Claims;

namespace PlannyCore.Services
{
    public interface IBaseUserCRUDService<T, TModel> : IBaseCRUDService<T,TModel> where T : class, IUserIdEntity, new()
    {
    }
    public class BaseUserCRUDService<T, TModel>:BaseCRUDService<T,TModel>, IBaseUserCRUDService<T,TModel>
        where T : class, IUserIdEntity, new()
    {
        
        private readonly IUserEntityBaseRepository<T, int> _dbRepository;
        IMapper _mapper;
        public BaseUserCRUDService(IUserEntityBaseRepository<T, int> dbRepository, IMapper mapper):base(dbRepository, mapper)
        {
            this._dbRepository = dbRepository;
            this._mapper = mapper;
        }

    }
}
