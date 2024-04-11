const express = require('express')
const app = express()
const fsolito = require('fs')
const fs = require('fs').promises
const exphbs = require('express-handlebars');

app.listen(3000, console.log("Servidor trotando\n Saludos cordiales! @.@"))

app.set("view engine", "handlebars");

//Configuración del motor de plantillas
app.engine('handlebars', exphbs.engine({
    extname: '.handlebars',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views',
    partialsDir: __dirname + '/views/partecillas'
}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})
// app.get("/", (req, res) => {
//     res.render("main", {
//         mensaje: []
//     });
// });

function fechaActual() {

    const now = new Date();
    const dia = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate().toString();
    const mes = now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : (now.getMonth() + 1).toString();
    const anio = now.getFullYear().toString();
    return `${dia}/${mes}/${anio}\n`
}

app.get("/crear", async (req, res) => {

    const { archivo, contenido } = req.query
    try {
        console.log(archivo)
        if (fsolito.existsSync(archivo)) {
            res.render("main", {
                mensaje: "Sorry pana, ya existe"
            });
            // res.send('<a href="/">Volver</a>')
        } else {

            await fs.writeFile(archivo, (fechaActual().concat(contenido)))
            // res.send('Archivo creado con éxito!<a href="/">Volver</a>')

        }
    } catch (error) {
        console.log(error)
        res.status(500).render("main", {
            mensaje: "Hubo un error"
        });
        // res.status(500).send('Hubo un error :(<br><a href="/">Volver</a>')
    }
})


app.get("/leer", async (req, res) => {
    const { archivo } = req.query
    try {
        const data = await fs.readFile(archivo)
        // res.send(data)
        res.sendFile(__dirname + "/" + archivo)
    } catch (error) {
        // res.status(500).send("Hubo un error :(")
        res.status(500).render("main", {
            mensaje: "Hubo un error :("
        });
    }
})


app.get("/renombrar", async (req, res) => {
    const { nombre, nuevoNombre } = req.query
    try {
        await fs.rename(nombre, nuevoNombre)
        res.send(`Archivo ${nombre} renombrado por ${nuevoNombre}`)
            `Archivo ${archivo} eliminado con éxito`
    } catch (error) {
        // res.status(500).send("Hubo un error :(")
        res.status(500).render("main", {
            mensaje: "Hubo un error"
        });
    }
})


app.get("/eliminar", async (req, res) => {
    const { archivo } = req.query
    try {
        await fs.unlink(archivo)
        res.render("main", {
            mensaje: `Archivo ${archivo} eliminado con éxito`
        });
        // res.send(`Archivo ${archivo} eliminado con éxito`)
    } catch (error) {
        // res.status(500).send("Hubo un error :(")
        res.status(500).render("main", {
            mensaje: "Hubo un error :("
        });
    }
})