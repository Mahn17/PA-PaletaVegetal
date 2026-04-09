using PA_PaletaVegetal.Server.Enums;

namespace PA_PaletaVegetal.Server.Models
{
    public class Vegetacion
    {
        public int Id { get; set; }
        public required string Nombre { get; set; }
        public TipoVegetacion Tipo { get; set; }
        public TipoAsoleamiento Asoleamiento { get; set; }
        public TipoCrecimiento Crecimiento { get; set; }
        public TipoRaiz Raiz { get; set; }
        public TipoRiego Riego { get; set; }
        public EstatusEspecie Estatus { get; set; }
        public double AlturaMax { get; set; }
        public double AlturaMin { get; set; }
        public double TroncoMax { get; set; }
        public double TroncoMin { get; set; }
        public double CopaMax { get; set; }
        public double CopaMin { get; set; }
        public string? ImagenUrl { get; set; }
        public string? TablaCromaticaUrl { get; set; }
    }
}
