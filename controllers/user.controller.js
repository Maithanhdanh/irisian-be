const responseReturn = require("../response/responseReturn")
const { User } = require("../models/user.model")
const { validationResult } = require("express-validator")
const ENV_VAR = require("../config/vars")
/**
 * ADD PATIENT
 *
 * @body patient_name    (String) patient's name             (required)
 * @body dob             (string) patient's date of birth    (required)
 * @body gender          (string) patient's gender           (required)
 * @body phone           (string) patient's phone            (required)
 * @body address         (string) patient's address          (optional)
 *
 * @return 200 - 'User is added' || 500 - errors
 **/
exports.addUser = async (req, res) => {
	const errors = validationResult(req)
	let resReturn = new responseReturn()
	if (!errors.isEmpty()) {
		resReturn.failure(req, res, 500, errors.array())
		return
	}

	const {
		_id: uid,
		role,
		email,
		name,
		accessToken,
		expiresIn,
		refreshToken_expiresIn,
		refresh_token,
	} = req.body

	try {
		const existUser = await User.getUserDetail(email)
		if (existUser != null) {
			resReturn.failure(req, res, 406, "Existed User")
			return
		}

		const newUser = new User({ uid, email, name, role })
		const doc = await newUser.save()
		const transformedDoc = doc.transform({
			role,
			accessToken,
			expiresIn,
			refreshToken_expiresIn,
		})

		res.cookie("refresh_token", refresh_token, {
			httpOnly: true,
			maxAge: ENV_VAR.REFRESH_TOKEN_COOKIE_EXPIRATION,
		})

		resReturn.success(req, res, 200, transformedDoc)
	} catch (errors) {
		resReturn.failure(req, res, 500, errors)
	}
}

exports.loginUser = async (req, res) => {
	const errors = validationResult(req)
	let resReturn = new responseReturn()
	if (!errors.isEmpty()) {
		resReturn.failure(req, res, 500, errors.array())
		return
	}

	const {
		_id: uid,
		role,
		accessToken,
		expiresIn,
		refreshToken_expiresIn,
		refreshToken,
	} = req.body

	res.cookie("refresh_token", refreshToken, {
		httpOnly: true,
		maxAge: ENV_VAR.REFRESH_TOKEN_COOKIE_EXPIRATION,
	})

	try {
		const doc = await User.get(uid)
		if(doc == null) return resReturn.failure(req, res, 400, 'User not found')
		const transformedDoc = doc.transform({
			role,
			accessToken,
			expiresIn,
			refreshToken_expiresIn,
		})

		resReturn.success(req, res, 200, transformedDoc)
	} catch (errors) {
		resReturn.failure(req, res, 500, errors)
	}
}

/**
 * SEARCH PATIENTS
 *
 * @query patient_name    (String) patient's name             (required)
 * @query dob             (string) patient's date of birth    (required)
 * @query gender          (string) patient's gender           (required)
 * @query phone           (string) patient's phone            (required)
 * @query address         (string) patient's address          (optional)
 * @query date_come       (string) patient's address          (optional)
 *
 * @return 200 - list of patient || 500 - errors
 **/
exports.searchUser = async (req, res) => {
	const errors = validationResult(req)
	let resReturn = new responseReturn()
	if (!errors.isEmpty()) {
		resReturn.failure(req, res, 500, errors.array())
		return
	}

	const { name, email } = req.query
	console.log(name, email)
	try {
		const docs = await User.find({
			name: { $regex: `.*${name}.*`, $options: "i" },
			email: { $regex: `.*${email}.*`, $options: "i" },
		})

		resReturn.success(req, res, 200, docs)
	} catch (errors) {
		resReturn.failure(req, res, 500, errors)
	}
}

/**
 * SEARCH PATIENT BY ID
 *
 * @query id    (String) patient's id    (required)
 *
 * @return 200 - patient's profile || 500 - errors
 **/
exports.getUser = async (req, res) => {
	const errors = validationResult(req)
	let resReturn = new responseReturn()
	if (!errors.isEmpty()) {
		resReturn.failure(req, res, 500, errors.array())
		return
	}

	const userID = req.params.id

	try {
		const doc = await User.get(userID)
		if (doc === null) {
			resReturn.failure(req, res, 500, { message: "Inexistent User" })
			return
		}
		const transformedDoc = doc.transform()
		resReturn.success(req, res, 200, transformedDoc)
	} catch (errors) {
		resReturn.failure(req, res, 500, errors)
	}
}

/**
 * UPDATE PATIENT INFO
 *
 * @query id    (String) patient's id    (required)
 *
 * @return 200 - patient's profile || 500 - errors
 **/
exports.updateUser = async (req, res) => {
	const errors = validationResult(req)
	let resReturn = new responseReturn()
	if (!errors.isEmpty()) {
		resReturn.failure(req, res, 500, errors.array())
		return
	}

	const { userId, name, avatar } = req.body

	try {
		const doc = await User.update(userId, {
			name: name,
			avatar: avatar,
		})
		if (doc === null) {
			resReturn.failure(req, res, 500, { message: "Inexistent User" })
			return
		}

		const transformedDoc = doc.transform()
		resReturn.success(req, res, 200, transformedDoc)
	} catch (errors) {
		resReturn.failure(req, res, 500, errors)
	}
}
