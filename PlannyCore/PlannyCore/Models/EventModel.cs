using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using PlannyCore.Data.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using PlannyCore.Data.Entities.Identity;

namespace PlannyCore.Models
{
    public class EventModel:UserIdModel
    {
        [Required]
        [StringLength(40)]
        public string Name { get; set; }
        public DateTime? Date { get; set; }
        //maybe remove it
        //public virtual ApplicationUser? User { get; set; }
        public virtual List<EventGroupModel>? EventGroups { get; set; }
        public bool? IsTemplate { get; set; }

        public int? EventSourceID { get; set; }
        public int? EventTypeID { get; set; }

    }
}
