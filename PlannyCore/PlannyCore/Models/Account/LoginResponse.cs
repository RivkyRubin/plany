namespace PlannyCore.Models.Account
{
    public class LoginResponse
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public int ID { get; set; }
        public List<string> Roles { get; set; }
    }
}
