using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using PlannyCore.Data;
using PlannyCore.Data.Entities;
using System.Security.Cryptography.Xml;

namespace PlannyCore.Dal
{
    public interface IEventRepository : IUserEntityBaseRepository<Event, int>
    {
        Task<Event> GetEventDetailsByIdAsync(int id);
        Task<List<Event>> GetTemplates();
    }
    public class EventRepository : UserEntityBaseRepository<Event, int>, IEventRepository
    {
        private ApplicationDbContext _db;

        public EventRepository(ApplicationDbContext db, IHttpContextAccessor httpContextAccessor) : base(db,httpContextAccessor)
        {
            this._db = db;
        }

        public async Task<Event> GetEventDetailsByIdAsync(int id)
        {
            var eventGroups = _db.EventGroups.Where(x => x.EventId == id).ToList();
            return  await _db.Events.Include(m => m.EventGroups).ThenInclude(y=>y.EventGroupLines).FirstOrDefaultAsync(x=>x.Id==id);
            //return await db.Set<Event>().FindAsync(id).;
        }

        public async Task<List<Event>> GetTemplates()
        {
            return await _db.Events.Where(x => x.IsTemplate.HasValue && x.IsTemplate.Value).ToListAsync();
        }
    }
}
