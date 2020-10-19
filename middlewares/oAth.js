const { validationResult } = require("express-validator")
const axiosServer = require("../config/axiosServer")
const ROUTE_MAP = require("../config/urlBase")
const responseReturn = require("../response/responseReturn")

exports.oAuth = async (req, res, next) => {
	try {
		let resReturn = new responseReturn()
		const authHeader = req.headers["authorization"]
		const token = authHeader && authHeader.split(" ")[1]
		if (token == null) resReturn.success(req, res, 401, "Invalid Token")

		const authenticatedUser = await axiosServer({
			method: "GET",
			url: "/auth/api/verify",
			headers: {
				Authorization: `Basic ${token}`,
			},
		})

		if (authenticatedUser.error)
			resReturn.success(req, res, 401, "Verify failed")
		req.body.userId = authenticatedUser.response.userId
		req.body.role = authenticatedUser.response.role
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
			resReturn.failure(res, 500, errors.array())
			return
		}

		const {name, email, password} = req.body

		const authenticatedUser = await axiosServer({
			method: ROUTE_MAP.USER.REGISTER.METHOD,
			url: ROUTE_MAP.USER.REGISTER.PATH,
			data:{name, email, password}
		})

		if (authenticatedUser.error)
			resReturn.success(req, res, 401, "Verify failed")
		req.body._id = authenticatedUser.response.user._id
		req.body.role = authenticatedUser.response.user.role
		next()
	} catch (errors) {
		console.log(errors)
	}
}
// module.exports = oAuth
