const responseReturn = require("../response/responseReturn")
const { PredictedResult } = require("../models/image.model")
const { User, ListHistory } = require("../models/user.model")
const { validationResult } = require("express-validator")

/**
 * Import new image
 *
 * @property {String} ownerId - property userId of request
 *
 * @return  {Promise<PredictedResult, Error>}
 **/
exports.importImage = async (req, res) => {
	let resReturn = new responseReturn()
	if (!req.userId | (req.userId === {}))
		return resReturn.failure(req, res, 422, "no User detected")
	try {
		const ownerId = req.userId
		const {
			path,
			image: imageId,
			no_background: noBackgroundImageId,
		} = req.body

		const existUser = await User.get(ownerId)
		if (existUser === null) {
			resReturn.failure(req, res, 500, { message: "Inexistent User" })
			return
		}

		const predictedResult = new PredictedResult({
			imageId,
			noBackgroundImageId,
			ownerId,
		})
		const doc = await predictedResult.save()

		const predictedInfo = doc._id
		const newHistory = new ListHistory({ path, imageId, predictedInfo }).history

		existUser.mergeHistory(newHistory)

		await User.update(ownerId, {
			history: existUser.history,
		})
		const transformedDoc = doc.transform()

		resReturn.success(req, res, 200, {
			message: "new Image is added",
			data: transformedDoc,
		})
	} catch (errors) {
		resReturn.failure(req, res, 500, errors)
	}
}

/**
 * Import info image
 *
 * @param {String} imageId
 * @body {ObjectId} userId
 * @body {Object} info - returned from machine learning server
 *
 * @return  {Promise<ResultInfo, Error>}
 **/
exports.importInfo = async (req, res) => {
	const errors = validationResult(req)
	let resReturn = new responseReturn()
	if (!errors.isEmpty()) {
		return resReturn.failure(req, res, 422, errors.array())
	}
	try {
		const { imageId } = req.params
		const { userId: ownerId, info } = req.body

		const existUser = await User.get(ownerId)
		if (existUser === null) {
			resReturn.failure(req, res, 500, { message: "Inexistent User" })
			return
		}

		const predictedResult = await PredictedResult.get(imageId)
		predictedResult.updateResult({ info })
		await PredictedResult.update(imageId, { result: predictedResult.result })
		await User.update(ownerId, {})

		resReturn.success(req, res, 200, {
			message: "Updated info",
			data: predictedResult.result.info,
		})
	} catch (errors) {
		resReturn.failure(req, res, 500, errors)
	}
}

/**
 * Import findings image
 *
 * @param {String} imageId
 * @body {ObjectId} userId
 * @body {Object} findings - returned from machine learning server
 *
 * @return  {Promise<ResultInfo, Error>}
 **/
exports.importFindings = async (req, res) => {
	const errors = validationResult(req)
	let resReturn = new responseReturn()
	if (!errors.isEmpty()) {
		resReturn.failure(req, res, 500, errors.array())
		return
	}

	try {
		const { imageId } = req.params
		const { userId: ownerId, findings } = req.body

		const existUser = await User.get(ownerId)
		if (existUser === null) {
			resReturn.failure(req, res, 500, { message: "Inexistent User" })
			return
		}

		const predictedResult = await PredictedResult.get(imageId)
		predictedResult.updateResult({ findings })
		await PredictedResult.update(imageId, { result: predictedResult.result })
		await User.update(ownerId, {})

		resReturn.success(req, res, 200, {
			message: "Updated info",
			data: predictedResult.result.findings,
		})
	} catch (errors) {
		resReturn.failure(req, res, 500, errors)
	}
}

/**
 * Import findings image
 *
 * @param {String} imageId
 * @body {ObjectId} userId
 *
 * @return  {Promise<PredictedResult, Error>}
 **/
exports.getImage = async (req, res) => {
	const errors = validationResult(req)
	let resReturn = new responseReturn()
	if (!errors.isEmpty()) {
		resReturn.failure(req, res, 500, errors.array())
		return
	}

	try {
		const { imageId } = req.params
		const { userId: ownerId } = req.body

		const existUser = await User.get(ownerId)
		if (existUser === null) {
			resReturn.failure(req, res, 500, { message: "Inexistent User" })
			return
		}

		const doc = await PredictedResult.get(imageId)
		const transformedDoc = doc.transform()

		resReturn.success(req, res, 200, transformedDoc)
	} catch (errors) {
		resReturn.failure(req, res, 500, errors)
	}
}

/**
 * Import findings image
 *
 * @quey {String} page - current page
 * @quey {String} perPage - items per page
 * @body {ObjectId} userId
 *
 * @return  {Promise<Array<PredictedResult>, Error>}
 **/
exports.getList = async (req, res) => {
	const errors = validationResult(req)
	let resReturn = new responseReturn()
	if (!errors.isEmpty()) {
		resReturn.failure(req, res, 500, errors.array())
		return
	}

	try {
		const { page, perPage } = req.query
		const { userId: ownerId } = req.body

		const existUser = await User.get(ownerId)
		if (existUser === null) {
			resReturn.failure(req, res, 500, { message: "Inexistent User" })
			return
		}

		const doc = await PredictedResult.list({ id: ownerId, ...req.query })
		const paginatedDoc = doc.slice((page - 1) * perPage, page * perPage)

		resReturn.success(req, res, 200, {
			nextPage: parseInt(page) + 1,
			totalPages: Math.ceil(doc.length / parseInt(perPage)),
			images: paginatedDoc,
		})
	} catch (errors) {
		resReturn.failure(req, res, 500, errors)
	}
}
