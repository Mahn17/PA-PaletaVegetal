//using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PA_PaletaVegetal.Server.Data;
using PA_PaletaVegetal.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;

namespace PA_PaletaVegetal.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VegetacionController : Controller
    {
        private readonly PA_PaletaVegetalServerContext _context;
        private readonly IWebHostEnvironment _env; // <-- Agregamos el entorno
        public VegetacionController(PA_PaletaVegetalServerContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        public async Task<IActionResult> GetVegetacion()
        {
            return Ok(await _context.Vegetacion.ToListAsync());
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetVegetacionById(int id)
        {
            var Vegetacion = await _context.Vegetacion.FindAsync(id);
            if (Vegetacion == null)
                return NotFound();
            return Ok(Vegetacion);
        }
        [HttpPost("image/{id}/{tipoImagen}")]
        public async Task<IActionResult> UploadImage(int id, string tipoImagen, IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("No se recibió ningún archivo.");

                // 1. Buscamos la planta en la base de datos
                var entity = await _context.Vegetacion.FindAsync(id);
                if (entity == null)
                    return NotFound($"No se encontró el registro con ID {id}");

                // Usamos la carpeta pública oficial de ASP.NET
                string webRoot = _env.WebRootPath; 
        
                // Si por alguna razón es nulo (desarrollo local), usamos una ruta segura
                if (string.IsNullOrEmpty(webRoot))
                {
                    webRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                }
                var folderPath = Path.Combine(webRoot, "FotosPV");
                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                // 2. LÓGICA DE REEMPLAZO: Decidimos qué campo borrar y actualizar según el {tipoImagen}
                string? urlAnterior = null;
                if (tipoImagen.ToLower() == "foto")
                {
                    urlAnterior = entity.ImagenUrl;
                }
                else if (tipoImagen.ToLower() == "tabla")
                {
                    urlAnterior = entity.TablaCromaticaUrl;
                }
                else
                {
                    return BadRequest("Tipo de imagen inválido. Use 'foto' o 'tabla'.");
                }

                // Borramos físicamente la imagen vieja si existe
                if (!string.IsNullOrEmpty(urlAnterior))
                {
                    var prevFileName = Path.GetFileName(urlAnterior);
                    var prevFilePath = Path.Combine(folderPath, prevFileName);
                    if (System.IO.File.Exists(prevFilePath))
                    {
                        System.IO.File.Delete(prevFilePath);
                    }
                }

                // 3. Generamos el nuevo nombre (agregamos el {tipoImagen} al nombre del archivo)
                var extension = Path.GetExtension(file.FileName);
                var guidCorto = Guid.NewGuid().ToString().Substring(0, 8);
                var fileName = $"{id}_{tipoImagen.ToLower()}_{guidCorto}{extension}";
                var filePath = Path.Combine(folderPath, fileName);

                // 4. Guardamos el archivo
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // 5. Actualizamos el campo correcto en la base de datos
                var urlRelativa = $"/FotosPV/{fileName}";
                if (tipoImagen.ToLower() == "foto")
                {
                    entity.ImagenUrl = urlRelativa;
                }
                else
                {
                    entity.TablaCromaticaUrl = urlRelativa;
                }

                _context.Update(entity);
                await _context.SaveChangesAsync();

                return Ok(new { mensaje = "Imagen guardada correctamente", url = entity.ImagenUrl });
            }
            catch (Exception ex)
            {
                // Aquí podrías usar un logger (ej. _logger.LogError)
                return StatusCode(StatusCodes.Status500InternalServerError, "Error interno del servidor");
            }
        }
        [HttpPost]
        public async Task<IActionResult> AddVegetacion(Vegetacion newVegetacion)
        {
            if (newVegetacion == null)
                return BadRequest();

            _context.Vegetacion.Add(newVegetacion);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetVegetacionById), new { id = newVegetacion.Id }, newVegetacion);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> EditVegetation(int id, Vegetacion editVegetacion)
        {
            var Vegetacion = await _context.Vegetacion.FindAsync(id);
            if (Vegetacion == null)
                return NotFound();

            //Vegetacion.Nombre = editVegetacion.Nombre;
            //Vegetacion.Tipo = editVegetacion.Tipo;
            _context.Entry(Vegetacion).CurrentValues.SetValues(editVegetacion);//edita todos los campos del modelo, ignora el id

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVegetacion(int id)
        {
            var Vegetacion = await _context.Vegetacion.FindAsync(id);
            if (Vegetacion == null)
                return NotFound();

            _context.Vegetacion.Remove(Vegetacion);
            await _context.SaveChangesAsync();

            return NoContent() ;
        }
    }
}
