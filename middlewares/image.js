const { validationResult } = require("express-validator")
const axiosML = require("../config/axiosML")
const ROUTE_MAP = require("../config/urlBase")
const responseReturn = require("../response/responseReturn")
const FormData = require("form-data")
const fs = require("fs")

exports.verifyImage = (req, res, next) => {
	let resReturn = new responseReturn()
	const file = req.file

	if (!file) resReturn.failure(req, res, 422, "Image not found")

	next()
}

exports.uploadImage = async (req, res, next) => {
	let resReturn = new responseReturn()
	try {
		const form_data = new FormData()
		const file = req.file
		const stream = fs.createReadStream(file.path)
		form_data.append("file", stream)
		const formHeaders = form_data.getHeaders()

		const response = await axiosML({
			method: ROUTE_MAP.IMAGE.UPLOAD.METHOD,
			url: ROUTE_MAP.IMAGE.UPLOAD.PATH,
			data: form_data,
			headers: {
				...formHeaders,
			},
		})

		req.body.path = file.path.split("\\").join("/")
		req.body.image = response.image
		req.body.no_background = response.no_background
		await fs.unlinkSync(file.path)
		next()
	} catch (errors) {
		resReturn.failure(req, res, 500, errors.message)
	}
}

exports.getInfo = async (req, res, next) => {
	try {
		const errors = validationResult(req)
		let resReturn = new responseReturn()
		if (!errors.isEmpty()) {
			resReturn.failure(req, res, 500, errors.array())
			return
		}

		const { imageId } = req.params

		const imageInfo = await axiosML({
			method: ROUTE_MAP.IMAGE.INFO.METHOD,
			url: ROUTE_MAP.IMAGE.INFO.PATH + `/${imageId}`,
		})

		if (imageInfo.error) resReturn.failure(req, res, 500, "getting Info failed")
		req.body.info = imageInfo
		next()
	} catch (errors) {
		console.log(errors)
	}
}

exports.getFindings = async (req, res, next) => {
	try {
		const errors = validationResult(req)
		let resReturn = new responseReturn()
		if (!errors.isEmpty()) {
			resReturn.failure(req, res, 500, errors.array())
			return
		}

		const { imageId } = req.params

		const imageFindings = await axiosML({
			method: ROUTE_MAP.IMAGE.FINDING.METHOD,
			url: ROUTE_MAP.IMAGE.FINDING.PATH + `/${imageId}`,
		})

		if (imageFindings.error) resReturn.failure(req, res, 500, "getting Info failed")
		req.body.findings = imageFindings
		next()
	} catch (errors) {
		console.log(errors)
	}
}
// module.exports = oAuth
