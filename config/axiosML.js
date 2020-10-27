const axios = require("axios")
const ENV_VAR = require("./vars")

// <!-- Initial axios request to MACHINE LEARNING server -->
const axiosAuth = axios.create({
	baseURL: ENV_VAR.MACHINE_LEARNING_URL,
	headers: {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
	},
	paramsSerializer: (params) => queryString.stringify(params),
})

// <!-- middleware to handle response before return data -->
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
