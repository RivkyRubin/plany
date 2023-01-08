using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PlannyCore.Migrations
{
    public partial class Add_Event_Location : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "Events",
                type: "VARCHAR(40)",
                maxLength: 40,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Location",
                table: "Events");
        }
    }
}
