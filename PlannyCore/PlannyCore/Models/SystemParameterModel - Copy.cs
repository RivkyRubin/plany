using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using PlannyCore.Data.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace PlannyCore.Models
{
    public class SystemParameterModel:ModelBase
    {
        [StringLength(40)]
        [Required]
        public string Name { get; set; }
        [Required]
        public string Value { get; set; }


    }
}
