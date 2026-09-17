document.addEventListener("DOMContentLoaded", () => {
  const resultado = document.getElementById("resultado")

  const mostrarResultado = async (url) => {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error("Error en la petición")
      const data = await res.body.json()
      resultado.textContent = JSON.stringify(data, null, 2)
    } catch (err) {
      resultado.textContent = "Error: " + err.message
    }
  }

  document.getElementById("btnBienvenida").addEventListener("click", () => {
    mostrarResultado("http://localhost:4000/")
  })

  document.getElementById("btnRutas").addEventListener("click", () => {
    mostrarResultado("http://localhost:3000/rutas")
  })

  document.getElementById("btnDatos").addEventListener("click", () => {
    mostrarResultado("http://localhost:3000/api/mascotas")
  })
})


document.addEventListener("submit", async (e) => {
e.preventDefault()
    const nombre = document.getElementById("nombre").value
    const tipo = document.getElementById("tipo").value
    if(!nombre || !tipo){
        alert("Por favor complete todos los campos.")
        return
    }
    
    try{
        const res = await fetch("http://localhost:3000/api/mascotas/",{
            method:"POST", 
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify({nombre,tipo})
        })

        if(!res.ok){
            const error = await res.json()
            alert("Error:"+ (error.error || "Algo salio mal"))
            return
        }
        const nuevaMascota = await res.json()
        console.log("Mascota creada: ", nuevaMascota)

        //limpio el form
        document.getElementById("formMascotas").reset()

    }catch(err){
        alert("Error al cargar la mascota: " + err.message)
    }
})