using PlannyCore.Data;
using PlannyCore.Data.Entities;

namespace PlannyCore.Dal
{
    public interface IEventTypeRepository : IEntityBaseRepository<EventType, int>
    {

    }
    public class EventTypeRepository : EntityBaseRepository<EventType, int>, IEventTypeRepository
    {
        private ApplicationDbContext _db;
        public EventTypeRepository(ApplicationDbContext db) : base(db)
        {
            this._db = db;
        }
    }
}
