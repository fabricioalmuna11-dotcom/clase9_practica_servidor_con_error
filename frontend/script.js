document.addEventListener("DOMContentLoaded", () => {
  const resultado = document.getElementById("resultado")
  const lista = document.getElementById("listaMascotas")
  const form = document.getElementById("formMascotas")
  const id = document.getElementById("mascotaId")
  const nombre = document.getElementById("nombre")
  const tipo = document.getElementById("tipo")
  const guardar = document.getElementById("btnGuardar")
  const cancelar = document.getElementById("btnCancelar")

  const peticion = async (url, opciones) => {
    const res = await fetch(url, opciones)
    const esJson = (res.headers.get("content-type") || "").includes("application/json")
    const data = esJson ? await res.json() : await res.text()
    if (!res.ok) throw new Error(data.error?.message || `Error HTTP ${res.status}`)
    return data
  }
  const mostrar = data => {
    resultado.textContent = typeof data === "string" ? data : JSON.stringify(data, null, 2)
  }
  const manejarError = err => mostrar("Error: " + err.message)
  const resetear = () => {
    form.reset()
    id.value = ""
    guardar.textContent = "Crear Mascota"
    cancelar.hidden = true
  }
  const listar = async () => {
    const mascotas = await peticion("/api/mascotas")
    lista.replaceChildren()
    mascotas.forEach(mascota => {
      const item = document.createElement("li")
      const texto = document.createElement("span")
      texto.textContent = `${mascota.id}: ${mascota.nombre} (${mascota.tipo}) `
      const editar = document.createElement("button")
      editar.textContent = "Editar"
      editar.type = "button"
      editar.addEventListener("click", () => {
        id.value = mascota.id
        nombre.value = mascota.nombre
        tipo.value = mascota.tipo
        guardar.textContent = "Guardar cambios"
        cancelar.hidden = false
        nombre.focus()
      })
      const borrar = document.createElement("button")
      borrar.textContent = "Borrar"
      borrar.type = "button"
      borrar.addEventListener("click", async () => {
        borrar.disabled = true
        try {
          const eliminada = await peticion(`/api/mascotas/${mascota.id}`, { method: "DELETE" })
          if (id.value === String(mascota.id)) resetear()
          await listar()
          mostrar(`Mascota eliminada: ${eliminada.nombre}`)
        } catch (err) { manejarError(err) }
        finally { borrar.disabled = false }
      })
      item.append(texto, editar, borrar)
      lista.append(item)
    })
    mostrar(mascotas)
  }
  document.getElementById("btnBienvenida").addEventListener("click", () => {
    peticion("/").then(mostrar).catch(manejarError)
  })
  document.getElementById("btnRutas").addEventListener("click", () => {
    peticion("/info").then(mostrar).catch(manejarError)
  })
  document.getElementById("btnDatos").addEventListener("click", () => listar().catch(manejarError))
  cancelar.addEventListener("click", resetear)
  form.addEventListener("submit", async e => {
    e.preventDefault()
    const datos = { nombre: nombre.value.trim(), tipo: tipo.value.trim() }
    if (!datos.nombre || !datos.tipo) return mostrar("Completá nombre y tipo.")
    guardar.disabled = true
    try {
      await peticion(id.value ? `/api/mascotas/${id.value}` : "/api/mascotas", {
        method: id.value ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      })
      resetear()
      await listar()
    } catch (err) { manejarError(err) }
    finally { guardar.disabled = false }
  })
  listar().catch(manejarError)
})
