const responseReturn = require("../response/responseReturn")
const { PredictedResult } = require("../models/image.model")
const { User, ListHistory } = require("../models/user.model")
const { validationResult } = require("express-validator")

/**
 * ADD User
 *
 * @body User_name    (String) User's name             (required)
 * @body dob             (string) User's date of birth    (required)
 * @body gender          (string) User's gender           (required)
 * @body phone           (string) User's phone            (required)
 * @body address         (string) User's address          (optional)
 *
 * @return 200 - 'User is added' || 500 - errors
 **/
exports.importImage = async (req, res) => {
	let resReturn = new responseReturn()
	if (!req.userId | (req.userId === {}))
		return resReturn.failure(req, res, 422, "no User detected")
	try {
		const ownerId = req.userId
		const role = req.role
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
 * SEARCH UserS
 * p
 * @query User_name    (String) User's name             (required)
 * @query dob             (string) User's date of birth    (required)
 * @query gender          (string) User's gender           (required)
 * @query phone           (string) User's phone            (required)
 * @query address         (string) User's address          (optional)
 * @query date_come       (string) User's address          (optional)
 *
 * @return 200 - list of User || 500 - errors
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
		predictedResult.updateResult({info})
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
 * SEARCH User BY ID
 *
 * @query id    (String) User's id    (required)
 *
 * @return 200 - User's profile || 500 - errors
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
		predictedResult.updateResult({findings})
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
