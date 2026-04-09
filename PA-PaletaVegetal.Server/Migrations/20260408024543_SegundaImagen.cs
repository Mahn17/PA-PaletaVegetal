using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PA_PaletaVegetal.Server.Migrations
{
    /// <inheritdoc />
    public partial class SegundaImagen : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TablaCromaticaUrl",
                table: "Vegetacion",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TablaCromaticaUrl",
                table: "Vegetacion");
        }
    }
}
