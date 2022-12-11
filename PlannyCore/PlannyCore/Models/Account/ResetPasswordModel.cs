namespace PlannyCore.Models.Account
{
    public class ResetPasswordModel
    {
            public string Password { get; set; }
            public string UserID { get; set; }
            public string Code { get; set; }
    }
}
