namespace PlannyCore.Data.Entities
{
    public class UserRefreshToken
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string? RefreshToken { get; set; }
    }
}
