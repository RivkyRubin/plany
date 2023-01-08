using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using PlannyCore.DomainModel;
using PlannyCore.Data.Entities.Identity;

namespace PlannyCore.Data.Entities
{
    public class Event : UserIdEntity
    {
        [ForeignKey("User")]
        public new int UserId { get; set; }

        [StringLength(40)]
        [Column(TypeName = "VARCHAR(40)")]
        public string Name { get; set; }
        public DateTime? Date { get; set; }
        public virtual ApplicationUser? User { get; set; }
        public ICollection<EventGroup> EventGroups { get; set; }
        public bool? IsTemplate { get; set; }
        public int? EventSourceID { get; set; }
        public int? EventTypeID { get; set; }
        [StringLength(40)]
        [Column(TypeName = "VARCHAR(40)")]
        public string? Location { get; set; }
        public Guid ShareId { get; set; }
    }
}
