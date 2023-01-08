using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PlannyCore.Migrations
{
    public partial class EventGroup_Add_Order : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "EventGroups",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Order",
                table: "EventGroups");
        }
    }
}
