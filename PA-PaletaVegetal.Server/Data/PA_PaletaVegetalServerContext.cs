using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PA_PaletaVegetal.Server.Models;

namespace PA_PaletaVegetal.Server.Data
{
    public class PA_PaletaVegetalServerContext : DbContext
    {
        public PA_PaletaVegetalServerContext (DbContextOptions<PA_PaletaVegetalServerContext> options)
            : base(options)
        {
        }
        
        public DbSet<PA_PaletaVegetal.Server.Models.Vegetacion> Vegetacion { get; set; } = default!;
        
    }
}
