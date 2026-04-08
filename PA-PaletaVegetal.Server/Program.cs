using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using PA_PaletaVegetal.Server.Data;

var builder = WebApplication.CreateBuilder(args);

// ------------------------------------------------
// 1. Configuración de la Base de Datos
builder.Services.AddDbContext<PA_PaletaVegetalServerContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("PA_PaletaVegetalServerContext") 
    ?? throw new InvalidOperationException("Connection string 'PA_PaletaVegetalServerContext' not found.")));

// 2. CONFIGURACIÓN DE CORS (Crucial para que React reciba datos)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("https://gentle-bay-07964fb1e.6.azurestaticapps.net/") // <-- REEMPLAZA CON TU URL DE AZURE
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

builder.Services.AddOpenApi();

var app = builder.Build();
// --- BLOQUE PARA CREAR TABLAS AUTOMÁTICAMENTE ---
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<PA_PaletaVegetalServerContext>();
        // Esta línea hace la magia: crea la DB y las tablas si no existen
        context.Database.EnsureCreated(); 
        Console.WriteLine("Base de datos verificada/creada con éxito.");
    }
    catch (Exception ex)
    {
        Console.WriteLine("Error al crear la base de datos: " + ex.Message);
    }
}
// 3. LIMPIEZA DE ARCHIVOS ESTÁTICOS (Ya no los necesitamos aquí)
// Se eliminan: UseDefaultFiles, MapStaticAssets, UseStaticFiles

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// 4. APLICAR CORS (Debe ir antes de MapControllers)
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

// 5. ELIMINAR EL FALLBACK (Esto evitaba que vieras errores 404 reales de la API)
// app.MapFallbackToFile("/index.html"); 

app.Run();
