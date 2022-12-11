using Microsoft.EntityFrameworkCore;
using PlannyCore.Data;
using PlannyCore.DomainModel;
using System.Security.Claims;

namespace PlannyCore.Dal
{
    public interface IUserEntityBaseRepository<T, Key> : IEntityBaseRepository<T, Key> where T : class, IUserIdEntity, new()
    {
        Task<List<T>> GetAllAsync();
    }
    public class UserEntityBaseRepository<T, Key> : EntityBaseRepository<T, Key>, IUserEntityBaseRepository<T, Key> where T : class, IUserIdEntity, new()
    {
        private ApplicationDbContext db;    //my database context
        private DbSet<T> entities;  //specific set
        private IHttpContextAccessor _httpContextAccessor;

        protected UserEntityBaseRepository(ApplicationDbContext db, IHttpContextAccessor httpContextAccessor) : base(db)
        {
            entities = db.Set<T>();
            this.db = db;
            _httpContextAccessor = httpContextAccessor;
        }
        public new async Task<List<T>> GetAllAsync()
        {
            var userId = _httpContextAccessor.HttpContext?.User.FindFirstValue("UserId");
            if (!string.IsNullOrEmpty(userId))
                return await entities.Where(x => x.UserId == int.Parse(userId)).ToListAsync();
            return await entities.ToListAsync();
        }
    }
}
