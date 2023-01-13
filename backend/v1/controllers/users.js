/* const User = require('../models/users') */
const {connection} = require('../connection.js')
const { mongodbInf } = require('../config.js')
const mongodb = require("mongodb");

/* // Creamos el cliente
const con = connection() */

// Connection URI.
// mongodb://localhost:27017
const uri = `mongodb://${mongodbInf.host}:${mongodbInf.port}/${mongodbInf.database}`
// Crear un nuevo MongoClient
const client = new mongodb.MongoClient(uri);

async function getAllUser(req, res){
    try{
        await client.connect();
        const database = client.db(mongodbInf.database)
        const collection = database.collection("users")

        const result = await collection.find().toArray()
        // console.log(JSON.stringify(result))
        res.send(JSON.stringify(result))
    }catch(err){
        res.send(`ERROR: ${err}`)
    }finally{
        await client.close();
    }
}
// Test getAllUser
// getAllUser().catch(console.dir);


// Create
async function createUser(req, res){
    try{
        await client.connect();
        const database = client.db(mongodbInf.database)
        const collection = database.collection("users")

        /* // Crear un Doc de Ejemplo
        const doc = {
            nombre: "Mario 5",
            apellidos: "Guerra 5",
        } */

        // Crear un Doc
        const doc = {
            curp: req.body.curp,
            tipo_usuario: req.body.tipo_usuario,
            nombre: req.body.nombre,
            apellido_paterno: req.body.apellido_paterno,
            apellido_materno: req.body.apellido_materno,
            edad: req.body.edad,
            tutor: req.body.tutor,
            lada: req.body.lada,
            num_telefono: req.body.num_telefono,
            estado: req.body.estado,
            ciudad: req.body.ciudad,
            colonia: req.body.colonia,
            escolaridad: req.body.escolaridad,
            ultima_escuela: req.body.ultima_escuela,
            correo: req.body.correo
        }

        const result = await collection.insertOne(doc)
        res.send(`Un documeno fue insertado con el ID: ${result.insertedId}`)
    }catch(err){
        res.send(`ERROR: ${err}`)
    }finally{
        await client.close();
    }
}
// Test createUser
// createUser().catch(console.dir);


// Update
async function updateUser(req, res){
    try {
        await client.connect();
        const database = client.db(mongodbInf.database)
        const collection = database.collection("users")

        /* // Crear documento actualizado test
        const idDocTest = {
            _id: new mongodb.ObjectId("63bf608c8391d717b9d65739"),
        }
        const docTest = {
            $set: { 
                nombre: "Jorge",
                apellidos: "Tato"
            }
        } */

        // Crear el documento actualizado
        const idDoc = {
            _id: new mongodb.ObjectId(req.body._id)
        }
        const doc = {
            $set: {
                curp: req.body.curp,
                tipo_usuario: req.body.tipo_usuario,
                nombre: req.body.nombre,
                apellido_paterno: req.body.apellido_paterno,
                apellido_materno: req.body.apellido_materno,
                edad: req.body.edad,
                tutor: req.body.tutor,
                lada: req.body.lada,
                num_telefono: req.body.num_telefono,
                estado: req.body.estado,
                ciudad: req.body.ciudad,
                colonia: req.body.colonia,
                escolaridad: req.body.escolaridad,
                ultima_escuela: req.body.ultima_escuela,
                correo: req.body.correo
            }
        }

        const result = await collection.findOneAndUpdate(idDoc, doc)
        res.send(`Usuario con _id: ${result.value._id} actualizado con exito. Status: ${result.ok}.`)
    }catch(err){
        res.send(`updateUser ERROR: ${err}`)
    }finally{
        await client.close();
    }
}
// Test updateUser
// updateUser().catch(console.dir);


// Delete
async function deleteUser(req, res){
    try {
        await client.connect();
        const database = client.db(mongodbInf.database)
        const collection = database.collection("users")

        // ID documento a eliminar
        const idDoc = {
            _id: new mongodb.ObjectId(req.body._id)
        }

        /* // CID documento a eliminar test
        const idDocTest = {
            _id: new mongodb.ObjectId("63bf6107b5823dbe5830157d"),
        } */

        const result = await collection.deleteOne(idDoc)
        // console.log(JSON.stringify(result))

        if (result.deletedCount === 1) {
            res.send(`Documento con _id: ${idDoc._id} eliminado con exito.`)
        } else {
            res.send("Ningun documento encontrado. 0 Documentos eliminados.")
        }
    }catch(err){
        console.log(`ERROR: ${err}`)
    }finally{
        await client.close()
    }
}
// Test deleteUser
// deleteUser().catch(console.dir);

module.exports = {getAllUser, createUser, updateUser, deleteUser}

/* // create
const createUser = (req, res)=>{
    // Sending request to create a data
    db.collection('data').insertOne({ text: req.body.text }, function (
        err,
        info
    ) {
        res.json(info.ops[0])
    })
} */

/* // Update
const updateUser = (req, res)=>{
    // Actualizar por su ID
    db.collection('users').findOneAndUpdate(
        { _id: new mongodb.ObjectId(req.body.id) },
        { $set: { text: req.body.text } },
        function () {
            res.send('Actualizado con exito!')
        }
    )
} */

/* // Delete
const deleteUser = (req, res)=>{
    // Eliminar por su ID
    db.collection('users').deleteOne(
        { _id: new mongodb.ObjectId(req.body.id) },
        function () {
        res.send('Eliminado con exito!')
        }
    )
} */