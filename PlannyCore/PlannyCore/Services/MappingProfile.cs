using AutoMapper;
using Microsoft.AspNetCore.Identity;
using PlannyCore.Data.Entities;
using PlannyCore.Data.Entities.Identity;
using PlannyCore.Models;
using PlannyCore.Models.Account;

namespace PlannyCore.Services
{
    public class MappingProfile:Profile
    {
        public MappingProfile() {
            CreateMap<ApplicationUser, UserProfile>()
                .ForMember(t => t.Name, opt => opt.MapFrom(t => t.UserName));
            CreateMap<Event, EventModel>()
                .ForMember(dest => dest.EventTypeID,
                   opt => opt.MapFrom
                   (src => src.IsTemplate.HasValue && src.IsTemplate.Value? src.Id : src.EventTypeID)).ReverseMap();
            CreateMap<EventType, EventTypeModel>().ReverseMap();
            CreateMap<EventGroup, EventGroupModel>().ReverseMap();
            CreateMap<EventGroupLine, EventGroupLineModel>().ReverseMap();
            CreateMap<SystemParameter, SystemParameterModel>().ReverseMap();
        }
    }
}
