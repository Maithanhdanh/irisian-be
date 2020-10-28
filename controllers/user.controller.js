const responseReturn = require("../response/responseReturn")
const { User } = require("../models/user.model")
const { validationResult } = require("express-validator")
const ENV_VAR = require("../config/vars")
/**
 * ADD PATIENT
 *
 * @body {ObjectId} uid - ObjectId from authentication server
 * @body {String} role - from authentication server
 * @body {String} email - request
 * @body {String} password - request
 * @body {String} accessToken - from authentication server
 * @body {String} refreshToken - from authentication server
 * @body {Number} accessToken - from authentication server
 * @body {Number} accessToken - from authentication server
 *
 * @return {Promise<User, Error>}
 **/
exports.addUser = async (req, res) => {
	const errors = validationResult(req)
	let resReturn = new responseReturn()
	if (!errors.isEmpty()) {
		resReturn.failure(req, res, 401, errors.array())
		return
	}

	try {
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

		const existUser = await User.getUserDetail(email)
		if (existUser != null) {
			resReturn.failure(req, res, 400, "Existed User")
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

/**
 * User log in
 *
 * @body {ObjectId} uid - ObjectId from authentication server
 * @body {String} role - from authentication server
 * @body {String} accessToken - from authentication server
 * @body {String} refreshToken - from authentication server
 * @body {Number} accessToken - from authentication server
 * @body {Number} accessToken - from authentication server
 *
 * @return  {Promise<User, Error>}
 **/
exports.loginUser = async (req, res) => {
	const errors = validationResult(req)
	let resReturn = new responseReturn()
	if (!errors.isEmpty()) {
		resReturn.failure(req, res, 400, errors.array())
		return
	}

	try {
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

		const doc = await User.get(uid)
		if (doc == null) return resReturn.failure(req, res, 400, "User not found")
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
 * Search list users
 *
 * @query {email} email
 * @query {name} name
 * @body {ObjectId} userId - from authentication server
 *
 * @return  {Promise<User, Error>}
 **/
exports.searchUser = async (req, res) => {
	const errors = validationResult(req)
	let resReturn = new responseReturn()
	if (!errors.isEmpty()) {
		resReturn.failure(req, res, 401, errors.array())
		return
	}

	const { name, email } = req.query
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
 * Search an user by Id
 *
 * @param {ObjectId} id
 * @body {ObjectId} userId - from authentication server
 *
 * @return  {Promise<Array<User>, Error>}
 **/
exports.getUser = async (req, res) => {
	const errors = validationResult(req)
	let resReturn = new responseReturn()
	if (!errors.isEmpty()) {
		resReturn.failure(req, res, 401, errors.array())
		return
	}

	const userID = req.params.id

	try {
		const doc = await User.get(userID)
		if (doc === null) {
			resReturn.failure(req, res, 400, "Inexistent User")
			return
		}

		const transformedDoc = doc.transform()
		resReturn.success(req, res, 200, transformedDoc)
	} catch (errors) {
		resReturn.failure(req, res, 500, errors)
	}
}

/**
 * Update user info
 *
 * @body {ObjectId} userId - from authentication server
 * @body {String} name - request
 * @body {String} avatar - request
 *
 * @return  {Promise<User, Error>}
 **/
exports.updateUser = async (req, res) => {
	const errors = validationResult(req)
	let resReturn = new responseReturn()
	if (!errors.isEmpty()) {
		resReturn.failure(req, res, 401, errors.array())
		return
	}

	const { userId, name, avatar } = req.body

	try {
		const doc = await User.update(
			userId ,
			{
				name: name,
				avatar: avatar,
			}
		)
		if (!doc) {
			resReturn.failure(req, res, 400, "Inexistent User" )
			return
		}

		const transformedDoc = doc.transform()
		resReturn.success(req, res, 200, transformedDoc)
	} catch (errors) {
		resReturn.failure(req, res, 500, errors)
	}
}

/**
 * Update user info
 *
 * @cookie {String} refresh_token
 *
 * @return  {Promise<User, Error>}
 **/
exports.getToken = async (req, res) => {
	const errors = validationResult(req)
	let resReturn = new responseReturn()
	if (!errors.isEmpty()) {
		resReturn.failure(req, res, 401, errors.array())
		return
	}

	const { _id: uid, role, accessToken, expiresIn } = req.body

	try {
		const doc = await User.get(uid)
		if (!doc) return resReturn.failure(req, res, 400, "User not found")

		const transformedDoc = doc.transform({
			role,
			accessToken,
			expiresIn,
		})

		resReturn.success(req, res, 200, transformedDoc)
	} catch (errors) {
		resReturn.failure(req, res, 500, errors)
	}
}

/**
 * Remove refresh token
 *
 * @cookie {String} refresh_token
 *
 * @return  {Promise<User, Nothing>}
 **/
exports.RemoveToken = async (req, res) => {
	const errors = validationResult(req)
	let resReturn = new responseReturn()
	if (!errors.isEmpty()) {
		resReturn.failure(req, res, 401, errors.array())
		return
	}

	const cookies = req.cookies.refresh_token
	if (!cookies) return res.sendStatus(401)

	res.cookie("refresh_token", "", { maxAge: 0 })

	resReturn.success(req, res, 200, "Removed Token")
}
