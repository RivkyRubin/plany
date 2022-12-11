using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PlannyCore.Migrations
{
    public partial class EventGroupLineEventGroupIdNotNullable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventGroupLines_EventGroups_EventGroupId",
                table: "EventGroupLines");

            migrationBuilder.AlterColumn<int>(
                name: "EventGroupId",
                table: "EventGroupLines",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_EventGroupLines_EventGroups_EventGroupId",
                table: "EventGroupLines",
                column: "EventGroupId",
                principalTable: "EventGroups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventGroupLines_EventGroups_EventGroupId",
                table: "EventGroupLines");

            migrationBuilder.AlterColumn<int>(
                name: "EventGroupId",
                table: "EventGroupLines",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_EventGroupLines_EventGroups_EventGroupId",
                table: "EventGroupLines",
                column: "EventGroupId",
                principalTable: "EventGroups",
                principalColumn: "Id");
        }
    }
}
