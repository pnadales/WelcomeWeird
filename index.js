const express = require('express')
const app = express()
const fsolito = require('fs')
const fs = require('fs').promises

app.listen(3000, console.log("Servidor trotando\n Saludos cordiales! @.@"))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})


app.get("/crear", async (req, res) => {
    const now = new Date();
    const dia = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate().toString();
    const mes = now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : (now.getMonth() + 1).toString();
    const anio = now.getFullYear().toString();
    const fecha = `${dia}/${mes}/${anio}\n`

    const { archivo, contenido } = req.query
    try {
        console.log(archivo)
        if (fsolito.existsSync(archivo)) {
            res.send('Sorry pana, ya existe<a href="/">Volver</a>')
        } else {

            await fs.writeFile(archivo, (fecha.concat(contenido)))
            res.send('Archivo creado con éxito!<a href="/">Volver</a>')
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error :(<br><a href="/">Volver</a>')
    }
})


app.get("/leer", async (req, res) => {
    const { archivo } = req.query
    try {
        const data = await fs.readFile(archivo)
        // res.send(data)
        res.sendFile(__dirname + "/" + archivo)
    } catch (error) {
        res.status(500).send("Hubo un error :(")
    }
})


app.get("/renombrar", async (req, res) => {
    const { nombre, nuevoNombre } = req.query
    try {
        await fs.rename(nombre, nuevoNombre)
        res.send(`Archivo ${nombre} renombrado por ${nuevoNombre}`)
    } catch (error) {
        res.status(500).send("Hubo un error :(")
    }
})


app.get("/eliminar", async (req, res) => {
    const { archivo } = req.query
    try {
        await fs.unlink(archivo)
        res.send(`Archivo ${archivo} eliminado con éxito`)
    } catch (error) {
        res.status(500).send("Hubo un error :(")
    }
})