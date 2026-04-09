using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PA_PaletaVegetal.Server.Migrations
{
    /// <inheritdoc />
    public partial class AgregarMedidasVegetacion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Altura",
                table: "Vegetacion",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Copa",
                table: "Vegetacion",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Tronco",
                table: "Vegetacion",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Altura",
                table: "Vegetacion");

            migrationBuilder.DropColumn(
                name: "Copa",
                table: "Vegetacion");

            migrationBuilder.DropColumn(
                name: "Tronco",
                table: "Vegetacion");
        }
    }
}
