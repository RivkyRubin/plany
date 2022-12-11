using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using PlannyCore.DomainModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlannyCore.Data.Entities
{
    [Index(nameof(SystemParameter.Name), IsUnique = true)]
    public class SystemParameter : EntityBase
    {
        [Column(TypeName = "VARCHAR(40)")]
        public string Name { get; set; }

        public string Value { get; set; }
    }
}
