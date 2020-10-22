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
	withCredentials: "include",
	paramsSerializer: (params) => queryString.stringify(params),
})
const parseCookies = (request) =>{
    var list = [],
        cookies = request.headers["set-cookie"];

		cookies && cookies.forEach( cookie => {
        var parts = cookie.split(';')[0].split(/=(.+)/);
        list[parts[0]] = parts[1];
    });

    return list;
}
axiosAuth.interceptors.response.use(
	(response) => {
		const listCookie = parseCookies(response)
		if (response && response.data) {
			return { 
				data: response.data, 
				cookie: listCookie
			}
		}

		return response
	},
	(error) => {
		// Handle errors
		throw error
	}
)
module.exports = axiosAuth
