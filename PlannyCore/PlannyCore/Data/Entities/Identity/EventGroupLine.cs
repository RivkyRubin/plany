using PlannyCore.DomainModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlannyCore.Data.Entities.Identity
{
    public class EventGroupLine : EntityBase
    {
        [ForeignKey("EventGroup")]
        public int EventGroupId { get; set; }
        public string Name { get; set; }
        [ForeignKey("User")]
        public int? CreatedByUserId { get; set; }
        public bool? IsDone { get; set; }
        public virtual EventGroup EventGroup { get; set; }
    }
}
