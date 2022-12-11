namespace PlannyCore.DomainModel
{
    public interface IUserIdEntity : IEntityBase
    {
        public int UserId { get; set; }
    }
    public class UserIdEntity : EntityBase, IUserIdEntity
    {
        public int UserId { get; set; }
    }
}
