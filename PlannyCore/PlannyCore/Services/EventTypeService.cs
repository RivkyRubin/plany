using AutoMapper;
using PlannyCore.Dal;
using PlannyCore.Data.Entities;
using PlannyCore.DomainModel.Exceptions;
using PlannyCore.Models;
using System.ComponentModel.DataAnnotations;
using System.Net;

namespace PlannyCore.Services
{
    public interface IEventTypeService:IBaseCRUDService<EventType,EventTypeModel>
    {
    }
    public class EventTypeService: BaseCRUDService<EventType,EventTypeModel>, IEventTypeService
    {
        private readonly IEventTypeRepository _eventTypeRepository;
        private readonly IMapper mapper;

        public EventTypeService(IEventTypeRepository eventTypeRepository, IMapper mapper) : base(eventTypeRepository, mapper)
        {
            this._eventTypeRepository = eventTypeRepository;
            this.mapper = mapper;
        }
    }
}
