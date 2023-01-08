using Microsoft.EntityFrameworkCore;
using PlannyCore.Data;

namespace PlannyCore.Dal
{
    public interface IAdminRepository
    {
        void UpdateDatabase();
    }
    public class AdminRepository:IAdminRepository
    {
        private ApplicationDbContext _db;
        public AdminRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public void UpdateDatabase()
        {

                _db.Database.Migrate();       
        }
    }
}
