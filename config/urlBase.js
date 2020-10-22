const URL_BASE = {
	USER: "/auth",
	IMAGE: "/image"
}
const ROUTES_IMAGE = {
	UPLOAD: "/upload",
    INFO: "/info",
    FINDING:"/findings"
}

const ROUTES_USER = {
	REGISTER: "/register",
	LOGIN: "/login"
}

const ROUTE_MAP = {
	USER: {
		REGISTER: { PATH: URL_BASE.USER + ROUTES_USER.REGISTER, METHOD: "POST" },
		LOGIN: { PATH: URL_BASE.USER + ROUTES_USER.LOGIN, METHOD: "POST" },
	},
	IMAGE: {
		UPLOAD: { PATH: URL_BASE.IMAGE + ROUTES_IMAGE.UPLOAD, METHOD: "POST" },
		INFO: { PATH: URL_BASE.IMAGE + ROUTES_IMAGE.INFO, METHOD: "GET" },
		FINDING: { PATH: URL_BASE.IMAGE + ROUTES_IMAGE.FINDING, METHOD: "GET" },
	},
}

module.exports = ROUTE_MAP
