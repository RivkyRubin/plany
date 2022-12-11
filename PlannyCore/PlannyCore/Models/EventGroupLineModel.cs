using PlannyCore.Data.Entities.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlannyCore.Models
{
    public class EventGroupLineModel:ModelBase
    {
        public int EventGroupId { get; set; }
        [StringLength(40)]
        [Required]
        public string Name { get; set; }
        public int? CreatedByUserId { get; set; }
        public bool? IsDone { get; set; }
    }
}
