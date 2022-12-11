using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using PlannyCore.DomainModel;

namespace PlannyCore.Data.Entities
{
    public class EventType : EntityBase
    {
        [StringLength(40)]
        [Column(TypeName = "VARCHAR(40)")]
        public string Name { get; set; }
    }
}
