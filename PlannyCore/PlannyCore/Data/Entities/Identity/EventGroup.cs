using PlannyCore.DomainModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlannyCore.Data.Entities.Identity
{
    public class EventGroup : EntityBase
    {
        [ForeignKey("Event")]
        public int EventId { get; set; }
        public string GroupName { get; set; }
        public int? Order { get; set; }
        public virtual Event Event { get; set; }
        public ICollection<EventGroupLine> EventGroupLines { get; set; }
    }
}
