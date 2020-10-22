const { validationResult } = require("express-validator")
const axiosAuth = require("../config/axiosAuth")
const ROUTE_MAP = require("../config/urlBase")
const responseReturn = require("../response/responseReturn")

exports.oAuth = async (req, res, next) => {
	let resReturn = new responseReturn()
	try {
		const authHeader = req.headers["authorization"]
		const token = authHeader && authHeader.split(" ")[1]
		if (token == null) resReturn.failure(req, res, 401, "Invalid Token")

		const authenticatedUser = await axiosAuth({
			method: "GET",
			url: "/auth/api/verify",
			headers: {
				Authorization: `Basic ${token}`,
			},
		})

		if (authenticatedUser.data.error)
			resReturn.failure(req, res, 401, "Verify failed")

		if (req.originalUrl === "/image/upload") {
			req.userId = authenticatedUser.data.response.userId
			req.role = authenticatedUser.data.response.role
			await next()
		} else {
			req.body.userId = authenticatedUser.data.response.userId
			req.body.role = authenticatedUser.data.response.role
			await next()
		}
	} catch (errors) {
		resReturn.failure(req, res, 500, errors)
	}
}

exports.Login = async (req, res, next) => {
	let resReturn = new responseReturn()
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			resReturn.failure(req, res, 500, errors.array())
			return
		}

		const { email, password } = req.body

		const authenticatedUser = await axiosAuth({
			method: ROUTE_MAP.USER.LOGIN.METHOD,
			url: ROUTE_MAP.USER.LOGIN.PATH,
			data: { email, password },
		})

		if (authenticatedUser.data.error)
			resReturn.failure(req, res, 401, "Verify failed")

		if (!authenticatedUser.cookie.refresh_token)
			resReturn.failure(req, res, 401, "Verify failed")

		req.body = {
			_id: authenticatedUser.data.response.user._id,
			role: authenticatedUser.data.response.user.role,
			accessToken: authenticatedUser.data.response.accessToken,
			expiresIn: authenticatedUser.data.response.expiresIn,
			refreshToken_expiresIn:
				authenticatedUser.data.response.refreshToken_expiresIn,
			refresh_token: authenticatedUser.cookie.refresh_token,
			"connect.sid": authenticatedUser.cookie["connect.sid"],
		}

		next()
	} catch (errors) {
		resReturn.failure(req, res, 500, errors)
	}
}

exports.oRegis = async (req, res, next) => {
	let resReturn = new responseReturn()
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			resReturn.failure(req, res, 500, errors.array())
			return
		}

		const { name, email, password } = req.body

		const authenticatedUser = await axiosAuth({
			method: ROUTE_MAP.USER.REGISTER.METHOD,
			url: ROUTE_MAP.USER.REGISTER.PATH,
			data: { name, email, password },
		})

		if (authenticatedUser.data.error)
			return resReturn.failure(req, res, 401, "Verify failed")

		if (!authenticatedUser.cookie.refresh_token)
			return resReturn.failure(req, res, 401, "Verify failed")

		req.body = {
			_id: authenticatedUser.data.response.user._id,
			email: authenticatedUser.data.response.user.email,
			name: authenticatedUser.data.response.user.name,
			role: authenticatedUser.data.response.user.role,
			accessToken: authenticatedUser.data.response.accessToken,
			expiresIn: authenticatedUser.data.response.expiresIn,
			refreshToken_expiresIn:
				authenticatedUser.data.response.refreshToken_expiresIn,
			refresh_token: authenticatedUser.cookie.refresh_token,
		}

		next()
	} catch (errors) {
		resReturn.failure(req, res, 500, errors)
	}
}
// module.exports = oAuth
