using Microsoft.EntityFrameworkCore;
using PA_PaletaVegetal.Server.Data;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// 1. DB
builder.Services.AddDbContext<PA_PaletaVegetalServerContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("PA_PaletaVegetalServerContext")));

// 2. CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("https://gentle-bay-07964fb1e.6.azurestaticapps.net") // Sin la barra diagonal al final
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

// 3. AUTO-CREACIÓN DE DB (Solo un bloque, limpiamos el duplicado)
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<PA_PaletaVegetalServerContext>();
        context.Database.EnsureCreated();
        Console.WriteLine("Tablas verificadas.");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Error en DB");
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// 4. ARCHIVOS ESTÁTICOS (CONFIGURACIÓN CORRECTA)
// Primero, habilitamos la wwwroot normal
app.UseStaticFiles(); 

// Segundo, configuramos FotosPV usando el entorno de la app, NO el directorio actual
var folderPath = Path.Combine(app.Environment.ContentRootPath, "FotosPV");

if (!Directory.Exists(folderPath))
{
    Directory.CreateDirectory(folderPath);
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(folderPath),
    RequestPath = "/FotosPV"
});

app.UseCors("AllowReactApp");
app.UseAuthorization();
app.MapControllers();

app.Run();
