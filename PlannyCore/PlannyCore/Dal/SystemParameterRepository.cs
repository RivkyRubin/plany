using PlannyCore.Data.Entities;
using PlannyCore.Data;

namespace PlannyCore.Dal
{
    public interface ISystemParameterRepository : IEntityBaseRepository<SystemParameter, int>
    {
        string GetSystemParameterValue(string name);
    }
    public class SystemParameterRepository : EntityBaseRepository<SystemParameter, int>, ISystemParameterRepository
    {
        private ApplicationDbContext _db;
        public SystemParameterRepository(ApplicationDbContext db) : base(db)
        {
            this._db = db;

        }

        public string GetSystemParameterValue(string name)
        {
            var systemParamter = _db.SystemParameters.FirstOrDefault(x => x.Name == name);
            if (systemParamter != null)
                return systemParamter.Value;
            return String.Empty;
        }
    }
}
