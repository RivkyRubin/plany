using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PlannyCore.Migrations
{
    public partial class EventGroupEventIdForeignKey : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_EventGroups_EventId",
                table: "EventGroups",
                column: "EventId");

            migrationBuilder.AddForeignKey(
                name: "FK_EventGroups_Events_EventId",
                table: "EventGroups",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventGroups_Events_EventId",
                table: "EventGroups");

            migrationBuilder.DropIndex(
                name: "IX_EventGroups_EventId",
                table: "EventGroups");
        }
    }
}
