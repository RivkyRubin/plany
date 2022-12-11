using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PlannyCore.Migrations
{
    public partial class Events_Add_EventTypeID : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EventTypeID",
                table: "Events",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EventTypeID",
                table: "Events");
        }
    }
}
