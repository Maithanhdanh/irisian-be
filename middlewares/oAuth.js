const { validationResult } = require("express-validator")
const axiosAuth = require("../config/axiosAuth")
const ROUTE_MAP = require("../config/urlBase")
const responseReturn = require("../response/responseReturn")

exports.oAuth = async (req, res, next) => {
	try {
		let resReturn = new responseReturn()
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
			req.userId = authenticatedUser.response.userId
			req.role = authenticatedUser.response.role
			await next()
		} else {
			req.body.userId = authenticatedUser.response.userId
			req.body.role = authenticatedUser.response.role
			await next()
		}
	} catch (errors) {
		console.log(errors)
	}
}

exports.Login = async (req, res, next) => {
	try {
		const errors = validationResult(req)
		let resReturn = new responseReturn()
		if (!errors.isEmpty()) {
			resReturn.failure(req, res, 500, errors.array())
			return
		}

		const { email, password } = req.body

		const authenticatedUser = await axiosAuth({
			method: ROUTE_MAP.USER.REGISTER.METHOD,
			url: ROUTE_MAP.USER.REGISTER.PATH,
			data: { email, password },
		})

		if (authenticatedUser.error)
			resReturn.failure(req, res, 401, "Verify failed")
		req.body._id = authenticatedUser.response.user._id
		req.body.role = authenticatedUser.response.user.role
		next()
	} catch (errors) {
		console.log(errors)
	}
}

exports.oRegis = async (req, res, next) => {
	try {
		const errors = validationResult(req)
		let resReturn = new responseReturn()
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
			resReturn.failure(req, res, 401, "Verify failed")
		req.body._id = authenticatedUser.response.user._id
		req.body.role = authenticatedUser.response.user.role
		next()
	} catch (errors) {
		console.log(errors)
	}
}
// module.exports = oAuth
