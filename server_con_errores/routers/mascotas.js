const express = require("express")
const createError = require("http-errors")
const fs = require("fs/promises"); // Usamos fs.promises porque vamos a trabajar con fn async solo
const path = require("path");
const mascotasRouter = express.Router()

//Ruta absoluta al archivo JSON
const filePath = path.join(__dirname, "../data_mascotas.json")

// Función auxiliar para leer el archivo JSON
const leerMascotas = async () => {
  const data = await fs.readFile(filePath, "utf-8")
  return JSON.parse(data) 
}

// Función auxiliar para guardar el array actualizado de las mascotas en el archivo.json
const guardarMascotas = async (mascotas) => {
  await fs.writeFile(filePath, JSON.stringify(mascotas, null, 2)) 
}

// Ruta GET /api/mascotas → devuelve todas las mascotas
mascotasRouter.get('/', async (req, res, next) => {
  leerMascotas()
    .then(mascotas => res.json(mascotas))
    .catch(err => next(createError(500, "Error al leer las mascotas")))
})

// Ruta para ver una mascota por ID
mascotasRouter.get('/:id', async (req, res, next) => {
  const id = req.params.id
  leerMascotas()
    .then(mascotas => {
      const mascota = mascotas.find(m => m.id === id)
      if (!mascota) return next(createError(404, "La mascota solicitada no existe"))
      res.json(mascota);
    })
    .catch(err => next(createError(500, "Error al buscar la mascota")))
})

// POST nueva Mascota
mascotasRouter.post('/', async (req, res, next) => {
  const { nombre, tipo } = req.body
  if (!nombre || !tipo) {
    return next(createError(400, "Faltan datos: nombre y tipo son obligatorios"))
  }
  leerMascotas()
    .then(mascotas => {
      const nuevaMascota = {
        id: mascotas.length ? mascotas[mascotas.length - 1].id + 1 : 1,
        nombre,
        tipo
      };
      mascotas.push(nuevaMascota)
      return guardarMascotas(mascotas).then(() => res.status(201).json(nuevaMascota))
    })
    .catch(err => next(createError(500, "Error al guardar la nueva mascota")))

})

// PATCH modificar Mascotas
mascotasRouter.patch('/:id', async (req, res, next) => {
  const id = parseInt(req.params.id)
  const { nombre, tipo } = req.body
  leerMascotas()
    .then(mascotas => {
      const mascota = mascotas.find(m => m.id === id)
      if (!mascota) return next(createError(404, "La mascota solicitada no existe"))

      if (nombre) mascota.nombre = nombre;
      if (tipo) mascota.tipo = tipo;

      return guardarMascotas(mascotas).then(() => res.json(mascota))
    })
    .catch(err => next(createError(500, "Error al modificar la mascota")))
})

// DELETE by id
mascotasRouter.delete('/:id', async (req, res, next) => {
  const id = req.params.id
  leerMascotas()
    .then(mascotas => {
      const index = mascotas.findIndex(m => m.id === id)
      if (index === -1) return next(createError(404, "La mascota solicitada no existe"))

      const mascotaEliminada = mascotas.splice(index, 1)[0]
      return guardarMascotas(mascotas).then(() => res.json(mascotaEliminada))
    })
    .catch(err => next(createError(500, "Error al eliminar la mascota")))

})

module.exports = { mascotasRouter }