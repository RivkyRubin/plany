using Microsoft.AspNetCore.Identity;

namespace PlannyCore.Data.Entities.Identity
{
    public class ApplicationUser:IdentityUser<int>
    {
         public string? ExternalLoginProvider { get; set; }
    }
}
