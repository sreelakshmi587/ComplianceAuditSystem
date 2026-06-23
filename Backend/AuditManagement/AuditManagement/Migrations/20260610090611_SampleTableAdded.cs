using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuditManagement.Migrations
{
    /// <inheritdoc />
    public partial class SampleTableAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupPermissions_Permission_PermissionId",
                table: "GroupPermissions");

            migrationBuilder.DropForeignKey(
                name: "FK_Permission_PermissionModule_ModuleId",
                table: "Permission");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PermissionModule",
                table: "PermissionModule");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Permission",
                table: "Permission");

            migrationBuilder.RenameTable(
                name: "PermissionModule",
                newName: "PermissionModules");

            migrationBuilder.RenameTable(
                name: "Permission",
                newName: "Permissions");

            migrationBuilder.RenameIndex(
                name: "IX_Permission_ModuleId",
                table: "Permissions",
                newName: "IX_Permissions_ModuleId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PermissionModules",
                table: "PermissionModules",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Permissions",
                table: "Permissions",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Sample",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sample", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_GroupPermissions_Permissions_PermissionId",
                table: "GroupPermissions",
                column: "PermissionId",
                principalTable: "Permissions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Permissions_PermissionModules_ModuleId",
                table: "Permissions",
                column: "ModuleId",
                principalTable: "PermissionModules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupPermissions_Permissions_PermissionId",
                table: "GroupPermissions");

            migrationBuilder.DropForeignKey(
                name: "FK_Permissions_PermissionModules_ModuleId",
                table: "Permissions");

            migrationBuilder.DropTable(
                name: "Sample");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Permissions",
                table: "Permissions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PermissionModules",
                table: "PermissionModules");

            migrationBuilder.RenameTable(
                name: "Permissions",
                newName: "Permission");

            migrationBuilder.RenameTable(
                name: "PermissionModules",
                newName: "PermissionModule");

            migrationBuilder.RenameIndex(
                name: "IX_Permissions_ModuleId",
                table: "Permission",
                newName: "IX_Permission_ModuleId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Permission",
                table: "Permission",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PermissionModule",
                table: "PermissionModule",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupPermissions_Permission_PermissionId",
                table: "GroupPermissions",
                column: "PermissionId",
                principalTable: "Permission",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Permission_PermissionModule_ModuleId",
                table: "Permission",
                column: "ModuleId",
                principalTable: "PermissionModule",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
