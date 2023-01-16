const cors = require('cors')
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
<<<<<<< HEAD
const alumno = require('./v1/routes/alumnos')
=======

>>>>>>> 03dff2ec4a7f956121c9a6c2baa301addc9f15dd
// Testeo de la Conexion
connection().catch(console.error);

// Rutas
app.use(cors());
app.get('/v1', (req, res)=>{
    res.send('Bienvenido | v1')
})
app.use('/v1/users', user)
app.use('/v1/clases', clase)
app.use('/v1/periodos', periodo)
app.use('/v1/asistencias', asistencia)
app.use('/v1/alumnos', alumno)

app.listen(port, ()=>{
    console.log(`Aplicacion corriendo en el puerto: ${port}.`)
})

// console.log('Probando, 1, 2, 3, Hola Mundo')