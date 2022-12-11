using Microsoft.EntityFrameworkCore;
using PlannyCore.Data;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using PlannyCore.DomainModel;

namespace PlannyCore.Dal
{
    public interface IEntityBaseRepository<T,Key> where T : class, IEntityBase, new()
    {
        Task<T> AddAsync(T entity);
        Task<T> GetByIdAsync(Key id);
        Task<List<T>> GetAllAsync();
        Task<bool> DeleteAsync(Key id);
        Task DeleteAsync(T entity);
        Task DeleteAsync(List<T> items);
        Task UpdateAsync(T entity);
    }
    public class EntityBaseRepository<T, Key> : IEntityBaseRepository<T, Key> where T : class, IEntityBase, new()
    {
        private ApplicationDbContext db;    //my database context
        private DbSet<T> entities;  //specific set

        public EntityBaseRepository(ApplicationDbContext db)
        {
            entities = db.Set<T>();
            this.db = db;
        }

        public async Task<T> AddAsync(T entity)
        {
            await entities.AddAsync(entity);
            await db.SaveChangesAsync();
            return entity;
        }

        public async Task<T> GetByIdAsync(Key id)
        {
            return await entities.FindAsync(id);
        }

        public async Task<List<T>> GetAllAsync()
        {
            return await entities.ToListAsync();
        }

        public async Task<bool> DeleteAsync(Key id)
        {
            T objectToDelete = await entities.FindAsync(id);
            if (objectToDelete == null)
            {
                return false;
            }
            entities.Remove(objectToDelete);
            await db.SaveChangesAsync();

            return true;
        }

        public async Task DeleteAsync(T entity)
        {
            entities.Remove(entity);
            await db.SaveChangesAsync();
        }

        public async Task DeleteAsync(List<T> items)
        {
            foreach (T entity in items)
            {
                entities.Remove(entity);
            }
            await db.SaveChangesAsync();
        }

        public async Task UpdateAsync(T entity)
        {
            entities.Attach(entity);
            db.Entry(entity).State = EntityState.Modified;
            await db.SaveChangesAsync();
        }

        public void Dispose()
        {
            db.Dispose();
        }
    }
}
