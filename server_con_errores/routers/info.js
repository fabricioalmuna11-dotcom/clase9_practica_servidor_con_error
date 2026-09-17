const express = require("express")
// En vez de definir una aplicaciób, porque ya la tengo
// Defino un router:
const infoRouter = express.Router()

infoRouter.get("/",(req,res)=>{
    res.send("Bienvenidos a API Mascotas!!")
})

// Ruta para ver las rutas disponibles - swagger (documentar)
infoRouter.get('/info', (req, res) => {
  res.send(`
    <h2>Rutas disponibles:</h2>
    <ul>
      <li>GET / → Bienvenida</li>
      <li>GET /api/mascotas → Lista de mascotas</li>
      <li>GET /api/mascotas/:id → Mascota por ID</li>
      <li>GET /info → Información de rutas</li>
      <li>POST /api/mascotas/ → Crear mascota</li>
      <li>PATCH /api/mascotas/:id → Actualizar mascota</li>
      <li>DELETE /api/mascotas/:id → Eliminar mascota</li>
    </ul>
  `)
})

module.exports = {infoRouter}