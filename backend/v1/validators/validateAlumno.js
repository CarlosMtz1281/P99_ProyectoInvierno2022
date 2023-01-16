const Ajv = require("ajv")
const addFormats = require("ajv-formats")
const ajv = new Ajv({allErrors: true}) // Ajv option allErrors is required
const localize_es = require('ajv-i18n/localize/es')
addFormats(ajv)
require("ajv-errors")(ajv)
// Schema
const {alumnoSchema} = require('../schemas/alumnoSchema')

const validate = ajv.compile(alumnoSchema)

async function validateAlumno(req, res, next){
	const isValid = validate(req.body)

	if(!isValid){
		localize_es(validate.errors)
		res.status(400).send(`ERROR: ${ajv.errorsText(validate.errors, {separator: '\n'})}`)
		// console.log(ajv.errorsText(validate.errors, {separator: '\n'}))
	}else{
		console.log("La data es valida")
		next()
	}

}

module.exports = {validateAlumno}