using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PlannyCore.Migrations
{
    public partial class EventGroupLineEventGroupIdForeignKey : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_EventGroupLines_EventGroupId",
                table: "EventGroupLines",
                column: "EventGroupId");

            migrationBuilder.AddForeignKey(
                name: "FK_EventGroupLines_EventGroups_EventGroupId",
                table: "EventGroupLines",
                column: "EventGroupId",
                principalTable: "EventGroups",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventGroupLines_EventGroups_EventGroupId",
                table: "EventGroupLines");

            migrationBuilder.DropIndex(
                name: "IX_EventGroupLines_EventGroupId",
                table: "EventGroupLines");
        }
    }
}
