namespace PlannyCore.Models
{
    public interface IUserIdModel
    {
        public int UserId { get; set; }
    }
    public class UserIdModel : ModelBase, IUserIdModel
    {
        public int UserId { get; set; }
    }
}
