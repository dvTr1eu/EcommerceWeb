using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEntityChat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsRead",
                table: "ChatMessages");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "ChatMessages",
                newName: "SenderId");

            migrationBuilder.RenameColumn(
                name: "Timestamp",
                table: "ChatMessages",
                newName: "SendAt");

            migrationBuilder.RenameColumn(
                name: "AdminId",
                table: "ChatMessages",
                newName: "ReceiverId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SenderId",
                table: "ChatMessages",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "SendAt",
                table: "ChatMessages",
                newName: "Timestamp");

            migrationBuilder.RenameColumn(
                name: "ReceiverId",
                table: "ChatMessages",
                newName: "AdminId");

            migrationBuilder.AddColumn<bool>(
                name: "IsRead",
                table: "ChatMessages",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
