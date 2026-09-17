# Correcciones — Clase 9, Sprint 3

## Ejecución

Desde `server_con_errores` ejecutar `npm ci` y `npm run dev`.
Abrir **http://localhost:4000/frontend/** en el navegador (no abrir el HTML con file://).
La API y el frontend se sirven desde el mismo origen, evitando problemas de CORS y puertos diferentes. Si se configura PORT, usar ese puerto en la URL.

## Errores, causas y soluciones

| Problema | Causa | Corrección |
| --- | --- | --- |
| No arrancaba con npm run dev | Se ejecutaba app.js, que no existe | Ejecutar server.js; corregir también main y agregar npm start |
| No encontraba el router | Importación ./router/mascotas | Usar ./routers/mascotas |
| Frontend no conectaba | Mezcla de puertos 3000 y 4000 | Servir frontend desde Express y usar rutas relativas |
| Información de rutas no disponible | Se pedía /rutas | Pedir /info |
| No se podían interpretar respuestas | res.body.json() no existe; bienvenida e información son texto/HTML | Usar res.json() o res.text() según Content-Type |
| Consulta y borrado por ID devolvían 404 | req.params.id es texto y los IDs del JSON son números | Convertir con Number antes de comparar |
| Método de edición mal documentado | /info anunciaba PUT, router implementaba PATCH | Documentar PATCH, que permite actualizar campos parcialmente |
| No había edición y borrado en pantalla | Frontend incompleto respecto de la consigna | Agregar listado con botones Editar/Borrar y reutilizar formulario para PATCH |
| Mensajes de error poco claros | Se mostraba el objeto error entero | Mostrar error.message de la respuesta |

Se conserva Node.js, Express, JavaScript sin frameworks y persistencia en JSON. No se agregaron dependencias. El HTML mantiene el diseño básico original; se corrigieron el idioma y el título y se retiró el favicon externo.

## Verificación realizada

- `npm ci`: instalación correcta.
- `npm run dev`: servidor iniciado con nodemon y server.js.
- `npm test`: prueba HTTP de integración aprobada, con servidor y datos temporales aislados.
- Comprobados GET /, GET /info, listado, creación (201), lectura por ID, edición PATCH, persistencia en JSON y borrado.
- Comprobados datos faltantes (400), IDs inexistentes para lectura/edición/borrado (404) y conservación de los datos iniciales al finalizar.
- Pendiente: prueba interactiva del frontend y consola en un navegador. El navegador remoto de esta sesión bloqueó localhost (ERR_BLOCKED_BY_CLIENT); no se declara esa prueba aprobada.

Para completar la verificación visual: abrir /frontend/, listar, crear una mascota de prueba, editarla, recargar para verificar persistencia y borrarla. Probar también Bienvenida e Info y revisar la consola del navegador.

## Entrega y explicación

El README original solicita documentar los errores y compartir en clase qué pasó y cómo se arregló. No especifica Classroom, campus, formulario, pull request, plazo ni política particular de asistencia con IA. No se realizó una entrega al instituto.

Fuente: https://github.com/PiaAchigarITBA/clase9_practica_servidor_con_error/blob/main/README.md

La aplicación funciona así: el navegador hace solicitudes HTTP; Express elige el router según la URL y el método; el router lee o modifica las mascotas del archivo JSON y devuelve una respuesta. PATCH cambia los campos enviados y DELETE elimina la mascota identificada por su ID.
