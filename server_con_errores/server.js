const express = require("express")
const app = express()
require("dotenv").config()
const PORT = process.env.PORT || 4000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const { infoRouter } = require("./routers/info")
const { mascotasRouter } = require("./router/mascotas")

const { loggerMiddleware } = require("./middlewares/logger")
app.use(loggerMiddleware)


app.use("/", infoRouter)
app.use("/api/mascotas", mascotasRouter)

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({
        error: {
            status: err.status,
            message: err.message || 'Ha ocurrido un error en el servidor.',
            stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
        }
    })
})

app.listen(PORT, () => {
    console.log(`Lograste levantar el server en el PORT: ${PORT}!!! 🚀 `)
})
