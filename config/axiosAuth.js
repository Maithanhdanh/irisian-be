const axios = require("axios")
const ENV_VAR = require("./vars")

const axiosAuth = axios.create({
	baseURL: ENV_VAR.AUTHENTICATE_URL,
	headers: {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
		"Access-Control-Allow-Credentials": true,
	},
	withCredentials: "true",
	paramsSerializer: (params) => queryString.stringify(params),
})

axiosAuth.interceptors.response.use(
	(response) => {

		if (response && response.data) {
			return response.data
		}

		return response
	},
	(error) => {
		// Handle errors
		throw error
	}
)
module.exports = axiosAuth
