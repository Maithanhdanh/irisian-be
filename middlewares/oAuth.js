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
		
		if (authenticatedUser.error)
			resReturn.failure(req, res, 401, "Verify failed")

		if (req.originalUrl === "/image/upload") {
			req.userId = authenticatedUser.response.user._id
			req.role = authenticatedUser.response.user.role
			next()
		} else {
			req.body.userId = authenticatedUser.response.user._id
			req.body.role = authenticatedUser.response.user.role
			next()
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

		if (authenticatedUser.error)
			resReturn.failure(req, res, 401, "Verify failed")

		req.body = {
			_id: authenticatedUser.response.user._id,
			role: authenticatedUser.response.user.role,
			accessToken: authenticatedUser.response.accessToken,
			expiresIn: authenticatedUser.response.expiresIn,
			refreshToken_expiresIn: authenticatedUser.response.refreshToken_expiresIn,
			refreshToken: authenticatedUser.response.refreshToken,
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

		if (authenticatedUser.error)
			return resReturn.failure(req, res, 401, "Verify failed")

		req.body = {
			_id: authenticatedUser.response.user._id,
			email: authenticatedUser.response.user.email,
			name: authenticatedUser.response.user.name,
			role: authenticatedUser.response.user.role,
			accessToken: authenticatedUser.response.accessToken,
			expiresIn: authenticatedUser.response.expiresIn,
			refreshToken_expiresIn: authenticatedUser.response.refreshToken_expiresIn,
			refreshToken: authenticatedUser.response.refreshToken,
		}

		next()
	} catch (errors) {
		resReturn.failure(req, res, 500, errors)
	}
}

exports.oGetToken = async (req, res, next) => {
	let resReturn = new responseReturn()
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			resReturn.failure(req, res, 500, errors.array())
			return
		}

		const { refresh_token } = req.cookies
		if (!refresh_token) return resReturn.failure(req, res, 401, "Verify failed")

		const authenticatedUser = await axiosAuth({
			method: ROUTE_MAP.USER.TOKEN.METHOD,
			url: ROUTE_MAP.USER.TOKEN.PATH,
			headers: {
				Cookie: `refresh_token=${refresh_token}`,
			},
		})

		if (authenticatedUser.error)
			return resReturn.failure(req, res, 401, "Verify failed")

		req.body = {
			_id: authenticatedUser.response.user._id,
			email: authenticatedUser.response.user.email,
			name: authenticatedUser.response.user.name,
			role: authenticatedUser.response.user.role,
			accessToken: authenticatedUser.response.accessToken,
			expiresIn: authenticatedUser.response.expiresIn,
		}

		next()
	} catch (errors) {
		resReturn.failure(req, res, 500, errors)
	}
}

// module.exports = oAuth
