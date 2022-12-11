namespace PlannyCore.DomainModel.Exceptions
{
    public class FailException : Exception
    {
        public FailException(string message) : base(message)
        {
        }
    }
}
