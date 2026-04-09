using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using PA_PaletaVegetal.Server.Data;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<PA_PaletaVegetalServerContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("PA_PaletaVegetalServerContext") ?? throw new InvalidOperationException("Connection string 'PA_PaletaVegetalServerContext' not found.")));

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

app.UseDefaultFiles();
app.MapStaticAssets();
app.UseStaticFiles(); // <-- Esto habilita la carpeta wwwroot
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
