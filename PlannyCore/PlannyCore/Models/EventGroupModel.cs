using PlannyCore.Data.Entities;
using System.ComponentModel.DataAnnotations;

namespace PlannyCore.Models
{
    public class EventGroupModel : ModelBase
    {
        public int EventId { get; set; }
        [StringLength(40)]
        [Required]
        public string GroupName { get; set; }
        public virtual List<EventGroupLineModel>? EventGroupLines { get; set; }
    }
}
