using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PA_PaletaVegetal.Server.Migrations
{
    /// <inheritdoc />
    public partial class ActualizacionTipos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Asoleamiento",
                table: "Vegetacion",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Crecimiento",
                table: "Vegetacion",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Estatus",
                table: "Vegetacion",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Raiz",
                table: "Vegetacion",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Riego",
                table: "Vegetacion",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Asoleamiento",
                table: "Vegetacion");

            migrationBuilder.DropColumn(
                name: "Crecimiento",
                table: "Vegetacion");

            migrationBuilder.DropColumn(
                name: "Estatus",
                table: "Vegetacion");

            migrationBuilder.DropColumn(
                name: "Raiz",
                table: "Vegetacion");

            migrationBuilder.DropColumn(
                name: "Riego",
                table: "Vegetacion");
        }
    }
}
