using PlannyCore.Data.Entities;
using PlannyCore.Data;
using PlannyCore.Data.Entities.Identity;

namespace PlannyCore.Dal
{
    public interface IEventGroupRepository : IEntityBaseRepository<EventGroup, int>
    {
        int? GetMaxGroupOrder(int id);
    }
    public class EventGroupRepository : EntityBaseRepository<EventGroup, int>, IEventGroupRepository
    {
        private ApplicationDbContext _db;

        public EventGroupRepository(ApplicationDbContext db):base(db)
        {
            this._db = db;
        }

        public int? GetMaxGroupOrder(int id)
        {
            var maxOrder = _db.EventGroups.Where(x => x.EventId == id).Max(x=>x.Order);
            return maxOrder;
        }

    }
}
