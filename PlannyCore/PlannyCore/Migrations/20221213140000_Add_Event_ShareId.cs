using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PlannyCore.Migrations
{
    public partial class Add_Event_ShareId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ShareId",
                table: "Events",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
            migrationBuilder.CreateIndex(
              name: "ShareIdIndex",
              table: "Events",
              column: "ShareId",
              unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ShareId",
                table: "Events");
            migrationBuilder.DropIndex("ShareIdIndex");
        }
    }
}
