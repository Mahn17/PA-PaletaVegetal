using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PA_PaletaVegetal.Server.Migrations
{
    /// <inheritdoc />
    public partial class MedidasActualizadas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Tronco",
                table: "Vegetacion",
                newName: "TroncoMin");

            migrationBuilder.RenameColumn(
                name: "Copa",
                table: "Vegetacion",
                newName: "TroncoMax");

            migrationBuilder.RenameColumn(
                name: "Altura",
                table: "Vegetacion",
                newName: "CopaMin");

            migrationBuilder.AddColumn<double>(
                name: "AlturaMax",
                table: "Vegetacion",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "AlturaMin",
                table: "Vegetacion",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "CopaMax",
                table: "Vegetacion",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AlturaMax",
                table: "Vegetacion");

            migrationBuilder.DropColumn(
                name: "AlturaMin",
                table: "Vegetacion");

            migrationBuilder.DropColumn(
                name: "CopaMax",
                table: "Vegetacion");

            migrationBuilder.RenameColumn(
                name: "TroncoMin",
                table: "Vegetacion",
                newName: "Tronco");

            migrationBuilder.RenameColumn(
                name: "TroncoMax",
                table: "Vegetacion",
                newName: "Copa");

            migrationBuilder.RenameColumn(
                name: "CopaMin",
                table: "Vegetacion",
                newName: "Altura");
        }
    }
}
