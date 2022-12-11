using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PlannyCore.Data.Entities;
using PlannyCore.Data.Entities.Identity;

namespace PlannyCore.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, int>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : base(options)
        {
        }
        public DbSet<UserRefreshToken> UserRefreshTokens { get; set; }
        public DbSet<Event> Events { get; set; }
        //public DbSet<EventType> EventTypes { get; set; }
        public DbSet<EventGroup> EventGroups { get; set; }
        public DbSet<EventGroupLine> EventGroupLines { get; set; }
        public DbSet<SystemParameter> SystemParameters { get; set; }
    }
}
