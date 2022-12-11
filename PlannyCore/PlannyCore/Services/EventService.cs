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
    public interface IEventService : IBaseUserCRUDService<Event, EventModel>
    {
        Task<ApiResponse<EventModel>> GetEventWithDetailsByIdAsync(int id);
        Task<ApiResponse<List<EventModel>>> GetTemplates();
        Task<ApiResponse<List<EventModel>>> GetUserTemplates(int userID);
    }
    public class EventService : BaseUserCRUDService<Event, EventModel>, IEventService
    {
        private readonly IEventRepository _eventRepository;
        private readonly IMapper _mapper;
        private readonly IEntityBaseRepository<EventGroup, int> _eventGroupRepository;
        private readonly IEntityBaseRepository<EventGroupLine, int> _eventGroupLineRepository;

        public EventService(IEventRepository eventRepository, IMapper mapper, IEntityBaseRepository<EventGroup, int> eventGroupRepository, IEntityBaseRepository<EventGroupLine, int> eventGroupLineRepository) : base(eventRepository, mapper)
        {
            this._eventRepository = eventRepository;
            this._mapper = mapper;
            this._eventGroupRepository = eventGroupRepository;
            this._eventGroupLineRepository = eventGroupLineRepository;
        }

        public async Task<ApiResponse<EventModel>> GetEventWithDetailsByIdAsync(int id)
        {
            try
            {
                var result = await _eventRepository.GetEventDetailsByIdAsync(id);
                var model = _mapper.Map<Event, EventModel>(result);

                return ApiResponse<EventModel>.SuccessResult(model);
            }
            catch (Exception ex) when (ex is FailException || ex is ValidationException || ex is ArgumentException)
            {
                return ApiResponse<EventModel>.ErrorResult(message: ex.Message, statusCode: HttpStatusCode.BadRequest);
            }
            catch (Exception ex) when (ex is ErrorException)
            {
                //LoggingManager.Error(ex.ToString());
                return ApiResponse<EventModel>.ErrorResult(message: ex.Message);
            }
            catch (Exception ex)
            {
                //LoggingManager.Error(ex.ToString());
                return ApiResponse<EventModel>.ErrorResult(message: ex.Message);
            }
        }

        public async Task<ApiResponse<List<EventModel>>> GetTemplates()
        {
            try
            {
                var result = await _eventRepository.GetTemplates();
                var model = _mapper.Map<List<Event>, List<EventModel>>(result);
                return ApiResponse<List<EventModel>>.SuccessResult(model);
            }
            catch (Exception ex) when (ex is FailException || ex is ValidationException || ex is ArgumentException)
            {
                return ApiResponse<List<EventModel>>.ErrorResult(message: ex.Message, statusCode: HttpStatusCode.BadRequest);
            }
            catch (Exception ex) when (ex is ErrorException)
            {
                //LoggingManager.Error(ex.ToString());
                return ApiResponse<List<EventModel>>.ErrorResult(message: ex.Message);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<EventModel>>.ErrorResult(message: ex.Message);
            }
        }

        public async Task<ApiResponse<List<EventModel>>> GetUserTemplates(int userID)
        {
            try
            {
                var result = await _eventRepository.GetTemplates();
                var events = await _eventRepository.GetAllAsync();
                // var syncRes = await Task.WhenAll(templates, events);
                result.AddRange(events);
                var model = _mapper.Map<List<Event>, List<EventModel>>(result);
                return ApiResponse<List<EventModel>>.SuccessResult(model);
            }
            catch (Exception ex) when (ex is FailException || ex is ValidationException || ex is ArgumentException)
            {
                return ApiResponse<List<EventModel>>.ErrorResult(message: ex.Message, statusCode: HttpStatusCode.BadRequest);
            }
            catch (Exception ex) when (ex is ErrorException)
            {
                //LoggingManager.Error(ex.ToString());
                return ApiResponse<List<EventModel>>.ErrorResult(message: ex.Message);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<EventModel>>.ErrorResult(message: ex.Message);
            }
        }
        public async override Task AfterAdd(Event entity)
        {
            bool hasGroup = false;
            var eventSourceID = entity.EventSourceID;
            if (eventSourceID.HasValue)
            {
                var eventSource = await _eventRepository.GetEventDetailsByIdAsync(eventSourceID.Value);
                if (eventSource != null)
                {
                    var eventSourceGroups = eventSource.EventGroups;
                    foreach (var group in eventSourceGroups)
                    {
                        var newGroup = new EventGroup() { EventId = entity.Id, GroupName = group.GroupName };
                        var newGroupRes = await _eventGroupRepository.AddAsync(newGroup);
                        if (newGroupRes != null)
                        {
                            hasGroup = true;
                            foreach (var line in group.EventGroupLines)
                            {
                                var newLine = new EventGroupLine() { EventGroupId = newGroupRes.Id, Name = line.Name };
                                await _eventGroupLineRepository.AddAsync(newLine);
                            }
                        }

                    }
                }
            }
            if (!hasGroup)
            {
                //sets a default group
                await _eventGroupRepository.AddAsync(new EventGroup()
                {
                    EventId = entity.Id,
                    GroupName = "Generic"
                });
            }
        }

        public new async Task<ApiResponse<int?>> AddAsync(EventModel model)
        {
             if (model.EventSourceID.HasValue)
            {
                var srcEventID = await _eventRepository.GetByIdAsync(model.EventSourceID.Value);
                if (srcEventID != null)
                {
                    if (srcEventID.IsTemplate.HasValue && srcEventID.IsTemplate.Value)
                    {
                        model.EventTypeID = srcEventID.Id;
                    }
                    else model.EventTypeID = srcEventID.EventTypeID;
                }
            }
            return await base.AddAsync(model);
        }


    }
}
