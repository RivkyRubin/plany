using AutoMapper;
using PlannyCore.Dal;
using PlannyCore.Data.Entities;
using PlannyCore.Data.Entities.Identity;
using PlannyCore.DomainModel.Exceptions;
using PlannyCore.Models;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Threading.Tasks;

namespace PlannyCore.Services
{
    public interface IEventGroupService : IBaseCRUDService<EventGroup, EventGroupModel>
    {
        int? GetMaxGroupOrder(int id);
    }
    public class EventGroupService : BaseCRUDService<EventGroup, EventGroupModel>, IEventGroupService
    {
        private readonly IEventGroupRepository _eventGroupRepository;
        private readonly IMapper _mapper;

        public EventGroupService(IEventGroupRepository eventGroupRepository, IMapper mapper) : base(eventGroupRepository, mapper)
        {
            this._eventGroupRepository = eventGroupRepository;
            this._mapper = mapper;

        }

        public int? GetMaxGroupOrder(int id)
        {
            var result = _eventGroupRepository.GetMaxGroupOrder(id);
            return result;
        }
    }
}
