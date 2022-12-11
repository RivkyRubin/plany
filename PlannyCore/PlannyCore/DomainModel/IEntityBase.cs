namespace PlannyCore.DomainModel
{
    public interface IEntityBase
    {
        int Id { get; set; }
        DateTime? CreatedDate { get; set; }
        DateTime? UpdatedDate { get; set; }
    }
}
