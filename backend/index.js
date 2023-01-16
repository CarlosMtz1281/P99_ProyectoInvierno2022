const express = require('express')
const { connection } = require('./v1/connection.js')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

// Rutas de los modelos
const user = require('./v1/routes/users')
const clase = require('./v1/routes/clases')
const periodo = require('./v1/routes/periodos')
const asistencia = require('./v1/routes/asistencias')
// Testeo de la Conexion
connection().catch(console.error);

// Rutas
app.get('/v1', (req, res)=>{
    res.send('Bienvenido | v1')
})
app.use('/v1/users', user)
app.use('/v1/clases', clase)
app.use('/v1/periodos', periodo)
app.use('/v1/asistencias', asistencia)

app.listen(port, ()=>{
    console.log(`Aplicacion corriendo en el puerto: ${port}.`)
})

// console.log('Probando, 1, 2, 3, Hola Mundo')